<template>
  <div>
    <h1>Welcome</h1>
    <p>Some book suggestions from Google Books API</p>
    <hr>
    <Login/>
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
