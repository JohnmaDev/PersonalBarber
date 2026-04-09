// composables/useCart.ts
// Carrito global — state reactivo compartido + persistencia localStorage
// Guard process.client para SSR-safe

import { reactive, computed, watch } from 'vue'

const CART_STORAGE_KEY = 'barbelcol_guest_cart'

// Cargar carrito desde localStorage (solo en cliente)
const loadCartFromStorage = (): CartItem[] => {
  if (!process.client) return []
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Error loading cart from LocalStorage:', e)
    return []
  }
}

interface CartItem {
  id: number | string
  name: string
  price: string | number
  image?: string
  images?: string[]
  stock: number
  qty: number
  [key: string]: unknown
}

// Estado global reactivo
const cartItems = reactive<CartItem[]>(loadCartFromStorage())

// Sincronizar automáticamente con localStorage
if (process.client) {
  watch(cartItems, (newCart) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
  }, { deep: true })
}

function addToCart(product: CartItem, qty = 1) {
  const stock = Number(product.stock) || 0
  const existing = cartItems.find(i => i.id === product.id)

  if (existing) {
    if (existing.qty + qty > stock) {
      return {
        success: false,
        message: `Solo quedan ${stock} unidades disponibles de este producto.`,
        currentQty: existing.qty
      }
    }
    existing.qty += qty
  } else {
    if (qty > stock) {
      return {
        success: false,
        message: `Solo quedan ${stock} unidades disponibles de este producto.`,
        currentQty: 0
      }
    }
    cartItems.push({ ...product, qty, stock })
  }
  return { success: true }
}

function removeFromCart(productId: number | string) {
  const idx = cartItems.findIndex(i => i.id === productId)
  if (idx !== -1) cartItems.splice(idx, 1)
}

function updateQuantity(productId: number | string, qty: number) {
  const item = cartItems.find(i => i.id === productId)
  if (!item) return
  if (qty <= 0) {
    removeFromCart(productId)
    return { success: true }
  }
  const stock = Number(item.stock) || 0
  if (qty > stock) {
    return {
      success: false,
      message: `El stock máximo disponible es ${stock}.`,
      maxStock: stock
    }
  }
  item.qty = qty
  return { success: true }
}

function clearCart() {
  cartItems.splice(0, cartItems.length)
}

function parsePrice(priceStr: string | number): number {
  return Number(String(priceStr).replace(/\$|\.| COP/g, '').trim()) || 0
}

function formatPrice(num: number | string): string {
  const n = typeof num === 'string' ? parsePrice(num) : num
  return `$${n.toLocaleString('es-CO')} COP`
}

function getProductQty(productId: number | string): number {
  const item = cartItems.find(i => i.id === productId)
  return item ? item.qty : 0
}

function isStockFull(product: CartItem): boolean {
  const currentQty = getProductQty(product.id)
  const stock = Number(product.stock) || 0
  return currentQty >= stock
}

const cartCount = computed(() => cartItems.reduce((sum, i) => sum + i.qty, 0))
const cartTotal = computed(() => cartItems.reduce((sum, i) => sum + parsePrice(i.price) * i.qty, 0))
const cartTotalFormatted = computed(() => formatPrice(cartTotal.value))

export function useCart() {
  return {
    cartItems,
    cartCount,
    cartTotal,
    cartTotalFormatted,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    formatPrice,
    parsePrice,
    getProductQty,
    isStockFull,
  }
}
