import { create } from 'zustand'

interface UIStore {
  isMenuOpen: boolean
  isCartOpen: boolean
  isSearchOpen: boolean
  toggleMenu: () => void
  toggleCart: () => void
  toggleSearch: () => void
  closeAll: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,

  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

  closeAll: () => set({ isMenuOpen: false, isCartOpen: false, isSearchOpen: false }),
}))
