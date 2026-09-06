// https://nuxt.com/docs/api/configuration/nuxt-config


export default defineNuxtConfig({

  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  devServer: {
    host: '0.0.0.0'
  },

  // SSR habilitado para SEO óptimo
  ssr: true,

  // Módulos
  modules: [
    '@nuxtjs/sitemap',
  ],

  // Tailwind V4 via PostCSS
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },



  // CSS global
  css: [
    '~/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],



  // Variables de entorno
  runtimeConfig: {
    // Solo servidor (privadas) — NUNCA expuestas al cliente
    adminPin: process.env.NUXT_ADMIN_PIN || process.env.NUXT_PUBLIC_ADMIN_PIN || '',
    // Públicas (cliente + servidor)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://personalbarber.co',
      // Wompi — llave PÚBLICA (diseñada para estar en el cliente)
      wompiPublicKey: process.env.NUXT_PUBLIC_WOMPI_KEY || '',
      // Ambiente: 'sandbox' | 'production'
      wompiEnvironment: process.env.NUXT_PUBLIC_WOMPI_ENV || 'sandbox',
    }
  },

  // Configuración global de sitio para SEO / Sitemap
  site: {
    url: process.env.NODE_ENV === 'production' ? 'https://personalbarber.co' : (process.env.NUXT_PUBLIC_SITE_URL || 'https://personalbarber.co'),
    name: 'PersonalBarber',
  },

  // App head global — metadatos base SEO
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'es' },
      title: 'PersonalBarber — Tienda de Barbería Online | Medellín & Colombia',
      meta: [
        { name: 'description', content: 'Tienda de barbería líder en Medellín y Colombia. Compra productos profesionales para barberos: máquinas WMark, ceras para cabello, minoxidil kirkland, tijeras y barbería a domicilio. Envíos rápidos a todo el país.' },
        { name: 'keywords', content: 'tienda de barberias, tienda de barberia medellin, productos de barberia, insumos de barberia colombia, maquinas de barberia, ceras para cabello, minoxidil medellin, minoxidil kirkland colombia, barberia medellin, barbero a domicilio medellin' },
        { name: 'theme-color', content: '#0A0A0A' },
        { property: 'og:title', content: 'PersonalBarber — Tienda de Barbería Online | Medellín & Colombia' },
        { property: 'og:description', content: 'Tienda de barbería profesional en Medellín. Ceras, máquinas WMark, cuidado de barba, minoxidil y skincare. Compra online con envíos a toda Colombia.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'PersonalBarber' },
        { property: 'og:url', content: 'https://personalbarber.co' },
        { property: 'og:image', content: 'https://personalbarber.co/og-image.webp' },
        { property: 'og:image:secure_url', content: 'https://personalbarber.co/og-image.webp' },
        { property: 'og:image:type', content: 'image/webp' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'PersonalBarber — Tienda de Barbería en Medellín' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'PersonalBarber — Tienda de Barbería Online | Medellín' },
        { name: 'twitter:description', content: 'Tienda de barbería profesional en Medellín. Compra online productos para barberos con envío a toda Colombia.' },
        { name: 'twitter:image', content: 'https://personalbarber.co/og-image.webp' },
      ],
      link: [
        { rel: 'canonical', href: 'https://personalbarber.co' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        // Preconnect a Cloudinary — elimina ~300ms de latencia DNS/TLS en imágenes
        { rel: 'preconnect', href: 'https://res.cloudinary.com' },
        // Preload hero image — mejora LCP crítico (mobile vs desktop)
        { rel: 'preload', as: 'image', href: '/bg_vertical_mobile.webp', media: '(max-width: 640px)' },
        { rel: 'preload', as: 'image', href: '/bg_vertical.webp', media: '(min-width: 641px)' },
        // Google Fonts: preconnect first — NON-BLOCKING via preload+onload trick
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        // Preload the font CSS non-blocking — eliminates 780ms render-blocking
        {
          rel: 'preload',
          as: 'style',
          href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap',
          onload: "this.onload=null;this.rel='stylesheet'"
        },
      ],
      noscript: [
        { innerHTML: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Serif+4:ital,wght@0,300;0,400;1,300&display=swap">' }
      ]
    }
  },

  // Sitemap automático (@nuxtjs/sitemap v8) con productos dinámicos
  sitemap: {
    siteUrl: 'https://personalbarber.co',
    exclude: [
      '/admin',
      '/admin/**',
      '/checkout',
      '/checkout/**',
      '/wa',
    ],
    urls: async () => {
      try {
        const response = await fetch('https://personalbarber.co/api/get_catalog')
        if (!response.ok) return []
        const data: any = await response.json()
        if (!data?.products || !Array.isArray(data.products)) return []

        return data.products
          .filter((p: any) => p.is_active !== false)
          .map((p: any) => {
            const cleanName = (p.name || '')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
            const slug = `${p.id}-${cleanName}`

            const images = (p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])).slice(0, 2).map((img: string) => ({
              loc: img,
              title: p.name,
            }))

            return {
              loc: `/tienda/producto/${slug}`,
              _priority: 0.8,
              changefreq: 'weekly',
              images,
            }
          })
      } catch {
        return []
      }
    },
  },

  // Nitro — preset Netlify para deploy
  nitro: {
    preset: 'netlify',
  },

  // Proxy de API + headers de seguridad para mejorar Best Practices score
  routeRules: {
    '/api/**': {
      proxy: process.env.NODE_ENV === 'development'
        ? 'http://localhost:8888/.netlify/functions/**'
        : 'https://personalbarber.co/.netlify/functions/**'
    },
    // Aplicar security headers a todo el sitio
    '/**': {
      headers: {
        'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      }
    }
  },
})

