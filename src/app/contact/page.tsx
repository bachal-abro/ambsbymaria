'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const locations = [
  {
    city: 'Islamabad',
    address: 'F8 Islamabad, Pakistan ',
    phone: '+92-310-0882460',
    hours: 'Mon-Sat: 10:00 - 19:00',
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to send')
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('idle')
      alert('Failed to send message. Please try again.')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20">
      <div className="luxury-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="font-display text-display-md md:text-display-lg text-gradient mb-6">
            Get in Touch
          </h1>
          <p className="text-luxury-white/60 text-lg max-w-2xl mx-auto">
            We're here to help you find the perfect piece or answer any
            questions you may have
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="font-display text-3xl text-luxury-white mb-8">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-luxury-gold text-sm uppercase tracking-wider mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="luxury-input"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-luxury-gold text-sm uppercase tracking-wider mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="luxury-input"
                    placeholder="Your phone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-luxury-gold text-sm uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="luxury-input"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-luxury-gold text-sm uppercase tracking-wider mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="luxury-input"
                >
                  <option value="">Select a subject</option>
                  <option value="inquiry">General Inquiry</option>
                  <option value="custom">Custom Design</option>
                  <option value="support">Customer Support</option>
                </select>
              </div>

              <div>
                <label className="block text-luxury-gold text-sm uppercase tracking-wider mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="luxury-input resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="luxury-btn-primary w-full disabled:opacity-50"
              >
                <span>
                  {status === 'loading'
                    ? 'Sending...'
                    : status === 'success'
                      ? 'Message Sent!'
                      : 'Send Message'}
                </span>
              </button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-luxury-gold text-center"
                >
                  Thank you! We'll get back to you soon.
                </motion.p>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-display text-3xl text-luxury-white mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                    <Mail className="text-luxury-gold" size={20} />
                  </div>
                  <div>
                    <p className="text-luxury-gold text-sm uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <a
                      href="mailto:info@ambsbymaria.com"
                      className="text-luxury-white hover:text-luxury-gold transition-colors"
                    >
                      [ambsbymaria@gmail.com]
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                    <Phone className="text-luxury-gold" size={20} />
                  </div>
                  <div>
                    <p className="text-luxury-gold text-sm uppercase tracking-wider mb-1">
                      Contact Number
                    </p>
                    <a
                      href="tel:+18005551234"
                      className="text-luxury-white hover:text-luxury-gold transition-colors"
                    >
                      +92-310-0882460
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 border border-luxury-gold/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="text-luxury-gold" size={20} />
                  </div>
                  <div>
                    <p className="text-luxury-gold text-sm uppercase tracking-wider mb-1">
                      Hours
                    </p>
                    <p className="text-luxury-white">
                      Monday - Saturday: 10:00 - 19:00
                    </p>
                    <p className="text-luxury-white">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>


          </motion.div>
        </div>

        {/* Locations */}
        <section id="locations">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-display-md text-center text-gradient mb-16"
          >
            Our Boutiques
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="luxury-card p-8"
              >
                <h3 className="font-display text-2xl text-luxury-gold mb-6">
                  {location.city}
                </h3>

                <div className="space-y-4 text-luxury-white/70">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-luxury-gold flex-shrink-0 mt-1" size={18} />
                    <p>{location.address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-luxury-gold flex-shrink-0" size={18} />
                    <a
                      href={`tel:${location.phone}`}
                      className="hover:text-luxury-gold transition-colors"
                    >
                      {location.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-luxury-gold flex-shrink-0" size={18} />
                    <p>{location.hours}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
