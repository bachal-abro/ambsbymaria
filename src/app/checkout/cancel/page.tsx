'use client'

import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutCancelPage() {
    return (
        <div className="min-h-screen bg-luxury-black flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full text-center"
            >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-900/20 border border-red-500/40 mb-8">
                    <XCircle className="text-red-400" size={48} />
                </div>
                <h1 className="font-display text-4xl text-luxury-white mb-4">Payment Cancelled</h1>
                <p className="text-luxury-white/60 mb-8">
                    Your payment was cancelled. Your cart has been preserved — you can try again whenever you&apos;re ready.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/checkout" className="luxury-btn-primary"><span>Try Again</span></Link>
                    <Link href="/shop" className="luxury-btn"><span>Keep Shopping</span></Link>
                </div>
            </motion.div>
        </div>
    )
}
