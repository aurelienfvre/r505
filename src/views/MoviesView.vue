<template>
  <div class="movies-view">
    <div class="container">
      <div class="page-header">
        <h1>Films</h1>
        <div class="actions">
          <div class="search-bar">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Rechercher un film..."
              @input="filterMovies"
            />
          </div>
          <button @click="showAddMovieForm = true" class="btn-add">
            <i class="fas fa-plus"></i> Ajouter un film
          </button>
        </div>
      </div>

      <div class="movies-filters">
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

      <div class="movies-container">
        <div v-if="loading" class="loading">
          <i class="fas fa-spinner fa-spin"></i>
          Chargement des films... ({{ movies.length }} films chargés)
        </div>

        <div v-else-if="movies.length === 0" class="no-movies">
          <i class="fas fa-film"></i>
          <p>Aucun film n'a été ajouté pour le moment</p>
        </div>

        <div v-else class="movies-content">
          <div v-if="paginatedMovies.length > 0" class="movies-grid">
            <MovieCard
              v-for="movie in paginatedMovies"
              :key="movie['@id']"
              :movie="movie"
              @click="viewMovieDetails(movie)"
            />
          </div>

          <div
            v-if="filteredMovies.length === 0 && searchQuery"
            class="no-results"
          >
            <i class="fas fa-search"></i>
            <p>
              Aucun film ne correspond à votre recherche "{{ searchQuery }}"
            </p>
          </div>

          <div class="results-info">
            Total : {{ filteredMovies.length }} films
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

    <AddMovieForm
      v-if="showAddMovieForm"
      @close="closeAddMovieForm"
      @add-movie="addMovie"
    />
  </div>
</template>

<script>
import MovieCard from "@/components/MovieCard.vue";
import AddMovieForm from "@/components/AddMovieForm.vue";
import MovieService from "@/services/movie.service";
import { debounce } from "lodash";

export default {
  name: "MoviesView",
  components: {
    MovieCard,
    AddMovieForm,
  },
  data() {
    return {
      movies: [],
      loading: true,
      error: null,
      success: null,
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 100, // Augmenté pour montrer plus de films par page
      showAddMovieForm: false,
      currentFilter: "all",
      filters: [
        { label: "Tous", value: "all" },
        { label: "Récents", value: "recent" },
        { label: "Les mieux notés", value: "top-rated" },
      ],
    };
  },
  computed: {
    filteredMovies() {
      let filtered = [...this.movies];

      // Recherche
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (movie) =>
            movie.title?.toLowerCase().includes(query) ||
            movie.director?.toLowerCase().includes(query)
        );
      }

      // Tri selon le filtre actif
      switch (this.currentFilter) {
        case "all":
          filtered.sort((a, b) => {
            const idA = parseInt(a["@id"]?.split("/").pop() || "0");
            const idB = parseInt(b["@id"]?.split("/").pop() || "0");
            return idB - idA;
          });
          break;
        case "recent":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime()
          );
          break;
        case "top-rated":
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }

      return filtered;
    },
    paginatedMovies() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredMovies.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredMovies.length / this.itemsPerPage);
    },
    displayedPages() {
      let pages = [];
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;

      if (totalPages <= 7) {
        // Si moins de 7 pages, afficher toutes les pages
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Toujours afficher la première page
        pages.push(1);

        if (currentPage > 3) {
          pages.push("...");
        }

        // Afficher les pages autour de la page courante
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

        // Toujours afficher la dernière page
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
    this.filterMovies = debounce(this.handleFilterMovies, 300);
    await this.loadMovies();
  },
  methods: {
    async loadMovies() {
      try {
        this.loading = true;
        this.error = null;
        const allMovies = await MovieService.getAllMovies();
        console.log("Loaded movies:", allMovies.length);
        this.movies = allMovies;
      } catch (error) {
        console.error("Error loading movies:", error);
        this.error = "Erreur lors du chargement des films";
      } finally {
        this.loading = false;
      }
    },
    handleFilterMovies() {
      this.currentPage = 1;
    },
    handleFilterChange(filter) {
      this.currentFilter = filter;
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        // Scroll en haut de la page
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    async addMovie(movieData) {
      try {
        this.loading = true;
        this.error = null;

        await MovieService.createMovie(movieData);
        await this.loadMovies();

        this.showAddMovieForm = false;
        this.showSuccess("Film ajouté avec succès");

        // Retour à la première page et tri par récents
        this.currentFilter = "recent";
        this.currentPage = 1;
      } catch (error) {
        console.error("Erreur lors de l'ajout du film:", error);
        this.error =
          "Erreur lors de l'ajout du film: " +
          (error.response?.data?.["hydra:description"] ||
            error.response?.data?.detail ||
            error.message);
      } finally {
        this.loading = false;
      }
    },
    closeAddMovieForm() {
      this.showAddMovieForm = false;
      this.error = null;
    },
    showSuccess(message) {
      this.success = message;
      setTimeout(() => {
        this.success = null;
      }, 3000);
    },
    viewMovieDetails(movie) {
      const movieId = movie["@id"].split("/").pop();
      this.$router.push(`/movies/${movieId}`);
    },
  },
};
</script>

<style scoped>
.movies-view {
  padding: 2rem 0;
  min-height: 100vh;
  background-color: var(--background-color);
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
  padding-left: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text-color);
  background: var(--background-color);
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.btn-add {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--accent-color);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.btn-add:hover {
  opacity: 0.9;
}

.movies-filters {
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

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.no-results,
.loading,
.error,
.success {
  text-align: center;
  padding: 4rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.error {
  color: #ef4444;
  background-color: #fee2e2;
  border-radius: 0.5rem;
}

.success {
  color: #059669;
  background-color: #d1fae5;
  border-radius: 0.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: transparent;
  cursor: pointer;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
    justify-content: center;
  }

  .movies-filters {
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 0.5rem;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .filter-btn {
    white-space: nowrap;
  }

  .pagination {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .pagination-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
