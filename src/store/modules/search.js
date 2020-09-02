const state = {
  apiKey: process.env.VUE_APP_API_KEY,
  searchResults: [],
  errorMessage: ""
};

const getters = {
  getSearchResults: (state) => state.searchResults,
  getErrorMessage: (state) => state.errorMessage,
  getTotalItems: (state) => state.totalItems
};

const actions = {
  runSimpleSearch({ dispatch, commit }, input) {
    commit("setErrorMessage", "");

    if (input.typeOfCall === "newSearch") {
      commit("clearSearchResults");
    }

    console.log("Input for Search", input);
    const searchTerm = input.input.replace(
      /[`~@#$%^&*()|=;:',.<>{}[\]/\s]+/gi,
      "+"
    );
    const startIndex = `&startIndex=${input.startIndex}`;
    const maxResults = `&maxResults=${input.maxResults}`;
    const searchString = searchTerm + startIndex + maxResults;
    console.log("SearchString: ", searchString);

    dispatch("runSearch", searchString);
  },
  runAdvancedSearch({ dispatch, commit }, input) {
    commit("setErrorMessage", "");

    if (input.typeOfCall === "newSearch") {
      commit("clearSearchResults");
    }

    console.log("Input for Search", input);
    let title = "";
    let author = "";
    let isbn = "";
    let language = "";

    if (input.title) {
      title = `intitle:${input.title.replace(
        /[`~@#$%^&*()|=;:',.<>{}[\]/\s]+/gi,
        "+"
      )}+`;
    }

    if (input.author) {
      author = `inauthor:${input.author.replace(
        /[`~@#$%^&*()|=;:',.<>{}[\]/\s]+/gi,
        "+"
      )}+`;
    }

    if (input.isbn) {
      isbn = `isbn:${input.isbn.replace(/[-/\s]+/gi, "")}`;
    }

    if (input.language) {
      language = `&langRestrict=${input.language}`;
    }

    const startIndex = `&startIndex=${input.startIndex}`;
    const maxResults = `&maxResults=${input.maxResults}`;

    const searchString =
      title + author + isbn + language + startIndex + maxResults;
    console.log("SearchString: ", searchString);

    dispatch("runSearch", searchString);
  },
  runSearch({ commit }, searchString) {
    fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${searchString}&key=${state.apiKey}`
    )
      .then((response) => response.json())
      .then((data) => {
        let responseData = [...data.items];
        console.log("Data from the response: ", responseData);
        let searchResults = [];
        responseData.forEach((responseObject) => {
          let resultObject = {
            bookId: responseObject.id,
            details: responseObject.volumeInfo
          };
          searchResults.push(resultObject);
        });
        commit("setSearchResults", searchResults);
      })
      .catch((error) => {
        console.log("error while fetching", error.message);
        let message = "The search was not successful.";
        commit("setErrorMessage", message);
      });
  },
  setErrorMessage({ commit }, message) {
    commit("setErrorMessage", message);
  }
};

const mutations = {
  setSearchResults(state, searchResults) {
    state.searchResults = [...state.searchResults, ...searchResults];
    console.log("state.searchResults:", state.searchResults);
  },
  clearSearchResults(state) {
    state.searchResults = [];
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
