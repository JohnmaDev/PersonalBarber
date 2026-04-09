import { computed, reactive } from 'vue';

const loadCartFromStorage = () => {
  return [];
};
const cartItems = reactive(loadCartFromStorage());
function addToCart(product, qty = 1) {
  const stock = Number(product.stock) || 0;
  const existing = cartItems.find((i) => i.id === product.id);
  if (existing) {
    if (existing.qty + qty > stock) {
      return {
        success: false,
        message: `Solo quedan ${stock} unidades disponibles de este producto.`,
        currentQty: existing.qty
      };
    }
    existing.qty += qty;
  } else {
    if (qty > stock) {
      return {
        success: false,
        message: `Solo quedan ${stock} unidades disponibles de este producto.`,
        currentQty: 0
      };
    }
    cartItems.push({ ...product, qty, stock });
  }
  return { success: true };
}
function removeFromCart(productId) {
  const idx = cartItems.findIndex((i) => i.id === productId);
  if (idx !== -1) cartItems.splice(idx, 1);
}
function updateQuantity(productId, qty) {
  const item = cartItems.find((i) => i.id === productId);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(productId);
    return { success: true };
  }
  const stock = Number(item.stock) || 0;
  if (qty > stock) {
    return {
      success: false,
      message: `El stock m\xE1ximo disponible es ${stock}.`,
      maxStock: stock
    };
  }
  item.qty = qty;
  return { success: true };
}
function clearCart() {
  cartItems.splice(0, cartItems.length);
}
function parsePrice(priceStr) {
  return Number(String(priceStr).replace(/\$|\.| COP/g, "").trim()) || 0;
}
function formatPrice(num) {
  const n = typeof num === "string" ? parsePrice(num) : num;
  return `$${n.toLocaleString("es-CO")} COP`;
}
function getProductQty(productId) {
  const item = cartItems.find((i) => i.id === productId);
  return item ? item.qty : 0;
}
function isStockFull(product) {
  const currentQty = getProductQty(product.id);
  const stock = Number(product.stock) || 0;
  return currentQty >= stock;
}
const cartCount = computed(() => cartItems.reduce((sum, i) => sum + i.qty, 0));
const cartTotal = computed(() => cartItems.reduce((sum, i) => sum + parsePrice(i.price) * i.qty, 0));
const cartTotalFormatted = computed(() => formatPrice(cartTotal.value));
function useCart() {
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
  };
}

export { useCart as u };
//# sourceMappingURL=useCart-CWHG987f.mjs.map
