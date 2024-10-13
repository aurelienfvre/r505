<template>
  <div class="movie-detail-view" v-if="movie">
    <h1>{{ movie.title }}</h1>
    <div class="movie-info">
      <img :src="movie.poster" :alt="movie.title" class="movie-poster">
      <div class="movie-details">
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
    <button @click="showEditForm = true">Modifier le film</button>
    <button @click="confirmDelete">Supprimer le film</button>
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
          { id: 1, name: 'Leonardo DiCaprio', photo: 'url_to_photo' },
          { id: 2, name: 'Joseph Gordon-Levitt', photo: 'url_to_photo' },
          { id: 3, name: 'Ellen Page', photo: 'url_to_photo' }
        ]
      }
    },
    updateMovie(updatedMovie) {
      // This should update the movie in your API
      this.movie = { ...this.movie, ...updatedMovie }
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
      this.$router.push({ name: 'Movies' })
    }
  }
}
</script>

<style scoped>
.movie-detail-view {
  padding: 20px;
}

.movie-info {
  display: flex;
  margin-bottom: 20px;
}

.movie-poster {
  width: 300px;
  height: auto;
  margin-right: 20px;
}

.movie-details {
  flex-grow: 1;
}

.actor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

button {
  margin-right: 10px;
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}
</style>