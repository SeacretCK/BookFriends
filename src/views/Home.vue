<template>
  <div class="wrapper">
    <section class="section section-welcome">
      <h1 class="welcome__heading">Welcome</h1>
      <p class="welcome__text">Some text...</p>
    </section>

    <section class="section section-bookInfo" v-if="showBookInfoModal">
      <BookInfoModal v-on:close="close" :bookInfo="clickedBookObject"></BookInfoModal>
    </section>

    <section class="section section-login" v-if="!showBookInfoModal">
      <Login/>
    </section>

    <section class="section section-books">
      <h2 class="books__heading">Most discussed books this week</h2>
      <div class="books__container">
        <div v-for="(book, index) in mostDiscussedBooksSorted" :key="index" class="books__item" @click="bookDetails(book.number)">
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
import Login from "@/components/Login.vue";
import BookInfoModal from "@/components/BookInfoModal.vue";
 

export default {
  name: 'Home',
  components: {
    Login,
    BookInfoModal
  },
  data() {
    return {
      showBookInfoModal: false,
      clickedBookNumber: null,
      clickedBookObject: null
    }
  },
  methods: {
    bookDetails(number) {
      this.showBookInfoModal = true;
      this.clickedBookNumber = number;
      this.clickedBookObject = this.clickedBookInfo;
    },
    close() {
      this.showBookInfoModal = false;
      this.clickedBookNumber = null;
      this.clickedBookObject = null;
    }
  },
  computed: {
    mostDiscussedBooksSorted() {
      return this.$store.getters.getMostDiscussedBooks.slice(0).sort((a, b) => a.number - b.number); // slice makes it a copy instead of mutating the original array (like sort would)
    },
    clickedBookInfo() {
      return this.mostDiscussedBooksSorted.filter(item => item.number === this.clickedBookNumber)
    }
  },
  created() {
    this.$store.dispatch("setMostDiscussedBooks")
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
