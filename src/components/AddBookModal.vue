<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        
        <div class="modal__content">
          <div class="modal__book-info">
            <h2 class="modal__book-title">  {{ bookInfo.details.title | trimLength}} </h2>
            <div class="book__image-box">
              <img class="book__image" v-if="bookInfo.details.imageLinks" :src="bookInfo.details.imageLinks.thumbnail || bookInfo.details.imageLinks.smallThumbnail">
              <font-awesome-icon class="book__default-icon" icon="book-open" v-else/>
            </div>
          </div>  
          <div class="modal__list-infos">
            <h2 class="info-heading">Select one of your lists</h2>  
            <p class="alert" v-show="addBookAlert"> {{ addBookAlert }} </p>
            <form class="form" @submit.prevent>
              <div class="form__input">
                <div class="choose-list">
                  <v-select @input="clearAlerts" class="select-list" v-model="properties.selectedList" :options="booklists" label="listName" placeholder="Select your booklist"></v-select> <!-- https://vue-select.org/ -->
                  <a @click="showCreateNewList = true">Or create a new list</a>
                  <div v-if="showCreateNewList" class="new-booklist__container">
                    <p class="alert" v-if="newListNameAlert"> {{ newListNameAlert }} </p>
                  <form @submit.prevent class="new-booklist__form">
                    <input
                      @input="clearAlerts"
                      type="text"
                      placeholder="Name of the list"
                      class="input"
                      v-model.trim="newListName"
                    />
                    <button class="button button-secondary" @click="createNewList">Create new list</button>
                  </form>
                  </div>
                  
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
              <div class="button-wrapper" @click="reminder">
                <button type="button" :disabled="!properties.selectedList" class="button" @click="add">Add book</button>
              </div>
              
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
        book: [],
        selectedList: "",
        comment: ""
      },
      newListName: "",
      newListNameAlert: "",
      selectedListName: "",
      addBookAlert: "",
      showCreateNewList: false
    }
  },
  created() {
    this.setBooklists();
  },
  methods: {
    ...mapActions([
      "addBookToList",
      "createBooklist",
      "setBooklists"
    ]),
    add() {
      this.addBookAlert = "";
      this.properties.book = this.bookInfo;
      if (this.checkIfBookIsAlreadyInTheList) {
        this.addBookAlert = "This book is already in the list!"
      } else {
        this.addBookToList(this.properties)
        this.$emit('close')
      }
    },
    reminder() {
      if (!this.properties.selectedList) {
        this.addBookAlert = "Please select a list!"
      }
    },
    createNewList() {
      this.newListNameAlert = "";
      if (this.newListName) { // making the input required didn't work properly and caused a browser alert after submit
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
            this.showCreateNewList = false;
          }, 1500);
        }
      }
    },
    clearAlerts() {
      this.addBookAlert = "";
      this.newListNameAlert = "";
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
      console.log("checkIfBookIsAlreadyInTheList", this.properties.selectedList.books.some(item => item.bookId === this.bookInfo.bookId))
      return this.properties.selectedList.books.some(item => item.bookId === this.bookInfo.bookId)
    }
  },

  filters: {
    trimLength(val) {
      if (val.length < 30) {
        return val;
      }
      return `${val.substring(0, 30)}...`;
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
    justify-content: space-around;
  }

  .modal__book-info {
    width: 30%;
    text-align: center;
  }

  .book__image-box {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .book__image {
    width: 100%;
    height: auto;
    object-fit: contain
  }

  .book__default-icon {
    width: 90%;
    height: auto;
    object-fit: contain;
    color: $color-medium-grey;
  }

  .modal__book-title {
    font-size: 1.1rem;
    margin-bottom: 10px;
    word-wrap: break-word;
  }

  .modal__list-infos {
    width: 60%;
  }

  .info-heading {
    font-size: 1.2rem;
  }

  .select-list {
    width: 100%;
    background-color: $color-white;
    margin-bottom: 10px;
    border-radius: 3px;
    border: 1px solid $color-dark-grey;
  }

  .new-booklist__container {
    margin-top: 10px;
  }

  .new-booklist__form {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .input {
    border-radius: 3px;
    border: 1px solid $color-dark-grey;
    padding-left: 5px;
  }

  .button-secondary {
    background: $color-medium-grey;
    font-weight: 500;
    padding: 0.5rem;

    &:hover,
    &:focus {
      background: lighten($color-medium-grey, 10%);
    }
  }

  .comment {
    display: flex;
    flex-direction: column;
  }

  .comment-input {
    padding: 0.5rem;
    margin-bottom: 10px;
    background-color: $color-white;
    border-radius: 3px;
    border: 1px solid $color-dark-grey;
  }

  .label {
    text-align: left;
    font-size: 14px;
    font-weight: 700;
  }

  .button-wrapper {
    display: inline-block;
  }

  .alert {
    padding: 1em;
    font-weight: 700;
    color: $color-red;
  }


  @media only screen and (min-width: 550px) {
    .info-heading {
      font-size: 1.4rem;
    }
    .modal__book-title {
      font-size: 1.3rem;
    }

  }
</style>

