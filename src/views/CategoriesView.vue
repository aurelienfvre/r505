<template>
  <div class="categories-view">
    <div class="container">
      <div class="page-header">
        <h1>Catégories</h1>
        <div class="actions">
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Rechercher une catégorie..."
            />
          </div>
          <button @click="showAddForm = true" class="btn-add">
            <i class="fas fa-plus"></i> Ajouter une catégorie
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        Chargement...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else class="categories-list">
        <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="category-item"
        >
          <div class="category-content">
            <div class="category-info">
              <h3>{{ category.title }}</h3>
              <p class="movies-count" v-if="category.movies">
                {{ category.movies.length }} film(s) associé(s)
              </p>
            </div>
            <div class="category-actions">
              <button @click="editCategory(category)" class="btn-edit">
                <i class="fas fa-edit"></i> Modifier
              </button>
              <button
                @click="confirmDelete(category)"
                class="btn-delete"
                :disabled="category.movies && category.movies.length > 0"
              >
                <i class="fas fa-trash"></i> Supprimer
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredCategories.length === 0" class="no-results">
          Aucune catégorie trouvée
        </div>
      </div>
    </div>

    <!-- Modal d'ajout -->
    <div
      v-if="showAddForm"
      class="modal-backdrop"
      @click.self="showAddForm = false"
    >
      <div class="modal-content">
        <h2>Ajouter une nouvelle catégorie</h2>
        <form @submit.prevent="createCategory">
          <div class="form-group">
            <label for="title">Titre</label>
            <input
              id="title"
              v-model="newCategory.title"
              type="text"
              required
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Ajouter</button>
            <button
              type="button"
              @click="showAddForm = false"
              class="btn-cancel"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal d'édition -->
    <div
      v-if="showEditForm"
      class="modal-backdrop"
      @click.self="showEditForm = false"
    >
      <div class="modal-content">
        <h2>Modifier la catégorie</h2>
        <form @submit.prevent="updateCategory">
          <div class="form-group">
            <label for="edit-title">Titre</label>
            <input
              id="edit-title"
              v-model="editedCategory.title"
              type="text"
              required
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit">Mettre à jour</button>
            <button
              type="button"
              @click="showEditForm = false"
              class="btn-cancel"
            >
              Annuler
            </button>
          </div>
        </form>
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
          Êtes-vous sûr de vouloir supprimer la catégorie "{{
            categoryToDelete?.title
          }}" ?
        </p>
        <div class="modal-actions">
          <button @click="deleteCategory" class="btn-confirm-delete">
            Supprimer
          </button>
          <button @click="showDeleteModal = false" class="btn-cancel">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryService from "@/services/category.service";

export default {
  name: "CategoriesView",
  data() {
    return {
      categories: [],
      loading: true,
      error: null,
      searchQuery: "",
      showAddForm: false,
      showEditForm: false,
      showDeleteModal: false,
      newCategory: {
        title: "",
      },
      editedCategory: {
        id: null,
        title: "",
      },
      categoryToDelete: null,
    };
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery) return this.categories;
      const query = this.searchQuery.toLowerCase();
      return this.categories.filter((category) =>
        category.title.toLowerCase().includes(query)
      );
    },
  },
  async created() {
    await this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        this.loading = true;
        this.categories = await CategoryService.getAllCategories();
      } catch (error) {
        this.error = "Erreur lors du chargement des catégories";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async createCategory() {
      try {
        await CategoryService.createCategory(this.newCategory);
        await this.fetchCategories();
        this.newCategory.title = "";
        this.showAddForm = false;
      } catch (error) {
        this.error = "Erreur lors de la création de la catégorie";
        console.error(error);
      }
    },
    editCategory(category) {
      this.editedCategory = {
        id: category.id,
        title: category.title,
      };
      this.showEditForm = true;
    },
    async updateCategory() {
      try {
        await CategoryService.updateCategory(
          this.editedCategory.id,
          this.editedCategory
        );
        await this.fetchCategories();
        this.showEditForm = false;
      } catch (error) {
        this.error = "Erreur lors de la mise à jour de la catégorie";
        console.error(error);
      }
    },
    confirmDelete(category) {
      if (category.movies && category.movies.length > 0) return;
      this.categoryToDelete = category;
      this.showDeleteModal = true;
    },
    async deleteCategory() {
      try {
        await CategoryService.deleteCategory(this.categoryToDelete.id);
        await this.fetchCategories();
        this.showDeleteModal = false;
        this.categoryToDelete = null;
      } catch (error) {
        this.error = "Erreur lors de la suppression de la catégorie";
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.categories-view {
  padding: 2rem 0;
  min-height: 100vh;
  background-color: var(--background-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  margin: 0;
  color: var(--text-color);
}

.actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-bar {
  position: relative;
}

.search-input {
  width: 300px;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--background-color);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.btn-add {
  padding: 0.75rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s ease;
}

.btn-add:hover {
  opacity: 0.9;
}

.loading,
.error,
.no-results {
  text-align: center;
  padding: 4rem;
  color: var(--text-color);
}

.error {
  color: #ef4444;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.category-content {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.movies-count {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.7;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
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

.btn-delete:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-edit:hover,
.btn-delete:hover:not(:disabled) {
  opacity: 0.9;
}

/* Modal styles */
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
  max-width: 500px;
}

.delete-modal {
  max-width: 400px;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--background-color);
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-submit,
.btn-cancel,
.btn-confirm-delete {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.3s ease;
}

.btn-submit {
  background-color: var(--accent-color);
  color: white;
}

.btn-cancel {
  background-color: #9ca3af;
  color: white;
}

.btn-confirm-delete {
  background-color: #ef4444;
  color: white;
}

.btn-submit:hover,
.btn-cancel:hover,
.btn-confirm-delete:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .actions {
    width: 100%;
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .btn-add {
    width: 100%;
    justify-content: center;
  }

  .category-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .category-actions {
    width: 100%;
    justify-content: center;
  }

  .btn-edit,
  .btn-delete {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-content {
    margin: 0 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel,
  .btn-confirm-delete {
    width: 100%;
  }

  .category-actions {
    flex-direction: column;
  }

  .btn-edit,
  .btn-delete {
    width: 100%;
  }
}
</style>
