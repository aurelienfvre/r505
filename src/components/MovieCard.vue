<template>
  <router-link :to="{ name: 'MovieDetail', params: { id: movie.id } }" class="movie-card">
    <img :src="movie.poster" :alt="movie.title" class="movie-poster">
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.year }}</p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.movie-card {
  width: 200px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.movie-info {
  padding: 1rem;
}

h3 {
  margin: 0;
  font-size: 1rem;
}

p {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .movie-card {
    width: 150px;
  }

  .movie-poster {
    height: 225px;
  }
}
</style>