import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { store } from "./store";
import firebase from "firebase/app";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashAlt,
  faCaretDown,
  faTimes,
  faSearch,
  faBookOpen,
  faCheck,
  faPen,
  faComment,
  faHeart as fasHeart
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faTrashAlt,
  faCaretDown,
  faTimes,
  faSearch,
  faBookOpen,
  faCheck,
  faPen,
  farHeart,
  fasHeart,
  faComment
);
Vue.component("font-awesome-icon", FontAwesomeIcon);

import vSelect from "vue-select";
Vue.component("v-select", vSelect);

import VueToastify from "vue-toastify";
Vue.use(VueToastify);

Vue.config.productionTip = false;

// handle page reloads
let app;

// eslint-disable-next-line no-unused-vars
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: (h) => h(App)
    }).$mount("#app");
  }
});
