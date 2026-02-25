'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { products } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

export default function FeaturedCollections() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const featuredProducts = products.filter((p) => p.featured)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <section
      ref={containerRef}
      className="relative py-32 bg-luxury-black overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl" />

      <div className="luxury-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-display-md md:text-display-lg text-gradient mb-6">
            Featured Collections
          </h2>
          <p className="text-luxury-white/60 text-lg max-w-2xl mx-auto">
            Handpicked pieces that embody our commitment to exceptional
            craftsmanship and timeless beauty
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featuredProducts.map((product, index) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Link
                href={`/shop/${product.slug}`}
                className="group block luxury-card overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-luxury-charcoal-light">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="text-white flex items-center gap-2"
                    >
                      <span className="text-sm uppercase tracking-wider">
                        View Details
                      </span>
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>
                  {/* Shimmer effect */}
                  <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100" />
                </div>

                {/* Info */}
                <div className="p-6">
                  <p className="text-luxury-gold/60 text-xs uppercase tracking-widest mb-2">
                    {product.category}
                  </p>
                  <h3 className="font-display text-xl text-luxury-white mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-luxury-white/60 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-luxury-gold font-medium text-lg">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-luxury-white/60 text-xs">
                      {product.specifications.carats}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link href="/shop" className="luxury-btn">
            <span>View All Collections</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
