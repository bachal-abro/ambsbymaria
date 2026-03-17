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
              Our Story
            </motion.p>

            <motion.h2
              className="font-display text-display-md md:text-display-lg text-luxury-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Everyday <br />
              <span className="text-gradient">Elegance</span>
            </motion.h2>

            <motion.div
              className="space-y-6 text-luxury-white/70 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p>
                Since 2021, AMBS by Maria has been on a mission: to create beautiful,
                modern jewelry that women can wear every day. We combine on-trend designs,
                comfortable wear, and thoughtful craftsmanship to make pieces that elevate your style effortlessly.
              </p>
              <p>
                From delicate earrings to statement jhumkas, every piece is crafted with care to
                bring elegance and joy to your everyday life. Our jewelry isn’t just an accessory
                — it’s a way to express yourself with style, confidence, and comfort.
              </p>
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
                src="/images/about/thank-you.jpg"
                alt="AMBS by Maria Personal Note"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
