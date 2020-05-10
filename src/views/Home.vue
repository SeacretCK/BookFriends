<template>
  <div class="wrapper">
    <section class="section section-welcome">
      <h1 class="welcome__heading">Welcome</h1>
      <p v-if="getCurrentUser" class="welcome__text">Search the GoogleBooks API for interesting books</p>
    </section>

    <section v-if="!getCurrentUser" class="section section-login">
      <Login/>
    </section>

    <section v-if="getCurrentUser" class="section section-search">
      <Search/>
    </section>
  
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Search from "@/components/Search.vue";
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {
    Login,
    Search
  },
  computed: {
    ...mapGetters([
      "getCurrentUser"
    ])
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
