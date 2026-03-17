import { create } from 'zustand'

interface UIStore {
  isMenuOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean
  toggleMenu: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleSearch: () => void
  closeAll: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  closeAll: () => set({ isMenuOpen: false, isCartOpen: false, isSearchOpen: false }),
}))
