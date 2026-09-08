import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // Si estamos en la misma página y solo cambian parámetros de consulta (filtros, orden, etc.),
    // conservar la posición de scroll y evitar saltos indeseados hacia arriba.
    if (to.path === from.path) {
      return false
    }
    return { top: 0, left: 0 }
  }
}
