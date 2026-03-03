'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { Award, Users, Globe, Heart } from 'lucide-react'

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'Uncompromising quality in every piece we create',
  },
  {
    icon: Users,
    title: 'Craftsmanship',
    description: 'Master artisans with generations of expertise',
  },
  {
    icon: Globe,
    title: 'Sustainability',
    description: 'Ethically sourced materials and responsible practices',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Love for the art drives everything we do',
  },
]

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  return (
    <div className="min-h-screen bg-luxury-black">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920"
            alt="Craftsmanship"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 luxury-container text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-display text-display-lg md:text-display-xl text-white mb-6"
          >
            Our Story
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
          >
            A legacy of passion, precision, and timeless beauty spanning nearly
            a century
          </motion.p>
        </motion.div>
      </section>

      {/* Heritage */}
      <section className="py-32 bg-luxury-charcoal">
        <div className="luxury-container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-display-md text-luxury-white mb-8">
                Since 1925
              </h2>
              <div className="space-y-6 text-luxury-white/70 text-lg leading-relaxed">
                <p>
                  Our journey began in a small atelier in Paris, where a master
                  craftsman with a vision for extraordinary jewelry laid the
                  foundation for what would become a legendary house.
                </p>
                <p>
                  Through world wars, cultural revolutions, and the evolution
                  of fashion, we have remained steadfast in our commitment to
                  creating pieces that transcend time. Each generation has
                  added its unique touch while honoring the traditional
                  techniques passed down through decades.
                </p>
                <p>
                  Today, we combine these time-honored methods with cutting-edge
                  technology, ensuring that every piece meets the exacting
                  standards that have defined us for nearly a century.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 bg-luxury-black">
        <div className="luxury-container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-display-md text-center text-gradient mb-20"
          >
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="luxury-card p-8 text-center group hover:shadow-luxury-glow transition-all duration-500"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 border border-luxury-gold/30 rounded-full mb-6 group-hover:border-luxury-gold group-hover:shadow-luxury-glow transition-all duration-500">
                    <Icon className="text-luxury-gold" size={28} />
                  </div>
                  <h3 className="font-display text-2xl text-luxury-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-luxury-white/60">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Logistics Partner */}
      <section className="py-20 bg-luxury-black">
        <div className="luxury-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-luxury-white/40 text-xs uppercase tracking-widest mb-8">
              Official Logistics Partner
            </p>
            <div className="inline-flex items-center space-x-6 px-10 py-6 border border-gray-200 bg-white">
              <Image
                src="/mp-logo.svg"
                alt="M&P Express Logistics"
                width={130}
                height={107}
                className="h-20 w-auto object-contain"
                style={{ width: 'auto' }}
              />
              <div className="w-px h-14 bg-gray-200" />
              <div className="text-left">
                <p className="text-luxury-charcoal text-sm font-semibold">M&amp;P Express Logistics</p>
                <p className="text-gray-500 text-xs mt-1">Nationwide delivery across Pakistan</p>
              </div>
            </div>
            <p className="mt-6 text-luxury-white/50 text-sm max-w-md mx-auto">
              We partner with M&amp;P Express to ensure your precious pieces arrive safely and on time, anywhere in Pakistan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Detail */}
      <section id="craftsmanship" className="py-32 bg-luxury-charcoal">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-display-md text-luxury-white mb-8">
                The Art of <span className="text-gradient">Craftsmanship</span>
              </h2>
              <div className="space-y-6 text-luxury-white/70 text-lg leading-relaxed">
                <p>
                  Our master craftsmen undergo years of rigorous training,
                  learning techniques that have been refined over generations.
                  Each piece passes through multiple pairs of expert hands
                  before it reaches you.
                </p>
                <p>
                  From the initial sketch to the final polish, every step is
                  performed with meticulous attention to detail. We use only
                  the finest materials: ethically sourced diamonds, conflict-free
                  gemstones, and precious metals of the highest purity.
                </p>
                <p>
                  This dedication to excellence means that each piece is not
                  just jewelry—it's a work of art, an heirloom, a story waiting
                  to be told.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] luxury-card overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800"
                alt="Craftsman at work"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
