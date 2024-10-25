<template>
  <div class="search-view">
    <h1>Recherche de Films</h1>
    <SearchFilm />
  </div>
</template>

<script>
import SearchFilm from "@/components/SearchFilm.vue";

export default {
  name: "SearchView",
  components: {
    SearchFilm,
  },
};
</script>

<style scoped>
.search-view {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
