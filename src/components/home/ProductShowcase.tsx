'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductShowcaseProps {
  initialProducts: Product[]
  title: string
  description?: string
  bgColor?: string
  priority?: boolean
}

export default function ProductShowcase({ 
  initialProducts, 
  title, 
  description,
  bgColor = "luxury-black",
  priority = false
}: ProductShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  // Determine items per view based on window width
  const [itemsPerView, setItemsPerView] = useState(1) // Default to 1 for mobile first

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setItemsPerView(1)
      else if (width < 1024) setItemsPerView(2)
      else setItemsPerView(4)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Recalculate maxIndex whenever initialProducts or itemsPerView changes
  const maxIndex = Math.max(0, initialProducts.length - itemsPerView)

  // Memoize nextSlide and prevSlide to avoid recreation issues
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [maxIndex])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [maxIndex])

  // Reset currentIndex if it exceeds maxIndex on resize
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [maxIndex, currentIndex])

  useEffect(() => {
    // Only auto-slide on tablets and desktop (itemsPerView > 1)
    if (!isPaused && isInView && maxIndex > 0 && itemsPerView > 1) {
      const interval = setInterval(nextSlide, 5000)
      return () => clearInterval(interval)
    }
  }, [isPaused, nextSlide, isInView, maxIndex, itemsPerView])

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  // Handle drag/swipe for mobile
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 20 // Reduced for much better sensitivity
    if (info.offset.x < -swipeThreshold) {
      nextSlide()
    } else if (info.offset.x > swipeThreshold) {
      prevSlide()
    }
  }

  return (
    <section
      ref={containerRef}
      className={`relative py-24 md:py-32 bg-${bgColor} overflow-hidden`}
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl opacity-50" />

      <div className="luxury-container relative z-10 px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16 relative"
        >
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-gradient mb-4 md:mb-6 leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-luxury-white/60 text-base md:text-lg max-w-2xl mx-auto font-sans px-4">
              {description}
            </p>
          )}

          {/* Navigation Arrows - Only show if carousel is active (Tablet/Desktop) */}
          {itemsPerView > 1 && (
            <div className="hidden sm:flex justify-center md:justify-end gap-4 mt-8 md:absolute md:right-0 md:bottom-0">
              <button
                onClick={prevSlide}
                className="p-3 rounded-full border border-luxury-gold/20 text-luxury-white hover:bg-luxury-gold/10 transition-colors pointer-events-auto"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 rounded-full border border-luxury-gold/20 text-luxury-white hover:bg-luxury-gold/10 transition-colors pointer-events-auto"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Conditional Rendering: Grid for Mobile, Carousel for others */}
        {itemsPerView === 1 ? (
          <div className="grid grid-cols-1 gap-8">
            {initialProducts.slice(0, 4).map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className="group block luxury-card overflow-hidden bg-luxury-charcoal/40 border border-luxury-gold/30"
                >
                  <div className="relative aspect-square overflow-hidden transform-gpu">
                    <Image
                      src={product.images[0]}
                      alt={`Trendy ${product.category}: ${product.name} at AmbsbyMaria`}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={priority && idx < 4}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20 text-white flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-[0.2em]">View Details</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-luxury-gold/60 text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
                      {product.category}
                    </p>
                    <h3 className="font-display text-xl text-luxury-white mb-2 group-hover:text-luxury-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between pt-4 border-t border-luxury-gold/5">
                      <span className="text-luxury-gold font-display text-xl">
                        {formatPrice(product.price)}
                      </span>
                      {product.specifications.carats && (
                        <span className="text-luxury-white/40 text-[10px] uppercase tracking-widest">
                          {product.specifications.carats}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Carousel Container */
          <div 
            className="relative px-0 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <motion.div
              className="flex gap-4 md:gap-8 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ 
                width: `${(initialProducts.length / itemsPerView) * 100}%`,
                touchAction: 'pan-y'
              }}
            >
              {initialProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="w-full px-2 md:px-0"
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    className="group block luxury-card h-full overflow-hidden bg-luxury-charcoal/40 border border-luxury-gold/30"
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden transform-gpu">
                      <Image
                        src={product.images[0]}
                        alt={`Trendy ${product.category}: ${product.name} at AmbsbyMaria`}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        priority={priority}
                      />
                      
                      {/* View Details Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 border border-white/20 text-white flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="text-[10px] md:text-xs uppercase tracking-[0.2em]">View Details</span>
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 md:p-6">
                      <p className="text-luxury-gold/60 text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">
                        {product.category}
                      </p>
                      <h3 className="font-display text-lg md:text-xl text-luxury-white mb-2 group-hover:text-luxury-gold transition-colors duration-300 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-luxury-white/50 text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 font-sans leading-relaxed">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-luxury-gold/5">
                        <span className="text-luxury-gold font-display text-lg md:text-xl">
                          {formatPrice(product.price)}
                        </span>
                        {product.specifications.carats && (
                          <span className="text-luxury-white/40 text-[9px] md:text-[10px] uppercase tracking-widest">
                            {product.specifications.carats}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Dots Indicator - Only show for Carousel (Desktop/Tablet) */}
        {itemsPerView > 1 && (
          <div className="flex justify-center gap-1.5 md:gap-2 mt-8 md:mt-12">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 md:w-8 bg-luxury-gold' : 'w-1.5 md:w-2 bg-luxury-gold/20'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link 
            href="/shop" 
            className="luxury-btn-primary scale-90 md:scale-100"
          >
            <span>Explore Full Collection</span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
