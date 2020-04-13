import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    mostDiscussedBooks: [
      {
        number: 1, 
        bookId: "NrTYBgAAQBAJ"
      },
      {
        number: 2,
        bookId: "OHclhBVv-X4C"
      },
      {
        number: 3,
        bookId: "yXbkAF7w4twC"
      }
    ],
    apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y"
  },
  mutations: {
    setMostDiscussedBooks: state => {
      state.mostDiscussedBooks.forEach(book => {
        fetch(`https://www.googleapis.com/books/v1/volumes/${book.bookId}?key=${state.apiKey}`)
            .then(response => response.json())
            .then(data => book.details = data.volumeInfo)
            .catch(error => console.log(error))
      })
      console.log(state.mostDiscussedBooks);
    }
  },
  actions: {
    setMostDiscussedBooks: context => context.commit("setMostDiscussedBooks")
  },
  getters: {
    getMostDiscussedBooks: state => state.mostDiscussedBooks
  },
  modules: {
  }
})
