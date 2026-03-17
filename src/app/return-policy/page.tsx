'use client'

import { motion } from 'framer-motion'
import { RefreshCcw } from 'lucide-react'

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20">
      <div className="luxury-container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold">
              <RefreshCcw size={24} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-gradient">Return & Refund Policy</h1>
          </div>

          <div className="luxury-card p-8 md:p-12 space-y-8 text-luxury-white/80 leading-relaxed">
            <section>
              <p className="mb-6">
                At AMBS by Maria, customer satisfaction is important to us. We aim to ensure that every order meets your expectations.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Returns</h2>
              <p className="mb-4">Returns are accepted only in the following cases:</p>
              <ul className="list-disc pl-5 space-y-2 text-luxury-white/70 mb-6">
                <li>The item received is damaged or defective</li>
                <li>The wrong product was delivered</li>
              </ul>
              <div className="bg-luxury-gold/5 border border-luxury-gold/20 p-4 rounded-lg mb-6">
                <p className="text-luxury-gold font-medium mb-2">Important Notice</p>
                <p className="text-sm">To request a return, please contact us within 48 hours of receiving your order.</p>
              </div>
              <p className="mb-4 font-medium text-luxury-white">Returned items must be:</p>
              <ul className="list-disc pl-5 space-y-2 text-luxury-white/70">
                <li>Unused</li>
                <li>In original packaging</li>
                <li>In the same condition as received</li>
              </ul>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Refunds</h2>
              <p className="mb-4">
                Once the returned item is received and inspected, we will notify you about the approval of your refund.
              </p>
              <p>
                If approved, the refund will be processed through the original payment method or store credit.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Non-Returnable Items</h2>
              <p>
                For hygiene and safety reasons, certain items such as earrings may not be eligible for return unless damaged.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
