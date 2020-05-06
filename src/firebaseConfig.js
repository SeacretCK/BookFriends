import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// firebase init
const config = {
  apiKey: "AIzaSyB_t_4hS4ZfKuYFzsMSbL-w9_CZdrNXX4U",
  authDomain: "bookfriends-8ad5b.firebaseapp.com",
  databaseURL: "https://bookfriends-8ad5b.firebaseio.com",
  projectId: "bookfriends-8ad5b",
  storageBucket: "bookfriends-8ad5b.appspot.com",
  messagingSenderId: "58628209996",
  appId: "1:58628209996:web:1fb81d39ecc15e5c0e23e9"

};

firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;
const storage = firebase.storage();

// firebase collections
const usersCollection = db.collection("users");
const booklistsCollection = db.collection("booklists");
const postsCollection = db.collection("posts");
const commentsCollection = db.collection("comments");
const likesCollection = db.collection("likes");

export {
  db,
  auth,
  currentUser,
  storage,
  usersCollection,
  booklistsCollection,
  postsCollection,
  commentsCollection,
  likesCollection
};
