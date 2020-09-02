import firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

// firebase init
console.log(process.env);
const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: "bookfriends-8ad5b.firebaseapp.com",
  databaseURL: "https://bookfriends-8ad5b.firebaseio.com",
  projectId: "bookfriends-8ad5b",
  storageBucket: "bookfriends-8ad5b.appspot.com",
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID
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
const messagesCollection = db.collection("messages");

export {
  db,
  auth,
  currentUser,
  storage,
  usersCollection,
  booklistsCollection,
  postsCollection,
  commentsCollection,
  messagesCollection
};
