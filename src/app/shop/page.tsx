'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { products } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import FeaturesBanner from '@/components/home/FeaturesBanner'

const categories = ['all', 'rings', 'necklaces', 'bracelets', 'earrings'] as const
type Category = typeof categories[number]

function ShopContent() {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') as Category
  
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    urlCategory && categories.includes(urlCategory) ? urlCategory : 'all'
  )

  useEffect(() => {
    if (urlCategory && categories.includes(urlCategory)) {
      setSelectedCategory(urlCategory)
    } else {
      setSelectedCategory('all')
    }
  }, [urlCategory])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000])
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategory === 'all' || product.category === selectedCategory
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1]
      return categoryMatch && priceMatch
    })
  }, [selectedCategory, priceRange])

  return (
    <>
      <div className="min-h-screen bg-luxury-black pt-32 pb-20">
        <div className="luxury-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="font-display text-display-md md:text-display-lg text-gradient mb-4">
              Collections
            </h1>
            <p className="text-luxury-white/60 text-lg">
              Discover our exquisite handcrafted jewelry
            </p>
          </motion.div>

          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <motion.aside
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block w-64 flex-shrink-0"
            >
              <div className="sticky top-32">
                <h2 className="font-display text-2xl text-luxury-white mb-6">
                  Filters
                </h2>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-luxury-gold text-sm uppercase tracking-wider mb-4">
                    Category
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-4 py-2 rounded transition-all duration-300 ${selectedCategory === category
                            ? 'bg-luxury-gold text-white'
                            : 'text-luxury-white/60 hover:text-luxury-gold hover:bg-luxury-charcoal'
                          }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-luxury-gold text-sm uppercase tracking-wider mb-4">
                    Price Range
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="25000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full accent-luxury-gold"
                    />
                    <div className="flex items-center justify-between text-luxury-white/60 text-sm">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden fixed bottom-8 right-8 z-50 w-14 h-14 bg-luxury-gold text-white rounded-full flex items-center justify-center shadow-luxury-elevation"
            >
              {showFilters ? <X size={24} /> : <Filter size={24} />}
            </button>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-luxury-white/60">
                  {filteredProducts.length} products
                </p>
              </div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-luxury-white/60 text-lg">
                    No products found matching your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <FeaturesBanner />
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-luxury-black pt-32 pb-20" />}>
      <ShopContent />
    </Suspense>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
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
