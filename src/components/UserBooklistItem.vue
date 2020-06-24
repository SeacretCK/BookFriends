<template>
  <div class="card__container"> 

    <div class="card__imageBox draggable-handle">
      <div>
        <img class="book__image"
          v-if="book.details.imageLinks" 
          :src="book.details.imageLinks.thumbnail || book.details.imageLinks.smallThumbnail">
        <font-awesome-icon class="book__default-icon" icon="book-open" v-else/>
      </div>
    </div>  

    <div class="card__infos">
      <h2 class="book__number">Nr. {{ book.number }}</h2>
      <h3 class="book__title"> {{ book.details.title }} </h3>
      <p class="book__author" v-if="book.details.authors">by {{ book.details.authors[0] }} </p>
      <p class="book__author-default" v-if="!book.details.authors"> Author unknown </p>
      <p class="book__comment">{{ book.comment }}</p>  
    </div>

    <div class="book__buttons"> 
      <div class="book__infoButton">
        <button type="button" class="button" @click="bookDetails()">Show Info</button>
      </div>
      <div class="book__addButton">
        <button type="button" class="button" @click="openAddBookModal()">Add to Booklist</button>
      </div>
    </div> 

    <section class="section section-bookInfoModal" v-if="showBookInfoModal">
      <BookInfoModal v-on:close="close" :bookInfo="book"></BookInfoModal>
    </section>

    <section class="section section-addBookModal" v-if="showAddBookModal">
      <AddBookModal v-on:close="close" :bookInfo="book"></AddBookModal>
    </section>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BookInfoModal from "@/components/BookInfoModal.vue";
import AddBookModal from "@/components/AddBookModal.vue";

export default {
  name: "BooklistItem",
  components: {
    BookInfoModal,
    AddBookModal
  },
  props: [
    "book",
    "booklistId",
    "bookArray"
  ],
  data() {
    return {
      showBookInfoModal: false,
      showAddBookModal: false,
    }
  },
  methods: {
    ...mapActions([

    ]),
    bookDetails() {
      this.showBookInfoModal = true;
      document.body.classList.add('modal-open');
    },
    openAddBookModal() {
      this.showAddBookModal = true;
    },
    close() {
      this.showBookInfoModal = false;
      this.showAddBookModal = false;
      document.body.classList.remove('modal-open');
    },
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>

  .card__container {
    display: flex;
    justify-content: space-around;
  }

  .card__imageBox {
    padding: 10px;
    text-align: left;
  }

  .book__image {
    height: 150px;
  }

  .book__default-icon {
    width: auto;
    height: 130px;
    object-fit: contain;
    color: $color-medium-grey;
  }

  .card__infos {
    width: 60%;
    padding: 10px;
    text-align: left;
  }

  .book__author {
    padding: 0.5em 0;
  }

  .book__author-default {
    padding: 0.5em 0;
    color: lighten($color-medium-grey, 30%);
  }

  .book__comment {
    font-style: italic;
    padding-top: 0.5em;
  }

  .book__comment-default {
    font-style: italic;
    padding-top: 0.5em;
    color: lighten($color-medium-grey, 30%);
  }

  .book__buttons {
    display: flex;
    flex-direction: column;

    .button {
      padding: 0.5em 1em;
      margin-top: 10px;;
    }
  }


</style>