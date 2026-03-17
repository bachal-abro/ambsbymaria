'use client'

import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
              <Shield size={24} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-gradient">Privacy Policy</h1>
          </div>

          <div className="luxury-card p-8 md:p-12 space-y-8 text-luxury-white/80 leading-relaxed">
            <section>
              <p className="text-luxury-gold text-sm uppercase tracking-widest mb-2 font-medium">Last Updated</p>
              <p>March 2026</p>
            </section>

            <section>
              <p className="mb-6">
                At AMBS by Maria, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect the information you provide when using our website.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Information We Collect</h2>
              <p className="mb-4">When you visit or place an order on our website, we may collect the following information:</p>
              <ul className="list-disc pl-5 space-y-2 text-luxury-white/70">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping and billing address</li>
                <li>Order details</li>
                <li>Payment information (processed securely through payment providers)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">How We Use Your Information</h2>
              <p className="mb-4">Your information is used to:</p>
              <ul className="list-disc pl-5 space-y-2 text-luxury-white/70">
                <li>Process and deliver your orders</li>
                <li>Communicate with you about your purchase</li>
                <li>Provide customer support</li>
                <li>Improve our website and services</li>
                <li>Send updates about new collections or promotions (only if you subscribe)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Data Protection</h2>
              <p>
                We take reasonable security measures to protect your personal information from unauthorized access, misuse, or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Third-Party Services</h2>
              <p>
                We may use trusted third-party services such as payment gateways, shipping partners, and analytics tools to operate our website and process orders.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Your Privacy Rights</h2>
              <p>
                You may request access, correction, or deletion of your personal information by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Contact Us</h2>
              <p>
                If you have any questions regarding this Privacy Policy, please contact us through our website.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
