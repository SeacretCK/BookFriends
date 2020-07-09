<template>
  <div class="modal__wrapper">
    <div class="modal__wrapper-inner" @click.self="$emit('close')">

      <section v-if="showUserBooklistModal">
        <UserBooklistModal v-on:close="close()" :booklistId="booklistId" :booklists="booklists"></UserBooklistModal>
      </section>

      <div class="modal__container">
        <div class="modal__header">
          <button type="button" class="button button-close" @click="$emit('close')"><font-awesome-icon icon="times"/></button>
        </div>
        <div class="modal__content">

          <div class="user__profile">
            <h2> {{ userInfo.name }} </h2>
            <div class="profile-container">
              <img :src="userInfo.image || defaultProfilePicture" alt="profile picture" class="profile-picture">
              <div class="profile-info" v-if="userInfo.favoriteBook || userInfo.aboutMe">
                <p v-if="userInfo.favoriteBook"><strong>likes:</strong> {{ userInfo.favoriteBook }}</p>
                <br>
                <p v-if="userInfo.aboutMe"><strong>about me:</strong> <i> {{ userInfo.aboutMe }}</i></p>
              </div>
              <div v-else class="profile-info">
                <p>This user hasn't shared any information yet</p>
              </div>
            </div>
          </div>

          <div class="user__booklists">
            <h2 class="booklist__heading">{{ userInfo.name }}'s booklists</h2>
            <div v-for="list in booklists" :key="list.listId">
              <div class="booklist__item" tabindex="0">
                <div class="booklist__name" @click="showBooklist(list.listId)">
                  <p> {{list.listName}} </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { usersCollection } from "@/firebaseConfig"
import { mapGetters } from 'vuex';
import UserBooklistModal from "@/components/UserBooklistModal.vue";
import { booklistsCollection } from "@/firebaseConfig"

export default {
  name: "UserProfile",
  components: {
    UserBooklistModal
  },
  props: [
    "userId"
  ],
  data() {
    return {
      userInfo: null,
      showUserBooklistModal: false,
      booklistId: "",
      booklists: [],
    }
  },
  methods: {
    getUserInfo() {
      usersCollection
      .doc(this.userId)
      .get()
      .then(res => {
        this.userInfo = res.data();
      })
      .catch(err => {
        this.$vToastify.error(err.message);
        console.log(err);
      });
    },
    showBooklist(id) {
      this.booklistId = id;
      this.showUserBooklistModal = true;
    },
    close() {
      this.booklistId = "";
      this.showUserBooklistModal = false;
    }
  },
  computed: {
    ...mapGetters([
      "getDefaultProfilePicture"
    ]),
    defaultProfilePicture() {
      return this.getDefaultProfilePicture
    }
  },
  created() {
    this.getUserInfo();

    let booklistArray = [];
    booklistsCollection
      .where("userId", "==", this.userId)
      .get()
      .then(res => {
        res.docs.forEach(list => {
          booklistArray.push({
            listId: list.id,
            listName: list.data().listName,
            status: list.data().status,
            position: list.data().position,
            books: list.data().books
          })
        })
        console.log("fetched booklistArray: ", booklistArray)
        this.booklists = booklistArray.sort((a, b) => a.listName.localeCompare(b.listName));
      })
      .catch(err => {
        this.$vToastify.error(err.message);
        console.log(err);
      });
  }
}
</script>

<style lang="scss" scoped>

.modal__header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0.5rem;
}

.profile-container {
  display: flex;
  justify-content: flex-start;
}

.profile-picture {
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 100px;
  border: 2px solid $color-light-blue;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 20px;
  padding-top: 1em;
  text-align: left;
}

.user__profile {
  margin-bottom: 1rem;
}

.user__booklists {
  grid-area: sidebar;
  @include set-background($color-dark-blue);
  border-radius: 10px;
  overflow: hidden; // this lets the corners of the children be clipped to the border-radius
  border: 1px solid $color-dark-grey;
  align-self: flex-start;
}

.booklist__heading {
  font-size: 1.7rem;
  padding: 0.3em 0;
  border-bottom: 1px solid $color-dark-grey;
}

.booklist__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8em;
  border-bottom: 1px solid $color-dark-grey;
  cursor: pointer;
  
  &:hover,
  &:focus {
    background-color: lighten($color-dark-blue, 10%);
    outline: none;
  }
}

.booklist__name {
  width: 60%;
  margin-right: 10px;
  text-align: left;
  display: flex;
  align-items: center;
  word-break: break-word;
}

</style>