import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, BookFormat } from '@/types'

interface CartState {
  items:      CartItem[]
  isCartOpen: boolean

  // Actions
  addItem:        (item: Omit<CartItem, 'quantity'>) => void
  removeItem:     (bookId: string, format: BookFormat) => void
  updateQuantity: (bookId: string, format: BookFormat, quantity: number) => void
  clearCart:      () => void
  setCartOpen:    (open: boolean) => void

  // Computed
  totalItems:  () => number
  totalPrice:  () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:      [],
      isCartOpen: false,

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
        set({ items: [] })
      },

      setCartOpen(open) {
        set({ isCartOpen: open })
      },

      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name:    'bok-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
