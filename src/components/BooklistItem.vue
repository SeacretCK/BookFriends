<template>
  <div class="card__container"> 

    <div class="card__imageBox draggable-handle">
      <img class="book__image"
          v-if="book.details.imageLinks" 
          :src="book.details.imageLinks.thumbnail || book.details.imageLinks.smallThumbnail">
      <font-awesome-icon class="book__default-icon" icon="book-open" v-else/>
    </div>  

    <div class="card__infos">
      <h2 class="book__number draggable-handle">Nr. {{ book.number }}</h2>
      <h3 class="book__title draggable-handle"> {{ book.details.title }} </h3>
      <p class="book__author draggable-handle" v-if="book.details.authors">by {{ book.details.authors[0] }} </p>
      <p class="book__author-default draggable-handle" v-if="!book.details.authors"> Author unknown </p>
      <p class="book__comment" @click="editComment" v-if="!editableComment && book.comment">{{ book.comment }} <font-awesome-icon icon='pen' class="pen-icon"/></p>
      <p class="book__comment-default" @click="editComment" v-if="!editableComment && !book.comment">add a comment? <font-awesome-icon icon='pen' class="pen-icon"/></p>
      <form @submit.prevent="saveEditedComment" v-if="editableComment" class="comment__edit-form">
        <textarea rows="1" ref="edit" class="comment__edit-textarea" v-model="comment"></textarea>
        <button type="button" class="button button-close button-check" @click="saveEditedComment"><font-awesome-icon icon='check' class="button__icon"/></button>
        <button type="button" class="button button-close" @click="editableComment = false, $emit('enableDraggable')"><font-awesome-icon icon='times' class="button__icon"/></button>
      </form>
    </div>

    <div class="book__delete">
      <button type="button" class="button button-close" @click="remove"><font-awesome-icon icon='trash-alt' class="button__icon"/></button>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "BooklistItem",
  props: [
    "book",
    "booklistId",
    "bookArray"
  ],
  data() {
    return {
      editableComment: false,
      updatedBook: {
        bookId: this.book.bookId,
        comment: this.book.comment,
        listId: this.booklistId,
        number: ""
      },
      comment: this.book.comment
    }
  },
  methods: {
    ...mapActions([
      "updateBookComment",
      "deleteBook"
    ]),
    remove() {
      this.updatedBook.number = this.book.number; // need to set it here so it's the actual number after possible sorting (didn't update in data)
      this.deleteBook(this.updatedBook)
    },

    editComment() {
      this.editableComment = true;
      this.$emit("disableDraggable");
    },
    saveEditedComment() {
      console.log("save ", this.comment)
      this.updatedBook.comment = this.comment;
      this.updateBookComment(this.updatedBook)
      this.editableComment = false;
      this.$emit("enableDraggable");
    }
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
    width: 40%;
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

  .comment__edit-form {
    display: flex;
    margin-top: 0.5em;
    border-radius: 3px;
    border: 1px solid $color-dark-grey;
    overflow: hidden;

    .button {
      border-radius: 0;
    }
  }

  .pen-icon {
    font-size: 14px;
    padding-bottom: 2px;
    cursor: pointer;
  }

  .comment__edit-textarea {
    width: 100%;
    padding: 0.5em;
    border: none;
  }

  .book__delete {
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;

    .button {
      padding: 0.5em 1em;
    }
  }

  .draggable-handle {
    cursor: move;
  }

</style>