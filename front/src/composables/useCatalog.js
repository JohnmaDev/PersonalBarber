import { ref } from 'vue'

const products = ref([])
const categories = ref([])
const isLoading = ref(false)
const isLoaded = ref(false)
const error = ref(null)

// Caché global para evitar llamadas redundantes a la API
export function useCatalog() {
  const fetchCatalog = async (force = false) => {
    if (isLoaded.value && !force) return { success: true }
    if (isLoading.value) return // Evitar múltiples llamadas simultáneas

    isLoading.value = true
    error.value = null

    try {
      // Cargar ambos endpoints en paralelo
      const [resProd, resCat] = await Promise.all([
        fetch('/api/get_products'),
        fetch('/api/get_categories')
      ])

      if (!resProd.ok || !resCat.ok) {
        throw new Error('Error de conexión con el servidor')
      }

      const dataProd = await resProd.json()
      const dataCat = await resCat.json()

      if (dataProd.ok && dataCat.ok) {
        // Solo para productos, aplicamos shuffle en la primera carga
        const shuffled = [...dataProd.products]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
        }
        products.value = shuffled
        categories.value = dataCat.categories
        isLoaded.value = true
        return { success: true }
      } else {
        throw new Error(dataProd.error || dataCat.error || 'Error obteniendo datos')
      }
    } catch (err) {
      error.value = err.message || 'Falló la conexión o error de red'
      console.error('Error cargando catálogo:', err)
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    categories,
    isLoading,
    isLoaded,
    error,
    fetchCatalog
  }
}
