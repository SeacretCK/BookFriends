<template>
  <div class="wrapper">
    <section class="section section-user">
      <h1 class="welcome__heading">Welcome to your Dashboard <span class="welcome__user-name">{{ userInfo.name }}</span> !</h1>
      
      <div class="user__dashboard">

        <div class="user__profile">
          <img :src="userInfo.image || defaultProfilePicture" alt="profile picture" class="profile-picture">
          <div class="profile-info" v-if="userInfo.favoriteBook || userInfo.aboutMe">
            <p v-if="userInfo.favoriteBook"><strong>likes:</strong> {{ userInfo.favoriteBook }}</p>
            <br>
            <p v-if="userInfo.aboutMe"><i> {{ userInfo.aboutMe }}</i></p>
          </div>
        </div>

        <div class="user__booklists">
          <h2 class="booklist__heading">Your booklists</h2>
          <div v-for="list in booklists" :key="list.listId">
            <div class="booklist__item" tabindex="0">
              <div class="booklist__name" @click="showBooklist(list.listId)">
                <p> {{list.listName}} </p>
              </div>
              <button type="button" class="button button-close booklist__delete" @click="deleteBooklist(list.listId)"><font-awesome-icon icon='trash-alt' class="button__icon"/></button>
            </div>
          </div>
          <p class="alert" v-if="newListNameAlert"> {{ newListNameAlert }} </p>
          <form @submit.prevent class="new-booklist__form">
            <button class="button button-create" @click="createNewList">Create new list</button>
            <input
              type="text"
              ref="input"
              placeholder="Name of the list"
              class="input"
              v-model.trim="newListName"
            />
          </form>
        </div>

        <div class="user__conversations">
          <h2 class="conversations__heading">Your conversations</h2>
          <div v-if="!getConversations.length" class="conversations__item no_item">
            <p>No conversations</p>
          </div>
          <div v-for="user in getConversations" :key="user.userId">
            <div class="conversations__item" tabindex="0" @click="openConversation(user.userId, user.userName)">
              <img :src="user.userImage || defaultProfilePicture" alt="profile picture" class="conversations__profile-picture">
              <p>{{ user.userName }} <span class="conversations__badge" v-if="user.unreadMessagesFromUser > 0">New messages: {{ user.unreadMessagesFromUser }}</span></p> 
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" v-if="conversationModal.showConversationModal">
      <ConversationModal v-on:close="close" :recipientId="conversationModal.userId" :recipientName="conversationModal.userName"></ConversationModal>
    </section>

    <section class="section" v-if="listModal.showBooklistModal">
      <BooklistModal v-on:close="close" :booklistId="listModal.clickedBooklistId"></BooklistModal>
    </section>

  </div>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BooklistModal from "@/components/BooklistModal.vue";
import ConversationModal from "@/components/ConversationModal.vue";
//import { usersCollection } from "@/firebaseConfig"


export default {
  name: "Dashboard",
  components: {
    BooklistModal,
    ConversationModal
  },
  data() {
    return {
      listModal: {
        showBooklistModal: false,
        clickedBooklistId: null,
      },
      newListName: "",
      newListNameAlert: "",
      conversationModal: {
        showConversationModal: false,
        userId: "",
        userName: ""
      }
    }
  },
  created() {
    this.setBooklists();
    this.setAllMessages();
    this.realtimeUpdateMessages();
  },
  methods: {
    ...mapActions([
      "setMostDiscussedBooks",
      "createBooklist",
      "setBooklists",
      "setBooksInBooklist",
      "deleteBooklist",
      "setAllMessages",
      "setUserConversation",
      "realtimeUpdateMessages"
    ]),
  
    showBooklist(id) {
      this.listModal.showBooklistModal = true;
      this.listModal.clickedBooklistId = id;
      this.setBooksInBooklist(this.listModal.clickedBooklistId)
      document.body.classList.add('modal-open');
    },
    openConversation(userId, userName) {
      this.conversationModal.userId = userId;
      this.conversationModal.userName = userName;
      this.conversationModal.showConversationModal = true;
      document.body.classList.add('modal-open');
    },
    close() {
      this.listModal.showBooklistModal = false;
      this.listModal.clickedBooklist = null;
      this.listModal.clickedBooklistObject = null;
      this.conversationModal.userId = "";
      this.conversationModal.showConversationModal = false;
      document.body.classList.remove('modal-open');
    },
    createNewList() {
      this.newListNameAlert = "";
      if (this.newListName) { // making the input required didn't work properly and caused a browser alert after submit
        if (this.checkIfListNameAlreadyExists) {
          this.newListNameAlert = "You already have a list with that name!"
        } else {
          this.createBooklist(this.newListName);
          this.newListName = "";
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      "getCurrentUserProfile",
      "getDefaultProfilePicture",
      "getBooklists",
      "getConversations",
      "getAllMessages",
      "getRealtimeUpdateMessages"
    ]),
    userInfo() {
      return this.getCurrentUserProfile
    },
    defaultProfilePicture() {
      return this.getDefaultProfilePicture
    },
    

    // BOOKLISTS

    booklists() {
      return this.getBooklists
    },
    checkIfListNameAlreadyExists() {
      return this.getBooklists.some(item => item.listName === this.newListName)
    },
  
    
  },
  watch: {
    getRealtimeUpdateMessages() {
      console.log("watcher of realtime updates")
      this.setAllMessages();
    }
  },
}
</script>

<style lang="scss" scoped>

.welcome__heading,
.welcome__text {
  color: inherit;
}

.welcome__heading {
  font-size: 2rem;
  margin-bottom: 0.8em;
}

.welcome__user-name {
  color: $color-light-blue;
}

// USER SECTION

.user__profile {
  display: flex;
  justify-content: center;
  grid-area: main;
  margin-bottom: 1rem;
}

.profile-picture {
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 100px;
  border: 2px solid $color-light-blue;
}

.profile-info {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  padding-top: 1em;
}

// CONVERSATIONS

.user__conversations {
  grid-area: conversations;
  text-align: left;
  @include set-background($color-dark-blue);
  border-radius: 10px;
  overflow: hidden; // this lets the corners of the children be clipped to the border-radius
  border: 1px solid $color-dark-grey;
  align-self: flex-start;
  max-width: 400px;
  margin: 0 auto;
}

.conversations__heading {
  font-size: 1.7rem;
  padding: 0.5rem;
  border-bottom: 1px solid $color-dark-grey;
  text-align: center;
}

.conversations__item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 1px solid $color-dark-grey;
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  
  &:hover,
  &:focus {
    background-color: lighten($color-dark-blue, 10%);
    outline: none;
  }

  &.no_item {
    cursor: default;

    &:hover,
    &:focus {
      background-color: inherit;
      outline: none;
    }
  }
}

.conversations__profile-picture {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid $color-light-blue;
  margin-right: 1rem;
}

.conversations__badge {
  min-width: 1em;
  height: auto;
  padding: 0.3em;
  margin-left: 1em;
  border-radius: 5px;
  background-color: $color-red;
  text-align: center;
}

// BOOKLISTS

.user__booklists {
  grid-area: sidebar2;
  @include set-background($color-dark-blue);
  border-radius: 10px;
  overflow: hidden; // this lets the corners of the children be clipped to the border-radius
  border: 1px solid $color-dark-grey;
  align-self: flex-start;
  margin: 0 auto;
  margin-bottom: 1rem;
  max-width: 400PX;
}

.booklist__heading {
  font-size: 1.7rem;
  padding: 0.3em 0;
  border-bottom: 1px solid $color-dark-grey;
}

.booklist__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8em;
  border-bottom: 1px solid $color-dark-grey;
  cursor: pointer;
  
  &:hover,
  &:focus {
    background-color: lighten($color-dark-blue, 10%);
    outline: none;
  }
}

.booklist__name {
  width: 60%;
  margin-right: 10px;
  text-align: left;
  display: flex;
  align-items: center;
  word-break: break-word;
}

.new-booklist__form {
  display: flex;
  width: 100%;
}

.button-create {
  border-radius: 0;
  border: 1px solid $color-dark-grey;
  width: 50%;
}

.button__icon {
  width: 20px;;
}

.input {
  border: 1px solid $color-dark-grey;
  width: 50%;
  padding-left: 5px;
}


@media only screen and (min-width: 900px) {
  .user__dashboard {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: minmax(100px, auto);
    grid-template-areas: 
      "main main main main main main main. sidebar sidebar sidebar sidebar"
      "conversations conversations conversations conversations conversations conversations conversations. sidebar2 sidebar2 sidebar2 sidebar2";
    row-gap: 2rem;
  }
 
  .user__booklists, 
  .user__conversations {
    margin: 0;
  }

  .user__profile {
    justify-content: flex-start;
  }
}

</style>