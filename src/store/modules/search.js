const state = {
  apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y",
  searchResults: []
};

const getters = {
  getSearchResults: state => state.searchResults
};

const actions = {
  // eslint-disable-next-line no-unused-vars
  runSimpleSearch({ commit }, input) {
    console.log(input)
    const searchString = input.replace(/[`~@#$%^&*()|=;:',.<>{}[\]/\s]+/gi, '+')
    console.log(searchString)

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchString}&key=${state.apiKey}`)
        .then(response => response.json())
        .then(data => {
          let searchResults = [...data.items];
          console.log(searchResults)
          commit("setSearchResults", searchResults)
        })
        .catch(error => console.log(error))
  }
};

const mutations = {
  setSearchResults(state, searchResults) {
    state.searchResults = searchResults;
    console.log("state.searchResults:", state.searchResults);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};