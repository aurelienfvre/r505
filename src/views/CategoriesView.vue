<template>
  <div class="categories-view">
    <div class="container">
      <h1>Catégories</h1>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Rechercher une catégorie" @input="searchCategories">
        <button @click="showAddCategoryForm = true" class="btn-add">Ajouter une catégorie</button>
      </div>
      <div class="category-list">
        <div v-for="category in paginatedCategories" :key="category.id" class="category-item">
          <h3>{{ category.name }}</h3>
          <div class="category-actions">
            <button @click="editCategory(category)" class="btn-edit">Modifier</button>
            <button @click="deleteCategory(category)" :disabled="category.movies.length > 0" class="btn-delete">Supprimer</button>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1" class="btn-pagination">Précédent</button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">Suivant</button>
      </div>
    </div>
    <AddCategoryForm v-if="showAddCategoryForm" @close="showAddCategoryForm = false" @add-category="addCategory" />
    <EditCategoryForm v-if="editingCategory" :category="editingCategory" @close="editingCategory = null" @update-category="updateCategory" />
  </div>
</template>

<script>
import AddCategoryForm from '@/components/AddCategoryForm.vue'
import EditCategoryForm from '@/components/EditCategoryForm.vue'

export default {
  name: 'CategoriesView',
  components: {
    AddCategoryForm,
    EditCategoryForm
  },
  data() {
    return {
      categories: [], // This should be populated from your API or store
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
      showAddCategoryForm: false,
      editingCategory: null
    }
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category =>
          category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredCategories.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.itemsPerPage)
    }
  },
  methods: {
    searchCategories() {
      this.currentPage = 1 // Reset to first page when searching
    },
    previousPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    addCategory(category) {
      // This should add the category to your API or store
      this.categories.push(category)
      this.showAddCategoryForm = false
    },
    editCategory(category) {
      this.editingCategory = category
    },
    updateCategory(updatedCategory) {
      // This should update the category in your API or store
      const index = this.categories.findIndex(c => c.id === updatedCategory.id)
      if (index !== -1) {
        this.categories[index] = updatedCategory
      }
      this.editingCategory = null
    },
    deleteCategory(category) {
      if (category.movies.length === 0) {
        // This should delete the category from your API or store
        const index = this.categories.findIndex(c => c.id === category.id)
        if (index !== -1) {
          this.categories.splice(index, 1)
        }
      }
    }
  }
}
</script>

<style scoped>
.categories-view {
  padding: 2rem 0;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.search-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-bar input {
  flex-grow: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
}

.btn-add {
  padding: 0.5rem 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-add:hover {
  opacity: 0.9;
}

.category-list {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.25rem 0.5rem;
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

.btn-edit:hover, .btn-delete:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-pagination:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .category-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .category-actions {
    margin-top: 1rem;
  }
}
</style>