<template>
  <div class="modal__container">
    <div class="modal__header">
      <button type="button" class="button button-close" @click="$emit('close')">x</button>
    </div>
    
    <div class="modal__content">
      <div class="modal__content-image">
        <img :src="bookInfo[0].details.imageLinks.thumbnail">
        <div class="modal__buttons">
          <button type="button" class="button">Add to Booklist</button>
          <button type="button" class="button">Read Discussions</button>
        </div>
      </div>  
      <div class="modal__content-infos">
        <h3 class="modal__book-title">  {{ bookInfo[0].details.title }} </h3>
        <p class="modal__book-author">by {{ bookInfo[0].details.authors.toString() }} </p>
        <p class="modal__book-year">published: {{ bookInfo[0].details.publishedDate }} </p>
        <p class="modal__book-summary" v-if="fullDescription" v-html="bookInfo[0].details.description"></p>
        <p class="modal__book-summary" v-else v-html="this.$options.filters.trimLength(bookInfo[0].details.description)"></p>
        <a v-if="readMore" @click="showFullDescription">Read more</a>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "BookInfoModal",
  props: ["bookInfo"],
  data() {
    return {
      readMore: false,
      fullDescription: false
    }
  },
  methods: {
    showFullDescription() {
      this.fullDescription = true;
      this.readMore = false;
    }
  },
  watch: {
    bookInfo() {
      if (this.bookInfo[0].details.description.length > 1200) {
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
  .modal__container {
    max-width: 600px;
    margin: 0 auto;
    padding: 5px;
    border-radius: 5px;
    @include set-background($color-light-grey); 
  }

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
    text-align: left;
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