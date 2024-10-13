<template>
  <div class="search-film">
    <div class="search-container">
      <input
          v-model="searchQuery"
          placeholder="Rechercher un film"
          class="search-input"
          ref="searchInput"
      >
      <button @click="addNewFilm" class="add-film-btn">Ajouter un film</button>
    </div>
    <p class="results-count">{{ filteredFilms.length }} résultat(s)</p>
    <div class="film-grid">
      <div v-for="film in filteredFilms" :key="film.title" class="film-card">
        <img :src="film.poster" :alt="film.title" class="film-poster">
        <div class="film-details">
          <h3>{{ film.title }} ({{ film.year }})</h3>
          <p v-if="film.rating" class="film-rating">Note: {{ film.rating }}/10</p>
          <p v-if="film.director" class="film-director">Réalisateur: {{ film.director }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchFilm',
  data() {
    return {
      searchQuery: '',
      allFilms: [
        {
          title: 'Inception',
          year: 2010,
          rating: 8.8,
          poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'
        },
        {
          title: 'The Matrix',
          year: 1999,
          rating: 8.7,
          poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
        },
        {
          title: 'Interstellar',
          year: 2014,
          rating: 8.6,
          poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg'
        }
      ]
    }
  },
  computed: {
    filteredFilms() {
      return this.allFilms.filter(film =>
          film.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    addNewFilm() {
      const newFilm = {
        title: 'Nouveau Film',
        year: 2023,
        poster: 'https://via.placeholder.com/300x450.png?text=Nouveau+Film'
      }
      this.allFilms.push(newFilm)
      this.$set(newFilm, 'rating', 8.5)
      this.$set(newFilm, 'director', 'John Doe')
    }
  },
  mounted() {
    this.$refs.searchInput.focus()
  }
}
</script>

<style scoped>
.search-film {
  font-family: Arial, sans-serif;
}

.search-container {
  display: flex;
  margin-bottom: 1rem;
}

.search-input {
  flex-grow: 1;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-film-btn {
  margin-left: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-film-btn:hover {
  background-color: #2980b9;
}

.results-count {
  margin-bottom: 1rem;
  font-style: italic;
  color: #7f8c8d;
}

.film-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.film-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.film-card:hover {
  transform: translateY(-5px);
}

.film-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.film-details {
  padding: 1rem;
}

.film-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.film-rating, .film-director {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #7f8c8d;
}
</style>