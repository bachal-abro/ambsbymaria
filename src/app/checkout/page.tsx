'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ArrowLeft, Loader2, CreditCard, Truck, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
    const { items, total, clearCart } = useCartStore()
    const { toggleCart } = useUIStore()
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const cartItems = items.map((item) => ({
                productSku: item.product.sku,
                materialSlug: item.selectedMaterial.id,
                quantity: item.quantity,
            }))

            if (paymentMethod === 'cod') {
                const res = await fetch('/api/orders/cod', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: cartItems, customerInfo: formData }),
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.error || 'Failed to place order')
                clearCart()
                router.push(`/checkout/success?session_id=${data.sessionId}`)
                return
            }

            // Card — Stripe flow
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems, customerInfo: formData }),
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Checkout failed')

            if (data.url) {
                clearCart()
                window.location.href = data.url
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center gap-6 text-center px-4">
                <ShoppingBag className="text-luxury-gold/30" size={80} />
                <h1 className="font-display text-3xl text-luxury-white">Your cart is empty</h1>
                <p className="text-luxury-white/60">Add some pieces to checkout</p>
                <Link href="/shop" className="luxury-btn-primary">
                    <span>Browse Collections</span>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-luxury-black pt-32 pb-20">
            <div className="luxury-container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Link href="/shop" className="inline-flex items-center gap-2 text-luxury-white/60 hover:text-luxury-gold transition-colors mb-8">
                        <ArrowLeft size={16} />
                        Back to Shop
                    </Link>

                    <h1 className="font-display text-display-md text-gradient mb-12">Checkout</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Shipping Form */}
                        <div>
                            <h2 className="font-display text-2xl text-luxury-white mb-8">Shipping Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-luxury-gold text-xs uppercase tracking-wider mb-4">Payment Method</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            { id: 'card' as const, label: 'Pay by Card', sub: 'Secure online payment via Stripe', icon: CreditCard },
                                            { id: 'cod' as const, label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: Truck },
                                        ].map(({ id, label, sub, icon: Icon }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setPaymentMethod(id)}
                                                className={`relative flex flex-col items-start gap-2 p-4 rounded-lg border transition-all text-left ${
                                                    paymentMethod === id
                                                        ? 'border-luxury-gold bg-luxury-gold/10'
                                                        : 'border-luxury-charcoal-light hover:border-luxury-gold/40'
                                                }`}
                                            >
                                                {paymentMethod === id && (
                                                    <CheckCircle2 size={14} className="absolute top-3 right-3 text-luxury-gold" />
                                                )}
                                                <Icon size={22} className={paymentMethod === id ? 'text-luxury-gold' : 'text-luxury-white/50'} />
                                                <div>
                                                    <p className={`text-sm font-medium ${paymentMethod === id ? 'text-luxury-white' : 'text-luxury-white/70'}`}>{label}</p>
                                                    <p className="text-luxury-white/40 text-xs mt-0.5">{sub}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-luxury-charcoal-light pt-6">
                                    <h3 className="text-luxury-gold text-xs uppercase tracking-wider mb-4">Shipping Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">Full Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="luxury-input" placeholder="Your full name" />
                                    </div>
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">Phone *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="luxury-input" placeholder="+92 xxx xxxx xxx" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="luxury-input" placeholder="your@email.com" />
                                </div>

                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">Address *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="luxury-input" placeholder="Street address" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">City *</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} required className="luxury-input" placeholder="Karachi" />
                                    </div>
                                    <div>
                                        <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">Postal Code</label>
                                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="luxury-input" placeholder="75000" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-luxury-gold text-xs uppercase tracking-wider mb-2">Country</label>
                                    <select name="country" value={formData.country} onChange={handleChange} className="luxury-input">
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="UAE">UAE</option>
                                        <option value="UK">United Kingdom</option>
                                        <option value="USA">United States</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {error && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm">
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="luxury-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {loading ? (
                                            <><Loader2 size={18} className="animate-spin" /> Processing...</>
                                        ) : paymentMethod === 'cod' ? (
                                            <><Truck size={18} /> Place Order — Cash on Delivery</>
                                        ) : (
                                            <><CreditCard size={18} /> Pay Securely with Stripe</>
                                        )}
                                    </span>
                                </button>

                                <p className="text-luxury-white/40 text-xs text-center">
                                    {paymentMethod === 'cod'
                                        ? '🚚 Your order will be confirmed and dispatched within 1–3 business days.'
                                        : '🔒 Secured by Stripe. Your payment info is never stored on our servers.'}
                                </p>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <h2 className="font-display text-2xl text-luxury-white mb-8">Order Summary</h2>
                            <div className="luxury-card p-6 space-y-4">
                                {items.map((item) => (
                                    <div key={`${item.product.id}-${item.selectedMaterial.id}`} className="flex gap-4 items-start">
                                        <div className="relative w-20 h-20 flex-shrink-0 bg-luxury-charcoal-light overflow-hidden rounded">
                                            <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-luxury-white font-medium text-sm mb-1 truncate">{item.product.name}</p>
                                            <p className="text-luxury-white/50 text-xs mb-2">{item.selectedMaterial.name} × {item.quantity}</p>
                                            <p className="text-luxury-gold text-sm font-medium">
                                                {formatPrice((item.product.price + item.selectedMaterial.price) * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t border-luxury-charcoal-light pt-4 mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-luxury-white/60 text-sm">Subtotal</span>
                                        <span className="text-luxury-white text-sm">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-luxury-white/60 text-sm">Shipping</span>
                                        <span className="text-luxury-gold text-sm">Free</span>
                                    </div>
                                    <div className="border-t border-luxury-charcoal-light pt-4 flex justify-between items-center">
                                        <span className="text-luxury-white font-display text-lg">Total</span>
                                        <span className="text-luxury-gold font-display text-2xl">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
