import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

interface WishlistState {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set((state) => ({ items: [...state.items, product] }))
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId)
      },
      toggleWishlist: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)
