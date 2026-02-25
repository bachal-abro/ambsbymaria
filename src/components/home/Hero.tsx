'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
        y: 40,
        duration: 1.2,
        delay: 0.6,
        ease: 'power3.out',
      })

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 20,
        duration: 0.9,
        delay: 1.0,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #E896B8 0%, #F0B0C8 25%, #F8C8D8 55%, #FDDDE6 75%, #F8C8D8 100%)',
      }}
    >

      {/* Animated shimmer particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.15, 0.6, 0.15],
              scale: [1, 1.8, 1],
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

      {/* Bottom fade — behind text, dark enough for white text */}
      <div className="absolute bottom-0 left-0 right-0 h-72 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(80,20,40,0.72) 0%, rgba(100,30,55,0.45) 45%, transparent 100%)' }}
      />

      {/* Text overlay — bottom center, Tiffany style */}
      <div className="absolute inset-x-0 bottom-12 z-20 flex flex-col items-center text-center px-4">
        <h1
          className="hero-title font-serif mb-6"
          style={{
            color: '#ffffff',
            fontSize: 'clamp(2rem, 5.5vw, 4.2rem)',
            letterSpacing: '0.04em',
            lineHeight: 1.1,
            fontWeight: 700,
            textShadow: '0 2px 16px rgba(60,15,30,0.5)',
          }}
        >
          Elegance Crafted By Maria
        </h1>

        <div className="hero-cta">
          <Link
            href="/shop"
            className="inline-block px-10 py-3 border border-white text-white text-xs uppercase tracking-[0.2em] font-sans
                       hover:bg-white hover:text-[#3D1A28] transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}
