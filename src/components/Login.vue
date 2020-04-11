<template>
  <div class="login-card">
    <form class="login-form">

      <label for="email" class="login-form__label-email">Email</label>
      <input
        type="text"
        placeholder="email@email.com"
        id="email"
        class="login-form__input-email"
      />

      <label for="password" class="login-form__label-password">Password</label>
      <input
        type="password"
        placeholder="******"
        id="password"
        class="login-form__input-password"
      />

      <button class="button">Log In</button>

      <div class="login-form__links">
        <a>Forgot Password</a>
        <a>Create an Account</a>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login"
}
</script>

<style lang="scss" scoped>

.login-card {
  max-width: 400px;
  padding: 20px;
  @include set-background($color-light-grey);
  margin: 10px auto;
  border-radius: 5px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form__input-email,
.login-form__input-password {
  padding: 0.5rem;
  margin-bottom: 10px;
}

.login-form__label-email,
.login-form__label-password {
  text-align: left;
  font-size: 14px;
}

.login-form__links {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5px;
}


</style>