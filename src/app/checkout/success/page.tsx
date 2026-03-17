'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, Package } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface OrderItem {
    id: string
    quantity: number
    unitPrice: number
    product: { name: string; sku: string; images: string[] }
    material: { name: string }
}

interface Order {
    id: string
    customerName: string
    email: string
    total: number
    status: string
    createdAt: string
    items: OrderItem[]
}

function SuccessContent() {
    const params = useSearchParams()
    const sessionId = params.get('session_id')
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!sessionId) { setLoading(false); return }
        fetch(`/api/orders/${sessionId}`)
            .then((r) => r.json())
            .then((data) => { setOrder(data.id ? data : null) })
            .finally(() => setLoading(false))
    }, [sessionId])

    if (loading) {
        return (
            <div className="min-h-screen bg-luxury-black flex items-center justify-center">
                <Loader2 className="text-luxury-gold animate-spin" size={48} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center px-4 py-20">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-luxury-gold/10 border border-luxury-gold mb-8"
                >
                    <CheckCircle className="text-luxury-gold" size={48} />
                </motion.div>

                <h1 className="font-display text-display-md text-gradient mb-4">Order Confirmed!</h1>
                <p className="text-luxury-white/60 text-lg mb-8">
                    Thank you for your purchase. We&apos;ll send a confirmation email shortly.
                </p>

                {order && (
                    <div className="luxury-card p-8 text-left mb-8">
                        <div className="flex items-center gap-2 mb-6">
                            <Package className="text-luxury-gold" size={20} />
                            <h2 className="font-display text-xl text-luxury-white">Order Details</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                            <div>
                                <p className="text-luxury-white/50 uppercase tracking-wider text-xs mb-1">Customer</p>
                                <p className="text-luxury-white">{order.customerName}</p>
                            </div>
                            <div>
                                <p className="text-luxury-white/50 uppercase tracking-wider text-xs mb-1">Email</p>
                                <p className="text-luxury-white">{order.email}</p>
                            </div>
                            <div>
                                <p className="text-luxury-white/50 uppercase tracking-wider text-xs mb-1">Status</p>
                                <span className="inline-block px-2 py-0.5 bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs rounded capitalize">{order.status}</span>
                            </div>
                            <div>
                                <p className="text-luxury-white/50 uppercase tracking-wider text-xs mb-1">Order ID</p>
                                <p className="text-luxury-white/60 font-mono text-xs">{order.id.slice(0, 12)}…</p>
                            </div>
                        </div>

                        {order.items?.length > 0 && (
                            <div className="space-y-3 border-t border-luxury-charcoal-light pt-6">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-luxury-white text-sm">{item.product.name}</p>
                                            <p className="text-luxury-white/50 text-xs">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-luxury-gold text-sm">{formatPrice(item.unitPrice * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="border-t border-luxury-charcoal-light mt-6 pt-6 flex justify-between">
                            <span className="text-luxury-white/60">Total Paid</span>
                            <span className="text-luxury-gold font-display text-xl">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    <Link href="/shop" className="luxury-btn-primary">
                        <span>Continue Shopping</span>
                    </Link>
                    <Link href="/" className="luxury-btn">
                        <span>Go Home</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-luxury-black flex items-center justify-center">
                <Loader2 className="text-luxury-gold animate-spin" size={48} />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
