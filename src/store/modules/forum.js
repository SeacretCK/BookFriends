import { postsCollection, usersCollection } from "@/firebaseConfig";
//import firebase from "firebase";

const state = {
  apiKey: process.env.VUE_APP_API_KEY,
  posts: []
};

const getters = {
  getPosts: (state) => state.posts
};

const actions = {
  // eslint-disable-next-line no-unused-vars
  setPosts({ commit }) {
    let postsArray = [];
    postsCollection
      .orderBy("createdOn", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
          let post = doc.data();
          post.id = doc.id;

          //userName and signature should be fetched with the id, because users can change their name/signature

          usersCollection
            .doc(post.userId)
            .get()
            .then((res) => {
              post.userName = res.data().name;
              post.userSignature = res.data().signature;
            })
            .catch((err) => {
              this._vm.$vToastify.error(err.message);
              console.log(err);
            });

          postsArray.push(post);
        });
        console.log("setPosts", postsArray);
        commit("setPosts", postsArray);
      })
      .catch((err) => {
        this._vm.$vToastify.error(err.message);
        console.log(err);
      });
  }
};

const mutations = {
  setPosts(state, postsArray) {
    state.posts = postsArray;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
