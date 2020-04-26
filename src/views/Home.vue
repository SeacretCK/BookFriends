<template>
  <div class="wrapper">
    <section class="section section-welcome">
      <h1 class="welcome__heading">Welcome</h1>
      <p class="welcome__text">Some text...</p>
    </section>

    <section class="section section-login">
      <Login/>
    </section>
  
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
  name: 'Home',
  components: {
    Login
  }
  
}
</script>

<style lang="scss" scoped>

.welcome__heading,
.welcome__text {
  color: inherit;
}

.welcome__heading {
  font-size: 2rem;
  margin-bottom: 0.8em;
}

</style>
