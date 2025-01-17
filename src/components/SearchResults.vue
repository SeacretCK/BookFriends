<template>
  <div class="results-container">
    <h2>Results</h2>
    <hr>
    <div v-for="book in getSearchResults" :key="book.id" class="books__item" @click="bookDetails(book.bookId)">
      <div class="book__image">
        <img 
          v-if="book.details.imageLinks" 
          :src="book.details.imageLinks.thumbnail || book.details.imageLinks.smallThumbnail">
        <font-awesome-icon class="book__default-icon" icon="book-open" v-else/>
      </div>
      <div class="book__info">
        <h3 class="book__title">  {{ book.details.title }} </h3>
        <p v-if="book.details.authors" class="book__author"> {{ book.details.authors.toString() }} </p>
      </div>
      <div class="book__addButton">
        <button type="button" class="button" @click="openAddBookModal(book.bookId)">Add to Booklist</button>
      </div> 
      
    </div>

    <section class="section section-bookInfoModal" v-if="bookModal.showBookInfoModal">
      <BookInfoModal v-on:close="close" :bookInfo="bookModal.clickedBookObject"></BookInfoModal>
    </section>

    <section class="section section-addBookModal" v-if="showAddBookModal">
      <AddBookModal v-on:close="close" :bookInfo="bookModal.clickedBookObject"></AddBookModal>
    </section>

    <div>
      <button type="button" class="button" @click="showMoreResults">Show more Results</button>
    </div>   

  </div>
</template>


<script>
import BookInfoModal from "@/components/BookInfoModal.vue";
import AddBookModal from "@/components/AddBookModal.vue";

import { mapGetters, mapActions } from 'vuex'

export default {
  name: "SearchResults",
  components: {
    BookInfoModal,
    AddBookModal
  },
  props: [
    "advancedSearch",
    "inputAdvancedSearch",
    "inputSimpleSearch"
  ],
  data() {
    return {
      bookModal: {
        showBookInfoModal: false,
        clickedBookId: "", 
        clickedBookObject: []
      },
      showAddBookModal: false,
    }
  },
  methods: {
    ...mapActions([
      "runSimpleSearch",
      "runAdvancedSearch"
    ]),
    bookDetails(id) {
      this.bookModal.clickedBookId = id;
      this.bookModal.clickedBookObject = this.clickedBookInfo[0];
      this.bookModal.showBookInfoModal = true;
      document.body.classList.add('modal-open');
    },
    openAddBookModal(id) {
      this.bookModal.clickedBookId = id;
      this.bookModal.clickedBookObject = this.clickedBookInfo[0];
      this.showAddBookModal = true;
      document.body.classList.add('modal-open');
    },
    close() {
      this.bookModal.showBookInfoModal = false;
      this.bookModal.clickedBookNumber = null;
      this.bookModal.clickedBookObject = null;
      this.showAddBookModal = false;
      document.body.classList.remove('modal-open');
    },
    showMoreResults() {
      if (!this.advancedSearch) {
        this.inputSimpleSearch.typeOfCall = "addResults";
        this.inputSimpleSearch.startIndex = this.getSearchResults.length + 1;
        this.runSimpleSearch(this.inputSimpleSearch);
      } else {
        this.inputAdvancedSearch.typeOfCall = "addResults";
        this.inputAdvancedSearch.startIndex = this.getSearchResults.length + 1;
        this.runAdvancedSearch(this.inputAdvancedSearch);
      }
    }
    
  },
  computed: {
    ...mapGetters([
      "getSearchResults",
    ]),
    clickedBookInfo() {
      return this.getSearchResults.filter(item => item.bookId === this.bookModal.clickedBookId)
      // returns an array with one object
    },
    
  }
}
</script>

<style lang="scss" scoped>

  .books__item {
    display: flex;
    justify-content: space-evenly;
    border: 1px solid $color-dark-grey;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    @include set-background($color-light-grey);
  }

  .book__image {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      height: auto;
      object-fit: contain
    }
  }

  .book__default-icon {
    width: 100%;
    height: auto;
    object-fit: contain;
    color: $color-medium-grey;
  }

  .book__info {
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding-left: 1em;
  }

  .book__title {
    text-align: left;
    font-size: 1.1rem;
    font-weight: 500;
  }

  .book__author {
    font-size: 0.9rem;
  }

  .book__addButton {
    width: 30%;
    display: flex;
    justify-content: center;
    align-items: center;

    .button {
      padding: 0.5rem;
      min-width: 0;
      width: 100%;
      object-fit: contain
    }
  }


  @media only screen and (min-width: 600px) {
    .book__title {
      text-align: left;
      font-size: 1.3rem;
      font-weight: 700;
    }

    .book__author {
      font-size: 1rem;
    }

    .book__addButton {
      width: 20%;
    }
  }
</style>