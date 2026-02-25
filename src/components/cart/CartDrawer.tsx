'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useUIStore } from '@/store/uiStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { isCartOpen, toggleCart } = useUIStore()
  const { items, total, removeItem, updateQuantity } = useCartStore()

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-luxury-elevation"
          >
            {/* Header */}
            <div className="p-6 border-b border-luxury-charcoal-light flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-luxury-gold" size={24} />
                <h2 className="font-display text-2xl text-luxury-white">
                  Shopping Cart
                </h2>
              </div>
              <button
                onClick={toggleCart}
                className="text-luxury-white/60 hover:text-luxury-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="text-luxury-gold/30 mb-4" size={64} />
                  <p className="text-luxury-white/70 text-lg mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-luxury-white/60 text-sm mb-6">
                    Add some luxury pieces to get started
                  </p>
                  <Link
                    href="/shop"
                    onClick={toggleCart}
                    className="luxury-btn"
                  >
                    <span>Browse Collections</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedMaterial.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 luxury-card p-4"
                    >
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-luxury-black overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-luxury-white font-medium mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-luxury-gold/60 text-sm mb-2">
                          {item.selectedMaterial.name}
                        </p>
                        <p className="text-luxury-gold font-medium">
                          {formatPrice(
                            (item.product.price + item.selectedMaterial.price) *
                              item.quantity
                          )}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedMaterial.id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="w-7 h-7 border border-luxury-charcoal-light text-luxury-white hover:border-luxury-gold transition-colors flex items-center justify-center"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-luxury-white text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedMaterial.id,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 border border-luxury-charcoal-light text-luxury-white hover:border-luxury-gold transition-colors flex items-center justify-center"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.selectedMaterial.id)
                        }
                        className="text-luxury-white/60 hover:text-luxury-gold transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-luxury-charcoal-light">
                {/* Subtotal */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-luxury-white/75 uppercase text-sm tracking-wider">
                    Subtotal
                  </span>
                  <span className="text-luxury-gold font-display text-2xl">
                    {formatPrice(total)}
                  </span>
                </div>

                <p className="text-luxury-white/60 text-xs text-center mb-6">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  <Link
                    href="/checkout"
                    onClick={toggleCart}
                    className="block luxury-btn-primary w-full"
                  >
                    <span>Proceed to Checkout</span>
                  </Link>
                  <button
                    onClick={toggleCart}
                    className="block luxury-btn w-full"
                  >
                    <span>Continue Shopping</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
