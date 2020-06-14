<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        <div class="modal__content">
          
          <form @submit.prevent class="form">
            <h1 class="form-heading">create a post</h1>
            <label for="title" class="label">Title</label>
            <input
              type="text"
              placeholder="Title"
              id="title"
              class="input"
              v-model.trim="post.title"
            />
            <textarea 
              v-model.trim="post.content"
              rows="10"
              class="input">
            </textarea>
            <button
              class="button"
              :disabled="!post.content || !post.title"
              @click="createPost"
            >
              post
            </button>
          </form>
        </div>
        
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'
import { postsCollection } from "@/firebaseConfig"

export default {
  name: "CreatePostModal",
  data() {
    return {
      post: {
        title: "",
        content: ""
      },
    }
  },

  methods: {
    ...mapActions([

    ]),
    createPost() {
      postsCollection
        .add({
          createdOn: new Date(),
          title: this.post.title,
          content: this.post.content,
          userId: this.getCurrentUser.uid,
          userName: this.getUserProfile.name,
          comments: 0,
          likes: 0,
          usersThatLiked: []
        })
        .then(ref => {
          console.log(ref);
          this.post.content = "";
          this.$emit('close');
        })
        .catch(err => {
          console.log(err);
        });
    }

  },
  computed: {
    ...mapGetters([
      "getCurrentUser",
      "getUserProfile"
    ])
  }
}
</script>


<style lang="scss" scoped>

  .modal__header {
    display: flex;
    justify-content: flex-end;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .form__heading {
    padding-bottom: 0.5em;
  }

  .input {
    padding: 0.5rem;
    margin-bottom: 10px;
    border-radius: 3px;
    border: 1px solid $color-medium-grey;
  }

  .label {
    text-align: left;
    font-size: 14px;
  }

</style>