'use client'

import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function TermsPage() {
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
              <FileText size={24} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-gradient">Terms & Conditions</h1>
          </div>

          <div className="luxury-card p-8 md:p-12 space-y-8 text-luxury-white/80 leading-relaxed">
            <section>
              <p className="text-luxury-gold text-sm uppercase tracking-widest mb-2 font-medium">Last Updated</p>
              <p>March 2026</p>
              <p className="mt-6">
                By using the AMBS by Maria website, you agree to the following terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Website Use</h2>
              <p>
                You agree to use this website only for lawful purposes and in a way that does not violate the rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Product Information</h2>
              <p>
                We strive to provide accurate product descriptions and images. However, slight variations in color or design may occur due to lighting or display differences.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Pricing</h2>
              <p>
                All prices listed on the website are subject to change without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Order Acceptance</h2>
              <p>
                We reserve the right to cancel or refuse any order if necessary, including cases of pricing errors or suspected fraudulent activity.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Intellectual Property</h2>
              <p>
                All content on this website, including images, logos, and text, belongs to AMBS by Maria and may not be copied or reproduced without permission.
              </p>
            </section>

            <section>
              <h2 className="text-luxury-white font-display text-2xl mb-4">Changes to Policies</h2>
              <p>
                We reserve the right to update or modify these policies at any time.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
