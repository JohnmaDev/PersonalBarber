import { reactive, computed, watch } from 'vue'

const CART_STORAGE_KEY = 'barbelcol_guest_cart'

// Intentar cargar el carrito desde localStorage
const loadCartFromStorage = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (e) {
    console.error('Error loading cart from LocalStorage:', e)
    return []
  }
}

// Estado global del carrito — reactivo y compartido entre todos los componentes
const cartItems = reactive(loadCartFromStorage())

// Sincronizar automáticamente cualquier cambio (agregar, borrar, cantidad)
watch(cartItems, (newCart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
}, { deep: true })

// Agregar producto (si ya existe, incrementa cantidad validando stock)
function addToCart(product, qty = 1) {
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
    // Guardamos el stock en el item para validaciones posteriores
    cartItems.push({ ...product, qty, stock })
  }
  return { success: true }
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
  const idx = cartItems.findIndex(i => i.id === productId)
  if (idx !== -1) cartItems.splice(idx, 1)
}

// Actualizar cantidad directamente (validando stock)
function updateQuantity(productId, qty) {
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

// Vaciar el carrito
function clearCart() {
  cartItems.splice(0, cartItems.length)
}

// Parsear precio colombiano a número
function parsePrice(priceStr) {
  return Number(String(priceStr).replace(/\$|\.| COP/g, '').trim()) || 0
}

// Formatear número como precio colombiano
function formatPrice(num) {
  return `$${num.toLocaleString('es-CO')} COP`
}

// Obtener cantidad actual de un producto en el carrito
function getProductQty(productId) {
  const item = cartItems.find(i => i.id === productId)
  return item ? item.qty : 0
}

// Verificar si el stock de un producto ya está lleno en el carrito
function isStockFull(product) {
  const currentQty = getProductQty(product.id)
  const stock = Number(product.stock) || 0
  return currentQty >= stock
}

// Totales computados
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
    isStockFull
  }
}
