<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h1>Bienvenue sur CinéVue</h1>
        <p>Explorez, découvrez et partagez votre passion pour le cinéma.</p>
      </div>
    </section>

    <section class="recent-movies">
      <div class="container">
        <h2>Films récents</h2>
        <div class="movie-grid">
          <MovieCard v-for="movie in recentMovies" :key="movie.id" :movie="movie" />
        </div>
      </div>
    </section>

    <section class="popular-actors">
      <div class="container">
        <h2>Acteurs populaires</h2>
        <div class="actor-grid">
          <ActorCard v-for="actor in popularActors" :key="actor.id" :actor="actor" />
        </div>
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
        {
          id: 1,
          title: 'Titanic',
          year: 1997,
          poster: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg'
        },
        {
          id: 2,
          title: 'Blade Runner',
          year: 1982,
          poster: 'https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
        },
        {
          id: 3,
          title: 'The Shining',
          year: 1980,
          poster: 'https://m.media-amazon.com/images/M/MV5BZWFlYmY2MGEtZjVkYS00YzU4LTg0YjQtYzY1ZGE3NTA5NGQxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg'
        }
      ],
      popularActors: [
        { id: 1, name: 'Leonardo DiCaprio', photo: 'https://example.com/leo.jpg' },
        { id: 2, name: 'Harrison Ford', photo: 'https://example.com/harrison.jpg' },
        { id: 3, name: 'Jack Nicholson', photo: 'https://example.com/jack.jpg' }
      ]
    }
  }
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 4rem 0;
  background-color: var(--hover-color);
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto;
}

.recent-movies,
.popular-actors {
  padding: 4rem 0;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.movie-grid,
.actor-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .hero p {
    font-size: 1rem;
  }

  .movie-grid,
  .actor-grid {
    gap: 1rem;
  }
}
</style>