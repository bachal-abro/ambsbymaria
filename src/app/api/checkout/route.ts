import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2023-10-16' as '2023-10-16',
})

interface CartItem {
    productSku: string
    materialSlug: string
    quantity: number
}

interface CheckoutBody {
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
        const body: CheckoutBody = await request.json()
        const { items, customerInfo } = body

        if (!items?.length || !customerInfo?.email) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
        // Track resolved DB IDs to store in webhook metadata
        const resolvedItems: Array<{ productId: string; materialId: string; quantity: number }> = []

        for (const item of items) {
            // Look up by sku (stable across data.ts and DB)
            const product = await prisma.product.findUnique({ where: { sku: item.productSku } })
            // Look up by slug (data.ts uses slug as the material id, e.g. 'rose-gold')
            const material = await prisma.material.findUnique({ where: { slug: item.materialSlug } })

            if (!product || !material) {
                return NextResponse.json(
                    { error: `Product or material not found: sku=${item.productSku}, slug=${item.materialSlug}` },
                    { status: 400 }
                )
            }

            resolvedItems.push({ productId: product.id, materialId: material.id, quantity: item.quantity })

            const unitPrice = Math.round((product.price + material.price) * 100) // paisas

            lineItems.push({
                price_data: {
                    currency: 'pkr',
                    product_data: {
                        name: `${product.name} – ${material.name}`,
                        images: (JSON.parse(product.images) as string[]).slice(0, 1),
                        metadata: { sku: product.sku },
                    },
                    unit_amount: unitPrice,
                },
                quantity: item.quantity,
            })
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: customerInfo.email,
            success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${siteUrl}/checkout/cancel`,
            metadata: {
                customerName: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                postalCode: customerInfo.postalCode,
                country: customerInfo.country,
                // Store resolved DB IDs (cuids) so the webhook can create OrderItems
                items: JSON.stringify(resolvedItems),
            },
        })

        return NextResponse.json({ url: session.url, sessionId: session.id })
    } catch (error) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: 'Checkout session creation failed' }, { status: 500 })
    }
}
