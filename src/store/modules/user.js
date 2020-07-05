import { usersCollection, messagesCollection } from "@/firebaseConfig"
//import router from '@/router'

const state = {
  apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y",
  currentUser: null,
  currentUserProfile: {},
  booklist: [],
  defaultProfilePicture: "https://firebasestorage.googleapis.com/v0/b/bookfriends-8ad5b.appspot.com/o/default-profile-pic.svg?alt=media&token=a4cce389-ab38-413c-94a2-ee88965c2a08",
  showSuccess: false,
  allMessages: [],
  conversationsWithUsers: [],
  userConversation: [],
  newIncomingMessages: [],
  allUsers: []
};

const getters = {
  getCurrentUser: state => state.currentUser,
  getCurrentUserProfile: state => state.currentUserProfile,
  getDefaultProfilePicture: state => state.defaultProfilePicture,
  getShowSuccess: state => state.showSuccess,
  getAllMessages: state => state.allMessages,
  getConversations: state => state.conversationsWithUsers,
  getUserConversation: state => state.userConversation,
  getRealtimeUpdateMessages: state => state.newIncomingMessages,
  getAllUsers: state => state.allUsers
};

const actions = {
  setCurrentUser({ commit }, user) {
    commit("setCurrentUser", user)
  },
  setCurrentUserProfile({ commit, state }) {
    usersCollection
      .doc(state.currentUser.uid)
      .get()
      .then(res => {
        commit("setCurrentUserProfile", res.data());
      })
      .catch(err => {
        console.log(err);
      });
  },
  clearUserData({ commit }) {
    commit("setCurrentUser", null);
    commit("setCurrentUserProfile", {})
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
        dispatch("setCurrentUserProfile");
        dispatch("showSuccess")
      })
      .catch(err => {
        console.log(err);
      });
  },
  showSuccess({ commit }) {
    commit("showSuccess");
  },
  setAllMessages({ commit, state, dispatch }) {
    console.log("setting all messages")
    let messagesArray = [];
    
    //incoming messages
    messagesCollection
      .where("recipientId", "==", state.currentUser.uid)
      .get()
      .then(res => {
        res.docs.forEach(message => {
          messagesArray.push({
            id: message.id,
            timestamp: message.data().timestamp,
            recipientId: message.data().recipientId,
            recipientName: message.data().recipientName,
            senderId: message.data().senderId,
            senderName: message.data().senderName,
            message: message.data().message,
            read: message.data().read
          })
        })
        console.log("fetched messages incoming", messagesArray)
      })
      .then(() => {
        //outgoing messages
        messagesCollection
        .where("senderId", "==", state.currentUser.uid)
        .get()
        .then(res => {
          res.docs.forEach(message => {
            messagesArray.push({
              id: message.id,
              timestamp: message.data().timestamp,
              recipientId: message.data().recipientId,
              recipientName: message.data().recipientName,
              senderId: message.data().senderId,
              senderName: message.data().senderName,
              message: message.data().message,
              read: message.data().read
            })
          })
          console.log("fetched messages complete", messagesArray)
          commit("setAllMessages", messagesArray);
          console.log("dispatching setConversations")
          dispatch("setConversations");
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err);
      });
  },

  realtimeUpdateMessages({ commit }) {
    console.log("realtimeUpdateMessages")
    let newIncomingMessage = [];
    messagesCollection
    .where("recipientId", "==", state.currentUser.uid)
    .onSnapshot(querySnapshot => {
      //if(querySnapshot.docChanges()[0].doc.data().type === 'added') {

      // the type === 'added' didn't work, so I use the onSnapshot only to trigger a watcher in the ConversationModal and run setAllMessages and setUserConversation again

      // it's probably better to do all the message fetching with onSnapshot, but I can only have one where condition afak

      // so now I initially fetch all the messages concerning the user (in and out), when sending a message setAllMessages and setUserConversation run again to update, and for incoming messages the onSnapshot registers changes in the datatbase, then setUserConversation handles if the new message is part of the current conversation

        querySnapshot.forEach(message => {
          newIncomingMessage.push({
            id: message.id,
            timestamp: message.data().timestamp,
            recipientId: message.data().recipientId,
            recipientName: message.data().recipientName,
            senderId: message.data().senderId,
            senderName: message.data().senderName,
            message: message.data().message,
            read: message.data().read
          })
        })

        console.log("new incoming message", newIncomingMessage)
        commit("realtimeUpdateMessages", newIncomingMessage)
      //}

    })
  },

  setConversations({ commit, state }) {
    console.log("setting conversations")
    let differentUsers = [];
    let allMessagesArray = state.allMessages;

    // setting different users
    allMessagesArray.forEach(message => {
      if (message.senderId !== state.currentUser.uid) {
        if (differentUsers.indexOf(message.senderId) === -1 )  {
          differentUsers.push(message.senderId)
        }
      }
      // first message to a user with no reply yet
      if (message.senderId === state.currentUser.uid) {
        if (differentUsers.indexOf(message.recipientId) === -1 )  {
          differentUsers.push(message.recipientId)
        }
      }
    });

    console.log("differentUsers: ", differentUsers)

    let userObjects = []
    differentUsers.forEach(userId => {
      let userObject = {
        userName: "",
        userId: userId,
        userImage: "",
        unreadMessagesFromUser: 0
      }
      userObjects.push(userObject);
    })

    console.log("userObjects: ", userObjects)

    // setting unread messages
    allMessagesArray.forEach(message => {
      if (message.recipientId === state.currentUser.uid && message.read === false) {
        console.log("checking for unread messages")
        userObjects.forEach(user => {
          if (user.userId === message.senderId) {
            console.log("unread message +1")
            user.unreadMessagesFromUser++;
          }
        })
      }
    })

    // completing user information
        
    userObjects.forEach(user => {
      usersCollection
      .doc(user.userId)
      .get()
      .then(res => {
        console.log("getting user information ", res.data())
        user.userName = res.data().name;
        user.userImage = res.data().image;
      })
      .catch(err => {
        console.log(err);
      });
    })

    console.log("userObjects to commit setConversations", userObjects)
    commit("setConversations", userObjects)
  },
  setUserConversation({ commit, state }, userId ) {
    console.log("setting userConversation")
    let allMessagesArray = state.allMessages;
    let conversation = [];

    allMessagesArray.forEach(message => {
      if (message.senderId === userId) {
        conversation.push(message)
      } else if (message.recipientId === userId) {
        conversation.push(message)
      }
    })

    conversation.sort((a, b) => a.timestamp - b.timestamp)
    commit("setUserConversation", conversation)
  },
  clearUserConversation({ commit }) {
    commit("clearUserConversation");
  },

  setAllUsers({ commit }) {
    let allUsers = [];
    usersCollection
    .get()
    .then(res => {
      res.docs.forEach(doc => {
        if (doc.id !== state.currentUser.uid) {
          let user = {};
          user.userName = doc.data().name;
          user.userId = doc.id;
          allUsers.push(user);
        }
      })
      console.log("setAllUsers", allUsers)
      commit("setAllUsers", allUsers)
    })
    .catch(err => {
      console.log(err)
    })
  }
};

const mutations = {
  setCurrentUser(state, user) {
    state.currentUser = user;
  },
  setCurrentUserProfile(state, profile) {
    state.currentUserProfile = profile;
  },
  showSuccess(state) {
    state.showSuccess = true;
    setTimeout(() => {
      state.showSuccess = false;
    }, 2000);
  },
  setAllMessages(state, messagesArray) {
    state.allMessages = messagesArray;
  },
  setConversations(state, differentUsers) {
    state.conversationsWithUsers = differentUsers;
  },
  setUserConversation(state, conversation) {
    state.userConversation = conversation
  },
  clearUserConversation(state) {
    state.userConversation = [];
  },
  realtimeUpdateMessages(state, newIncomingMessage) {
    state.newIncomingMessages = [...state.newIncomingMessages, ...newIncomingMessage];
  },
  setAllUsers(state, allUsers) {
    state.allUsers = allUsers;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};