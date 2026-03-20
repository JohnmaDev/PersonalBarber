import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import router from './router'

// Usa el router antes de hacer mount
createApp(App)
  .use(router)
  .mount('#app')
