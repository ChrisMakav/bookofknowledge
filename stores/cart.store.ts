import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, BookFormat } from '@/types'

export interface AppliedPromo {
  id:       string
  code:     string
  type:     'percentage' | 'fixed'
  value:    number
  discount: number
}

interface CartState {
  items:      CartItem[]
  isCartOpen: boolean
  promo:      AppliedPromo | null

  // Actions
  addItem:        (item: Omit<CartItem, 'quantity'>) => void
  removeItem:     (bookId: string, format: BookFormat) => void
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void
  clearCart:      () => void
  setCartOpen:    (open: boolean) => void
  applyPromo:     (promo: AppliedPromo) => void
  clearPromo:     () => void

  // Computed
  totalItems:    () => number
  subtotal:      () => number
  totalPrice:    () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:      [],
      isCartOpen: false,
      promo:      null,

      addItem(item) {
        set((state) => {
          const existing = state.items.find(
            (i) => i.bookId === item.bookId && i.format === item.format,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.bookId === item.bookId && i.format === item.format
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: 1 }] }
        })
      },

      removeItem(bookId, format) {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.bookId === bookId && i.format === format),
          ),
        }))
      },

      updateQuantity(bookId, format, quantity) {
        if (quantity <= 0) {
          get().removeItem(bookId, format)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.bookId === bookId && i.format === format
              ? { ...i, quantity }
              : i,
          ),
        }))
      },

      clearCart() {
        set({ items: [], promo: null })
      },

      setCartOpen(open) {
        set({ isCartOpen: open })
      },

      applyPromo(promo) {
        set({ promo })
      },

      clearPromo() {
        set({ promo: null })
      },

      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },

      totalPrice() {
        const sub     = get().subtotal()
        const discount = get().promo?.discount ?? 0
        return Math.max(0, parseFloat((sub - discount).toFixed(2)))
      },
    }),
    {
      name:    'bok-cart',
      partialize: (state) => ({ items: state.items, promo: state.promo }),
    },
  ),
)
