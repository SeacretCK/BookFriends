<template>
  <header class="header">
    <section class="section header-section">
      <div>
        <router-link class="header__logo" to="/">BookFriends</router-link>
      </div>
      <Navigation></Navigation>
    </section>
  </header>
</template>

<script>

import Navigation from "@/components/Navigation.vue"

export default {
  name: "Login",
  components: {
    Navigation
    }
}
</script>

<style lang="scss" scoped>

.header {
  background-color: $color-dark-grey;
  position: sticky;
  top: 0;
  left: 0;
  
  // the v-select component in the advanced search was showing up above the header when scrolling
  // z-index: -1 made it disappear
  z-index: 10;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
}

.header__logo {
  font-size: 3rem;
  font-weight: 900;
  color: $color-light-blue;
  text-decoration: none;

  &:hover {
    color: $color-light-blue; // overrides the hover effect for links in typography.scss
  }
}

</style>