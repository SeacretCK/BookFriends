import { usersCollection } from "@/firebaseConfig"
//import router from '@/router'

const state = {
  apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y",
  currentUser: null,
  userProfile: {},
  booklist: [],
  defaultProfilePicture: "https://firebasestorage.googleapis.com/v0/b/bookfriends-8ad5b.appspot.com/o/default-profile-pic.png?alt=media&token=a3ce294c-6633-46fb-bae2-a388f08a0e4d",
  showSuccess: false
};

const getters = {
  getCurrentUser: state => state.currentUser,
  getUserProfile: state => state.userProfile,
  getDefaultProfilePicture: state => state.defaultProfilePicture,
  getShowSuccess: state => state.showSuccess 
};

const actions = {
  setCurrentUser({ commit }, user) {
    commit("setCurrentUser", user)
  },
  setUserProfile({ commit, state }) {
    usersCollection
      .doc(state.currentUser.uid)
      .get()
      .then(res => {
        commit("setUserProfile", res.data());
      })
      .catch(err => {
        console.log(err);
      });
  },
  clearUserData({ commit }) {
    commit("setCurrentUser", null);
    commit("setUserProfile", {})
  },
  updateProfile({ dispatch }, profile) {
    usersCollection
      .doc(state.currentUser.uid)
      .update({
        name: profile.name,
        aboutMe: profile.aboutMe,
        favoriteBook: profile.favoriteBook,
        signature: profile.signature,
        image: profile.image
      })
      .then(() => {
        dispatch("setUserProfile");
        dispatch("showSuccess")
      })
      .catch(err => {
        console.log(err);
      });
  },
  showSuccess({ commit }) {
    commit("showSuccess");
  }
};

const mutations = {
  setCurrentUser(state, user) {
    state.currentUser = user;
  },
  setUserProfile(state, profile) {
    state.userProfile = profile;
  },
  showSuccess(state) {
    state.showSuccess = true;
    setTimeout(() => {
      state.showSuccess = false;
    }, 2000);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};