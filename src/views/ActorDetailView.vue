<template>
  <div class="actor-detail-view" v-if="actor">
    <div class="container">
      <div class="actor-header">
        <h1>{{ actor.name }}</h1>
        <div class="actor-actions">
          <button @click="showEditForm = true" class="btn-edit">Modifier</button>
          <button @click="confirmDelete" class="btn-delete">Supprimer</button>
        </div>
      </div>
      <div class="actor-content">
        <img :src="actor.photo" :alt="actor.name" class="actor-photo">
        <div class="actor-info">
          <p><strong>Date de naissance:</strong> {{ actor.birthDate }}</p>
          <p><strong>Nationalité:</strong> {{ actor.nationality }}</p>
          <p><strong>Biographie:</strong> {{ actor.biography }}</p>
        </div>
      </div>
      <h2>Filmographie</h2>
      <div class="movie-grid">
        <MovieCard v-for="movie in actor.movies" :key="movie.id" :movie="movie" />
      </div>
    </div>
    <EditActorForm v-if="showEditForm" :actor="actor" @close="showEditForm = false" @update-actor="updateActor" />
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue'
import EditActorForm from '@/components/EditActorForm.vue'

export default {
  name: 'ActorDetailView',
  components: {
    MovieCard,
    EditActorForm
  },
  data() {
    return {
      actor: null,
      showEditForm: false
    }
  },
  created() {
    // Fetch actor details based on route params
    this.fetchActorDetails(this.$route.params.id)
  },
  methods: {
    fetchActorDetails(id) {
      // This should fetch actor details from your API
      // For now, we'll use dummy data
      this.actor = {
        id: id,
        name: 'Leonardo DiCaprio',
        birthDate: '11/11/1974',
        nationality: 'Américain',
        biography: 'Leonardo Wilhelm DiCaprio est un acteur, scénariste et producteur de cinéma américain.',
        photo: 'url_to_photo',
        movies: [
          { id: 1, title: 'Inception', year: 2010, poster: 'url_to_poster' },
          { id: 2, title: 'The Revenant', year: 2015, poster: 'url_to_poster' },
          { id: 3, title: 'The Wolf of Wall Street', year: 2013, poster: 'url_to_poster' }
        ]
      }
    },
    updateActor(updatedActor) {
      // This should update the actor in your API
      this.actor = { ...this.actor, ...updatedActor }
      this.showEditForm = false
    },
    confirmDelete() {
      if (confirm('Êtes-vous sûr de vouloir supprimer cet acteur ?')) {
        this.deleteActor()
      }
    },
    deleteActor() {
      // This should delete the actor from your API
      // Then redirect to the actors list
      this.$router.push({ name: 'Actors' })
    }
  }
}
</script>

<style scoped>
.actor-detail-view {
  padding: 2rem 0;
}

.actor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;
  font-size: 2rem;
}

.actor-actions {
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

.actor-content {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.actor-photo {
  width: 300px;
  height: auto;
  border-radius: 0.5rem;
}

.actor-info {
  flex: 1;
}

h2 {
  margin-bottom: 1rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

@media (max-width: 768px) {
  .actor-content {
    flex-direction: column;
  }

  .actor-photo {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>