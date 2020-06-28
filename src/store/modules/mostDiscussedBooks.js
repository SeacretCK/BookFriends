const state = {
  mostDiscussedBooks: [
    {
      number: 1, 
      bookId: "ukYnDwAAQBAJ"
    },
    {
      number: 2,
      bookId: "OHclhBVv-X4C"
    },
    {
      number: 3,
      bookId: "IYSCezJGwE4C"
    }
  ],
  // if the fetched data are added to the existing array, the change wouldn't be reactive and thus not displayed at initial page load, that's why a new array is created
  mostDiscussedBooksDetails: [],
  apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y"
};

const getters = {
  getMostDiscussedBooks: state => state.mostDiscussedBooksDetails
};

const actions = {
  setMostDiscussedBooks: ({ state, commit }) => {
    let fetchedBooks = [];
    state.mostDiscussedBooks.forEach(book => {
      fetch(`https://www.googleapis.com/books/v1/volumes/${book.bookId}?key=${state.apiKey}`)
          .then(response => response.json())
          .then(data => {
            fetchedBooks.push(
              {
                number: book.number,
                id: data.id,
                details: data.volumeInfo
              }
            );
          })
          .catch(error => console.log(error))
    })
    commit("setMostDiscussedBooks", fetchedBooks);
  }
};

const mutations = {
  setMostDiscussedBooks: (state, fetchedBooks) => {
    state.mostDiscussedBooksDetails = fetchedBooks
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};