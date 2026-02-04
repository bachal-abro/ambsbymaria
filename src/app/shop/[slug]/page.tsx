'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ShoppingBag, Heart, Share2, Check } from 'lucide-react'
import Product3DViewer from '@/components/3d/Product3DViewer'
import { products, materials } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Material } from '@/types'

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
  const [view3D, setView3D] = useState(true)

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem(product, selectedMaterial, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const totalPrice = product.price + selectedMaterial.price

  return (
    <div className="min-h-screen bg-luxury-black pt-32 pb-20">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* View Toggle */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setView3D(true)}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  view3D
                    ? 'text-luxury-gold border-b-2 border-luxury-gold'
                    : 'text-luxury-white/60'
                }`}
              >
                3D View
              </button>
              <button
                onClick={() => setView3D(false)}
                className={`px-4 py-2 text-sm transition-all duration-300 ${
                  !view3D
                    ? 'text-luxury-gold border-b-2 border-luxury-gold'
                    : 'text-luxury-white/60'
                }`}
              >
                Photos
              </button>
            </div>

            {/* Main Display */}
            <div className="luxury-card overflow-hidden mb-6">
              {view3D ? (
                <div className="aspect-square">
                  <Product3DViewer
                    category={product.category}
                    material={selectedMaterial}
                    autoRotate={true}
                  />
                </div>
              ) : (
                <div className="relative aspect-square bg-luxury-charcoal-light">
                  <Image
                    src={product.images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {!view3D && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square luxury-card overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-luxury-gold' : ''
                    }`}
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
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-luxury-gold/60 text-xs uppercase tracking-widest mb-4">
              {product.category}
            </p>

            <h1 className="font-display text-display-sm md:text-display-md text-luxury-white mb-6">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-display text-luxury-gold">
                {formatPrice(totalPrice)}
              </span>
              {selectedMaterial.price > 0 && (
                <span className="text-luxury-white/40 text-sm">
                  (Base: {formatPrice(product.price)} + Material:{' '}
                  {formatPrice(selectedMaterial.price)})
                </span>
              )}
            </div>

            <p className="text-luxury-white/70 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Material Selection */}
            <div className="mb-8">
              <h3 className="text-luxury-gold text-sm uppercase tracking-wider mb-4">
                Select Material
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {product.materials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setSelectedMaterial(material)}
                    className={`luxury-card p-4 text-left transition-all duration-300 ${
                      selectedMaterial.id === material.id
                        ? 'border-luxury-gold shadow-luxury-glow'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-6 h-6 rounded-full border border-luxury-charcoal-light"
                        style={{ backgroundColor: material.color }}
                      />
                      <span className="text-luxury-white font-medium">
                        {material.name}
                      </span>
                    </div>
                    {material.price > 0 && (
                      <p className="text-luxury-gold text-sm">
                        +{formatPrice(material.price)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-8 luxury-card p-6">
              <h3 className="text-luxury-gold text-sm uppercase tracking-wider mb-4">
                Specifications
              </h3>
              <dl className="space-y-3">
                {Object.entries(product.specifications).map(
                  ([key, value]) =>
                    value && (
                      <div key={key} className="flex justify-between">
                        <dt className="text-luxury-white/60 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-luxury-white">{value}</dd>
                      </div>
                    )
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
              <button className="w-14 h-14 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 flex items-center justify-center">
                <Heart size={20} />
              </button>
              <button className="w-14 h-14 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 flex items-center justify-center">
                <Share2 size={20} />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 text-sm text-luxury-white/60">
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
  )
}
