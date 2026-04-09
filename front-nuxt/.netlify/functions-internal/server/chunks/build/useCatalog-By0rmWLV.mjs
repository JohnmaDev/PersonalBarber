import { ref } from 'vue';

const products = ref([]);
const categories = ref([]);
const isLoaded = ref(false);
const isLoading = ref(false);
const error = ref(null);
function useCatalog() {
  const fetchCatalog = async (force = false) => {
    if (isLoaded.value && !force) return { success: true };
    if (isLoading.value) return { success: false };
    isLoading.value = true;
    error.value = null;
    try {
      const [resProd, resCat] = await Promise.all([
        $fetch("/api/get_products"),
        $fetch("/api/get_categories")
      ]);
      if (resProd.ok && resCat.ok) {
        if (false) ;
        else {
          products.value = resProd.products;
        }
        categories.value = resCat.categories;
        isLoaded.value = true;
        return { success: true };
      } else {
        throw new Error("Error obteniendo datos del cat\xE1logo");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Fall\xF3 la conexi\xF3n o error de red";
      error.value = msg;
      console.error("Error cargando cat\xE1logo:", err);
      return { success: false, error: msg };
    } finally {
      isLoading.value = false;
    }
  };
  return {
    products,
    categories,
    isLoading,
    isLoaded,
    error,
    fetchCatalog
  };
}

export { useCatalog as u };
//# sourceMappingURL=useCatalog-By0rmWLV.mjs.map
