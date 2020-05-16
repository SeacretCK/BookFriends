<template>
  <div class="search-container">
    <div class="simpleSearch" v-if=!showAdvancedSearch>
      <form class="simpleSearch__searchbar" @submit.prevent>
        <div class="simpleSearch__input">
          <input 
            type="text" 
            class="simpleSearch__input-field" 
            v-model.trim="simpleSearch.input"
          />
        </div>
        <div class="simpleSearch__icon">
          <button class="button button-simpleSearch" @click="runSimpleSearch(simpleSearch.input)"><font-awesome-icon icon='search' class="button-search__icon"/></button>
        </div>
      </form>
      <a @click="toggleSearch" class="toggleSearch-link">Advanced Search</a>
    </div>
    <div class="advancedSearch" v-else>
      <form class="advancedSearch__searchbar" @submit.prevent>
        <input 
          type="text"
          placeholder="Title" 
          class="advancedSearch__input" 
          v-model.trim="advancedSearch.title"
        />

        <input 
          type="text"
          placeholder="Author"
          class="advancedSearch__input" 
          v-model.trim="advancedSearch.author"
        />
        <v-select class="select-list" v-model="advancedSearch.language" :options="languages" label="language" :reduce="language => language.code" placeholder="Language"></v-select> <!-- https://vue-select.org/ -->
        
        <input 
          type="text" 
          placeholder="Isbn"
          class="advancedSearch__input" 
          v-model.trim="advancedSearch.isbn"
        />
        <div class="advancedSearch__icon">
          <button class="button button-advancedSearch" @click="runAdvancedSearch(advancedSearch)"><font-awesome-icon icon='search' class="button-search__icon"/></button>
        </div>
        <a @click="toggleSearch" class="toggleSearch-link">Back to Simple Search</a>
      </form>
    </div>

    <section v-if="showResults" class="section section-results">
      <SearchResults/>
    </section>
    <br>
    <h2 v-if="showErrorMessage">{{ getErrorMessage }}</h2>
    
  </div>
</template>

<script>
import SearchResults from "@/components/SearchResults.vue";
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "Search",
  components: {
    SearchResults
  },
  data() {
    return {
      simpleSearch: {
        input: ""
      },
      advancedSearch: {
        title: "",
        author: "",
        language: "",
        isbn: ""
      },
      showAdvancedSearch: false,
      showResults: false,
      showErrorMessage: false,
      languages: [
        {
          language: "English",
          code: "en"
        },
        {
          language: "German",
          code: "de"
        },
        {
          language: "Spanish",
          code: "es"
        },
        {
          language: "French",
          code: "fr"
        },
        {
          language: "Russian",
          code: "ru"
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      "runSimpleSearch",
      "runAdvancedSearch",
      "setErrorMessage"
    ]),
    toggleSearch() {
      this.showAdvancedSearch = !this.showAdvancedSearch;
      this.showResults = false;
      this.simpleSearch.input = "";
      this.advancedSearch.title = "";
      this.advancedSearch.author = "";
      this.advancedSearch.language = "";
      this.advancedSearch.isbn = "";
      this.setErrorMessage("");
    }

  },
  computed: {
    ...mapGetters([
      "getSearchResults",
      "getErrorMessage"
    ])
    
  },

  watch: {
    getSearchResults() {
      console.log("watcher searchResults: ", this.getSearchResults)
      if(this.getSearchResults.length) {
        this.showResults = true;
      } else {
        this.showResults = false;
      }
    },
    getErrorMessage() {
      console.log("watcher errorMessage: ", this.getErrorMessage)
      if(this.getErrorMessage) {
        this.showErrorMessage = true;
      } else {
        this.showErrorMessage = false;
      }
    }
  }
  
}
</script>

<style lang="scss" scoped>

.simpleSearch__searchbar {
  width: 100%;
  display: flex;
  border-radius: 10px;
  overflow: hidden;
}

.simpleSearch__input {
  width: 100%;
}

.simpleSearch__input-field {
  width: 100%;
  padding: 1rem;
}

.button-simpleSearch {
  border-radius: 0;
  height: 100%;
}

.toggleSearch-link {
  color: $color-light-blue;

  &:hover {
    color: lighten($color-light-blue, 8%)
  }
}

.advancedSearch__searchbar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


.advancedSearch__input {
  width: 50%;
  padding: 0.5rem;
  margin-bottom: 10px;
  border: 0;
  border-radius: 3px;
}

.select-list {
  width: 50%;
  background-color: $color-white;
  margin-bottom: 10px;
  border-radius: 3px;
  padding: 3px;
}



</style>