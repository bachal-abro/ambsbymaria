import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, CartItem, Product, Material } from '@/types'

interface CartStore extends Cart {
  addItem: (product: Product, material: Material, quantity?: number) => void
  removeItem: (productId: string, materialId: string) => void
  updateQuantity: (productId: string, materialId: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (product, material, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedMaterial.id === material.id
          )

          let newItems: CartItem[]

          if (existingItemIndex > -1) {
            newItems = [...state.items]
            newItems[existingItemIndex].quantity += quantity
          } else {
            newItems = [
              ...state.items,
              { product, selectedMaterial: material, quantity },
            ]
          }

          const total = newItems.reduce(
            (sum, item) =>
              sum +
              item.product.price *
                item.quantity,
            0
          )

          return { items: newItems, total }
        })
      },

      removeItem: (productId, materialId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.selectedMaterial.id === materialId
              )
          )

          const total = newItems.reduce(
            (sum, item) =>
              sum +
              item.product.price *
                item.quantity,
            0
          )

          return { items: newItems, total }
        })
      },

      updateQuantity: (productId, materialId, quantity) => {
        set((state) => {
          const newItems = state.items.map((item) =>
            item.product.id === productId &&
            item.selectedMaterial.id === materialId
              ? { ...item, quantity }
              : item
          )

          const total = newItems.reduce(
            (sum, item) =>
              sum +
              item.product.price *
                item.quantity,
            0
          )

          return { items: newItems, total }
        })
      },

      clearCart: () => set({ items: [], total: 0 }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'luxe-cart-storage',
    }
  )
)
