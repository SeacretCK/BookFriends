<template>
  <div id="app">
    <Header/>
    <router-view/>
  </div>
</template>

<script>
import Header from "@/components/Header.vue"

export default {
  name: 'App',
  components: {
    Header
  }
}
</script>

<style lang="scss">
// this comment ensures that the scss applies to all components
</style>
