<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Modifier le film</h2>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i> {{ error }}
      </div>

      <form @submit.prevent="submitForm" class="edit-form">
        <div class="form-row">
          <div class="form-group">
            <label for="title">Titre <span class="required">*</span></label>
            <input
              id="title"
              v-model="editedMovie.title"
              type="text"
              required
              placeholder="Titre du film"
            />
          </div>

          <div class="form-group">
            <label for="director"
              >Réalisateur <span class="required">*</span></label
            >
            <input
              id="director"
              v-model="editedMovie.director"
              type="text"
              required
              placeholder="Nom du réalisateur"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="description">Synopsis</label>
          <textarea
            id="description"
            v-model="editedMovie.description"
            rows="4"
            placeholder="Description du film"
          ></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="releaseDate">Date de sortie</label>
            <input
              id="releaseDate"
              v-model="editedMovie.releaseDate"
              type="date"
            />
          </div>

          <div class="form-group">
            <label for="duration">Durée (minutes)</label>
            <input
              id="duration"
              v-model="editedMovie.duration"
              type="number"
              min="1"
              placeholder="Ex: 120"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="rating">Note</label>
            <input
              id="rating"
              v-model="editedMovie.rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="Note sur 5"
            />
          </div>

          <div class="form-group">
            <label for="entries">Nombre d'entrées</label>
            <input
              id="entries"
              v-model="editedMovie.entries"
              type="number"
              min="0"
              placeholder="Nombre d'entrées"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="budget">Budget</label>
            <input
              id="budget"
              v-model="editedMovie.budget"
              type="number"
              min="0"
              placeholder="Budget en euros"
            />
          </div>

          <div class="form-group">
            <label for="boxOffice">Box Office</label>
            <input
              id="boxOffice"
              v-model="editedMovie.boxOffice"
              type="number"
              min="0"
              placeholder="Recettes en euros"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="media">Image du film (URL)</label>
          <input
            id="media"
            v-model="editedMovie.media"
            type="url"
            placeholder="https://exemple.com/image.jpg"
          />
        </div>

        <div class="form-group">
          <label for="trailer">Bande-annonce (URL)</label>
          <input
            id="trailer"
            v-model="editedMovie.trailer"
            type="url"
            placeholder="https://exemple.com/trailer"
          />
        </div>

        <div class="form-group">
          <label>Acteurs</label>
          <div class="search-actors">
            <div class="search-box">
              <input
                type="text"
                v-model="actorSearch"
                placeholder="Rechercher un acteur..."
                @input="searchActors"
              />
            </div>
            <div v-if="filteredActors.length" class="actors-list">
              <div
                v-for="actor in filteredActors"
                :key="actor['@id']"
                class="actor-item"
              >
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    :value="actor['@id']"
                    v-model="editedMovie.actors"
                  />
                  {{ actor.firstname }} {{ actor.lastname }}
                </label>
              </div>
            </div>
          </div>
          <div class="selected-actors" v-if="editedMovie.actors.length">
            <div
              v-for="actorId in editedMovie.actors"
              :key="actorId"
              class="selected-actor"
            >
              {{ getActorName(actorId) }}
              <button
                type="button"
                @click="removeActor(actorId)"
                class="btn-remove"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Catégories</label>
          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category['@id']"
              class="category-checkbox"
            >
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  :value="category['@id']"
                  v-model="editedMovie.categories"
                />
                {{ category.title }}
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            <i class="fas fa-times"></i> Annuler
          </button>
          <button type="submit" class="btn-submit">
            <i class="fas fa-save"></i> Sauvegarder
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { debounce } from "lodash";
import ActorService from "@/services/actor.service";
import CategoryService from "@/services/category.service";

export default {
  name: "EditMovieForm",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editedMovie: {
        title: this.movie.title || "",
        description: this.movie.description || "",
        director: this.movie.director || "",
        releaseDate: this.movie.releaseDate
          ? this.formatDateForInput(this.movie.releaseDate)
          : "",
        media: this.movie.media || "",
        entries: this.movie.entries || 0,
        rating: this.movie.rating || null,
        duration: this.movie.duration || null,
        trailer: this.movie.trailer || "",
        budget: this.movie.budget || null,
        boxOffice: this.movie.boxOffice || null,
        actors: this.movie.actors?.map((a) => a["@id"] || a) || [],
        categories: this.movie.categories?.map((c) => c["@id"] || c) || [],
      },
      actors: [],
      categories: [],
      actorSearch: "",
      error: null,
    };
  },
  computed: {
    filteredActors() {
      if (!this.actorSearch) return this.actors;
      const search = this.actorSearch.toLowerCase();
      return this.actors.filter(
        (actor) =>
          actor.firstname?.toLowerCase().includes(search) ||
          actor.lastname?.toLowerCase().includes(search)
      );
    },
  },
  async created() {
    this.searchActors = debounce(this.performActorSearch, 300);
    this.loadActors();
    this.loadCategories();
  },
  methods: {
    async loadActors() {
      try {
        this.actors = await ActorService.getAllActors();
      } catch (error) {
        console.error("Error loading actors:", error);
        this.error = "Erreur lors du chargement des acteurs";
      }
    },
    async loadCategories() {
      try {
        this.categories = await CategoryService.getAllCategories();
      } catch (error) {
        console.error("Error loading categories:", error);
        this.error = "Erreur lors du chargement des catégories";
      }
    },
    formatDateForInput(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toISOString().split("T")[0];
    },
    performActorSearch() {
      // La recherche est gérée par le computed filteredActors
    },
    getActorName(actorId) {
      const actor = this.actors.find((a) => a["@id"] === actorId);
      return actor ? `${actor.firstname} ${actor.lastname}` : "Acteur inconnu";
    },
    removeActor(actorId) {
      this.editedMovie.actors = this.editedMovie.actors.filter(
        (id) => id !== actorId
      );
    },
    validateForm() {
      if (!this.editedMovie.title?.trim()) {
        this.error = "Le titre est requis";
        return false;
      }
      if (!this.editedMovie.director?.trim()) {
        this.error = "Le réalisateur est requis";
        return false;
      }
      return true;
    },
    async submitForm() {
      try {
        if (!this.validateForm()) {
          return;
        }

        // Ne garder que les champs modifiés pour le PATCH
        const updatedFields = {};
        Object.keys(this.editedMovie).forEach((key) => {
          if (
            JSON.stringify(this.editedMovie[key]) !==
            JSON.stringify(this.movie[key])
          ) {
            updatedFields[key] = this.editedMovie[key];
          }
        });

        this.$emit("update-movie", updatedFields);
      } catch (error) {
        console.error("Error submitting form:", error);
        this.error = "Erreur lors de la mise à jour du film";
      }
    },
  },
};
</script>

<style scoped>
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

.modal-content {
  background-color: var(--background-color);
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: var(--border-color);
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--accent-color);
  border-radius: 4px;
}

h2 {
  margin-bottom: 2rem;
  text-align: center;
  color: var(--text-color);
  font-size: 1.5rem;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  margin: 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

.required {
  color: #dc2626;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--background-color);
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.search-actors {
  margin-bottom: 1rem;
}

.actors-list {
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.actor-item {
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
}

.actor-item:hover {
  background-color: var(--hover-color);
}

.selected-actors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.selected-actor {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.btn-remove {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.3s ease;
}

.checkbox-label:hover {
  background-color: var(--hover-color);
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.btn-submit,
.btn-cancel {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-submit {
  background-color: var(--accent-color);
  color: white;
}

.btn-cancel {
  background-color: #9ca3af;
  color: white;
}

.btn-submit:hover,
.btn-cancel:hover {
  opacity: 0.9;
}

.search-box {
  position: relative;
  margin-bottom: 0.5rem;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-color);
  opacity: 0.5;
}

@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
    width: calc(100% - 2rem);
    max-height: calc(100vh - 2rem);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }

  .selected-actors {
    flex-direction: column;
  }

  .selected-actor {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
