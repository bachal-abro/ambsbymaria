'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Gem, Award, Shield, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Gem,
    title: 'Premium Materials',
    description:
      'Only the finest 18K gold, platinum, and conflict-free diamonds',
  },
  {
    icon: Award,
    title: 'Master Craftsmen',
    description: 'Decades of experience in traditional and modern techniques',
  },
  {
    icon: Shield,
    title: 'Lifetime Warranty',
    description: 'Every piece is backed by our comprehensive warranty',
  },
  {
    icon: Sparkles,
    title: 'Bespoke Design',
    description: 'Custom creations tailored to your vision and style',
  },
]

export default function CraftsmanshipSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-luxury-black overflow-hidden"
    >
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(#D4AF37 1px, transparent 1px),
            linear-gradient(90deg, #D4AF37 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="luxury-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-display-md md:text-display-lg text-gradient mb-6">
            The Art of Craftsmanship
          </h2>
          <p className="text-luxury-white/60 text-lg max-w-2xl mx-auto">
            Every piece is a masterpiece, meticulously crafted to perfection
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="luxury-card p-8 text-center group hover:shadow-luxury-glow transition-all duration-500"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 border border-luxury-gold/30 rounded-full mb-6 group-hover:border-luxury-gold group-hover:shadow-luxury-glow transition-all duration-500"
                >
                  <Icon className="text-luxury-gold" size={28} />
                </motion.div>
                <h3 className="font-display text-xl text-luxury-white mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-luxury-white/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24"
        >
          <h3 className="font-display text-3xl text-center text-luxury-white mb-16">
            Our Process
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-luxury-gold/30 hidden lg:block" />
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {[
                { step: '01', title: 'Design', desc: 'Conceptualization' },
                { step: '02', title: 'Selection', desc: 'Material sourcing' },
                { step: '03', title: 'Crafting', desc: 'Expert creation' },
                { step: '04', title: 'Setting', desc: 'Gem placement' },
                { step: '05', title: 'Finishing', desc: 'Final polish' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + index * 0.1,
                  }}
                  className="relative text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-luxury-charcoal border-2 border-luxury-gold rounded-full mb-4 relative z-10">
                    <span className="font-display text-luxury-gold text-lg">
                      {item.step}
                    </span>
                  </div>
                  <h4 className="font-display text-lg text-luxury-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-luxury-white/60 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
