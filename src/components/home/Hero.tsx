'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import gsap from 'gsap'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Hero3DScene = dynamic(() => import('@/components/3d/Hero3DScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="loading-spinner w-16 h-16 border-2 border-luxury-gold border-t-transparent rounded-full" />
    </div>
  ),
})

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.8])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 100,
        duration: 1.2,
        delay: 0.5,
        ease: 'power4.out',
      })

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.8,
        ease: 'power3.out',
      })

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.1,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-luxury-black"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-luxury-charcoal via-luxury-black to-luxury-black opacity-60" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-luxury-gold rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* 3D Model - Cinematic Diamond Ring */}
      <motion.div
        className="absolute inset-0"
        style={{ 
          opacity,
          scale,
        }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        >
          <Hero3DScene />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="luxury-container text-center">
          <motion.div style={{ opacity, scale }}>
            <motion.h1
              className="hero-title font-display text-display-lg md:text-display-xl text-gradient glow-text mb-6"
              initial={{ opacity: 0 }}
            >
              Timeless Elegance
            </motion.h1>

            <motion.p
              className="hero-subtitle text-xl md:text-2xl text-luxury-champagne/80 mb-12 max-w-2xl mx-auto font-serif"
              initial={{ opacity: 0 }}
            >
              Discover exceptional jewelry crafted with passion, precision, and
              unparalleled artistry
            </motion.p>

            <motion.div
              className="hero-cta flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0 }}
            >
              <Link href="/shop" className="luxury-btn-primary">
                <span>Explore Collections</span>
              </Link>
              <Link href="/about" className="luxury-btn">
                <span>Our Story</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ opacity }}
      >
        <span className="text-luxury-gold/60 text-xs uppercase tracking-widest">
          Scroll
        </span>
        <ArrowDown className="text-luxury-gold/60" size={24} />
      </motion.div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-black to-transparent" />
    </section>
  )
}
