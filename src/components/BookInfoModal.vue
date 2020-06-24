<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        
        <div class="modal__content">
          <div class="modal__content-image">
            <img v-if="bookInfo.details.imageLinks" :src="bookInfo.details.imageLinks.thumbnail || bookInfo.details.imageLinks.smallThumbnail">
            <font-awesome-icon class="book__default-icon" icon="book-open" v-else/>
            <div class="modal__buttons">
              <button type="button" class="button" @click="openAddBookModal()">Add to Booklist</button>
              <button type="button" class="button" disabled>Read Discussions</button>
            </div>
          </div>  
          <div class="modal__content-infos">
            <h3 class="modal__book-title">  {{ bookInfo.details.title }} </h3>
            <p v-if="bookInfo.details.authors" class="modal__book-author">by {{ bookInfo.details.authors.toString() }} </p>
            <p v-if="bookInfo.details.publishedDate" class="modal__book-year">published: {{ bookInfo.details.publishedDate }} </p>
            <div v-if="bookInfo.details.description">
              <p class="modal__book-summary" v-if="fullDescription" v-html="bookInfo.details.description"></p>
              <p class="modal__book-summary" v-else v-html="this.$options.filters.trimLength(bookInfo.details.description)"></p>
            </div>
            <a v-if="readMore" @click="showFullDescription">Read more</a>
          </div>
        </div>
      </div>

      <section class="section section-addBookModal" v-if="showAddBookModal">
        <AddBookModal v-on:close="close" :bookInfo="bookInfo"></AddBookModal>
      </section>

    </div>
  </div>
</template>

<script>
import AddBookModal from "@/components/AddBookModal.vue";

export default {
  name: "BookInfoModal",
  components: {
    AddBookModal
    },
  props: ["bookInfo"],
  data() {
    return {
      readMore: false,
      fullDescription: false,
      showAddBookModal: false
    }
  },
  methods: {
    showFullDescription() {
      this.fullDescription = true;
      this.readMore = false;
    },
    openAddBookModal() {
      this.showAddBookModal = true;
    },
    close() {
      this.showAddBookModal = false;
    }
  },

  // watcher not needed anymore because direct click on the next book prevented by clickaway-detect overlay
  // idea for later: adding arrows to switch between the books (also useful for booklists)

  // watch: {
  //   bookInfo() {
  //     if (this.bookInfo[0].details.description.length > 1200) {
  //       this.readMore = true;
  //       this.fullDescription = false;
  //     } else {
  //       this.readMore = false;
  //     }
  //   }
  // },
  created() {
      if(this.bookInfo.details.description) {
        if (this.bookInfo.details.description.length > 1200) {
          this.readMore = true;
          this.fullDescription = false;
        } else {
          this.readMore = false;
        }
      }
      
  },
  filters: {
    trimLength(val) {
      if (val.length < 1200) {
        return val;
      }
      return `${val.substring(0, 1200)}...`;
    }
  }
}
</script>

<style lang="scss" scoped>

  .modal__header {
    display: flex;
    justify-content: flex-end;
  }

  .modal__content {
    display: flex;
    justify-content: space-between;
  }

  .modal__content-image {
    width: 30%;
    padding: 10px;
    text-align: center;
  }
  
  .book__default-icon {
    width: 90%;
    height: auto;
    object-fit: contain;
    color: $color-medium-grey;
  }

  .modal__buttons {
    padding: 10px 0;

    .button {
      margin: 5px 0;
    }
  }

  .modal__content-infos {
    width: 65%;
    padding: 10px;
    text-align: left;
    
  }

  .modal__book-author {
    padding: 0.5em 0;
  }

  .modal__book-year {
    font-style: italic;
    padding-bottom: 1em;
  }

</style>