import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function isAuthorized(request: Request) {
    return request.headers.get('x-admin-password') === (process.env.ADMIN_PASSWORD || 'admin123')
}

// GET — list all products
export async function GET(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const products = await prisma.product.findMany({
        include: { materials: { include: { material: true } } },
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(
        products.map((p: any) => ({
            ...p,
            images: JSON.parse(p.images),
            specifications: JSON.parse(p.specifications),
            materials: p.materials.map((pm: any) => pm.material),
        }))
    )
}

// POST — create product
export async function POST(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const { materialSlugs, ...productData } = body

        const product = await prisma.product.create({
            data: {
                ...productData,
                images: JSON.stringify(productData.images || []),
                specifications: JSON.stringify(productData.specifications || {}),
            },
        })

        // Link materials by slug
        if (materialSlugs?.length) {
            const materials = await prisma.material.findMany({ where: { slug: { in: materialSlugs } } })
            await prisma.productMaterial.createMany({
                data: materials.map((m: any) => ({ productId: product.id, materialId: m.id })),
                skipDuplicates: true,
            })
        }

        return NextResponse.json({ ...product, images: JSON.parse(product.images), specifications: JSON.parse(product.specifications) })
    } catch (error) {
        console.error('Create product error:', error)
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}

// PATCH — update product
export async function PATCH(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id, materialSlugs, images, specifications, ...rest } = await request.json()

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...rest,
                ...(images !== undefined && { images: JSON.stringify(images) }),
                ...(specifications !== undefined && { specifications: JSON.stringify(specifications) }),
            },
        })

        // Update material links if provided
        if (materialSlugs !== undefined) {
            await prisma.productMaterial.deleteMany({ where: { productId: id } })
            const materials = await prisma.material.findMany({ where: { slug: { in: materialSlugs } } })
            await prisma.productMaterial.createMany({
                data: materials.map((m: any) => ({ productId: id, materialId: m.id })),
                skipDuplicates: true,
            })
        }

        return NextResponse.json({ ...product, images: JSON.parse(product.images), specifications: JSON.parse(product.specifications) })
    } catch (error) {
        console.error('Update product error:', error)
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

// DELETE — remove product
export async function DELETE(request: Request) {
    if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id } = await request.json()
        // Cascade: remove material links first
        await prisma.productMaterial.deleteMany({ where: { productId: id } })
        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete product error:', error)
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}
