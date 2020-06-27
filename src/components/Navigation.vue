<template>
  <nav class="navigation" v-show="currentUser">
    <div class="navigation__user-picture">
      <router-link to="dashboard"><img :src="selectImage" alt="profile picture" class="profile-picture"></router-link>
    </div>
    <div class="navigation__name">
      <transition name="slide-fade">
        <!-- Header Navigation Menu Icons -->
        <button class="button button-menu" @click="show = !show">
          <p> {{ userInfo.name }} <font-awesome-icon icon="caret-down"/></p>
        </button>
      </transition>
    </div>
    <!-- Dropdown Menu -->
    <transition name="dropdown">
      <div class="navigation__dropdown" v-if="show">
        <ul class="navigation__dropdown-ul">
          <li class="navigation__dropdown-item" @click="show = false"><router-link class="navigation__dropdown-link" to="home">Search</router-link></li>
          <li class="navigation__dropdown-item" @click="show = false"><router-link class="navigation__dropdown-link" to="dashboard">Dashboard</router-link></li>
          <li class="navigation__dropdown-item" @click="show = false"><router-link class="navigation__dropdown-link" to="profile">Profile</router-link></li>
          <li class="navigation__dropdown-item" @click="show = false"><router-link class="navigation__dropdown-link" to="forum">Forum</router-link></li>
          
          <!-- Dropdown Menu Separator -->
          <hr>
          <li class="navigation__dropdown-item" @click="show = false"><a class="navigation__dropdown-link" @click="logout">Logout</a></li>
        </ul>
      </div>
    </transition>
    <div class="clickaway-detect" v-if="show" @click="show = false">
    </div>
  </nav>
</template>

<script>
import { auth } from "@/firebaseConfig"
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "Navigation",
  data() {
    return {
      show: false
    }
  },
  methods: {
    ...mapActions([
      "clearUserData"
    ]),
    logout() {
      auth.signOut()
        .then(() => {
          this.clearUserData();
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    ...mapGetters([
      "getCurrentUser",
      "getCurrentUserProfile",
      "getDefaultProfilePicture"
    ]),
    currentUser() {
      return this.getCurrentUser
    },
    userInfo() {
      return this.getCurrentUserProfile
    },
    defaultProfilePicture() {
      return this.getDefaultProfilePicture
    },
    selectImage() {
      if (this.userInfo.image) {
        return this.userInfo.image
      } else {
        return this.getDefaultProfilePicture
      }
    },
  }
}
</script>

<style lang="scss" scoped>

.navigation {
  margin: 0; 
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.navigation__user-picture {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-picture {
  height: 50px;
  width: 50px;
  object-fit: cover;
  border-radius: 25px;
  border: 1px solid $color-light-blue;
}

.button-menu {
  display: flex;
  justify-content: center;
  background-color: $color-light-blue;
  color: $color-dark-grey;
  margin-left: 20px;
}

.navigation__dropdown {
  top: 100%;
  right: 0;
  position: absolute;
  z-index: 10;
  min-width: 200px;
  margin-top: 1rem;
  overflow-y: auto;
  border-radius: 5px;
  background-color: $color-light-grey;
  border: 1px solid $color-dark-grey;
  background-clip: padding-box;
}

.navigation__dropdown-ul {
  list-style: none;
  text-align: right;
  padding: 1em;
  padding-left: 0;
  background-color: $color-light-grey;
}

.navigation__dropdown-link {
  color: $color-light-blue;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 0 50px 50px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 1em;

  &:hover {
  color: lighten($color-light-blue, 10%);
  background-color: $color-dark-blue;
  }
}

// Animation Menu Icon

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s;
}
.slide-fade-enter,
.slide-fade-leave-active {
  opacity: 0;
}
.slide-fade-enter {
  transform: translateX(30px);
}
.slide-fade-leave-active {
  transform: translateX(-30px);
}

// Dropdown Menu Animation

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.5s;
}
.dropdown-enter,
.dropdown-leave-to {
  opacity: 0;
}

// close menu on clickaway 

.clickaway-detect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $color-medium-grey;
  opacity: 0.6;
}

</style>