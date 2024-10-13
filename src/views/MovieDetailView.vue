<template>
  <div class="movie-detail-view" v-if="movie">
    <div class="container">
      <div class="movie-header">
        <h1>{{ movie.title }}</h1>
        <div class="movie-actions">
          <button @click="showEditForm = true" class="btn-edit">Modifier</button>
          <button @click="confirmDelete" class="btn-delete">Supprimer</button>
        </div>
      </div>
      <div class="movie-content">
        <img :src="movie.poster" :alt="movie.title" class="movie-poster">
        <div class="movie-info">
          <p><strong>Année:</strong> {{ movie.year }}</p>
          <p><strong>Réalisateur:</strong> {{ movie.director }}</p>
          <p><strong>Catégories:</strong> {{ movie.categories.join(', ') }}</p>
          <p><strong>Synopsis:</strong> {{ movie.synopsis }}</p>
        </div>
      </div>
      <h2>Acteurs</h2>
      <div class="actor-grid">
        <ActorCard v-for="actor in movie.actors" :key="actor.id" :actor="actor" />
      </div>
    </div>
    <EditMovieForm v-if="showEditForm" :movie="movie" @close="showEditForm = false" @update-movie="updateMovie" />
  </div>
</template>

<script>
import ActorCard from '@/components/ActorCard.vue'
import EditMovieForm from '@/components/EditMovieForm.vue'

export default {
  name: 'MovieDetailView',
  components: {
    ActorCard,
    EditMovieForm
  },
  data() {
    return {
      movie: null,
      showEditForm: false
    }
  },
  created() {
    // Fetch movie details based on route params
    this.fetchMovieDetails(this.$route.params.id)
  },
  methods: {
    fetchMovieDetails(id) {
      // This should fetch movie details from your API
      // For now, we'll use dummy data
      this.movie = {
        id: id,
        title: 'Inception',
        year: 2010,
        director: 'Christopher Nolan',
        categories: ['Sci-Fi', 'Action'],
        synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        poster: 'url_to_poster',
        actors: [
          {id: 1, name: 'Leonardo DiCaprio', photo: 'url_to_photo'},
          {id: 2, name: 'Joseph Gordon-Levitt', photo: 'url_to_photo'},
          {id: 3, name: 'Ellen Page', photo: 'url_to_photo'}
        ]
      }
    },
    updateMovie(updatedMovie) {
      // This should update the movie in your API
      this.movie = {...this.movie, ...updatedMovie}
      this.showEditForm = false
    },
    confirmDelete() {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
        this.deleteMovie()
      }
    },
    deleteMovie() {
      // This should delete the movie from your API
      // Then redirect to the movies list
      this.$router.push({name: 'Movies'})
    }
  }
}
</script>

<style scoped>
.movie-detail-view {
  padding: 2rem 0;
}

.movie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.movie-actions {
  display: flex;
  gap: 1rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-edit {
  background-color: var(--accent-color);
  color: white;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}

.btn-edit:hover,
.btn-delete:hover {
  opacity: 0.9;
}

.movie-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.movie-poster {
  width: 300px;
  height: auto;
  border-radius: 0.5rem;
}

.movie-info {
  flex: 1;
}

h2 {
  margin-bottom: 1rem;
}

.actor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .movie-content {
    flex-direction: column;
  }

  .movie-poster {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>