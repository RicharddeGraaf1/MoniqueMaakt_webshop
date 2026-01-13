import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  price: number
  image?: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  loadFromStorage: () => void
  saveToStorage: () => void
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const items = get().items
    const existingItem = items.find((i) => i.id === item.id)
    
    let newItems: CartItem[]
    if (existingItem) {
      newItems = items.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + (item.quantity || 1) }
          : i
      )
    } else {
      newItems = [...items, { ...item, quantity: item.quantity || 1 }]
    }
    set({ items: newItems })
    get().saveToStorage()
  },
  removeItem: (id) => {
    const newItems = get().items.filter((item) => item.id !== id)
    set({ items: newItems })
    get().saveToStorage()
  },
  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id)
    } else {
      const newItems = get().items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
      set({ items: newItems })
      get().saveToStorage()
    }
  },
  clearCart: () => {
    set({ items: [] })
    get().saveToStorage()
  },
  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  },
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0)
  },
  loadFromStorage: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart-storage')
      if (stored) {
        try {
          const items = JSON.parse(stored)
          set({ items })
        } catch (e) {
          // Invalid storage data
        }
      }
    }
  },
  saveToStorage: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart-storage', JSON.stringify(get().items))
    }
  },
}))
