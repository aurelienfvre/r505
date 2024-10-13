<template>
  <div class="movies-view">
    <div class="container">
      <h1>Films</h1>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Rechercher un film" @input="searchMovies">
        <button @click="showAddMovieForm = true" class="btn-add">Ajouter un film</button>
      </div>
      <div class="movie-grid">
        <MovieCard v-for="movie in paginatedMovies" :key="movie.id" :movie="movie" />
      </div>
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1" class="btn-pagination">Précédent</button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">Suivant</button>
      </div>
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
      movies: [
        {
          id: 1,
          title: 'Titanic',
          year: 1997,
          director: 'James Cameron',
          actors: 'Leonardo DiCaprio, Kate Winslet, Billy Zane, Kathy Bates',
          poster: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg',
          plot: '84 years later, a 100 year-old woman named Rose DeWitt Bukater tells the story to her granddaughter Lizzy Calvert, Brock Lovett, Lewis Bodine, Bobby Buell and Anatoly Mikailavich on the Keldysh about her life set in April 10th 1912, on a ship called Titanic when young Rose boards the departing ship with the upper-class passengers and her mother, Ruth DeWitt Bukater, and her fiancé, Caledon Hockley. Meanwhile, a drifter and artist named Jack Dawson and his best friend Fabrizio De Rossi win third-class tickets to the ship in a game. And she explains the whole story from departure until the death of Titanic on its first and last voyage April 15th, 1912 at 2:20 in the morning.',
          metascore: '75'
        },
        {
          id: 2,
          title: 'Blade Runner',
          year: 1982,
          director: 'Ridley Scott',
          actors: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos',
          poster: 'https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
          plot: 'A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.',
          metascore: '89'
        },
        {
          id: 3,
          title: 'The Shining',
          year: 1980,
          director: 'Stanley Kubrick',
          actors: 'Jack Nicholson, Shelley Duvall, Danny Lloyd, Scatman Crothers',
          poster: 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
          plot: 'A family heads to an isolated hotel for the winter where an evil spiritual presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.',
          metascore: '63'
        }
      ],
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
      this.movies.push({...movie, id: this.movies.length + 1})
      this.showAddMovieForm = false
    }
  }
}
</script>

<style scoped>
.movies-view {
  padding: 2rem 0;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-bar input {
  flex-grow: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  font-size: 1rem;
}

.btn-add {
  padding: 0.75rem 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
  font-size: 1rem;
}

.btn-add:hover {
  opacity: 0.9;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  justify-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-pagination:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .movie-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>