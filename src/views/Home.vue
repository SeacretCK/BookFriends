<template>
  <div class="wrapper">
    <section class="section section-welcome">
      <h1 class="welcome__heading">Welcome</h1>
      <p class="welcome__text">Some text...</p>
    </section>
    
    <section class="section section-login">
      <Login/>
    </section>

    <section class="section section-books">
      <h2>Most discussed books this week</h2>
      <div class="books__container">
        <div v-for="(book, index) in booksArray" :key="index" class="books__item">
          <h3 class="book__title">  {{book.title}} </h3>
          <p class="book__author"> {{book.author}} </p>
          <p class="book__year">released: {{book.year}} </p>
          <img :src="book.imageUrl" class="book__image">
        </div>
      </div>
    </section>   
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
  name: 'Home',
  components: {
    Login
  },
  data() {
    return {
      booksArray: [
        {
          title: "Book One",
          author: "Mr. X",
          year: "2020",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Polygraphiae.jpg" 
        },
        {
          title: "Book Two",
          author: "Mr. X",
          year: "2020",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Polygraphiae.jpg" 
        },
        {
          title: "Book Three",
          author: "Mr. X",
          year: "2020",
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Polygraphiae.jpg" 
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.welcome__heading,
.welcome__text {
  color: inherit;
}

.books__container {
  display: flex;
  justify-content: space-between;
}

.books__item {
  width: 30%;
  border: 1px solid $color-dark-grey;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  @include set-background($color-light-grey);
}

.book__image {
  width: 90%;
}

</style>
