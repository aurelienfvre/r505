<template>
  <div id="search-film">
    <h2>Recherche de Films</h2>
    <div class="search-container">
      <input
          v-model="searchQuery"
          placeholder="Rechercher un film"
          ref="searchInput"
      >
      <button @click="addNewFilm" class="add-film-btn">Ajouter un film</button>
    </div>
    <p class="results-count">Nombre de résultats : {{ filteredFilms.length }}</p>
    <ul class="film-list">
      <li v-for="film in filteredFilms" :key="film.title" class="film-item">
        <img :src="film.poster" :alt="film.title" class="film-poster">
        <div class="film-details">
          <h3>{{ film.title }} ({{ film.year }})</h3>
          <p v-if="film.rating" class="film-rating">Note: {{ film.rating }}/10</p>
          <p v-if="film.director" class="film-director">Réalisateur: {{ film.director }}</p>
        </div>
      </li>
    </ul>
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

      // Ajouter une propriété de manière réactive
      this.$set(newFilm, 'rating', 8.5)
      this.$set(newFilm, 'director', 'John Doe')

      console.log('Nouveau film ajouté:', newFilm)
    }
  },
  mounted() {
    this.$refs.searchInput.focus()
  }
}
</script>git init


<style scoped>
#search-film {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-film-btn {
  padding: 10px 20px;
  margin-left: 10px;
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
  margin-bottom: 20px;
  font-style: italic;
  color: #7f8c8d;
}

.film-list {
  list-style-type: none;
  padding: 0;
}

.film-item {
  display: flex;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.film-poster {
  width: 100px;
  height: 150px;
  object-fit: cover;
  margin-right: 20px;
  border-radius: 4px;
}

.film-details {
  flex-grow: 1;
}

.film-details h3 {
  margin-top: 0;
  color: #2c3e50;
}

.film-rating, .film-director {
  margin: 5px 0;
  color: #34495e;
}
</style>