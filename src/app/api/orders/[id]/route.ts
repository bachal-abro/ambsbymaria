import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16' as '2023-10-16',
})

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Try to find order by ID first
        let order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: {
                    include: {
                        product: true,
                        material: true,
                    },
                },
            },
        })

        // If not found by ID, try by Stripe session ID
        if (!order) {
            order = await prisma.order.findUnique({
                where: { stripeSessionId: params.id },
                include: {
                    items: {
                        include: {
                            product: true,
                            material: true,
                        },
                    },
                },
            })
        }

        // If still not found, try fetching from Stripe and creating it
        if (!order && process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
            const session = await stripe.checkout.sessions.retrieve(params.id, {
                expand: ['line_items'],
            })
            if (session.payment_status === 'paid' && session.metadata) {
                const meta = session.metadata
                // Create minimal order record
                order = await prisma.order.create({
                    data: {
                        stripeSessionId: session.id,
                        customerName: meta.customerName || 'Customer',
                        email: meta.email || '',
                        phone: meta.phone || '',
                        address: meta.address || '',
                        city: meta.city || '',
                        postalCode: meta.postalCode || '',
                        country: meta.country || 'Pakistan',
                        status: 'processing',
                        total: (session.amount_total || 0) / 100,
                    },
                    include: { items: { include: { product: true, material: true } } },
                })
            }
        }

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({
            ...order,
            items: order.items.map((item) => ({
                ...item,
                product: {
                    ...item.product,
                    images: JSON.parse(item.product.images),
                    specifications: JSON.parse(item.product.specifications),
                },
            })),
        })
    } catch (error) {
        console.error('Order lookup error:', error)
        return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
    }
}
