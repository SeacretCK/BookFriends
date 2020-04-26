import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import firebase from "firebase/app";

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTrashAlt, faCaretDown, faTimes)
Vue.component('font-awesome-icon', FontAwesomeIcon)

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