'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ShoppingBag, Heart, Share2, Check, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { useWishlistStore } from '@/store/wishlistStore'
import type { Material, Product } from '@/types'
import ProductCard from '@/components/shop/ProductCard'
import FeaturesBanner from '@/components/home/FeaturesBanner'

export default function ProductClientLogic({ 
  product, 
  materials,
  relatedProducts = []
}: { 
  product: Product, 
  materials: Material[],
  relatedProducts?: Product[]
}) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(
    materials?.[0] || {} as Material
  )
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [shareFeedback, setShareFeedback] = useState(false)

  const addItem = useCartStore((state) => state.addItem)
  const openCart = useUIStore((state) => state.openCart)
  const { toggleWishlist, isInWishlist } = useWishlistStore()

  const handleAddToCart = () => {
    addItem(product, selectedMaterial, quantity)
    setAddedToCart(true)
    openCart()
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out ${product.name} on AMBS BY MARIA`,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing', err)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShareFeedback(true)
        setTimeout(() => setShareFeedback(false), 2000)
      } catch (err) {
        console.error('Failed to copy', err)
      }
    }
  }

  const isFavorited = isInWishlist(product.id)

  const totalPrice = product.price

  return (
    <>
    <main className="min-h-screen bg-luxury-black pt-32 pb-20">
      <article className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Viewer */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Display */}
            <div className="luxury-card overflow-hidden mb-6 relative group/gallery">
              <div className="relative aspect-square bg-luxury-charcoal-light">
                <Image
                  src={product.images[selectedImage]}
                  alt={`${product.name} - ${product.category} at AmbsbyMaria`}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover/gallery:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
                      }}
                      className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-luxury-gold hover:border-luxury-gold transition-all pointer-events-auto"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
                      }}
                      className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-luxury-gold hover:border-luxury-gold transition-all pointer-events-auto"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === index ? 'border-luxury-gold scale-95 shadow-md' : 'border-luxury-charcoal-light hover:border-luxury-gold/50'}`}
                  aria-label={`Show ${product.name} image ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
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

            <h1 className="font-display text-3xl md:text-display-md text-luxury-white mb-4 sm:mb-6">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-4 mb-8">
              <span className="text-3xl sm:text-4xl font-display text-luxury-gold">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <p className="text-luxury-white/70 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-luxury-gold text-sm uppercase tracking-wider mb-4">
                Quantity
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-luxury-charcoal-light text-luxury-white hover:border-luxury-gold transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="text-luxury-white text-lg w-12 text-center" aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-luxury-charcoal-light text-luxury-white hover:border-luxury-gold transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full sm:flex-1 luxury-btn-primary py-4 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-none"
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
              <div className="flex gap-4 w-full sm:w-auto order-2 sm:order-none">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 sm:w-14 h-14 border transition-all duration-300 flex items-center justify-center group ${
                    isFavorited 
                      ? 'border-luxury-gold bg-luxury-gold text-white' 
                      : 'border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white'
                  }`}
                  aria-label={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={20} className={isFavorited ? "fill-current" : "group-hover:fill-current"} />
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 sm:w-14 h-14 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 flex items-center justify-center relative group"
                  aria-label="Share product"
                >
                  {shareFeedback ? (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-luxury-gold text-white text-[10px] uppercase tracking-tighter px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-300" role="alert">
                          Link Copied
                      </div>
                  ) : null}
                  {shareFeedback ? <Check size={20} /> : <Share2 size={20} />}
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 text-sm text-luxury-white/75">
              <div className="flex items-center gap-3">
                <Check className="text-luxury-gold" size={16} />
                <span>Designed for Daily Wear</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-luxury-gold" size={16} />
                <span>Modern Trendy Design</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-luxury-gold" size={16} />
                <span>Skin-Friendly Materials</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-luxury-gold" size={16} />
                <span>Premium Quality Finish</span>
              </div>
            </div>
          </motion.div>
        </div>
      </article>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-luxury-black border-t border-luxury-charcoal-light">
          <div className="luxury-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="font-display text-3xl text-luxury-white mb-4">You May Also Like</h2>
              <p className="text-luxury-white/60">Complement your look with these elegant pieces.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FeaturesBanner />
    </main>
    </>
  )
}
