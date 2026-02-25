import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16' as '2023-10-16',
})

export async function POST(request: Request) {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        return NextResponse.json({ error: `Webhook error: ${err}` }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const meta = session.metadata

        if (!meta) return NextResponse.json({ received: true })

        try {
            const items: Array<{ productId: string; materialId: string; quantity: number }> =
                JSON.parse(meta.items || '[]')

            // Calculate total
            let total = 0
            const orderItemsData = []

            for (const item of items) {
                const product = await prisma.product.findUnique({ where: { id: item.productId } })
                const material = await prisma.material.findUnique({ where: { id: item.materialId } })
                if (!product || !material) continue
                const unitPrice = product.price + material.price
                total += unitPrice * item.quantity
                orderItemsData.push({ productId: item.productId, materialId: item.materialId, quantity: item.quantity, unitPrice })
            }

            await prisma.order.create({
                data: {
                    stripeSessionId: session.id,
                    customerName: meta.customerName || 'Unknown',
                    email: meta.email || '',
                    phone: meta.phone || '',
                    address: meta.address || '',
                    city: meta.city || '',
                    postalCode: meta.postalCode || '',
                    country: meta.country || 'Pakistan',
                    status: 'processing',
                    total,
                    items: { create: orderItemsData },
                },
            })
        } catch (err) {
            console.error('Failed to create order from webhook:', err)
        }
    }

    return NextResponse.json({ received: true })
}
