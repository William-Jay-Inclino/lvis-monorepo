import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faKey, faBolt, faSmile, faUserCircle, faTrash, faEdit, faSearch, faPlus, faChevronRight, faChevronLeft, faPrint, faList, faSave, faSync, faInfoCircle, faLock, faUsers, faCog, faPlusCircle, faShoppingCart, faTimesCircle, faBell, faEye, faClose, faPaperPlane, faStar, faStickyNote, faUserPlus, faPaperclip, faTimes, faGear, faClipboard, faLink, faFileInvoice, faWarehouse, faBook, faCheckCircle, faHistory, faTruck, faMedal, faMoneyBillWave, faCalendarAlt, faCar, faEyeSlash, faHeart, faCheck, faWarning, faDoorOpen, faShieldAlt, faGasPump, faHandshake, faWrench, faHouse, faCoins, faBoxesStacked, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'; // Import only used icons

library.add(
  faUser, faKey, faBolt, faSmile, faUserCircle, faTrash, faEdit, faSearch, faPlus, faCog,
  faChevronRight, faChevronLeft, faPrint, faList, faSave, faSync, faInfoCircle, faLock, 
  faUsers, faPlusCircle, faShoppingCart, faTimesCircle, faBell, faEye, faClose, faPaperPlane,
  faStar, faStickyNote, faUserPlus, faPaperclip, faTimes, faGear, faClipboard, faLink, faEyeSlash,
  faFileInvoice, faMoneyBillWave, faWarehouse, faBook, faCalendarAlt, faCheckCircle, faHistory, faTruck, faCar,
  faMedal, faSmile, faCheck, faWarning, faDoorOpen, faShieldAlt, faGasPump, faHistory, faWrench, faHouse, faCoins,
  faChevronDown, faChevronUp,
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
