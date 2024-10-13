<template>
  <div class="actors-view">
    <div class="container">
      <h1>Acteurs</h1>
      <div class="search-bar">
        <input v-model="searchQuery" placeholder="Rechercher un acteur" @input="searchActors">
        <button @click="showAddActorForm = true" class="btn-add">Ajouter un acteur</button>
      </div>
      <div class="actor-grid">
        <ActorCard v-for="actor in paginatedActors" :key="actor.id" :actor="actor" />
      </div>
      <div class="pagination">
        <button @click="previousPage" :disabled="currentPage === 1" class="btn-pagination">Précédent</button>
        <span>Page {{ currentPage }} sur {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn-pagination">Suivant</button>
      </div>
    </div>
    <AddActorForm v-if="showAddActorForm" @close="showAddActorForm = false" @add-actor="addActor" />
  </div>
</template>

<script>
import ActorCard from '@/components/ActorCard.vue'
import AddActorForm from '@/components/AddActorForm.vue'

export default {
  name: 'ActorsView',
  components: {
    ActorCard,
    AddActorForm
  },
  data() {
    return {
      actors: [], // This should be populated from your API or store
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 12,
      showAddActorForm: false
    }
  },
  computed: {
    filteredActors() {
      return this.actors.filter(actor =>
          actor.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    paginatedActors() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredActors.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredActors.length / this.itemsPerPage)
    }
  },
  methods: {
    searchActors() {
      this.currentPage = 1 // Reset to first page when searching
    },
    previousPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    addActor(actor) {
      // This should add the actor to your API or store
      this.actors.push(actor)
      this.showAddActorForm = false
    }
  }
}
</script>

<style scoped>
.actors-view {
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

.actor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
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

  .actor-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>