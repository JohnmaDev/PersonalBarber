import { reactive, computed } from 'vue'

// Estado global del carrito — reactivo y compartido entre todos los componentes
const cartItems = reactive([])

// Agregar producto (si ya existe, incrementa cantidad)
function addToCart(product, qty = 1) {
  const existing = cartItems.find(i => i.id === product.id)
  if (existing) {
    existing.qty += qty
  } else {
    cartItems.push({ ...product, qty })
  }
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
  const idx = cartItems.findIndex(i => i.id === productId)
  if (idx !== -1) cartItems.splice(idx, 1)
}

// Actualizar cantidad directamente
function updateQuantity(productId, qty) {
  const item = cartItems.find(i => i.id === productId)
  if (!item) return
  if (qty <= 0) {
    removeFromCart(productId)
  } else {
    item.qty = qty
  }
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
  }
}
