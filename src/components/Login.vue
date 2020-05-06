<template>
  <div class="login-card">
    <p class="login-error" v-if="errorMessage">*{{ errorMessage }}*</p>

    <!-- LOGIN FORM -->
    <!-- @submit.prevent is super important! because otherwise there would be a page refresh that interrupts the authentication process! -->
    <form v-if="showLoginForm" class="form login-form" @submit.prevent>

      <label for="email" class="label login-form__label-email">Email</label>
      <input
        type="text"
        placeholder="email@email.com"
        id="email"
        class="input login-form__input-email"
        required
        v-model.trim="loginForm.email"
      />

      <label for="password" class="label login-form__label-password">Password</label>
      <input
        type="password"
        placeholder="******"
        id="password"
        class="input login-form__input-password"
        required
        v-model.trim="loginForm.password"
      />

      <button class="button" @click="login">Log In</button>

      <div class="links login-form__links">
        <a>Forgot Password</a>
        <a @click="toggleForm">Create an Account</a>
      </div>
    </form>

    <!-- SIGN UP FORM -->
    <form v-if="!showLoginForm" class="form signup-form" @submit.prevent>

      <label for="name" class="label signup-form__label-name">Name</label>
      <input
        type="text"
        placeholder="User"
        id="name"
        class="input signup-form__input-name"
        required
        v-model.trim="signupForm.name"
      />

      <label for="email" class="label signup-form__label-email">Email</label>
      <input
        type="text"
        placeholder="email@email.com"
        id="email"
        class="input signup-form__input-email"
        required
        v-model.trim="signupForm.email"
      />

      <label for="password" class="label signup-form__label-password">Password</label>
      <input
        type="password"
        placeholder="******"
        id="password"
        class="input signup-form__input-password"
        required
        v-model.trim="signupForm.password"
      />

      <button class="button" @click="signup">Sign Up</button>

      <div class="links signup-form__links">
        <a>Forgot Password</a>
        <a @click="toggleForm">Back to Login</a>
      </div>
    </form>
  </div>
</template>

<script>
import { usersCollection, auth } from "@/firebaseConfig"
import { mapActions } from 'vuex'

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        email: "",
        password: ""
      },
      signupForm: {
        name: "",
        email: "",
        password: ""
      },
      showLoginForm: true,
      errorMessage: ""
    }
  },
  methods: {
    ...mapActions([
      "setCurrentUser",
      "setUserProfile"
    ]),
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
      this.errorMessage = "";
    },
    signup() {
      auth
        .createUserWithEmailAndPassword(
          this.signupForm.email,
          this.signupForm.password
        )
        .then(data => {
          const user = data.user;
          const id = data.user.uid;
          this.setCurrentUser(user);

          // create user obj in firestore users collection
          usersCollection
            .doc(id)
            .set({
              name: this.signupForm.name,
              email: this.signupForm.email,
              booklists: []
            })
            .then(() => {
              this.setUserProfile();
              this.$router.push("/dashboard");
              console.log("user created");
            })
            .catch(err => {
              console.log(err);
              this.errorMessage = err.message;
            });
        })
        .catch(err => {
          console.log(err);
          this.errorMessage = err.message;
        });
    },
    login() {
      auth
        .signInWithEmailAndPassword(
          this.loginForm.email,
          this.loginForm.password
        )
        .then(data => {
          this.setCurrentUser(data.user);
          this.setUserProfile();
          this.$router.push("/dashboard");
        })
        .catch(err => {
          console.log(err);
          this.errorMessage = err.message;
        });
    }
  },
  computed: {
    
  }
  
}
</script>

<style lang="scss" scoped>

.login-card {
  max-width: 400px;
  padding: 20px;
  @include set-background($color-light-grey);
  margin: 30px auto;
  border-radius: 5px;
}

.login-error {
  color: $color-red;
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
}

.links {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px;
}


</style>