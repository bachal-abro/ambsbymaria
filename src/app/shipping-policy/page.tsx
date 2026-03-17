'use client'

import { motion } from 'framer-motion'
import { Truck } from 'lucide-react'

export default function ShippingPolicyPage() {
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
              <Truck size={24} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-gradient">Shipping & Service Policy</h1>
          </div>

          <div className="luxury-card p-8 md:p-12 space-y-8 text-luxury-white/80 leading-relaxed">
            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Order Processing</h2>
              <p>
                Orders are typically processed within 1–2 business days after confirmation.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Delivery Time</h2>
              <p className="mb-4">
                Delivery times may vary depending on your location. Most orders are delivered within 3–5 business days.
              </p>
              <p className="text-sm uppercase tracking-widest text-luxury-gold mb-2">Notice: Delivery times may be affected by:</p>
              <ul className="list-disc pl-5 space-y-2 text-luxury-white/70">
                <li>Public holidays</li>
                <li>Courier delays</li>
                <li>Weather conditions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Shipping Charges</h2>
              <p>
                Shipping costs may vary depending on your location and order value. Any applicable shipping charges will be displayed at checkout.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Order Tracking</h2>
              <p>
                Once your order has been shipped, you will receive tracking information to monitor the delivery status.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Incorrect Address</h2>
              <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-lg">
                <p className="text-red-400 font-medium mb-2">Address Accuracy</p>
                <p>
                  Please ensure that your shipping address is correct when placing an order. AMBS by Maria is not responsible for delays caused by incorrect addresses.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
