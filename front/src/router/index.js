import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home,
    meta: {
      title: 'PersonalBarber — Barbería Premium en Medellín',
      description: 'Barbería premium en Medellín con el mejor estilo. Cortes exclusivos, barba profesional y productos especializados. Reserva tu cita online al instante.'
    }
  },
  { 
    path: '/agendar', 
    name: 'ReservaCita', 
    component: () => import('@/views/ReservaCita.vue'),
    meta: {
      title: 'Agendar Cita | PersonalBarber',
      description: 'Reserva tu cita online en PersonalBarber. Selecciona tu barbero, servicio y horario preferido en Medellín.'
    }
  },
  { 
    path: '/admin', 
    name: 'AdminPanel', 
    component: () => import('@/views/AdminPanel.vue'),
    meta: {
      title: 'Panel de Administración | PersonalBarber'
    }
  },
  { 
    path: '/tienda', 
    name: 'Tienda', 
    component: () => import('@/views/StoreView.vue'),
    meta: {
      title: 'Tienda Online | PersonalBarber',
      description: 'Descubre nuestros productos especializados para el cuidado de la barba y el cabello. Compra online en PersonalBarber.'
    }
  },
  { 
    path: '/tienda/producto/:slug', 
    name: 'ProductDetail', 
    component: () => import('@/views/ProductDetailView.vue'),
    meta: {
      title: 'Producto | PersonalBarber',
      description: 'Detalles del producto. Consigue los mejores artículos para el cuidado personal en PersonalBarber.'
    }
  },
  { 
    path: '/checkout', 
    name: 'Checkout', 
    component: () => import('@/views/CheckoutView.vue'),
    meta: {
      title: 'Finalizar Compra | PersonalBarber'
    }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return savedPosition || { top: 0, left: 0 }
  }
})

// Actualizar el título y metadata dinámicamente según la ruta
router.beforeEach((to, from, next) => {
  // Buscar la ruta más cercana que tenga un título definido
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  }

  // Buscar la ruta más cercana que tenga una descripción definida
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.description);
  const metaDescriptionTag = document.querySelector('meta[name="description"]');
  if (nearestWithMeta && metaDescriptionTag) {
    metaDescriptionTag.setAttribute('content', nearestWithMeta.meta.description);
  }

  next();
});

export default router