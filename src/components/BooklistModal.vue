<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        <h2 class="modal__listName"> {{ listName }}</h2>
        <p v-if="!bookArraySorted.length">The list is empty</p>
        <p v-if="bookArraySorted.length > 1">Sort your list with drag & drop</p>
        <draggable 
          @end="updateNumbers"
          :disabled=draggable.disabled
          direction="vertical"
          class="draggable"
          handle=".draggable-handle">

          <div class="modal__content" v-for="book in bookArraySorted" :key="book.bookId" :id="book.bookId">

            <BooklistItem :book="book" :booklistId="booklistId" :bookArray="bookArraySorted" 
              v-on:disableDraggable="draggable.disabled = true"
              v-on:enableDraggable="draggable.disabled = false">
            </BooklistItem>

          </div>

        </draggable>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BooklistItem from "./BooklistItem.vue"
import draggable from 'vuedraggable'

export default {
  name: "BooklistModal",
  components: {
    BooklistItem,
    draggable
  },
  props: [
    "booklistId"
  ],
  data() {
    return {
      //bookArray: this.getBooksInBooklist,
      // I can also directly use the getter in the v-for and in the deleteBook method!
      draggable: {
        disabled: false
      },
      update: {
        newSortedList: this.getBooksInBooklist,
        listId: this.booklistId
      },
      listWasSorted: false
    }
  },
  methods: {
    ...mapActions([
      "setNewSorting"
    ]),
    updateNumbers(e) {
      console.log(e)
      console.log("New index: " + e.newIndex)
      console.log("Old index: " + e.oldIndex)
      this.listWasSorted = true;
      const listArray = this.getBooksInBooklist;
      let updatedList = [];
      // maybe it is not even required to make a new array, because the following number updates seem to apply directly to bookArraySorted (that's why it's updating immediately in the list)

      if (e.oldIndex > e.newIndex) {
        listArray.forEach(book => {
          if (book.number > e.newIndex && book.number < e.oldIndex + 2) {
            if (book.number === e.oldIndex + 1) {
              book.number = e.newIndex + 1;
            } else {
              book.number ++;
            } 
          } 
          updatedList.push(book);
        })
      } else {
        listArray.forEach(book => {
          if (book.number < e.newIndex + 2 && book.number > e.oldIndex) {
            if (book.number === e.oldIndex + 1) {
              book.number = e.newIndex + 1;
            } else {
              book.number --;
            }
          }
          updatedList.push(book);
        })
      }
      console.log("listArray", listArray);
      console.log("updatedList", updatedList);
      console.log("bookArraySorted", this.bookArraySorted)
      this.update.newSortedList = updatedList;
      this.updateSorting();
    },
    updateSorting() {
      if (this.listWasSorted) {
        this.setNewSorting(this.update);
        this.listWasSorted = false;
      }
    }
  },
  computed: {
    ...mapGetters([
      "getBooksInBooklist",
      "getBooklists"
    ]),
    listName() {
      return this.getBooklists.find(item => item.listId === this.booklistId).listName;
    },
    bookArraySorted() {
      return this.getBooksInBooklist.slice(0).sort((a, b) => a.number - b.number); // slice makes it a copy instead of mutating the original Array (like sort would)
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

  .modal__listName {
    padding: 0.5em;
    font-size: 2rem;
  }

</style>