<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="main-title">CinéVue</h1>
        <p class="hero-subtitle">
          Découvrez, explorez et partagez votre passion pour le cinéma
        </p>
        <div class="hero-buttons">
          <router-link to="/movies" class="btn-primary">
            <i class="fas fa-play"></i>
            Explorer les films
          </router-link>
          <router-link to="/actors" class="btn-secondary">
            <i class="fas fa-users"></i>
            Voir les acteurs
          </router-link>
        </div>
      </div>
      <div class="hero-overlay"></div>
    </div>

    <div class="content-wrapper">
      <section class="recent-movies-section">
        <div class="section-header">
          <h2>Films récents</h2>
          <router-link to="/movies" class="btn-view-all">
            <span>Voir tout</span>
            <i class="fas fa-chevron-right"></i>
          </router-link>
        </div>

        <div v-if="loadingMovies" class="loading-container">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Chargement des films...</span>
        </div>

        <div v-else-if="errorMovies" class="error-container">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorMovies }}
        </div>

        <div v-else class="movies-showcase">
          <div class="movies-scroll">
            <MovieCard
              v-for="movie in recentMovies"
              :key="movie['@id']"
              :movie="movie"
              class="movie-card-wrapper"
            />
          </div>
        </div>
      </section>

      <section class="featured-section">
        <div class="featured-divider">
          <span class="divider-line"></span>
          <span class="divider-text">Acteurs Populaires</span>
          <span class="divider-line"></span>
        </div>
      </section>

      <section class="popular-actors-section">
        <div v-if="loadingActors" class="loading-container">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Chargement des acteurs...</span>
        </div>

        <div v-else-if="errorActors" class="error-container">
          <i class="fas fa-exclamation-circle"></i>
          {{ errorActors }}
        </div>

        <div v-else class="actors-showcase">
          <div class="actors-grid">
            <ActorCard
              v-for="actor in popularActors"
              :key="actor['@id']"
              :actor="actor"
              class="actor-card-wrapper"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import MovieCard from "@/components/MovieCard.vue";
import ActorCard from "@/components/ActorCard.vue";
import MovieService from "@/services/movie.service";
import ActorService from "@/services/actor.service";

export default {
  name: "HomeView",
  components: {
    MovieCard,
    ActorCard,
  },
  data() {
    return {
      recentMovies: [],
      popularActors: [],
      loadingMovies: true,
      loadingActors: true,
      errorMovies: null,
      errorActors: null,
    };
  },
  async created() {
    await Promise.all([this.fetchRecentMovies(), this.fetchPopularActors()]);
  },
  methods: {
    async fetchRecentMovies() {
      try {
        this.loadingMovies = true;
        this.errorMovies = null;
        const movies = await MovieService.getAllMovies();

        this.recentMovies = movies
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
      } catch (error) {
        console.error("Error fetching recent movies:", error);
        this.errorMovies = "Erreur lors du chargement des films récents";
      } finally {
        this.loadingMovies = false;
      }
    },
    async fetchPopularActors() {
      try {
        this.loadingActors = true;
        this.errorActors = null;
        const actors = await ActorService.getAllActors();

        this.popularActors = actors
          .sort((a, b) => (b.awards || 0) - (a.awards || 0))
          .slice(0, 3);
      } catch (error) {
        console.error("Error fetching popular actors:", error);
        this.errorActors = "Erreur lors du chargement des acteurs populaires";
      } finally {
        this.loadingActors = false;
      }
    },
  },
};
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background-color: var(--background-color);
}

.hero-section {
  position: relative;
  height: 80vh;
  min-height: 600px;
  display: flex;
  align-items: center;
  background-image: url("../../public/img/hero.jpg");
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    var(--background-color) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  padding: 0 2rem;
}

.main-title {
  font-size: 5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, var(--accent-color), #4f46e5);
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.5rem;
  color: white;
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--accent-color);
  color: white;
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h2 {
  font-size: 2rem;
  color: var(--text-color);
  margin: 0;
}

.btn-view-all {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  opacity: 0.8;
}

.movies-showcase {
  margin: -1rem;
  padding: 1rem;
  overflow: hidden;
}

.movies-scroll {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.movies-scroll::-webkit-scrollbar {
  display: none;
}

.movie-card-wrapper {
  flex: 0 0 300px;
  scroll-snap-align: start;
  transform: scale(0.98);
  transition: transform 0.3s ease;
}

.movie-card-wrapper:hover {
  transform: scale(1);
}

.featured-section {
  padding: 4rem 0;
  text-align: center;
}

.featured-divider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.divider-text {
  font-size: 1.5rem;
  color: var(--text-color);
  font-weight: 600;
  padding: 0 1rem;
}

.actors-showcase {
  margin-top: 2rem;
}

.actors-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.actor-card-wrapper {
  transition: transform 0.3s ease;
}

.actor-card-wrapper:hover {
  transform: translateY(-10px);
}

.loading-container,
.error-container {
  text-align: center;
  padding: 4rem;
  color: var(--text-color);
}

.loading-container i,
.error-container i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-container {
  color: #ef4444;
}

@media (max-width: 1024px) {
  .main-title {
    font-size: 4rem;
  }

  .actors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 500px;
  }

  .main-title {
    font-size: 3rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .content-wrapper {
    padding: 2rem 1rem;
  }

  .movie-card-wrapper {
    flex: 0 0 250px;
  }
}

@media (max-width: 640px) {
  .hero-buttons {
    flex-direction: column;
  }

  .actors-grid {
    grid-template-columns: 1fr;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>
