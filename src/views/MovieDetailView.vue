<template>
  <div class="movie-detail-view">
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="movie" class="movie-content">
      <div class="movie-header">
        <div class="poster-container">
          <img
            :src="movie.media || 'https://via.placeholder.com/300x450'"
            :alt="movie.title"
            class="movie-poster"
          />
        </div>

        <div class="movie-info">
          <div class="title-section">
            <h1>{{ movie.title }}</h1>
            <div class="movie-actions">
              <button @click="showEditForm = true" class="btn-edit">
                <i class="fas fa-edit"></i> Modifier
              </button>
              <button @click="confirmDelete" class="btn-delete">
                <i class="fas fa-trash"></i> Supprimer
              </button>
            </div>
          </div>

          <div class="movie-meta">
            <span v-if="movie.releaseDate">{{
              formatDate(movie.releaseDate)
            }}</span>
            <span class="separator" v-if="movie.releaseDate && movie.director"
              >•</span
            >
            <span v-if="movie.director" class="director">{{
              movie.director
            }}</span>
            <span class="separator" v-if="movie.duration">•</span>
            <span v-if="movie.duration" class="duration">{{
              formatDuration(movie.duration)
            }}</span>
          </div>

          <div class="rating-box" v-if="movie.rating">
            <div class="rating-stars">
              <span class="stars">
                {{ "★".repeat(Math.floor(movie.rating)) }}
                {{ movie.rating % 1 >= 0.5 ? "½" : "" }}
              </span>
            </div>
            <span class="rating-value">{{ movie.rating }}/5</span>
          </div>

          <div class="movie-description" v-if="movie.description">
            <h2>Synopsis</h2>
            <p>{{ movie.description }}</p>
          </div>

          <div
            class="categories-section"
            v-if="movie.categories && movie.categories.length"
          >
            <h2>Catégories</h2>
            <div class="categories-list">
              <span
                v-for="category in movie.categories"
                :key="category.id"
                class="category-tag"
              >
                {{ category.title }}
              </span>
            </div>
          </div>

          <div
            class="actors-section"
            v-if="movie.actors && movie.actors.length"
          >
            <h2>Distribution</h2>
            <div class="actors-grid">
              <router-link
                v-for="actor in movie.actors"
                :key="actor.id"
                :to="{ name: 'ActorDetail', params: { id: actor.id } }"
                class="actor-card"
              >
                <img
                  :src="actor.media || 'https://via.placeholder.com/150x150'"
                  :alt="`${actor.firstname} ${actor.lastname}`"
                  class="actor-image"
                />
                <div class="actor-info">
                  <h3>{{ actor.firstname }} {{ actor.lastname }}</h3>
                  <p v-if="actor.nationality" class="nationality">
                    {{ actor.nationality }}
                  </p>
                </div>
              </router-link>
            </div>
          </div>

          <div class="additional-info" v-if="movie.budget || movie.boxOffice">
            <h2>Informations techniques</h2>
            <div class="info-grid">
              <div class="info-item" v-if="movie.budget">
                <span class="info-label">Budget</span>
                <span class="info-value">{{ formatMoney(movie.budget) }}</span>
              </div>
              <div class="info-item" v-if="movie.boxOffice">
                <span class="info-label">Box Office</span>
                <span class="info-value">{{
                  formatMoney(movie.boxOffice)
                }}</span>
              </div>
              <div class="info-item" v-if="movie.createdAt">
                <span class="info-label">Ajouté le</span>
                <span class="info-value">{{
                  formatDate(movie.createdAt)
                }}</span>
              </div>
            </div>
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
        <p>Êtes-vous sûr de vouloir supprimer le film "{{ movie?.title }}" ?</p>
        <div class="modal-actions">
          <button @click="deleteMovie" class="btn-confirm-delete">
            Supprimer
          </button>
          <button @click="showDeleteModal = false" class="btn-cancel">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Formulaire d'édition -->
    <EditMovieForm
      v-if="showEditForm"
      :movie="movie"
      @close="showEditForm = false"
      @update-movie="updateMovie"
    />
  </div>
</template>

<script>
import MovieService from "@/services/movie.service";
import EditMovieForm from "@/components/EditMovieForm.vue";

export default {
  name: "MovieDetailView",
  components: {
    EditMovieForm,
  },
  data() {
    return {
      movie: null,
      loading: true,
      error: null,
      showEditForm: false,
      showDeleteModal: false,
    };
  },
  async created() {
    await this.fetchMovie();
  },
  methods: {
    async fetchMovie() {
      try {
        this.loading = true;
        this.error = null;
        const movie = await MovieService.getMovie(this.$route.params.id);
        console.log("Movie detail:", movie);
        this.movie = movie;
      } catch (error) {
        console.error("Error fetching movie:", error);
        this.error = error.message || "Erreur lors du chargement du film";
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatDuration(minutes) {
      if (!minutes) return "";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h${mins ? mins + "min" : ""}`;
    },
    formatMoney(amount) {
      if (!amount) return "";
      return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(amount);
    },
    confirmDelete() {
      this.showDeleteModal = true;
    },
    async deleteMovie() {
      try {
        await MovieService.deleteMovie(this.movie.id);
        this.$router.push({ name: "Movies" });
      } catch (error) {
        console.error("Error deleting movie:", error);
        this.error = "Erreur lors de la suppression du film";
      }
      this.showDeleteModal = false;
    },
    async updateMovie(updatedMovie) {
      try {
        await MovieService.updateMovie(this.movie.id, updatedMovie);
        await this.fetchMovie();
        this.showEditForm = false;
      } catch (error) {
        console.error("Error updating movie:", error);
        this.error = "Erreur lors de la mise à jour du film";
      }
    },
  },
};
</script>

<style scoped>
.movie-detail-view {
  padding: 2rem 0;
  min-height: 100vh;
  background-color: var(--background-color);
}

.movie-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.loading,
.error {
  text-align: center;
  padding: 4rem;
  font-size: 1.1rem;
  color: var(--text-color);
}

.error {
  color: #ef4444;
}

.movie-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
}

.title-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.movie-actions {
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

.poster-container {
  position: sticky;
  top: 2rem;
}

.movie-poster {
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
}

.movie-info {
  color: var(--text-color);
}

h1 {
  font-size: 2.5rem;
  margin: 0;
  line-height: 1.2;
}

h2 {
  font-size: 1.5rem;
  margin: 2rem 0 1rem 0;
}

.movie-meta {
  font-size: 1.1rem;
  opacity: 0.8;
  margin-bottom: 1rem;
}

.separator {
  margin: 0 0.5rem;
}

.rating-box {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.rating-stars {
  color: #ffd700;
  letter-spacing: 2px;
}

.movie-description {
  margin: 2rem 0;
  line-height: 1.6;
}

.actors-section,
.categories-section,
.additional-info {
  margin-top: 2rem;
}

.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.actor-card {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.actor-card:hover {
  transform: translateY(-5px);
}

.actor-image {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}

.actor-info {
  padding: 0.75rem;
}

.actor-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

.actor-info .nationality {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  opacity: 0.7;
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.category-tag {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 0.9rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-item {
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}

.info-label {
  display: block;
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1.1rem;
  font-weight: 500;
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

.delete-modal h2 {
  margin-top: 0;
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
  .movie-header {
    grid-template-columns: 1fr;
  }

  .poster-container {
    position: static;
    max-width: 300px;
    margin: 0 auto 2rem auto;
  }

  h1 {
    font-size: 2rem;
  }

  .movie-meta {
    font-size: 1rem;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .title-section {
    flex-direction: column;
    gap: 1rem;
  }

  .movie-actions {
    width: 100%;
    justify-content: stretch;
  }

  .btn-edit,
  .btn-delete {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .categories-list {
    gap: 0.5rem;
  }

  .category-tag {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  .modal-content {
    margin: 0 1rem;
  }

  .movie-actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    width: 100%;
  }
}
</style>
