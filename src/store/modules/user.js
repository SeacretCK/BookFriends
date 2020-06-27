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
  newIncomingMessages: []
};

const getters = {
  getCurrentUser: state => state.currentUser,
  getCurrentUserProfile: state => state.currentUserProfile,
  getDefaultProfilePicture: state => state.defaultProfilePicture,
  getShowSuccess: state => state.showSuccess,
  getConversations: state => state.conversationsWithUsers,
  getUserConversation: state => state.userConversation,
  getRealtimeUpdateMessages: state => state.newIncomingMessages
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
    allMessagesArray.forEach(message => {
      if (message.senderId !== state.currentUser.uid) {
        if (differentUsers.indexOf(message.senderId) === -1 )  {
          differentUsers.push(message.senderId)
        }
      }
    })

    let userObjects = []
    differentUsers.forEach(userId => {
      usersCollection
      .doc(userId)
      .get()
      .then(res => {
        console.log(res.data())
        let userObject = {
          name: res.data().name,
          id: userId,
          image: res.data().image
        }
        userObjects.push(userObject);
      })
      .catch(err => {
        console.log(err);
      });
    })
    console.log("conversations: ", userObjects);
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
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};