<template>
  <header>
    <section>
      <div>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="dashboard">Dashboard</router-link></li>
          <li><router-link to="profile">Profile</router-link></li>
          <li><router-link to="forum">Forum</router-link></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<style lang="scss" scoped>
ul {
  list-style: none;
  display: flex;

  li {
    margin-bottom: 1em;
    margin-left: 1em;
    
    a {
      color: #41688f;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: 700;
      text-transform: uppercase;
      cursor: pointer;

      &:hover {
      color: #274564;
      }
    }
  }
}






</style>