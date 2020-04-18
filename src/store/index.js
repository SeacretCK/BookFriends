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
    mostDiscussedBooksDetails: [],
    apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y"
  },
  mutations: {
    setMostDiscussedBooks: state => {
      console.log("store - before mutation('setMostDiscussedBooks')");
      state.mostDiscussedBooksDetails = [];
      state.mostDiscussedBooks.forEach(book => {
        fetch(`https://www.googleapis.com/books/v1/volumes/${book.bookId}?key=${state.apiKey}`)
            .then(response => response.json())
            .then(data => {
              state.mostDiscussedBooksDetails.push(
                {
                  number: book.number,
                  bookId: book.bookId,
                  details: data.volumeInfo
                }
              );
            })
            .catch(error => console.log(error))
      })
      console.log("store - after mutation('setMostDiscussedBooks')", state.mostDiscussedBooksDetails);
    }
  },
  actions: {
    setMostDiscussedBooks: ({ commit }) => {
      console.log("store - action - before commit('setMostDiscussedBooks')");
      commit("setMostDiscussedBooks");
      console.log("store - action - after commit('setMostDiscussedBooks')");

    }
  },
  getters: {
    getMostDiscussedBooks: state => state.mostDiscussedBooksDetails
  },
  modules: {
  }
})
