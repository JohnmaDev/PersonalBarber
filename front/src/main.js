import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'

// FontAwesome Tree-Shaking Configuration
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { 
  faArrowLeft, faBolt, faBoxOpen, faCalendarCheck, faCalendarTimes, 
  faCameraRetro, faCheck, faCheckCircle, faChevronDown, faChevronUp, 
  faCloudUploadAlt, faComments, faCut, faEdit, faExclamationCircle, 
  faExclamationTriangle, faImage, faInfoCircle, faLock, faMapMarkerAlt, 
  faMinusCircle, faPlus, faPlusCircle, faSave, faSearch, faShieldAlt, 
  faShoppingBag, faSignOutAlt, faSpa, faSpinner, faStore, faSyncAlt, 
  faTag, faTimes, faTools, faTrashAlt, faTruck, faTshirt, faPlug, 
  faBrush, faSprayCan, faScissors, faUser, faKissWinkHeart, faEye, 
  faPalette, faMagic, faPumpSoap, faPaintBrush, faPenNib, faTags, 
  faImages, faCog, faUpload, faBox, faLink, faWallet, faLayerGroup,
  faStar, faGem, faCrown, faGlasses, faGift
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

library.add(
  faArrowLeft, faBolt, faBoxOpen, faCalendarCheck, faCalendarTimes, 
  faCameraRetro, faCheck, faCheckCircle, faChevronDown, faChevronUp, 
  faCloudUploadAlt, faComments, faCut, faEdit, faExclamationCircle, 
  faExclamationTriangle, faImage, faInfoCircle, faLock, faMapMarkerAlt, 
  faMinusCircle, faPlus, faPlusCircle, faSave, faSearch, faShieldAlt, 
  faShoppingBag, faSignOutAlt, faSpa, faSpinner, faStore, faSyncAlt, 
  faTag, faTimes, faTools, faTrashAlt, faTruck, faTshirt, faPlug, 
  faBrush, faSprayCan, faScissors, faUser, faKissWinkHeart, faEye, 
  faPalette, faMagic, faPumpSoap, faPaintBrush, faPenNib, faTags, 
  faImages, faCog, faUpload, faBox, faLink, faWallet, faLayerGroup,
  faStar, faGem, faCrown, faGlasses, faGift,
  faInstagram, faTiktok, faWhatsapp
)

// Auto-replace <i class="fas fa-*"></i> with <svg>
dom.watch()

// Usa el router antes de hacer mount
createApp(App)
  .use(router)
  .mount('#app')

