const state = {
  apiKey: "AIzaSyAiFCyH0fZG1Ox7mvFncKsaQ2ms61D8t5Y",
  searchResults: [],
  errorMessage: ""
};

const getters = {
  getSearchResults: state => state.searchResults,
  getErrorMessage: state => state.errorMessage
};

const actions = {
  runSimpleSearch({ commit }, input) {
    commit("setErrorMessage", "");
    commit("setSearchResults", []);
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
        .catch(error => {
          console.log("error while fetching", error.message);
          let message = "The search was not successful.";
          commit("setErrorMessage", message);
        })
  },
  runAdvancedSearch({ commit }, input) {
    commit("setErrorMessage", "");
    commit("setSearchResults", []);
    console.log(input)
    let title = "";
    let author = "";
    let isbn = "";
    let language = "";

    if (input.title) {
      title = `intitle:${input.title.replace(/[`~@#$%^&*()|=;:',.<>{}[\]/\s]+/gi, '+')}+`;
    }

    if (input.author) {
      author = `inauthor:${input.author.replace(/[`~@#$%^&*()|=;:',.<>{}[\]/\s]+/gi, '+')}+`;
    }

    if (input.isbn) {
      isbn = `isbn:${input.isbn.replace(/[-/\s]+/gi, '')}`;
    }

    if (input.language) {
      language = `&langRestrict=${input.language}`
    }
    
    const searchString = title + author + isbn + language;
    console.log(searchString)

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchString}&key=${state.apiKey}`)
        .then(response => response.json())
        .then(data => {
          let searchResults = [...data.items];
          console.log(searchResults)
          commit("setSearchResults", searchResults)
        })
        .catch(error => {
          console.log("error while fetching", error.message);
          let message = "The search was not successful.";
          commit("setErrorMessage", message);
        })
  },
  setErrorMessage({ commit }, message) {
    commit("setErrorMessage", message);
  }

};

const mutations = {
  setSearchResults(state, searchResults) {
    state.searchResults = searchResults;
    console.log("state.searchResults:", state.searchResults);
  },
  setErrorMessage(state, message) {
    state.errorMessage = message;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};