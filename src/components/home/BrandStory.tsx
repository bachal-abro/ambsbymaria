'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'

export default function BrandStory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-luxury-charcoal overflow-hidden"
    >
      {/* Parallax background */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 opacity-10"
      >
        <div className="absolute top-20 left-10 w-64 h-64 border border-luxury-gold/20 rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-luxury-gold/20 rounded-full" />
      </motion.div>

      <div className="luxury-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            style={{ opacity }}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.p
              className="text-luxury-gold text-sm uppercase tracking-widest mb-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Our Heritage
            </motion.p>

            <motion.h2
              className="font-display text-display-md md:text-display-lg text-luxury-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              A Legacy of{' '}
              <span className="text-gradient">Excellence</span>
            </motion.h2>

            <motion.div
              className="space-y-6 text-luxury-white/70 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p>
                Since 1925, we have dedicated ourselves to the art of fine
                jewelry, creating pieces that transcend time and trends. Each
                creation is a testament to our unwavering commitment to
                perfection.
              </p>
              <p>
                Our master craftsmen bring generations of expertise to every
                piece, combining traditional techniques with modern innovation.
                The result is jewelry that doesn't just adorn—it tells a story.
              </p>
              <p>
                From the selection of the finest materials to the final polish,
                every step is executed with meticulous attention to detail,
                ensuring that each piece meets our exacting standards of
                excellence.
              </p>
            </motion.div>

            <motion.div
              className="mt-12 grid grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {[
                { number: '98+', label: 'Years of Excellence' },
                { number: '50K+', label: 'Happy Clients' },
                { number: '100%', label: 'Handcrafted' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-display text-luxury-gold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-luxury-white/60 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden luxury-card">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800"
                alt="Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent" />
            </div>

            {/* Floating accent */}
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-8 -right-8 w-32 h-32 border border-luxury-gold/30 rounded-full"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -bottom-8 -left-8 w-24 h-24 border border-luxury-gold/30 rounded-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
