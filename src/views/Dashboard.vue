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
          <div v-for="user in getConversations" :key="user.id">
            <div class="conversations__item" tabindex="0" @click="openConversation(user.id, user.name)">
              <img :src="user.image || defaultProfilePicture" alt="profile picture" class="conversations__profile-picture">
              <p>{{ user.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" v-if="conversationModal.showConversationModal">
      <ConversationModal v-on:close="close" :recipientId="conversationModal.userId" :recipientName="conversationModal.userName"></ConversationModal>
    </section>

    <section class="section" v-if="bookModal.showBookInfoModal">
      <BookInfoModal v-on:close="close" :bookInfo="bookModal.clickedBookObject"></BookInfoModal>
    </section>

    <section class="section" v-if="listModal.showBooklistModal">
      <BooklistModal v-on:close="close" :booklistId="listModal.clickedBooklistId"></BooklistModal>
    </section>

    <section class="section section-books">
      <h2 class="books__heading">Most discussed books this week</h2>
      <div class="books__container">
        <div v-for="book in mostDiscussedBooksSorted" :key="book.id" class="books__item" @click="bookDetails(book.number)">
          <h3 class="book__title">  {{ book.details.title }} </h3>
          <p class="book__author"> {{ book.details.authors.toString() }} </p>
          <div class="book__image">
            <img :src="book.details.imageLinks.thumbnail">
          </div>
        </div>
      </div>
    </section>   
  </div>  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BookInfoModal from "@/components/BookInfoModal.vue";
import BooklistModal from "@/components/BooklistModal.vue";
import ConversationModal from "@/components/ConversationModal.vue";
//import { usersCollection } from "@/firebaseConfig"


export default {
  name: "Dashboard",
  components: {
    BookInfoModal,
    BooklistModal,
    ConversationModal
  },
  data() {
    return {
      bookModal: {
        showBookInfoModal: false,
        clickedBookNumber: null,
        clickedBookObject: null
      },
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
    this.setMostDiscussedBooks();
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
    bookDetails(number) {
      this.bookModal.showBookInfoModal = true;
      this.bookModal.clickedBookNumber = number;
      this.bookModal.clickedBookObject = this.clickedBookInfo[0];
      document.body.classList.add('modal-open');
    },
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
      this.bookModal.showBookInfoModal = false;
      this.bookModal.clickedBookNumber = null;
      this.bookModal.clickedBookObject = null;
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
      "getMostDiscussedBooks",
      "getDefaultProfilePicture",
      "getBooklists",
      "getConversations"
    ]),
    userInfo() {
      return this.getCurrentUserProfile
    },
    defaultProfilePicture() {
      return this.getDefaultProfilePicture
    },
    

    // MOST DISCUSSED BOOKS

    mostDiscussedBooksSorted() {
      console.log("mostDiscussedBooksSorted: ", this.getMostDiscussedBooks.slice(0).sort((a, b) => a.number - b.number))
      return this.getMostDiscussedBooks.slice(0).sort((a, b) => a.number - b.number); // slice makes it a copy instead of mutating the original Array (like sort would)
    },
    clickedBookInfo() {
      return this.mostDiscussedBooksSorted.filter(item => item.number === this.bookModal.clickedBookNumber)
      // returns an array with one object
    },

    // BOOKLISTS

    booklists() {
      return this.getBooklists
    },
    checkIfListNameAlreadyExists() {
      return this.getBooklists.some(item => item.listName === this.newListName)
    },


    // MESSAGES

    
  }
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

.user__dashboard {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(100px, auto);
  grid-template-areas: 
    "main main main main main main main. sidebar sidebar sidebar sidebar"
    "conversations conversations conversations conversations conversations conversations conversations. sidebar2 sidebar2 sidebar2 sidebar2";
  row-gap: 2rem;
}

.user__profile {
  display: flex;
  justify-content: flex-start;
  grid-area: main;
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
}

.conversations__profile-picture {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid $color-light-blue;
  margin-right: 1rem;
}

// BOOKLISTS

.user__booklists {
  grid-area: sidebar2;
  @include set-background($color-dark-blue);
  border-radius: 10px;
  overflow: hidden; // this lets the corners of the children be clipped to the border-radius
  border: 1px solid $color-dark-grey;
  align-self: flex-start;
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

// OTHER SECTIONS

.books__heading {
  font-size: 1.7rem;
  margin-bottom: 0.5em;
}

.books__container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.books__item {
  width: 30%;
  border: 1px solid $color-dark-grey;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  @include set-background($color-light-grey);
}

.book__image {
  padding: 10px;
}

.book__title,
.book__author {
  margin-bottom: 0.5em;
}

.book__title {
  font-size: 1.5rem;
  margin-top: 0.5em;
}

</style>