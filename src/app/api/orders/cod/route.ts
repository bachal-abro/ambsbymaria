import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { randomBytes } from 'crypto'

interface CartItem {
    productSku: string
    materialSlug: string
    quantity: number
}

interface CODBody {
    items: CartItem[]
    customerInfo: {
        name: string
        email: string
        phone: string
        address: string
        city: string
        postalCode: string
        country: string
    }
}

export async function POST(request: Request) {
    try {
        const body: CODBody = await request.json()
        const { items, customerInfo } = body

        if (!items?.length || !customerInfo?.email) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        let total = 0
        const orderItemsData = []

        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { sku: item.productSku } })
            const material = await prisma.material.findUnique({ where: { slug: item.materialSlug } })

            if (!product || !material) {
                return NextResponse.json(
                    { error: `Product or material not found: sku=${item.productSku}, slug=${item.materialSlug}` },
                    { status: 400 }
                )
            }

            const unitPrice = product.price + material.price
            total += unitPrice * item.quantity
            orderItemsData.push({
                productId: product.id,
                materialId: material.id,
                quantity: item.quantity,
                unitPrice,
            })
        }

        // Generate a unique COD session reference
        const codRef = `COD-${randomBytes(12).toString('hex')}`

        const order = await prisma.order.create({
            data: {
                stripeSessionId: codRef,
                customerName: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                postalCode: customerInfo.postalCode,
                country: customerInfo.country,
                status: 'pending',
                total,
                items: { create: orderItemsData },
            },
            include: {
                items: { include: { product: true, material: true } },
            },
        })

        return NextResponse.json({ sessionId: codRef, orderId: order.id })
    } catch (error) {
        console.error('COD order error:', error)
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
    }
}
