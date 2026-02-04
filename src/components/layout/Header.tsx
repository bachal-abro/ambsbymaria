'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Collections', href: '/shop' },
  { name: 'Rings', href: '/shop?category=rings' },
  { name: 'Necklaces', href: '/shop?category=necklaces' },
  { name: 'Bracelets', href: '/shop?category=bracelets' },
  { name: 'Earrings', href: '/shop?category=earrings' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { isMenuOpen, toggleMenu, toggleCart } = useUIStore()
  const itemCount = useCartStore((state) => state.getItemCount())

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-luxury-black/95 backdrop-blur-md border-b border-luxury-charcoal-light'
            : 'bg-transparent'
        )}
      >
        <div className="luxury-container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 border border-luxury-gold flex items-center justify-center transition-all duration-300 group-hover:bg-luxury-gold">
                <span className="text-luxury-gold text-xl font-display font-bold group-hover:text-luxury-black transition-colors">
                  L
                </span>
              </div>
              <span className="text-xl font-display tracking-wider text-gradient glow-text hidden sm:block">
                LUXE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm uppercase tracking-wider text-luxury-white/80 hover:text-luxury-gold transition-colors duration-300 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <button
                className="text-luxury-white/80 hover:text-luxury-gold transition-colors duration-300"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <button
                onClick={toggleCart}
                className="relative text-luxury-white/80 hover:text-luxury-gold transition-colors duration-300"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-luxury-gold text-luxury-black text-xs flex items-center justify-center rounded-full font-medium"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="lg:hidden text-luxury-white/80 hover:text-luxury-gold transition-colors duration-300"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-luxury-black/95 backdrop-blur-lg">
              <nav className="flex flex-col items-center justify-center h-full space-y-8">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={toggleMenu}
                      className="text-2xl font-display text-luxury-white hover:text-luxury-gold transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
