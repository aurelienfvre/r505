<template>
  <div class="actor-detail-view" v-if="actor">
    <h1>{{ actor.name }}</h1>
    <div class="actor-info">
      <img :src="actor.photo" :alt="actor.name" class="actor-photo">
      <div class="actor-details">
        <p><strong>Date de naissance:</strong> {{ actor.birthDate }}</p>
        <p><strong>Nationalité:</strong> {{ actor.nationality }}</p>
        <p><strong>Biographie:</strong> {{ actor.biography }}</p>
      </div>
    </div>
    <h2>Filmographie</h2>
    <div class="movie-grid">
      <MovieCard v-for="movie in actor.movies" :key="movie.id" :movie="movie" />
    </div>
    <button @click="showEditForm = true">Modifier l'acteur</button>
    <button @click="confirmDelete">Supprimer l'acteur</button>
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
  padding: 20px;
}

.actor-info {
  display: flex;
  margin-bottom: 20px;
}

.actor-photo {
  width: 300px;
  height: auto;
  margin-right: 20px;
}

.actor-details {
  flex-grow: 1;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
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