<template>
  <div class="wrapper">
    <section class="section section-user">
      <h1 class="welcome__heading">Welcome to your Dashboard <span class="welcome__user-name">{{ userInfo.name }}</span> !</h1>
      <hr>
      <p>Create your own BookLists with content from Google Books API</p>
      <p>Connect with friends? Send them book recommendations?</p>
      <hr>
      <div class="user__profile">
        <img :src="userInfo.image || defaultProfilePicture" alt="profile picture" class="profile-picture">
        <div class="user__info" v-if="userInfo.favoriteBook || userInfo.aboutMe">
          <p v-if="userInfo.favoriteBook"><strong>likes:</strong> {{ userInfo.favoriteBook }}</p>
          <br>
          <p v-if="userInfo.aboutMe"><i> {{ userInfo.aboutMe }}</i></p>
        </div>
      </div>
    </section>
      
    <section class="section section-news">
      <h2 class="news__heading">You have new Messages!</h2>
      <p>...</p>
      <p>...</p>
    </section>

    <section class="section section-bookInfoModal" v-if="showBookInfoModal">
      <BookInfoModal v-on:close="close" :bookInfo="clickedBookObject"></BookInfoModal>
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

export default {
  name: "Dashboard",
  components: {
    BookInfoModal
  },
  data() {
    return {
      showBookInfoModal: false,
      clickedBookNumber: null,
      clickedBookObject: null
    }
  },
  created() {
    this.setMostDiscussedBooks();
  },
  methods: {
    ...mapActions([
      "setMostDiscussedBooks"
    ]),
    bookDetails(number) {
      this.showBookInfoModal = true;
      this.clickedBookNumber = number;
      this.clickedBookObject = this.clickedBookInfo;
      document.body.classList.add('modal-open');
    },
    close() {
      this.showBookInfoModal = false;
      this.clickedBookNumber = null;
      this.clickedBookObject = null;
      document.body.classList.remove('modal-open');
    }
  },
  computed: {
    ...mapGetters([
      //"getCurrentUser",
      "getUserProfile",
      "getMostDiscussedBooks",
      "getDefaultProfilePicture"
    ]),
    userInfo() {
      return this.getUserProfile
    },
    defaultProfilePicture() {
      return this.getDefaultProfilePicture
    },
    mostDiscussedBooksSorted() {
      return this.getMostDiscussedBooks.slice(0).sort((a, b) => a.number - b.number); // slice makes it a copy instead of mutating the original array (like sort would)
    },
    clickedBookInfo() {
      return this.mostDiscussedBooksSorted.filter(item => item.number === this.clickedBookNumber)
    },
    // currentUser() {
    //   return this.getCurrentUser
    // }
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

.user__profile {
  display: flex;
  justify-content: center;
}

.profile-picture {
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 100px;
  border: 1px solid $color-white;
}

.user__info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}

.news__heading,
.books__heading {
  font-size: 1.7rem;
  margin-bottom: 0.5em;
}

.books__container {
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  width: 80%;
  margin: 0 auto;
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