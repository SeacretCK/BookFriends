<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        
        <div class="modal__content" v-for="book in bookArray" :key="book.bookId">
          
          <div class="modal__content-imageBox">
            <img class="book__image" :src="book.details.imageLinks.thumbnail">
          </div>  
          <div class="modal__content-infos">
            <h2 class="book__number">Nr. {{ book.number }}</h2>
            <h3 class="book__title"> {{ book.details.title }} </h3>
            <p class="book__author">by {{ book.details.authors[0] }} </p>
            <p class="book__comment" v-show="book.comment">"{{ book.comment }}"</p>
            
          </div>
          <div class="book__delete">
            <button type="button" class="button button-close" @click="deleteBook(book.bookId)"><font-awesome-icon icon='trash-alt' class="button__icon"/></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { booklistsCollection } from "@/firebaseConfig"
import firebase from "firebase";

export default {
  name: "BooklistModal",
  props: [
    "bookListId"
  ],
  data() {
    return {
      bookArray: this.getBooksInBooklist()
    }
  },
  methods: {
    ...mapActions([
      "setBooklists",
      "setBooksInBooklist"
    ]),
    ...mapGetters([
      "getBooksInBooklist"
    ]),
    deleteBook(id) {
      const listId = this.bookListId;
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
        this.setBooklists();
        setTimeout(() => {
          console.log("timeout");
          this.setBooksInBooklist(this.bookListId);
        }, 2000);
        
      })
      .catch(err => {
        console.log(err);
      });
    }
    
  }
}
</script>

<style lang="scss" scoped>
  .modal__wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  }

  .modal__wrapper-inner {
    // make the modal content scrollable, apparently contradictory with position: fixed in modal__wrapper (needs a parent with fixed height?)
    // height must be the same as fixed wrapper
    // see: https://github.com/euvl/vue-js-modal/issues/147
    height: 100vh;
    width: 100vw; 
    overflow: auto; 
  }

  // dark overlay 
  .modal__wrapper-inner::after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: $color-medium-grey;
    opacity: 0.9;
    z-index: -1;
  }

  .modal__container {
    max-width: 600px;
    margin: 0 auto;
    margin-top: 6rem;
    padding: 5px;
    border-radius: 5px;
    @include set-background($color-light-grey);
    opacity: 1.5; 
  }

  .modal__header {
    display: flex;
    justify-content: flex-end;
  }

  .modal__content {
    display: flex;
    justify-content: space-around;
  }

  .modal__content-imageBox {
    padding: 10px;
    text-align: left;
  }

  .book__image {
    height: 150px;
  }

  .modal__content-infos {
    width: 60%;
    padding: 10px;
    text-align: left;
  }

  .book__author {
    padding: 0.5em 0;
  }

  .book__comment {
    font-style: italic;
    padding-top: 1em;
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