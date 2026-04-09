// composables/useCatalog.ts
// Catálogo SSR — useFetch() para que el contenido sea visible para Google
// El shuffle se aplica SOLO en el cliente para no romper hidratación

export interface Product {
  id: number
  name: string
  brand: string
  price: string | number
  description: string
  category: string
  images?: string[]
  image?: string
  stock: number
  slug?: string
  [key: string]: unknown
}

export interface Category {
  id: string
  label: string
  department: string
  style?: string
  accent?: string
  cover?: string
  icon?: string
  comingSoon?: boolean
  [key: string]: unknown
}

// State compartido entre todos los componentes (singleton)
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const isLoaded = ref(false)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useCatalog() {
  /**
   * Carga el catálogo mediante useFetch (SSR) o $fetch (client fallback).
   * Se ejecuta automáticamente en el server durante SSR, lo que hace que
   * el contenido sea indexable por Google en el primer HTML servido.
   */
  const fetchCatalog = async (force = false) => {
    if (isLoaded.value && !force) return { success: true }
    if (isLoading.value) return { success: false }

    isLoading.value = true
    error.value = null

    try {
      const [resProd, resCat] = await Promise.all([
        $fetch<{ ok: boolean; products: Product[] }>('/api/get_products'),
        $fetch<{ ok: boolean; categories: Category[] }>('/api/get_categories'),
      ])

      if (resProd.ok && resCat.ok) {
        // Asignar productos — shuffle SOLO en cliente para no romper hidratación SSR
        if (process.client) {
          const shuffled = [...resProd.products]
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
          }
          products.value = shuffled
        } else {
          products.value = resProd.products
        }

        categories.value = resCat.categories
        isLoaded.value = true
        return { success: true }
      } else {
        throw new Error('Error obteniendo datos del catálogo')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falló la conexión o error de red'
      error.value = msg
      console.error('Error cargando catálogo:', err)
      return { success: false, error: msg }
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
    fetchCatalog,
  }
}
