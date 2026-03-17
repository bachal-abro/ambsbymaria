'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import ProductCard from '@/components/shop/ProductCard'
import FeaturesBanner from '@/components/home/FeaturesBanner'

const categories = ['all', 'rings', 'necklaces', 'bracelets', 'earrings'] as const
type Category = typeof categories[number]

export default function ShopContent({ initialProducts }: { initialProducts: Product[] }) {
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
    return initialProducts.filter((product) => {
      const categoryMatch =
        selectedCategory === 'all' || product.category === selectedCategory
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1]
      return categoryMatch && priceMatch
    })
  }, [selectedCategory, priceRange, initialProducts])

  return (
    <>
      <div className="min-h-screen bg-luxury-black pt-32 pb-20">
        <div className="luxury-container">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12 md:mb-16"
          >
            <h1 className="font-display text-3xl sm:text-display-md md:text-display-lg text-gradient mb-4">
              Collections
            </h1>
            <p className="text-luxury-white/60 text-lg">
              Discover elegant jewelry designed to add beauty and sophistication to your everyday look.
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
                      max="5000"
                      step="50"
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
              className="lg:hidden fixed bottom-10 right-10 z-[10000] w-16 h-16 bg-luxury-gold text-white rounded-full shadow-2xl shadow-luxury-gold/40 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              aria-label={showFilters ? 'Close filters' : 'Open filters'}
            >
              {showFilters ? <X size={28} /> : <Filter size={28} />}
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

      {/* Mobile Filter Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[9999] lg:hidden ${showFilters ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!showFilters}
      >
        {/* Backdrop */}
        <div
          onClick={() => setShowFilters(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${showFilters ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-0 right-0 h-full w-[320px] max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-500 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <h2 className="font-display text-2xl text-[#1A1118]">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 -mr-2 text-gray-400 hover:text-luxury-gold transition-colors"
              aria-label="Close filters"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {/* Categories */}
            <div className="mb-10">
              <h3 className="text-luxury-gold text-sm uppercase tracking-widest mb-6 font-semibold">
                Category
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowFilters(false)
                    }}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between ${selectedCategory === category
                      ? 'bg-luxury-gold text-white shadow-lg shadow-luxury-gold/20'
                      : 'text-gray-600 hover:text-luxury-gold bg-gray-50'
                      }`}
                  >
                    <span className="font-medium">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    {selectedCategory === category && <div className="w-2 h-2 bg-white rounded-full" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-luxury-gold text-sm uppercase tracking-widest mb-6 font-semibold">
                Price Range
              </h3>
              <div className="space-y-8 px-2">
                <div className="relative pt-4">
                  <input
                    type="range"
                    min="0"
                    max="25000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-400 tracking-wider">Min</span>
                    <span className="text-sm font-semibold text-[#1A1118]">{formatPrice(priceRange[0])}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-gray-400 tracking-wider">Max</span>
                    <span className="text-sm font-semibold text-[#1A1118]">{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => setShowFilters(false)}
              className="w-full luxury-btn-primary py-4 rounded-xl text-sm font-bold shadow-xl shadow-luxury-gold/30"
            >
              <span>Apply {filteredProducts.length} Results</span>
            </button>
          </div>
        </div>
      </div>

      <FeaturesBanner />
    </>
  )
}

