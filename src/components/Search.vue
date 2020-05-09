<template>
  <div class="search-container">
    <div class="simpleSearch" v-if=!showAdvancedSerach>
      <form class="simpleSearch__searchbar" @submit.prevent>
        <div class="simpleSearch__input">
          <input 
            type="text" 
            class="simpleSearch__input-field" 
            v-model.trim="simpleSearch.input"
          />
        </div>
        <div class="simpleSearch__icon">
          <button class="button button-search" @click="runSimpleSearch(simpleSearch.input)"><font-awesome-icon icon='search' class="button-search__icon"/></button>
        </div>
      </form>
    </div>
    <div class="advancedSearch" v-else>

    </div>

    <section v-if="showResults" class="section section-results">
      <SearchResults/>
    </section>
    
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
      showAdvancedSerach: false,
      showResults: false
    }
  },
  methods: {
    ...mapActions([
      "runSimpleSearch"
    ]),

  },
  computed: {
    ...mapGetters([
      "getSearchResults"
    ])
  },

  watch: {
    getSearchResults() {
      console.log("watcher: ", this.getSearchResults)
      if(this.getSearchResults) {
        this.showResults = true;
      } else {
        this.showResults = false;
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

.button-search {
  border-radius: 0;
  height: 100%;
}




</style>