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
    paymentMethod: 'cod' | 'advance'
    subtotal: number
    shippingCost: number
    taxAmount: number
    promoCode?: string
    discountApplied?: number
    total: number
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

            const unitPrice = product.price
            total += unitPrice * item.quantity
            orderItemsData.push({
                productId: product.id,
                materialId: material.id,
                quantity: item.quantity,
                unitPrice,
            })
        }

        // Generate a unique reference
        const refPrefix = body.paymentMethod === 'cod' ? 'COD' : 'ADV'
        const orderRef = `${refPrefix}-${randomBytes(8).toString('hex').toUpperCase()}`

        const order = await prisma.order.create({
            data: {
                stripeSessionId: orderRef,
                customerName: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                postalCode: customerInfo.postalCode,
                country: customerInfo.country,
                status: 'pending',
                total: body.total,
                promoCode: body.promoCode || "",
                discountApplied: body.discountApplied || 0,
                items: { create: orderItemsData },
            },
            include: {
                items: { include: { product: true, material: true } },
            },
        })

        return NextResponse.json({ sessionId: orderRef, orderId: order.id })
    } catch (error) {
        console.error('COD order error:', error)
        return NextResponse.json({ error: 'Failed to place order' }, { status: 500 })
    }
}
