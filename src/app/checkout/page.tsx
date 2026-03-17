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
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'advance'>('cod')

    // Promo code state
    const [promoCode, setPromoCode] = useState('')
    const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; discountType: string } | null>(null)
    const [validatingPromo, setValidatingPromo] = useState(false)
    const [promoError, setPromoError] = useState('')

    const subtotal = items.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0)
    const isFreeShipping = subtotal >= 2500
    const shippingCost = isFreeShipping ? 0 : 299

    const promoDiscountAmount = appliedPromo
        ? (appliedPromo.discountType === 'percentage'
            ? Math.round(subtotal * (appliedPromo.discount / 100))
            : appliedPromo.discount)
        : 0

    const taxRate = paymentMethod === 'cod' ? 0.04 : 0
    const taxAmount = Math.round((subtotal - promoDiscountAmount) * taxRate)
    const grandTotal = (subtotal - promoDiscountAmount) + shippingCost + taxAmount

    const handleApplyPromo = async () => {
        if (!promoCode) return
        setValidatingPromo(true)
        setPromoError('')
        try {
            const res = await fetch('/api/promo-codes/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: promoCode }),
            })
            const data = await res.json()
            if (res.ok) {
                setAppliedPromo(data)
                setPromoCode('')
            } else {
                setPromoError(data.error || 'Invalid code')
            }
        } catch (err) {
            setPromoError('Failed to validate code')
        } finally {
            setValidatingPromo(false)
        }
    }

    const canSubmit = subtotal >= 500

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!canSubmit) {
            setError('Minimum order value must be at least Rs 500')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Corrected: Map 'items' from cart store to the desired structure for the API
            const apiItems = items.map((item) => ({
                productSku: item.product.sku,
                materialSlug: item.selectedMaterial.id,
                quantity: item.quantity,
            }))

            const res = await fetch('/api/orders/cod', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: apiItems,
                    customerInfo: formData,
                    paymentMethod,
                    subtotal,
                    shippingCost,
                    taxAmount,
                    promoCode: appliedPromo?.code || '',
                    discountApplied: promoDiscountAmount,
                    total: grandTotal
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to place order')
            clearCart()
            router.push(`/checkout/success?session_id=${data.sessionId}`)
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
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <Link href="/shop" className="inline-flex items-center gap-2 text-luxury-white/60 hover:text-luxury-gold transition-colors mb-8">
                                <ArrowLeft size={16} />
                                Back to Shop
                            </Link>

                            <h1 className="font-display text-display-md text-gradient">Checkout</h1>
                        </div>
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <Image
                                    src="/logo.png"
                                    alt="AmbsbyMaria"
                                    width={120}
                                    height={42}
                                    className="h-10 md:h-12 w-auto object-contain"
                                    priority
                                />
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Shipping Form */}
                        <div>
                            <h2 className="font-display text-2xl text-luxury-white mb-8">Shipping Information</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Payment Method */}
                                {/* Payment Method Selection */}
                                <div>
                                    <h3 className="text-luxury-gold text-xs uppercase tracking-wider mb-4">Payment Method</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`flex flex-col items-start gap-2 p-4 rounded-lg border transition-all text-left ${paymentMethod === 'cod'
                                                    ? 'border-luxury-gold bg-luxury-gold/10'
                                                    : 'border-luxury-charcoal-light hover:border-luxury-gold/40'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <Truck size={20} className={paymentMethod === 'cod' ? 'text-luxury-gold' : 'text-luxury-white/50'} />
                                                {paymentMethod === 'cod' && <CheckCircle2 size={16} className="text-luxury-gold" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${paymentMethod === 'cod' ? 'text-luxury-white' : 'text-luxury-white/70'}`}>Cash on Delivery</p>
                                                <p className="text-luxury-white/40 text-[10px] mt-0.5">Pay at your doorstep (4% GST applied)</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('advance')}
                                            className={`flex flex-col items-start gap-2 p-4 rounded-lg border transition-all text-left ${paymentMethod === 'advance'
                                                    ? 'border-luxury-gold bg-luxury-gold/10'
                                                    : 'border-luxury-charcoal-light hover:border-luxury-gold/40'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <CreditCard size={20} className={paymentMethod === 'advance' ? 'text-luxury-gold' : 'text-luxury-white/50'} />
                                                {paymentMethod === 'advance' && <CheckCircle2 size={16} className="text-luxury-gold" />}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${paymentMethod === 'advance' ? 'text-luxury-white' : 'text-luxury-white/70'}`}>Advance Payment</p>
                                                <p className="text-luxury-white/40 text-[10px] mt-0.5">Bank Transfer / Paisa (No extra Tax)</p>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Bank Details Container */}
                                    {paymentMethod === 'advance' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-5 rounded-lg border border-luxury-gold/30 bg-luxury-gold/5 space-y-4 mb-8"
                                        >
                                            <div className="flex items-center gap-3 text-luxury-gold">
                                                <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center">
                                                    <CreditCard size={16} />
                                                </div>
                                                <h4 className="font-display text-lg">Bank Details</h4>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 text-sm">
                                                <div className="flex justify-between border-b border-luxury-gold/10 pb-2">
                                                    <span className="text-luxury-white/50">Bank Name</span>
                                                    <span className="text-luxury-white font-medium">UBL Bank</span>
                                                </div>
                                                <div className="flex justify-between border-b border-luxury-gold/10 pb-2">
                                                    <span className="text-luxury-white/50">Account Title</span>
                                                    <span className="text-luxury-white font-medium">Maria Amjad</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-luxury-white/50">Account Number</span>
                                                    <span className="text-luxury-white font-medium select-all">1471285365133</span>
                                                </div>
                                            </div>
                                            <div className="bg-luxury-gold/20 p-3 rounded text-[11px] text-luxury-white leading-relaxed italic">
                                                Please send the screenshot of your payment receipt at our WhatsApp (+92-310-0882460) to confirm your order.
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Form Fields */}

                                <div className="border-t border-luxury-charcoal-light pt-6">
                                    <h3 className="text-luxury-white font-medium text-xs uppercase tracking-wider mb-4">Shipping Details</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-luxury-white/80 text-xs uppercase tracking-wider mb-2">Full Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="luxury-input" placeholder="Your full name" />
                                    </div>
                                    <div>
                                        <label className="block text-luxury-white/80 text-xs uppercase tracking-wider mb-2">Phone *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="luxury-input" placeholder="+92 xxx xxxx xxx" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-luxury-white/80 text-xs uppercase tracking-wider mb-2">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="luxury-input" placeholder="your@email.com" />
                                </div>

                                <div>
                                    <label className="block text-luxury-white/80 text-xs uppercase tracking-wider mb-2">Address *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="luxury-input" placeholder="Street address" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-luxury-white/80 text-xs uppercase tracking-wider mb-2">City *</label>
                                        <input type="text" name="city" value={formData.city} onChange={handleChange} required className="luxury-input" placeholder="Karachi" />
                                    </div>
                                    <div>
                                        <label className="block text-luxury-white/80 text-xs uppercase tracking-wider mb-2">Postal Code</label>
                                        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="luxury-input" placeholder="75000" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-luxury-white/80 text-xs uppercase tracking-wider mb-2">Country</label>
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
                                {/* Order Summary Table */}
                                <div className="border-t border-luxury-charcoal-light pt-6 space-y-3">
                                    <div className="flex justify-between text-luxury-white/80 text-sm">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-luxury-white/80 text-sm">
                                        <span>Shipping</span>
                                        <span className={isFreeShipping ? 'text-green-400' : ''}>
                                            {isFreeShipping ? 'Free' : formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                    {appliedPromo && (
                                        <div className="flex justify-between text-green-400 text-sm">
                                            <span>Discount ({appliedPromo.code})</span>
                                            <span>-{formatPrice(promoDiscountAmount)}</span>
                                        </div>
                                    )}
                                    {taxAmount > 0 && (
                                        <div className="flex justify-between text-luxury-white/80 text-sm">
                                            <span>GST Tax (4%)</span>
                                            <span>{formatPrice(taxAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-luxury-white font-medium text-lg pt-2 border-t border-luxury-charcoal-light/50">
                                        <span>Total Amount</span>
                                         <span className="text-luxury-white font-medium">{formatPrice(grandTotal)}</span>
                                    </div>
                                </div>

                                {!canSubmit && (
                                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-[11px] text-red-400 text-center">
                                        Minimum order value must be at least Rs 500/- to proceed.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !canSubmit}
                                    className="luxury-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        {loading ? (
                                            <><Loader2 size={18} className="animate-spin" /> Processing...</>
                                        ) : paymentMethod === 'cod' ? (
                                            <><Truck size={18} /> Confirm COD Order</>
                                        ) : (
                                            <><CreditCard size={18} /> Confirm Advance Payment Order</>
                                        )}
                                    </span>
                                </button>

                                <p className="text-luxury-white/40 text-[10px] text-center italic">
                                    {paymentMethod === 'cod'
                                        ? '🚚 Cash on Delivery orders are confirmed after phone verification.'
                                        : '📱 Order will be confirmed once payment screenshot is shared on WhatsApp.'}
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
                                             <p className="text-luxury-white/70 text-xs mb-2">Quantity: {item.quantity}</p>
                                             <p className="text-luxury-white font-medium text-sm">
                                                {formatPrice(
                                                    item.product.price *
                                                    item.quantity
                                                )}
                                             </p>
                                        </div>
                                    </div>
                                ))}

                                <div className="border-t border-luxury-charcoal-light pt-4 mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-luxury-white/60 text-sm">Subtotal</span>
                                        <span className="text-luxury-white text-sm">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-luxury-white/60 text-sm">Shipping</span>
                                        <span className={isFreeShipping ? 'text-green-400 font-medium' : 'text-luxury-gold text-sm'}>
                                            {isFreeShipping ? 'Free' : formatPrice(shippingCost)}
                                        </span>
                                    </div>
                                    {appliedPromo && (
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex flex-col">
                                                <span className="text-luxury-white/60 text-sm">Promo ({appliedPromo.code})</span>
                                                <button
                                                    onClick={() => setAppliedPromo(null)}
                                                    className="text-[10px] text-red-400 text-left hover:text-red-300 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <span className="text-green-400 text-sm">-{formatPrice(promoDiscountAmount)}</span>
                                        </div>
                                    )}
                                    {taxAmount > 0 && (
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-luxury-white/60 text-sm">GST (4%)</span>
                                            <span className="text-luxury-white text-sm">{formatPrice(taxAmount)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-luxury-charcoal-light pt-4 flex justify-between items-center">
                                        <span className="text-luxury-white font-display text-lg">Total</span>
                                        <span className="text-luxury-white font-display text-2xl">{formatPrice(grandTotal)}</span>
                                    </div>

                                    {/* Promo Code Input */}
                                    {!appliedPromo && (
                                        <div className="mt-8 pt-6 border-t border-luxury-charcoal-light/30">
                                            <p className="text-luxury-gold text-[10px] uppercase tracking-widest mb-3">Have a promo code?</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                                    placeholder="Enter code"
                                                    className="luxury-input text-sm flex-1"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyPromo}
                                                    disabled={validatingPromo || !promoCode}
                                                    className="luxury-btn text-xs px-4"
                                                >
                                                    {validatingPromo ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                                                </button>
                                            </div>
                                            {promoError && (
                                                <p className="text-red-400 text-[10px] mt-2 italic">{promoError}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
