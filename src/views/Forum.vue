<template>
  <div class="wrapper">
    <section class="section">

      <h1>Share your opinion!</h1>
      <br>
      <button class="button" @click="openCreatePostModal">Create a new Post</button>
      <br>
      <section v-if="showCreatePost">
        <CreatePostModal v-on:close="close()"></CreatePostModal>
      </section>
      
      <section v-if="showFullPost">
        <ViewPostModal v-on:close="close()" :post="fullPost" :likes="fullPost.likes"></ViewPostModal>
      </section>

      <section v-if="showUserProfile">
        <UserProfile v-on:close="close()" :userId="profile.userId"></UserProfile>
      </section>

      <section v-if="showConversationModal">
        <ConversationModal v-on:close="close()" :recipientId="conversation.userId" :recipientName="conversation.name"></ConversationModal>
      </section>

      <div v-if="!showCreatePost && !showFullPost && !showConversationModal && !showUserProfile" class="posts">
        <h1 class="posts-title">Latest Posts</h1>
        <div v-if="getPosts.length" class="posts-item">
          <div v-for="(post, index) in getPosts" class="post" :key="index">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-author">by 
              <span class="usermenu-anchor">
                <a>{{ post.userName }}</a> 
                <span class="usermenu-links">
                  <a @click="openProfile(post.userId)">View profile</a>
                  <a @click="openConversation(post.userId, post.userName)">Write a message</a>
                </span>
              </span>
            </p>
            <p class="post-date">posted {{ post.createdOn | formatDate }}</p>
            <p class="post-content">{{ post.content | trimLength }}</p>
            <div class="infos">
              <span class="info tooltip-comment">
                  <font-awesome-icon icon='comment' class="icon"/>
                  {{ post.comments }}
                <span class="tooltiptext-comment">Comments</span>
              </span>
              <span class="info tooltip-like">
                  <font-awesome-icon icon='heart' class="icon"/>
                  {{ post.likes }}
                <span class="tooltiptext-like">Likes</span>
              </span>
              <span class="info"><a @click="openViewPostModal(post)">view full post</a></span>
            </div>

          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no posts</p>
        </div>
      </div>    

    </section>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreatePostModal from "@/components/CreatePostModal.vue"
import ViewPostModal from "@/components/ViewPostModal.vue"
import UserProfile from "@/components/UserProfile.vue"
import ConversationModal from "@/components/ConversationModal.vue"
import moment from 'moment'

export default {
  name: 'Forum',
  components: {
    CreatePostModal,
    ViewPostModal,
    UserProfile,
    ConversationModal
  },
  data() {
    return {
      showCreatePost: false,
      showFullPost: false,
      fullPost: {},
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
  methods: {
    ...mapActions([
      "setPosts"
    ]),
    openCreatePostModal() {
      this.showCreatePost = true;
      document.body.classList.add('modal-open');
    },
    openViewPostModal(post) {
      this.fullPost = post;
      this.showFullPost = true;
      document.body.classList.add('modal-open');
    },
    openProfile(userId) {
      console.log("openProfile", userId);
      this.profile.userId = userId;
      this.showUserProfile = true;
      document.body.classList.add('modal-open');
    },
    openConversation(userId, userName) {
      console.log("openMessage", userId);
      this.conversation.userId = userId;
      this.conversation.name = userName;
      this.showConversationModal = true;
      document.body.classList.add('modal-open');
    },
    close() {
      this.showCreatePost = false;
      this.showFullPost = false;
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
      "getPosts"
    ]),
  },
  watch: {
    getPosts(newVal) {
      console.log("watcher getPosts", newVal);
      let updatedPost = newVal.find(item => item.id === this.fullPost.id)
      this.fullPost = updatedPost;
    }
  },
  created() {
    this.setPosts();
  },
  
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  }
}
</script>

<style lang="scss" scoped>

.posts {
  margin-top: 1rem;
}

.post {
  border: 1px solid $color-dark-grey;
  padding: 1rem;
  border-radius: 5px;
  @include set-background($color-light-grey);
  text-align: left;
}

.post-title {
  margin: 0 1rem;
}

.post-author,
.post-date {
  font-size: 14px;
  margin: 0 1rem;
  font-style: italic;
}

.post-content {
  margin: 0.5rem 1rem;
}

.infos {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-top: 5px;

}

.info {
  margin: 0.5rem 1rem;
  color: $color-medium-blue;
  cursor: default;
}

.tooltip-like,
.tooltip-comment,
.usermenu-anchor {
  position: relative;
}

.tooltip-like .tooltiptext-like,
.tooltip-comment .tooltiptext-comment,
.usermenu-anchor .usermenu-links  {
  visibility: hidden;
  width: 120px;
  @include set-background($color-medium-grey);
  text-align: center;
  font-size: 1.2rem;
  border: 0.1px solid $color-white;
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
.tooltip-comment:hover .tooltiptext-comment,
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

</style>