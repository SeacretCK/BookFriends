<template>
  <div class="wrapper">
    <section class="section section-profile">
      <h1 class="welcome__heading">Update your Profile</h1>
      <div >
        <img :src="selectImage" alt="profile picture" class="profile-picture">
      </div>

      <transition name="fade">
        <p v-show="showSuccessTransition" class="success">Profile updated</p>
      </transition>

      <div class="profile">
        <form class="form profile-form" @submit.prevent>
          <label for="name" class="label profile-form__label-name">Name</label>
          <input
            type="text"
            :placeholder="getCurrentUserProfile.name"
            id="name"
            required
            class="input profile-form__input-name"
            v-model.trim="profileForm.name"
          />
          <label for="fav-book" class="label profile-form__label-fav-book">Favorite Book</label>
          <input
            type="text"
            :placeholder="getCurrentUserProfile.favoriteBook || '>>What\'s your favorite book?<<'"
            id="fav-book"
            class="input profile-form__input-fav-book"
            v-model.trim="profileForm.favoriteBook"
          />
          <label for="about-me" class="label profile-form__label-about">About Me</label>
          <textarea
            type="text"
            rows="3"
            :placeholder="getCurrentUserProfile.aboutMe || '>>Tell others about yourself!<<'"
            id="about-me"
            class="input profile-form__input-about"
            v-model.trim="profileForm.aboutMe"
          />
          <label for="signature" class="label profile-form__label-signature">Signature</label>
          <input
            type="text"
            :placeholder="getCurrentUserProfile.signature || '>>Your signature<<'"
            id="signature"
            class="input profile-form__input-signature"
            v-model.trim="profileForm.signature"
          />
          <label class="label profile-form__label-picture">Profile Picture</label>
          <div class="profile-form__picture">
            <label tabindex=0 v-on:keyup.enter="$refs.fileInput.click()" for="picture" class="button profile-form__choose-picture">Choose File</label>
            <input ref="fileInput" type="file" id="picture" class="input profile-form__input-picture" @change="uploadImage">
            <button type="button" class="button button-close profile-form__delete-picture" @click="deleteImage"><font-awesome-icon icon='trash-alt' class="button__icon"/></button>
          </div>

          <button class="button" @click="updateProfile(profileForm)">Update Profile</button>
        </form>

      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { storage, usersCollection } from "@/firebaseConfig"

export default {
  name: "Profile",
  data() {
    return {
      showSuccessTransition: false
    }
  },
  computed: {
    ...mapGetters([
      "getCurrentUserProfile",
      "getCurrentUser",
      "getDefaultProfilePicture",
      "getShowSuccess"
    ]),
    profileForm() {
      return {
        name: this.getCurrentUserProfile.name,
        aboutMe: this.getCurrentUserProfile.aboutMe || "",
        favoriteBook: this.getCurrentUserProfile.favoriteBook || "",
        signature: this.getCurrentUserProfile.signature || "",
        image: this.getCurrentUserProfile.image || ""
        // if these keys don't exist yet (because they are not created with the currentUserProfile on signup) and are still empty when clicking update, they must be set to an empty string to upload valid data to firebase
      }
    },
    selectImage() {
      if (this.getCurrentUserProfile.image) {
        return this.getCurrentUserProfile.image
      } else {
        return this.getDefaultProfilePicture
      }
    },
    showSuccess() {
      return this.getShowSuccess;
    }
  },
  methods: {
    ...mapActions([
      "updateProfile",
      "setCurrentUserProfile"
    ]),
    uploadImage(e) {
      const file = e.target.files[0];
      console.log(file)
      const storageRef = storage.ref(`${this.getCurrentUser.uid}_profilePicture`)
      console.log(storageRef)
      const uploadTask = storageRef.put(file);

      // CODE FROM FIREBASE DOCS:
      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on('state_changed', snapshot => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      }, error => {
        // Handle unsuccessful uploads
        console.log(error)
      }, () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          console.log('File available at', downloadURL);
          this.profileForm.image = downloadURL;
          this.updateProfile(this.profileForm);
        });
      });

    },
    deleteImage() {
      const desertRef = storage.ref(`${this.getCurrentUser.uid}_profilePicture`)
      desertRef.delete().then( () => {
        console.log("File successfully deleted")
        usersCollection
          .doc(this.getCurrentUser.uid)
          .update({
            image: ""
          })
          .then(() => {
            this.setCurrentUserProfile();
            console.log("profile updated");
          })
          .catch(err => {
            console.log(err);
          });
        }).catch(error => {
          console.log(error)
        })
    }
  },
  watch: {
    showSuccess(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);
      this.showSuccessTransition = newValue;
    }
  }
}
</script>

<style lang="scss" scoped>

.welcome__heading {
  font-size: 2rem;
  margin-bottom: 0.8em;
  color: inherit;
}

.profile-picture {
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 50px;
  border: 1px solid $color-white;
}

.profile {
  max-width: 400px;
  padding: 20px;
  @include set-background($color-light-grey);
  margin: 10px auto;
  border-radius: 5px;
}

.form {
  display: flex;
  flex-direction: column;
}

.input {
  padding: 0.5rem;
  margin-bottom: 10px;
}

.label {
  text-align: left;
  font-size: 14px;
  font-weight: 700;
}

.links {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px;
}

.profile-form__picture {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.profile-form__choose-picture {
  background-color: $color-dark-grey;
  font-weight: 400;
	padding: 0.5rem 1rem;
  
  &:hover,
  &:focus {
		background: lighten($color-dark-grey, 10%);
  }
}

.profile-form__input-picture {
  display: none;
}

.button-close {
  align-self: center;
  margin-left: 20px;
  height: 35px;
  width: 35px;
}

.button__icon {
  width: 20px;;
}

.success {
  background-color: $color-green;
  font-size: 2rem;
  padding: 2rem;
  font-weight: 700;
}

</style>