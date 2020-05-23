<template>
  <div class="card__container"> 

    <div class="card__imageBox">
      <img class="book__image" :src="book.details.imageLinks.thumbnail">
    </div>  

    <div class="card__infos">
      <h2 class="book__number">Nr. {{ book.number }}</h2>
      <h3 class="book__title"> {{ book.details.title }} </h3>
      <p class="book__author">by {{ book.details.authors[0] }} </p>
      <p class="book__comment" @click="editComment" v-if="!editableComment && book.comment">{{ book.comment }} <font-awesome-icon icon='pen' class="pen-icon"/></p>
      <p class="book__comment-default" @click="editComment" v-if="!editableComment && !book.comment">add a comment? <font-awesome-icon icon='pen' class="pen-icon"/></p>
      <form @submit.prevent="saveEditedComment" v-if="editableComment" class="comment__edit-form">
        <textarea rows="1" ref="edit" class="comment__edit-textarea" v-model="comment"></textarea>
        <button type="button" class="button button-close button-check" @click="saveEditedComment"><font-awesome-icon icon='check' class="button__icon"/></button>
        <button type="button" class="button button-close" @click="editableComment = false"><font-awesome-icon icon='times' class="button__icon"/></button>
      </form>
    </div>

    <div class="book__delete">
      <button type="button" class="button button-close" @click="deleteBook(book.bookId)"><font-awesome-icon icon='trash-alt' class="button__icon"/></button>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { booklistsCollection } from "@/firebaseConfig"
import firebase from "firebase";

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
        comment: "",
        listId: this.booklistId
      },
      comment: this.book.comment
    }
  },
  methods: {
    ...mapActions([
      "setBooklists",
      "setBooksInBooklist",
      "updateBookNumbers",
      "updateBookComment"
    ]),
    deleteBook(id) {
      const listId = this.booklistId;
      // to use arrayRemove you have to pass the exact object that should be removed (https://stackoverflow.com/questions/59694940/fieldvalue-arrayremove-to-remove-an-object-from-array-of-objects-based-on-prop)
      const bookObject = this.bookArray.filter(item => item.bookId === id)[0];
      const objectToDelete = {
        bookId: bookObject.bookId,
        comment: bookObject.comment,
        number: bookObject.number
      }
      booklistsCollection
      .doc(listId)
      .update({
        books: firebase.firestore.FieldValue.arrayRemove(objectToDelete)
      })
      .then(() => {
        console.log("successfully deleted")
      })
      .catch(err => {
        console.log(err);
      });

      const deletedBook = {
        number: bookObject.number,
        listId: listId
      }
      setTimeout(() => {
        console.log("timeout");
        this.setBooklists();
      }, 2000);
      setTimeout(() => {
        console.log("timeout");
        this.updateBookNumbers(deletedBook);
      }, 3000);
      setTimeout(() => {
        console.log("timeout");
        this.setBooksInBooklist(this.booklistId);
      }, 4000);
    },

    editComment() {
      this.editableComment = true;
    },
    saveEditedComment() {
      console.log("save ", this.comment)
      this.updatedBook.comment = this.comment;
      this.updateBookComment(this.updatedBook)
      this.editableComment = false;
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
    padding: 10px;
    text-align: left;
  }

  .book__image {
    height: 150px;
  }

  .card__infos {
    width: 60%;
    padding: 10px;
    text-align: left;
  }

  .book__author {
    padding: 0.5em 0;
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

</style>