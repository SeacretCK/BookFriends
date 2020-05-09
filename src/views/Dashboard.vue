<template>
  <div class="wrapper">
    <section class="section section-user">
      <h1 class="welcome__heading">Welcome to your Dashboard <span class="welcome__user-name">{{ userInfo.name }}</span> !</h1>
      <hr>
      <p>Create your own BookLists with content from Google Books API</p>
      <p>Connect with friends? Send them book recommendations?</p>
      <hr>
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
        <div class="user__news">
          <h2 class="news__heading">You have new Messages!</h2>
          <p>...</p>
          <p>...</p>
        </div>
      </div>
    </section>


    <section class="section section-bookInfoModal" v-if="bookModal.showBookInfoModal">
      <BookInfoModal v-on:close="close" :bookInfo="bookModal.clickedBookObject"></BookInfoModal>
    </section>

    <section class="section section-booklistModal" v-if="listModal.showBooklistModal">
      <BooklistModal v-on:close="close" :bookListId="listModal.clickedBooklistId"></BooklistModal>
    </section>

    <section class="section section-books">
      <h2 class="books__heading">Most discussed books this week</h2>
      <div class="books__container">
        <div v-for="book in mostDiscussedBooksSorted" :key="book.bookId" class="books__item" @click="bookDetails(book.number)">
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


export default {
  name: "Dashboard",
  components: {
    BookInfoModal,
    BooklistModal
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
      newListNameAlert: ""
    }
  },
  created() {
    this.setMostDiscussedBooks();
    this.setBooklists();
  },
  methods: {
    ...mapActions([
      "setMostDiscussedBooks",
      "createBooklist",
      "setBooklists",
      "setBooksInBooklist",
      "deleteBooklist"
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
    close() {
      this.bookModal.showBookInfoModal = false;
      this.bookModal.clickedBookNumber = null;
      this.bookModal.clickedBookObject = null;
      this.listModal.showBooklistModal = false;
      this.listModal.clickedBooklist = null;
      this.listModal.clickedBooklistObject = null;
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
      "getUserProfile",
      "getMostDiscussedBooks",
      "getDefaultProfilePicture",
      "getBooklists"
    ]),
    userInfo() {
      return this.getUserProfile
    },
    defaultProfilePicture() {
      return this.getDefaultProfilePicture
    },

    // MOST DISCUSSED BOOKS

    mostDiscussedBooksSorted() {
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
    }
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
    "news news news news news news news. sidebar sidebar sidebar sidebar";
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

// NEWS

.user__news {
  grid-area: news;
  text-align: left;
}

.news__heading {
  font-size: 1.7rem;
  margin-bottom: 0.5em;
}


// BOOKLISTS

.user__booklists {
  grid-area: sidebar;
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

.news__heading,
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