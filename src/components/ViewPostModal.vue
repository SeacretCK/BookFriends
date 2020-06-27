<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">

      <section v-if="showUserProfile">
        <UserProfile v-on:close="close()" :userId="profile.userId"></UserProfile>
      </section>

      <section v-if="showConversationModal">
        <ConversationModal v-on:close="close()" :recipientId="conversation.userId" :recipientName="conversation.name"></ConversationModal>
      </section>

      <div v-if="!showConversationModal && !showUserProfile" class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        <div class="modal__content">

          <div class="post__header">
            <div>
              <h2 class="post-title">{{ post.title }}</h2>
              <p class="post-info">posted by 
                <span class="usermenu-anchor">
                  <a>{{ post.userName }}</a> 
                  <span class="usermenu-links">
                    <a @click="openProfile(post.userId)">View profile</a>
                    <a @click="openConversation(post.userId, post.userName)">Write a message</a>
                  </span>
                </span> on {{ post.createdOn | formatDate }}</p>
            </div>
            
            <div class="infos">
              <span v-if="userHasLiked" class="like tooltip-like">
                <a @click="dislikePost()">
                  <font-awesome-icon icon="heart" class="icon"/>
                </a>
                {{ likes }}
                <span class="tooltiptext-like">Dislike</span>
              </span>
              
              <span v-if="!userHasLiked" class="like tooltip-like">
                <a @click="likePost()">
                  <font-awesome-icon :icon="['far', 'heart']" class="icon"/>
                </a>
                {{ likes }}
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
              <p class="comment-info">posted by 
                <span class="usermenu-anchor">
                  <a>{{ comment.userName }}</a> 
                  <span class="usermenu-links">
                    <a @click="openProfile(comment.userId)">View profile</a>
                    <a @click="openConversation(comment.userId, comment.userName)">Write a message</a>
                  </span>
                </span>
                on {{ comment.createdOn | formatDate }}</p>
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
import UserProfile from "@/components/UserProfile.vue"
import ConversationModal from "@/components/ConversationModal.vue"


export default {
  name: "ViewPostModal",
  components: {
    UserProfile,
    ConversationModal
  },
  props: [
    "post",
    "likes"
  ],
  data() {
    return {
      postComments: [],
      comment: {
        postId: this.post.id,
        userId: "",
        userName: "",
        content: "",
        counter: ""
      },
      alert: "",
      showUserProfile: false,
      profile: {
        userId: ""
      },
      showConversationModal: false,
      conversation: {
        userId: "",
        name: ""
      }
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
          this.comment.counter = commentsArray.length
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
          userName: this.getCurrentUserProfile.name
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
      if (this.post.userId === this.getCurrentUser.uid) {
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
    },
    dislikePost() {
      let newUserArray = [...this.post.usersThatLiked];
      let userIndex = newUserArray.indexOf(this.getCurrentUser.uid);
      newUserArray.splice(userIndex, 1);

      postsCollection
        .doc(this.post.id)
        .update({
          usersThatLiked: newUserArray,
          likes: this.post.likes - 1
        })
        .then(() => {
          console.log("post disliked")
          this.setPosts();
        })
        .catch(err => {
          console.log(err);
        });
    },
    openProfile(userId) {
      console.log("openProfile", userId);
      this.profile.userId = userId;
      this.showUserProfile = true;
      document.body.classList.add('modal-open');
    },
    openConversation(userId, userName) {
      this.conversation.userId = userId;
      this.conversation.name = userName;
      this.showConversationModal = true;
      document.body.classList.add('modal-open');
    },
    close() {
      this.conversation.userId = "";
      this.conversation.name = "";
      this.profile.userId = "";
      this.showConversationModal = false;
      this.showUserProfile = false;
      document.body.classList.remove('modal-open');
    },
  
  },
  computed: {
    ...mapGetters([
      "getCurrentUser",
      "getCurrentUserProfile"
    ]),
    userHasLiked() {
      return this.post.usersThatLiked.includes(this.getCurrentUser.uid)
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).format('MMMM Do YYYY, k:mm:ss');
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

  .tooltip-like,
  .usermenu-anchor {
    position: relative;
  }

  .tooltip-like .tooltiptext-like,
  .usermenu-anchor .usermenu-links {
    visibility: hidden;
    width: 120px;
    @include set-background($color-medium-grey);
    text-align: center;
    font-size: 1.2rem;
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

  .tooltip-like:hover .tooltiptext-like,
  .usermenu-anchor:hover .usermenu-links {
    visibility: visible;
  }

  .usermenu-anchor .usermenu-links {
    display: flex;
    flex-direction: column;
    width: 200px;

    a {
      color: inherit;

      &:hover {
        color: $color-light-blue;
      }
    }
    
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