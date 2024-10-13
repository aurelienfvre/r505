<template>
  <div class="categories-view">
    <h1>Catégories</h1>
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Rechercher une catégorie" @input="searchCategories">
    </div>
    <button @click="showAddCategoryForm = true" class="add-button">Ajouter une catégorie</button>
    <div class="category-list">
      <div v-for="category in paginatedCategories" :key="category.id" class="category-item">
        <h3>{{ category.name }}</h3>
        <button @click="editCategory(category)">Modifier</button>
        <button @click="deleteCategory(category)" :disabled="category.movies.length > 0">Supprimer</button>
      </div>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
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
  padding: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.add-button {
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.category-list {
  display: grid;
  gap: 20px;
}

.category-item {
  background-color: var(--secondary-color);
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
}
</style>