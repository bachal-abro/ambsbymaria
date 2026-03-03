import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const MESHY_BASE = 'https://api.meshy.ai/openapi/v2/image-to-3d'

function isAuthorized(request: Request) {
    return request.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'admin123')
}

function meshyHeaders() {
    return {
        Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
        'Content-Type': 'application/json',
    }
}

// POST — kick off image-to-3D task
export async function POST(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (!process.env.MESHY_API_KEY) {
        return NextResponse.json({ error: 'MESHY_API_KEY not configured' }, { status: 500 })
    }

    const { imageUrl, productId } = await request.json()

    if (!imageUrl || !productId) {
        return NextResponse.json({ error: 'imageUrl and productId are required' }, { status: 400 })
    }

    try {
        const meshyRes = await fetch(MESHY_BASE, {
            method: 'POST',
            headers: meshyHeaders(),
            body: JSON.stringify({
                image_url: imageUrl,
                ai_model: 'meshy-4',
                topology: 'quad',
                target_polycount: 30000,
                should_remesh: true,
            }),
        })

        if (!meshyRes.ok) {
            const err = await meshyRes.json().catch(() => ({}))
            console.error('Meshy error:', err)
            return NextResponse.json(
                { error: (err as { message?: string }).message || `Meshy API error ${meshyRes.status}` },
                { status: meshyRes.status }
            )
        }

        const { result: taskId } = await meshyRes.json() as { result: string }

        // Store taskId in product specifications so we can resume polling
        const product = await prisma.product.findUnique({ where: { id: productId } })
        if (product) {
            const specs = JSON.parse(product.specifications) as Record<string, string>
            await prisma.product.update({
                where: { id: productId },
                data: {
                    specifications: JSON.stringify({ ...specs, _meshyTaskId: taskId }),
                },
            })
        }

        return NextResponse.json({ taskId })
    } catch (error) {
        console.error('generate-3d error:', error)
        return NextResponse.json({ error: 'Failed to start 3D generation' }, { status: 500 })
    }
}

// GET — poll task status  (?taskId=xxx&productId=yyy)
export async function GET(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')
    const productId = searchParams.get('productId')

    if (!taskId) return NextResponse.json({ error: 'taskId required' }, { status: 400 })

    try {
        const meshyRes = await fetch(`${MESHY_BASE}/${taskId}`, {
            headers: meshyHeaders(),
        })

        if (!meshyRes.ok) {
            return NextResponse.json({ error: `Poll error ${meshyRes.status}` }, { status: meshyRes.status })
        }

        const task = await meshyRes.json() as {
            id: string
            status: 'PENDING' | 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED' | 'EXPIRED'
            progress: number
            model_urls?: { glb?: string }
        }

        // When done, persist the GLB URL into the product's specifications
        if (task.status === 'SUCCEEDED' && task.model_urls?.glb && productId) {
            const product = await prisma.product.findUnique({ where: { id: productId } })
            if (product) {
                const specs = JSON.parse(product.specifications) as Record<string, string>
                // Remove the temp task ID, store the model URL
                delete specs._meshyTaskId
                await prisma.product.update({
                    where: { id: productId },
                    data: {
                        specifications: JSON.stringify({ ...specs, modelUrl: task.model_urls.glb }),
                    },
                })
            }
        }

        return NextResponse.json({
            status: task.status,
            progress: task.progress,
            modelUrl: task.model_urls?.glb ?? null,
        })
    } catch (error) {
        console.error('poll error:', error)
        return NextResponse.json({ error: 'Failed to poll task' }, { status: 500 })
    }
}
