import { postsCollection } from "@/firebaseConfig"
//import firebase from "firebase";

const state = {
  apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y",
  posts: []
};

const getters = {
  getPosts: state => state.posts
};

const actions = {
  // eslint-disable-next-line no-unused-vars
  setPosts({ commit }) {
    let postsArray = [];
    postsCollection
      .orderBy("createdOn", "desc")
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          let post = doc.data();
          post.id = doc.id;
          postsArray.push(post);
        });
        console.log("setPosts", postsArray)
        commit("setPosts", postsArray);
      })
      .catch(err => {
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