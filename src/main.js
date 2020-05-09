import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import firebase from "firebase/app";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faCaretDown, faTimes, faSearch, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTrashAlt, faCaretDown, faTimes, faSearch, faBookOpen)
Vue.component('font-awesome-icon', FontAwesomeIcon)

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

Vue.config.productionTip = false

// handle page reloads
let app;

firebase.auth().onAuthStateChanged(user => {
  console.log("onAuthStateChanged User: ", user);
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})