<template>
  <div class="movies-view">
    <h1>Films</h1>
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Rechercher un film" @input="searchMovies">
    </div>
    <button @click="showAddMovieForm = true" class="add-button">Ajouter un film</button>
    <div class="movie-grid">
      <MovieCard v-for="movie in paginatedMovies" :key="movie.id" :movie="movie" />
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
    </div>
    <AddMovieForm v-if="showAddMovieForm" @close="showAddMovieForm = false" @add-movie="addMovie" />
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue'
import AddMovieForm from '@/components/AddMovieForm.vue'

export default {
  name: 'MoviesView',
  components: {
    MovieCard,
    AddMovieForm
  },
  data() {
    return {
      movies: [], // This should be populated from your API or store
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 12,
      showAddMovieForm: false
    }
  },
  computed: {
    filteredMovies() {
      return this.movies.filter(movie =>
          movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredMovies.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredMovies.length / this.itemsPerPage)
    }
  },
  methods: {
    searchMovies() {
      this.currentPage = 1 // Reset to first page when searching
    },
    previousPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    addMovie(movie) {
      // This should add the movie to your API or store
      this.movies.push(movie)
      this.showAddMovieForm = false
    }
  }
}
</script>

<style scoped>
.movies-view {
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.add-button {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
}
</style>