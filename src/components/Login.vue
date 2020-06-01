<template>
  <div class="login-card">
    <p class="login-error" v-if="errorMessage">*{{ errorMessage }}*</p>

    <!-- LOGIN FORM -->
    <!-- @submit.prevent is super important! because otherwise there would be a page refresh that interrupts the authentication process! -->
    <form v-if="showLoginForm && !forgotPassword" class="form login-form" @submit.prevent>
      <h2 class="form__heading">Login with your Account</h2>

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
        <a @click="forgotPassword = true">Forgot Password</a>
        <a @click="toggleForm">Create an Account</a>
      </div>
    </form>

    <!-- SIGN UP FORM -->
    <form v-if="!showLoginForm && !forgotPassword" class="form signup-form" @submit.prevent>
      <h2 class="form__heading">Create an Account</h2>

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
        <a @click="forgotPassword = true">Forgot Password</a>
        <a @click="toggleForm">Back to Login</a>
      </div>
    </form>

    <form v-if="forgotPassword" @submit.prevent>
      <div v-if="!resetPasswordSuccess" class="form">
        <h2 class="form__heading">Reset Password</h2>
        <p class="password-form__text">We will send you an email to reset your password</p>

        <label for="email" class="label">Email</label>
        <input
          type="text"
          placeholder="email@email.com"
          id="email"
          class="input"
          required
          v-model.trim="passwordForm.email"
        />

        <button class="button" @click="resetPassword">Submit</button>

        <div class="links">
          <a @click="showLoginForm = true, forgotPassword = false">Back to Login</a>
        </div>
      </div>
 
      <div v-else>
        <h2 class="form__heading">Email sent</h2>
        <p class="password-form__text">Check your email for a link to reset your password</p>
        <button class="button" @click="showLoginForm = true, forgotPassword = false, resetPasswordSuccess = false">Back to Login</button>
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
      passwordForm: {
        email: ""
      },
      showLoginForm: true,
      errorMessage: "",
      forgotPassword: false,
      resetPasswordSuccess: false
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
          //this.$router.push("/dashboard");
        })
        .catch(err => {
          console.log(err);
          this.errorMessage = err.message;
        });
    },
    resetPassword() {
      auth
        .sendPasswordResetEmail(this.passwordForm.email)
        .then(() => {
          this.passwordForm.email = '';
          this.resetPasswordSuccess = true;
      }).catch(err => {
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

.form__heading {
  padding-bottom: 0.5em;
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

.password-form__text {
  padding-bottom: 1em;
  font-style: italic;
}
</style>