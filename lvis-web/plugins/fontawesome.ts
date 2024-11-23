import { defineNuxtPlugin } from '#app';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faKey, faBolt, faSmile, faUserCircle } from '@fortawesome/free-solid-svg-icons'; // Import only used icons

// Add the selected icons to the library
library.add(faUser, faKey, faBolt, faSmile, faUserCircle);

console.log('library', library);

export default defineNuxtPlugin((nuxtApp) => {
  // Register the FontAwesomeIcon component globally
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
});
