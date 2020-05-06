<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        
        <div class="modal__content">
          <div class="modal__content-image">
            <img :src="bookInfo.details.imageLinks.thumbnail">
          </div>  
          <div class="modal__content-infos">
            <h3 class="modal__book-title">  {{ bookInfo.details.title }} </h3>
            <p class="alert" v-if="addBookAlert"> {{ addBookAlert }} </p>
            <form class="form" @submit.prevent>
              <div class="form__input">
                <div class="choose-list">
                  <v-select class="select-list" v-model="properties.selectedList" :options="booklists" label="listName" placeholder="Select your booklist"></v-select> <!-- https://vue-select.org/ -->
                  <p class="alert" v-if="newListNameAlert"> {{ newListNameAlert }} </p>
                  <form @submit.prevent class="new-booklist__form">
                    <button class="button" @click="createNewList">Create new list</button>
                    <input
                      type="text"
                      placeholder="name of the list"
                      class="input"
                      required
                      v-model.trim="newListName"
                    />
                  </form>
                </div>
                <div class="comment">
                  <label for="comment" class="label">Comment</label>
                  <textarea
                    type="text"
                    rows="3"
                    placeholder="Add a comment"
                    id="comment"
                    class="comment-input"
                    v-model.trim="properties.comment"
                  />
                </div>
              </div>
              <button type="button" class="button" @click="add">Add</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "AddBookModal",
  props: ["bookInfo"],
  data() {
    return {
      properties: {
        book: this.bookInfo,
        selectedList: "",
        comment: ""
      },
      newListName: "",
      newListNameAlert: "",
      selectedListName: "",
      addBookAlert: ""
    }
  },
  methods: {
    ...mapActions([
      "addBookToList",
      "createBooklist"
    ]),
    add() {
      this.addBookAlert = "";
      if (this.checkIfBookIsAlreadyInTheList) {
        this.addBookAlert = "This book is already in the list!"
      } else {
        this.addBookToList(this.properties)
        this.$emit('close')
      }

    },
    createNewList() {
      this.newListNameAlert = "";
      if (this.checkIfListNameAlreadyExists) {
        this.newListNameAlert = "You already have a list with that name!"
      } else {
        this.createBooklist(this.newListName);
        // it takes some time to create the list
        // without timeout getNewListObject returns an empty array
        setTimeout(() => {
          console.log("timeout");
          this.properties.selectedList = this.getNewListObject[0];
          this.newListName = "";
        }, 2000);
      }
    }
  },
  computed: {
    ...mapGetters([
      "getBooklists"
    ]),
    booklists() {
      return this.getBooklists
    },
    checkIfListNameAlreadyExists() {
      return this.getBooklists.some(item => item.listName === this.newListName)
    },
    getNewListObject() {
      return this.getBooklists.filter(item => item.listName === this.newListName)
      // returns an array with one object
    },
    checkIfBookIsAlreadyInTheList() {
      console.log("selected list object: ", this.properties.selectedList)
      return this.properties.selectedList.books.some(item => item.bookId === this.bookInfo.bookId)
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
    justify-content: space-between;
  }

  .modal__content-image {
    width: 30%;
    padding: 10px;
    text-align: left;
  }

  .select-list {
    width: 200px;
    background-color: $color-white;
  }

  .new-booklist__form {
    display: flex;
  }

  .comment {
    display: flex;
    flex-direction: column;
  }

  .comment-input {
    padding: 0.5rem;
    margin-bottom: 10px;
    background-color: $color-white;
    border-radius: 5px;
    border: 1px solid $color-dark-grey;
  }

  .label {
    text-align: left;
    font-size: 14px;
    font-weight: 700;
  }

  .alert {
    padding: 1em;
    font-weight: 700;
    color: $color-red;
  }
</style>

<style lang="scss">

  // adjusting the style of the v-select doesn't work in scoped
  // https://github.com/sagalbot/vue-select/issues/490

  .select-list .vs__dropdown-toggle,
  .select-list .vs__dropdown-menu {
    border-radius: 5px;
    border: 1px solid $color-dark-grey;
    cursor: pointer;
  }

  .select-list input {
    cursor: pointer;
  }

</style>