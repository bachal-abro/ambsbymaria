'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Search } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'

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
  const { isMenuOpen, toggleMenu, toggleCart } = useUIStore()
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex flex-col"
      >
        {/* Announcement Bar */}
        <div className="bg-[#f8d0d3] text-[#1A1F2C] py-2 px-4 text-center text-[9px] md:text-[10px] uppercase font-normal tracking-[0.2em] w-full">
          Free Nationwide Delivery Above Order of Rs 2500/-
        </div>

        <div className="w-full px-4 md:px-10 border-b border-luxury-charcoal-light">
          <div className="flex items-center justify-between h-20">
            {/* Logo at far Left */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center group" title="AmbsbyMaria - Home">
                <Image
                  src="/logo.png"
                  alt="AmbsbyMaria Premium Jewellery Home"
                  width={160}
                  height={56}
                  className="h-14 md:h-16 w-auto object-contain"
                  style={{ width: 'auto' }}
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation & Icons Grouped to the Right */}
            <div className="hidden lg:flex items-center space-x-10">
              {/* Desktop Navigation - Improved Spacing */}
              <nav className="flex items-center space-x-10" aria-label="Main Navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-[11px] uppercase tracking-[0.2em] font-medium text-luxury-white/80 hover:text-luxury-gold transition-colors duration-300 relative group whitespace-nowrap"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-luxury-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              {/* Spacing between Contact and Search Bar Icon */}
              <div className="flex items-center space-x-6 border-l border-luxury-charcoal-light/30 pl-10 ml-4">
                <button
                  className="text-luxury-white/70 hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Search"
                >
                  <Search size={22} />
                </button>

                <button
                  onClick={toggleCart}
                  className="relative text-luxury-white/70 hover:text-luxury-gold transition-colors duration-300"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag size={22} />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-luxury-gold text-white text-[10px] flex items-center justify-center rounded-full font-bold"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Actions & Menu Toggle */}
            <div className="flex lg:hidden items-center space-x-4">
              <button
                onClick={toggleCart}
                className="relative text-luxury-white/70 hover:text-luxury-gold transition-colors duration-300"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={24} />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-luxury-gold text-white text-[9px] flex items-center justify-center rounded-full font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="text-luxury-white/70 hover:text-luxury-gold transition-colors duration-300"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
            <div className="absolute inset-0 bg-white/95 backdrop-blur-lg">
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
