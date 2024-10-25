<template>
  <div class="actors-view">
    <div class="container">
      <div class="page-header">
        <h1>Acteurs</h1>
        <div class="actions">
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Rechercher un acteur..."
            />
          </div>
          <button @click="showAddActorForm = true" class="btn-add">
            <i class="fas fa-plus"></i> Ajouter un acteur
          </button>
        </div>
      </div>

      <div class="actors-filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="['filter-btn', { active: currentFilter === filter.value }]"
          @click="handleFilterChange(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>

      <div v-if="success" class="success-message">
        <i class="fas fa-check-circle"></i>
        {{ success }}
      </div>

      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        {{ error }}
      </div>

      <div class="actors-container">
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          Chargement des acteurs... ({{ actors.length }} acteurs chargés)
        </div>

        <div v-else-if="actors.length === 0" class="no-actors">
          <i class="fas fa-user-slash"></i>
          <p>Aucun acteur n'a été ajouté pour le moment</p>
        </div>

        <div v-else class="actors-content">
          <div v-if="paginatedActors.length > 0" class="actors-grid">
            <ActorCard
              v-for="actor in paginatedActors"
              :key="actor['@id']"
              :actor="actor"
              @click="viewActorDetails(actor)"
            />
          </div>

          <div
            v-if="filteredActors.length === 0 && searchQuery"
            class="no-results"
          >
            <i class="fas fa-search"></i>
            <p>
              Aucun acteur ne correspond à votre recherche "{{ searchQuery }}"
            </p>
          </div>

          <div class="results-info">
            Total : {{ filteredActors.length }} acteurs
          </div>

          <div v-if="totalPages > 1" class="pagination">
            <button
              @click="changePage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="pagination-btn"
            >
              <i class="fas fa-chevron-left"></i> Précédent
            </button>
            <div class="pagination-numbers">
              <button
                v-for="page in displayedPages"
                :key="page"
                :class="['page-number', { active: currentPage === page }]"
                @click="changePage(page)"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="changePage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
            >
              Suivant <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <AddActorForm
      v-if="showAddActorForm"
      @close="closeAddActorForm"
      @add-actor="addActor"
    />
  </div>
</template>

<script>
import ActorCard from "@/components/ActorCard.vue";
import AddActorForm from "@/components/AddActorForm.vue";
import ActorService from "@/services/actor.service";
import { debounce } from "lodash";

export default {
  name: "ActorsView",
  components: {
    ActorCard,
    AddActorForm,
  },
  data() {
    return {
      actors: [],
      loading: true,
      error: null,
      success: null,
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 100, // Augmenté pour montrer plus d'acteurs
      showAddActorForm: false,
      currentFilter: "all",
      filters: [
        { label: "Tous", value: "all" },
        { label: "Les plus récompensés", value: "awards" },
        { label: "Les plus actifs", value: "active" },
      ],
    };
  },
  computed: {
    filteredActors() {
      let filtered = [...this.actors];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (actor) =>
            actor.firstname?.toLowerCase().includes(query) ||
            actor.lastname?.toLowerCase().includes(query) ||
            actor.nationality?.toLowerCase().includes(query)
        );
      }

      switch (this.currentFilter) {
        case "all":
          filtered.sort((a, b) => {
            const idA = parseInt(a["@id"]?.split("/").pop() || "0");
            const idB = parseInt(b["@id"]?.split("/").pop() || "0");
            return idB - idA;
          });
          break;
        case "awards":
          filtered.sort((a, b) => (b.awards || 0) - (a.awards || 0));
          break;
        case "active":
          filtered.sort(
            (a, b) => (b.movies?.length || 0) - (a.movies?.length || 0)
          );
          break;
      }

      return filtered;
    },
    paginatedActors() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredActors.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredActors.length / this.itemsPerPage);
    },
    displayedPages() {
      let pages = [];
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);

        if (currentPage > 3) {
          pages.push("...");
        }

        for (
          let i = Math.max(2, currentPage - 1);
          i <= Math.min(totalPages - 1, currentPage + 1);
          i++
        ) {
          pages.push(i);
        }

        if (currentPage < totalPages - 2) {
          pages.push("...");
        }

        pages.push(totalPages);
      }

      return pages;
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
  },
  async created() {
    this.filterActors = debounce(this.handleFilterActors, 300);
    await this.loadActors();
  },
  methods: {
    async loadActors() {
      try {
        this.loading = true;
        this.error = null;
        const allActors = await ActorService.getAllActors();
        console.log("Loaded actors:", allActors.length);
        this.actors = allActors;
      } catch (error) {
        console.error("Error loading actors:", error);
        this.error = "Erreur lors du chargement des acteurs";
      } finally {
        this.loading = false;
      }
    },
    handleFilterActors() {
      this.currentPage = 1;
    },
    handleFilterChange(filter) {
      this.currentFilter = filter;
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    async addActor(actorData) {
      try {
        this.loading = true;
        this.error = null;

        await ActorService.createActor(actorData);
        await this.loadActors();

        this.showAddActorForm = false;
        this.showSuccess("Acteur ajouté avec succès");

        this.currentFilter = "all";
        this.currentPage = 1;
      } catch (error) {
        console.error("Erreur lors de l'ajout de l'acteur:", error);
        this.error =
          "Erreur lors de l'ajout de l'acteur: " +
          (error.response?.data?.["hydra:description"] ||
            error.response?.data?.detail ||
            error.message);
      } finally {
        this.loading = false;
      }
    },
    closeAddActorForm() {
      this.showAddActorForm = false;
      this.error = null;
    },
    showSuccess(message) {
      this.success = message;
      setTimeout(() => {
        this.success = null;
      }, 3000);
    },
    viewActorDetails(actor) {
      const actorId = actor["@id"].split("/").pop();
      this.$router.push(`/actors/${actorId}`);
    },
  },
};
</script>

<style scoped>
.actors-view {
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
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
  border: 1px solid var(--accent-color);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--accent-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-add:hover {
  background: var(--accent-color);
  color: white;
}

.actors-filters {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1rem;
}

.filter-btn {
  background: none;
  border: none;
  padding: 0.5rem 0;
  color: var(--text-color);
  cursor: pointer;
  position: relative;
  font-size: 1rem;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  opacity: 1;
}

.filter-btn.active {
  opacity: 1;
  color: var(--accent-color);
}

.filter-btn.active::after {
  content: "";
  position: absolute;
  bottom: -1rem;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--accent-color);
}

.actors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.no-results {
  text-align: center;
  padding: 4rem;
  color: var(--text-color);
  font-size: 1.1rem;
}

.loading,
.error {
  text-align: center;
  padding: 4rem;
  color: var(--text-color);
}

.error {
  color: #ef4444;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: var(--text-color);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .actions {
    flex-direction: column;
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .btn-add {
    width: 100%;
  }

  .actors-filters {
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .filter-btn {
    white-space: nowrap;
  }
}

@media (max-width: 480px) {
  .actors-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }

  .actors-filters {
    justify-content: space-between;
  }
}
</style>
