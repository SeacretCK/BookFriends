<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        <h2 class="modal__listName"> {{ listName }}</h2>

          <div class="modal__content" v-for="book in bookArraySorted" :key="book.bookId" :id="book.bookId">

            <UserBooklistItem :book="book" :booklistId="booklistId" :bookArray="bookArraySorted">
            </UserBooklistItem>

          </div>

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserBooklistItem from "./UserBooklistItem.vue"

export default {
  name: "BooklistModal",
  components: {
    UserBooklistItem
  },
  props: [
    "booklistId",
    "booklists"
  ],
  data() {
    return {

    }
  },
  methods: {
    ...mapActions([
     
    ]),
    
  },
  computed: {
    ...mapGetters([

    ]),
    listName() {
      return this.booklists.find(item => item.listId === this.booklistId).listName;
    },
    bookArray() {
      return this.booklists.find(item => item.listId === this.booklistId).books;
    },
    bookArraySorted() {
      return this.bookArray.slice(0).sort((a, b) => a.number - b.number); // slice makes it a copy instead of mutating the original Array (like sort would)
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