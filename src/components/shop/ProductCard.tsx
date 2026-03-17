'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group block luxury-card overflow-hidden h-full"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-luxury-charcoal-light">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Shimmer */}
          <div className="shimmer-effect absolute inset-0 opacity-0 group-hover:opacity-100" />

          {!product.inStock && (
            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded">
              Out of Stock
            </div>
          )}
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
              {product.specifications.purity}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
