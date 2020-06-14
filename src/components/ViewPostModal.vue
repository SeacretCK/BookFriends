<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">
      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        <div class="modal__content">

          <div class="post__header">
            <div>
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-info">posted by {{ post.userName }} on {{ post.createdOn | formatDate }}</p>
            </div>
            
            <div class="infos">
              <span class="like tooltip-like">
                <a @click="likePost()">
                  <font-awesome-icon icon='heart' class="icon"/>
                </a> {{ post.likes }}
                <span class="tooltiptext-like">Like</span>
              </span>
              <p class="alert" v-if="alert"> {{ alert }} </p>
            </div>

          </div>

          <div class="post__content">
            <p class="post-content">{{ post.content }}</p>
          </div>

          <br>

          <div v-if="postComments.length" class="post-comments">
            <div v-for="(comment, index) in postComments" class="comment" :key="index">
              <p class="comment-content">{{ comment.content }}</p>
              <p class="comment-info">posted by {{ comment.userName }} on {{ comment.createdOn | formatDate }}</p>
            </div>
          </div>
          
          <br>

          <form @submit.prevent class="form">
            <h1 class="form-heading">Comment</h1>
            <textarea class="input"
              v-model.trim="comment.content"
              rows="5">
            </textarea>
            <button
              class="button"
              :disabled="!comment.content"
              @click="createComment"
            >
              add comment
            </button>
          </form>
        </div>
        
      </div>
    </div>
  </div>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { commentsCollection, postsCollection } from "@/firebaseConfig"

export default {
  name: "ViewPostModal",
  props: [
    "post"
  ],
  data() {
    return {
      postComments: [],
      comment: {
        postId: this.post.id,
        userId: "",
        userName: "",
        content: "",
        counter: this.post.comments
      },
      alert: ""
    }
  },
  created() {
    this.getComments();
    console.log("post: ", this.post)
  },

  methods: {
    ...mapActions([
      "setPosts"
    ]),
    getComments() {
      commentsCollection
        .where("postId", "==", this.post.id)
        .orderBy("createdOn", "asc")
        .get()
        .then(docs => {
          let commentsArray = [];

          docs.forEach(doc => {
            let comment = doc.data();
            comment.id = doc.id;
            commentsArray.push(comment);
          });

          this.postComments = commentsArray;
        })
        .catch(err => {
          console.log(err);
        });
    },
    createComment() {
      let postId = this.comment.postId;
      let commentsCounter = this.comment.counter;

      commentsCollection
        .add({
          createdOn: new Date(),
          content: this.comment.content,
          postId: postId,
          userId: this.getCurrentUser.uid,
          userName: this.getUserProfile.name
        })
        .then(() => {
          postsCollection
            .doc(postId)
            .update({
              comments: commentsCounter + 1
            })
            .then(() => {
              console.log("post updated")
              this.getComments();
              this.setPosts();
              this.comment.content = "";
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    likePost() {
      if (this.post.usersThatLiked.includes(this.getCurrentUser.uid)) {
        this.alert = "You already liked that post"
      } else if (this.post.userId === this.getCurrentUser.uid) {
        this.alert = "You can't like your own post"
      } else {
        let newUserArray = [...this.post.usersThatLiked, this.getCurrentUser.uid]

        postsCollection
          .doc(this.post.id)
          .update({
            usersThatLiked: newUserArray,
            likes: this.post.likes + 1
          })
          .then(() => {
            console.log("post liked")
            this.setPosts();
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
  },
  computed: {
    ...mapGetters([
      "getCurrentUser",
      "getUserProfile"
    ])
  },
  
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    },
  }
}
</script>


<style lang="scss" scoped>

  .modal__header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }

  .post__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .post__header,
  .post-content,
  .comment {
    padding: 0.5rem;
    @include set-background($color-light-grey);
    text-align: left;
  }

  .comment {
    border: 1px solid $color-medium-grey;
    border-radius: 3px;
    margin-bottom: 2px;
  }

  .post-title {
    margin: 0 1rem;
  }

  .post-info,
  .comment-info {
    font-size: 14px;
    margin: 0 1rem;
    font-style: italic;
  }

  .post-content {
    margin: 0.5rem 1rem;
  }

  .comment-content {
    margin: 0.5rem 1rem 1rem 1rem;
  }

  .infos {
    text-align: center;
    width: 100px;
  }

  .like {
    font-size: 1.8rem;
    margin-right: 2rem;
    cursor: default;
  }

  .alert {
    font-size: 14px;
    font-style: italic;
    color: $color-red;
  }

  .tooltip-like {
    position: relative;
  }

  .tooltip-like .tooltiptext-like {
    visibility: hidden;
    width: 120px;
    @include set-background($color-medium-grey);
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
    width: 120px;
    bottom: 100%;
    left: 50%;
    margin-left: -60px; /* Use half of the width (120/2 = 60), to center the tooltip */
  }

  .tooltip-like:hover .tooltiptext-like {
    visibility: visible;
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