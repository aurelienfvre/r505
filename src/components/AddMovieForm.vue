```vue
<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Ajouter un nouveau film</h2>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <form @submit.prevent="submitForm" class="form">
        <div class="form-group">
          <label for="title">Titre</label>
          <input
            id="title"
            v-model="movie.title"
            type="text"
            required
            placeholder="Titre du film"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="releaseDate">Date de sortie</label>
            <input
              id="releaseDate"
              v-model="movie.releaseDate"
              type="date"
              required
            />
          </div>

          <div class="form-group">
            <label for="duration">Durée (minutes)</label>
            <input
              id="duration"
              v-model="movie.duration"
              type="number"
              min="1"
              required
              placeholder="Ex: 120"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="director">Réalisateur</label>
          <input
            id="director"
            v-model="movie.director"
            type="text"
            required
            placeholder="Nom du réalisateur"
          />
        </div>

        <div class="form-group">
          <label for="description">Synopsis</label>
          <textarea
            id="description"
            v-model="movie.description"
            required
            rows="4"
            placeholder="Description du film"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="media">Image du film (URL)</label>
          <input
            id="media"
            v-model="movie.media"
            type="url"
            placeholder="https://exemple.com/image.jpg"
          />
        </div>

        <div class="form-group">
          <label for="trailer">Bande-annonce (URL)</label>
          <input
            id="trailer"
            v-model="movie.trailer"
            type="url"
            placeholder="https://exemple.com/trailer"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="budget">Budget</label>
            <input
              id="budget"
              v-model="movie.budget"
              type="number"
              min="0"
              placeholder="Budget en euros"
            />
          </div>

          <div class="form-group">
            <label for="boxOffice">Box Office</label>
            <input
              id="boxOffice"
              v-model="movie.boxOffice"
              type="number"
              min="0"
              placeholder="Recettes en euros"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="rating">Note</label>
          <input
            id="rating"
            v-model="movie.rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="Note sur 5"
          />
        </div>

        <div class="form-group">
          <label>Acteurs</label>
          <div class="search-actors">
            <input
              type="text"
              v-model="actorSearch"
              placeholder="Rechercher un acteur..."
              @input="searchActors"
            />
          </div>
          <div class="actors-grid" v-if="filteredActors.length">
            <div
              v-for="actor in filteredActors"
              :key="actor.id"
              class="actor-checkbox"
            >
              <input
                type="checkbox"
                :id="'actor-' + actor.id"
                :value="actor['@id']"
                v-model="movie.actors"
              />
              <label :for="'actor-' + actor.id">
                {{ actor.firstname }} {{ actor.lastname }}
              </label>
            </div>
          </div>
          <div class="selected-actors" v-if="movie.actors.length">
            <h4>Acteurs sélectionnés:</h4>
            <div class="selected-actors-list">
              <div
                v-for="actorUrl in movie.actors"
                :key="actorUrl"
                class="selected-actor"
              >
                {{ getActorName(actorUrl) }}
                <button
                  type="button"
                  @click="removeActor(actorUrl)"
                  class="btn-remove-actor"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>Catégories</label>
          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-checkbox"
            >
              <input
                type="checkbox"
                :id="'category-' + category.id"
                :value="category['@id']"
                v-model="movie.categories"
              />
              <label :for="'category-' + category.id">{{
                category.title
              }}</label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            <i class="fas fa-times"></i> Annuler
          </button>
          <button type="submit" class="btn-submit">
            <i class="fas fa-check"></i> Ajouter le film
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import CategoryService from "@/services/category.service";
import ActorService from "@/services/actor.service";
import { debounce } from "lodash";

export default {
  name: "AddMovieForm",
  data() {
    return {
      movie: {
        title: "",
        releaseDate: "",
        director: "",
        description: "",
        media: "",
        trailer: "",
        duration: null,
        rating: null,
        budget: null,
        boxOffice: null,
        categories: [],
        actors: [],
      },
      categories: [],
      actors: [],
      filteredActors: [],
      actorSearch: "",
      error: null,
    };
  },
  created() {
    this.loadCategories();
    this.loadActors();
    this.searchActors = debounce(this.performActorSearch, 300);
  },
  methods: {
    async loadCategories() {
      try {
        this.categories = await CategoryService.getAllCategories();
      } catch (error) {
        console.error("Error loading categories:", error);
        this.error = "Erreur lors du chargement des catégories";
      }
    },
    async loadActors() {
      try {
        this.actors = await ActorService.getAllActors();
        this.filteredActors = this.actors;
      } catch (error) {
        console.error("Error loading actors:", error);
        this.error = "Erreur lors du chargement des acteurs";
      }
    },
    performActorSearch() {
      if (!this.actorSearch.trim()) {
        this.filteredActors = this.actors;
        return;
      }

      const search = this.actorSearch.toLowerCase();
      this.filteredActors = this.actors.filter((actor) => {
        const fullName = `${actor.firstname} ${actor.lastname}`.toLowerCase();
        return fullName.includes(search);
      });
    },
    removeActor(actorUrl) {
      this.movie.actors = this.movie.actors.filter((url) => url !== actorUrl);
    },
    getActorName(actorUrl) {
      const actor = this.actors.find((a) => a["@id"] === actorUrl);
      return actor ? `${actor.firstname} ${actor.lastname}` : "Acteur inconnu";
    },
    async submitForm() {
      try {
        const movieData = {
          title: this.movie.title,
          releaseDate: this.movie.releaseDate,
          director: this.movie.director,
          description: this.movie.description,
          media: this.movie.media,
          rating: this.movie.rating ? parseFloat(this.movie.rating) : null,
          duration: this.movie.duration ? parseInt(this.movie.duration) : null,
          trailer: this.movie.trailer || null,
          budget: this.movie.budget ? parseInt(this.movie.budget) : null,
          boxOffice: this.movie.boxOffice
            ? parseInt(this.movie.boxOffice)
            : null,
          // S'assurer que les acteurs et catégories sont au bon format
          actors: this.movie.actors.map((id) =>
            id.startsWith("/api/") ? id : `/api/actors/${id}`
          ),
          categories: this.movie.categories.map((id) =>
            id.startsWith("/api/") ? id : `/api/categories/${id}`
          ),
          createdAt: new Date().toISOString(),
        };

        this.$emit("add-movie", movieData);
      } catch (error) {
        console.error("Error in form submission:", error);
        this.error =
          "Erreur lors de la soumission du formulaire: " + error.message;
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
  color: #ef4444;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

input,
textarea {
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
textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.search-actors {
  margin-bottom: 1rem;
}

.actors-grid,
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.actor-checkbox,
.category-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.actor-checkbox:hover,
.category-checkbox:hover {
  background-color: var(--hover-color);
}

.actor-checkbox input[type="checkbox"],
.category-checkbox input[type="checkbox"] {
  width: auto;
}

.selected-actors {
  margin-top: 1rem;
}

h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-color);
}

.selected-actors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-actor {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--accent-color);
  color: white;
  border-radius: 0.25rem;
  font-size: 0.9rem;
}

.btn-remove-actor {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

@media (max-width: 640px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .actors-grid,
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
    justify-content: center;
  }
}
</style>
