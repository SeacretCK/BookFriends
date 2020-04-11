<template>
  <header cass="header">
    <nav class="navigation-wrapper">
      <ul class="navigation">
        <li class="navigation__item"><router-link class="navigation__link" to="/">Home</router-link></li>
        <li class="navigation__item"><router-link class="navigation__link" to="dashboard">Dashboard</router-link></li>
        <li class="navigation__item"><router-link class="navigation__link" to="profile">Profile</router-link></li>
        <li class="navigation__item"><router-link class="navigation__link" to="forum">Forum</router-link></li>
        <li class="navigation__item"><a class="navigation__link">Logout</a></li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>

.navigation-wrapper {
  background-color: $color-dark-grey;
  max-width: $max-width-section;
  margin: 0 auto;
  padding: 20px;
}

.navigation {
  list-style: none;
  display: flex;
  padding: 1em;
  margin: 0; 
}

.navigation__item {
  margin-left: 1em;
}

.navigation__link {
  color: $color-light-blue;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;

  &:hover {
  color: lighten($color-light-blue, 5%);
  }
}
</style>