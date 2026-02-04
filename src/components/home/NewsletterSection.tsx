'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1500)
  }

  return (
    <section className="relative py-32 bg-luxury-charcoal overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-luxury-gold rounded-full"
        />
      </div>

      <div className="luxury-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-display-md md:text-display-lg text-gradient mb-6">
              Join Our Circle
            </h2>
            <p className="text-luxury-white/70 text-lg mb-12">
              Be the first to discover new collections, exclusive offers, and
              insider stories from the world of luxury jewelry
            </p>

            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-luxury-gold/60" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={status === 'loading' || status === 'success'}
                  className="luxury-input pl-12 pr-32"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="absolute right-2 luxury-btn-primary text-xs px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>
                    {status === 'loading'
                      ? 'Subscribing...'
                      : status === 'success'
                      ? 'Subscribed!'
                      : 'Subscribe'}
                  </span>
                </button>
              </div>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-luxury-gold text-sm mt-4"
                >
                  Thank you for subscribing!
                </motion.p>
              )}
            </form>

            <p className="text-luxury-white/40 text-xs mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
