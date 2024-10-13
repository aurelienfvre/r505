<template>
  <div class="actors-view">
    <h1>Acteurs</h1>
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="Rechercher un acteur" @input="searchActors">
    </div>
    <button @click="showAddActorForm = true" class="add-button">Ajouter un acteur</button>
    <div class="actor-grid">
      <ActorCard v-for="actor in paginatedActors" :key="actor.id" :actor="actor" />
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1">Précédent</button>
      <span>Page {{ currentPage }} sur {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
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

.actor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
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