import Vue from 'vue'
import Vuex from 'vuex'
import mostDiscussedBooks from "./modules/mostDiscussedBooks"
import user from "./modules/user"
import booklists from "./modules/booklists"
import search from "./modules/search"
import forum from "./modules/forum"


import { auth } from "@/firebaseConfig"


Vue.use(Vuex)


// the store gets reset with page reload
// that's why currentUser and currentUserProfile need to be set again
// an alternative would be local storage, cookie or persistedstate (https://github.com/robinvdvleuten/vuex-persistedstate)

auth.onAuthStateChanged(user => {
  if (user) {
    console.log("check user on page reload")
    store.dispatch("setCurrentUser", user);
    store.dispatch("setCurrentUserProfile");
  }
});

export const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  },
  modules: {
    mostDiscussedBooks,
    user,
    booklists,
    search,
    forum
  }
})
