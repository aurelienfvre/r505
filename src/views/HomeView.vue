<template>
  <div class="home">
    <h1>Bienvenue sur CinéVue</h1>
    <section class="movies-section">
      <h2>Films récents</h2>
      <div class="movie-grid">
        <MovieCard v-for="movie in recentMovies" :key="movie.id" :movie="movie" />
      </div>
    </section>
    <section class="actors-section">
      <h2>Acteurs populaires</h2>
      <div class="actor-grid">
        <ActorCard v-for="actor in popularActors" :key="actor.id" :actor="actor" />
      </div>
    </section>
  </div>
</template>

<script>
import MovieCard from '@/components/MovieCard.vue'
import ActorCard from '@/components/ActorCard.vue'

export default {
  name: 'HomeView',
  components: {
    MovieCard,
    ActorCard
  },
  data() {
    return {
      recentMovies: [
        { id: 1, title: 'Inception', year: 2010, poster: 'url_to_poster' },
        { id: 2, title: 'The Dark Knight', year: 2008, poster: 'url_to_poster' },
        { id: 3, title: 'Interstellar', year: 2014, poster: 'url_to_poster' },
        { id: 4, title: 'Pulp Fiction', year: 1994, poster: 'url_to_poster' }
      ],
      popularActors: [
        { id: 1, name: 'Leonardo DiCaprio', photo: 'url_to_photo' },
        { id: 2, name: 'Christian Bale', photo: 'url_to_photo' },
        { id: 3, name: 'Matthew McConaughey', photo: 'url_to_photo' },
        { id: 4, name: 'John Travolta', photo: 'url_to_photo' }
      ]
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}

h1 {
  margin-bottom: 2rem;
}

.movies-section, .actors-section {
  margin-bottom: 3rem;
}

h2 {
  margin-bottom: 1rem;
}

.movie-grid, .actor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  justify-items: center;
}

@media (max-width: 768px) {
  .movie-grid, .actor-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>