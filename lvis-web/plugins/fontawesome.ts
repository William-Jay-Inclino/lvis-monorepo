import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faKey, faBolt, faSmile, faUserCircle, faTrash, faEdit, faSearch, faPlus, faChevronRight, faChevronLeft, faPrint, faList, faSave, faSync, faInfoCircle, faLock, faUsers, faCog, faPlusCircle, faShoppingCart, faTimesCircle } from '@fortawesome/free-solid-svg-icons'; // Import only used icons

library.add(
  faUser, faKey, faBolt, faSmile, faUserCircle, faTrash, faEdit, faSearch, faPlus, faCog,
  faChevronRight, faChevronLeft, faPrint, faList, faSave, faSync, faInfoCircle, faLock, 
  faUsers, faPlusCircle, faShoppingCart, faTimesCircle,
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
});
