// plugins/fontawesome.client.ts
// FontAwesome — solo cliente (no SSR), evita hidration mismatch

import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Evitar que FontAwesome agregue CSS automáticamente (prevenir hydration mismatch)
config.autoAddCss = false

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

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FaIcon', FontAwesomeIcon)
})
