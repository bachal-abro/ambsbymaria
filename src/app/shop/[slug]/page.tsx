'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, Heart, Share2, Check } from 'lucide-react'
import { products, materials } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Material } from '@/types'
import FeaturesBanner from '@/components/home/FeaturesBanner'

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = products.find((p) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  const [selectedMaterial, setSelectedMaterial] = useState<Material>(
    materials.find((m) => m.id === product.defaultMaterial) || materials[0]
  )
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product, selectedMaterial, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const totalPrice = product.price + selectedMaterial.price

  return (
    <>
      <div className="min-h-screen bg-luxury-black pt-32 pb-20">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Product Viewer */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Main Display */}
              <div className="luxury-card overflow-hidden mb-6">
                <div className="relative aspect-square bg-luxury-charcoal-light">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square luxury-card overflow-hidden ${selectedImage === index ? 'ring-2 ring-luxury-gold' : ''}`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-luxury-gold/60 text-xs uppercase tracking-widest mb-3">
                {product.category}
              </p>

              {/* SKU / Inventory Number */}
              <div className="flex items-center gap-2 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-luxury-white/30 flex-shrink-0"
                  aria-hidden="true"
                >
                  <path d="M3 5h2M7 5h1M11 5h3M17 5h1M20 5h1M3 12h1M6 12h2M11 12h1M14 12h2M18 12h1M3 19h2M7 19h1M11 19h3M17 19h1M20 19h1" />
                </svg>
                <span className="font-mono text-[11px] tracking-widest text-luxury-white/40 border border-luxury-white/10 px-2 py-0.5 rounded-sm bg-luxury-white/5 select-all">
                  SKU: {product.sku}
                </span>
              </div>

              <h1 className="font-display text-display-sm md:text-display-md text-luxury-white mb-6">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-display text-luxury-gold">
                  {formatPrice(totalPrice)}
                </span>
                {selectedMaterial.price > 0 && (
                  <span className="text-luxury-white/60 text-sm">
                    (Base: {formatPrice(product.price)} + Material:{' '}
                    {formatPrice(selectedMaterial.price)})
                  </span>
                )}
              </div>

              <p className="text-luxury-white/70 text-lg leading-relaxed mb-8">
                {product.description}
              </p>



              {/* Specifications */}
              <div className="mb-8 luxury-card p-6">
                <h3 className="text-luxury-gold text-sm uppercase tracking-wider mb-4">
                  Specifications
                </h3>
                <dl className="space-y-3">
                  {product.specifications.weight && (
                    <div className="flex justify-between">
                      <dt className="text-luxury-white/60">Weight</dt>
                      <dd className="text-luxury-white">{product.specifications.weight}</dd>
                    </div>
                  )}
                  {product.specifications.dimensions && (
                    <div className="flex justify-between">
                      <dt className="text-luxury-white/60">Dimensions</dt>
                      <dd className="text-luxury-white">{product.specifications.dimensions}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-luxury-gold text-sm uppercase tracking-wider mb-4">
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-luxury-charcoal-light text-luxury-white hover:border-luxury-gold transition-colors"
                  >
                    -
                  </button>
                  <span className="text-luxury-white text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-luxury-charcoal-light text-luxury-white hover:border-luxury-gold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 luxury-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {addedToCart ? (
                      <>
                        <Check size={20} />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={20} />
                        Add to Cart
                      </>
                    )}
                  </span>
                </button>
                <button className="w-14 h-14 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 flex items-center justify-center">
                  <Heart size={20} />
                </button>
                <button className="w-14 h-14 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 flex items-center justify-center">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Features */}
              <div className="space-y-4 text-sm text-luxury-white/75">
                <div className="flex items-center gap-3">
                  <Check className="text-luxury-gold" size={16} />
                  <span>Free shipping on orders over $500</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-luxury-gold" size={16} />
                  <span>Lifetime warranty included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-luxury-gold" size={16} />
                  <span>30-day return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="text-luxury-gold" size={16} />
                  <span>Authenticated & certified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <FeaturesBanner />
    </>
  )
}
