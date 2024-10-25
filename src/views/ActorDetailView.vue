<template>
  <div class="actor-detail-view">
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement...
    </div>

    <div v-if="success" class="success-message">
      <i class="fas fa-check-circle"></i>
      {{ success }}
    </div>

    <div v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </div>

    <div v-if="actor" class="container">
      <div class="actor-header">
        <div class="title-section">
          <h1>{{ actor.firstname }} {{ actor.lastname }}</h1>
          <div class="actor-actions">
            <button @click="showEditForm = true" class="btn-edit">
              <i class="fas fa-edit"></i> Modifier
            </button>
            <button @click="confirmDelete" class="btn-delete">
              <i class="fas fa-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>

      <div class="actor-content">
        <div class="actor-main">
          <img
            :src="actor.media || 'https://via.placeholder.com/300x300'"
            :alt="`${actor.firstname} ${actor.lastname}`"
            class="actor-photo"
          />
          <div class="actor-info">
            <div class="info-item">
              <strong>Date de naissance:</strong>
              <span>{{ formatDate(actor.dob) }}</span>
            </div>

            <div class="info-item" v-if="actor.nationality">
              <strong>Nationalité:</strong>
              <span>{{ actor.nationality }}</span>
            </div>

            <div class="info-item" v-if="actor.gender">
              <strong>Genre:</strong>
              <span>{{ formatGender(actor.gender) }}</span>
            </div>

            <div class="info-item" v-if="actor.awards !== null">
              <strong>Récompenses:</strong>
              <span>{{ actor.awards }}</span>
            </div>

            <div class="info-item" v-if="actor.deathDate">
              <strong>Date de décès:</strong>
              <span>{{ formatDate(actor.deathDate) }}</span>
            </div>
          </div>
        </div>

        <div class="actor-biography" v-if="actor.bio">
          <h2>Biographie</h2>
          <p>{{ actor.bio }}</p>
        </div>

        <div class="filmography" v-if="actor.movies && actor.movies.length">
          <h2>Filmographie</h2>
          <div class="movies-grid">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div
      v-if="showDeleteModal"
      class="modal-backdrop"
      @click.self="showDeleteModal = false"
    >
      <div class="modal-content delete-modal">
        <h2>Confirmer la suppression</h2>
        <p>
          Êtes-vous sûr de vouloir supprimer l'acteur "{{ actor?.firstname }}
          {{ actor?.lastname }}" ?
        </p>
        <div class="modal-actions">
          <button @click="deleteActor" class="btn-confirm-delete">
            <i class="fas fa-trash"></i> Supprimer
          </button>
          <button @click="showDeleteModal = false" class="btn-cancel">
            <i class="fas fa-times"></i> Annuler
          </button>
        </div>
      </div>
    </div>

    <EditActorForm
      v-if="showEditForm"
      :actor="actor"
      @close="closeEditForm"
      @update-actor="updateActor"
    />
  </div>
</template>

<script>
import MovieCard from "@/components/MovieCard.vue";
import EditActorForm from "@/components/EditActorForm.vue";
import ActorService from "@/services/actor.service";
import MovieService from "@/services/movie.service";

export default {
  name: "ActorDetailView",
  components: {
    MovieCard,
    EditActorForm,
  },
  data() {
    return {
      actor: null,
      movies: [],
      showEditForm: false,
      showDeleteModal: false,
      loading: true,
      error: null,
      success: null,
    };
  },
  async created() {
    await this.fetchActorDetails();
  },
  methods: {
    async fetchActorDetails() {
      try {
        this.loading = true;
        this.error = null;
        const actorData = await ActorService.getActor(this.$route.params.id);
        console.log("Fetched actor data:", actorData);
        this.actor = actorData;

        if (actorData.movies && actorData.movies.length) {
          const moviePromises = actorData.movies.map(async (movieUrl) => {
            if (typeof movieUrl !== "string") return null;

            const movieId = movieUrl.split("/").pop();
            try {
              return await MovieService.getMovie(movieId);
            } catch (error) {
              console.error(`Error fetching movie ${movieId}:`, error);
              return null;
            }
          });
          const moviesData = await Promise.all(moviePromises);
          this.movies = moviesData.filter((movie) => movie !== null);
        }
      } catch (error) {
        console.error("Error fetching actor details:", error);
        this.error = "Erreur lors du chargement des données de l'acteur";
      } finally {
        this.loading = false;
      }
    },
    async updateActor(actorData) {
      try {
        this.loading = true;
        this.error = null;
        console.log("Updating actor with data:", actorData);
        await ActorService.updateActor(
          this.actor["@id"].split("/").pop(),
          actorData
        );
        await this.fetchActorDetails();
        this.showEditForm = false;
        this.showSuccess("Acteur mis à jour avec succès");
      } catch (error) {
        console.error("Error updating actor:", error);
        this.error = "Erreur lors de la mise à jour de l'acteur";
      } finally {
        this.loading = false;
      }
    },
    confirmDelete() {
      this.showDeleteModal = true;
    },
    async deleteActor() {
      try {
        this.loading = true;
        await ActorService.deleteActor(this.actor["@id"].split("/").pop());
        this.$router.push({ name: "Actors" });
      } catch (error) {
        console.error("Error deleting actor:", error);
        this.error = "Erreur lors de la suppression de l'acteur";
      } finally {
        this.loading = false;
        this.showDeleteModal = false;
      }
    },
    closeEditForm() {
      this.showEditForm = false;
      this.error = null;
    },
    showSuccess(message) {
      this.success = message;
      setTimeout(() => {
        this.success = null;
      }, 3000);
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    formatGender(gender) {
      const genders = {
        male: "Homme",
        female: "Femme",
        other: "Autre",
      };
      return genders[gender] || gender;
    },
  },
};
</script>

<style scoped>
.actor-detail-view {
  padding: 2rem 0;
  min-height: 100vh;
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading,
.error-message,
.success-message {
  text-align: center;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 1200px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading {
  color: var(--text-color);
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
}

.success-message {
  background-color: #dcfce7;
  color: #059669;
}

.actor-header {
  margin-bottom: 2rem;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

h1 {
  margin: 0;
  font-size: 2.5rem;
  color: var(--text-color);
  line-height: 1.2;
}

.actor-actions {
  display: flex;
  gap: 1rem;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
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
  flex-direction: column;
  gap: 2rem;
}

.actor-main {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.actor-photo {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  aspect-ratio: 1;
  object-fit: cover;
}

.actor-info {
  color: var(--text-color);
}

.info-item {
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

.info-item strong {
  min-width: 150px;
  font-weight: 500;
}

h2 {
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
  color: var(--text-color);
}

.actor-biography {
  line-height: 1.6;
  color: var(--text-color);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.delete-modal {
  background-color: var(--background-color);
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.modal-content {
  color: var(--text-color);
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-confirm-delete,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.btn-confirm-delete {
  background-color: #ef4444;
  color: white;
}

.btn-cancel {
  background-color: #9ca3af;
  color: white;
}

.btn-confirm-delete:hover,
.btn-cancel:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .actor-main {
    grid-template-columns: 1fr;
  }

  .actor-photo {
    max-width: 300px;
    margin: 0 auto;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .title-section {
    flex-direction: column;
    gap: 1rem;
  }

  h1 {
    font-size: 2rem;
  }

  .actor-actions {
    width: 100%;
  }

  .btn-edit,
  .btn-delete {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .actor-actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    width: 100%;
  }

  .modal-content {
    margin: 0 1rem;
  }

  .info-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .info-item strong {
    min-width: auto;
  }
}
</style>
