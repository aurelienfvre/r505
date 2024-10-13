<template>
  <router-link :to="{ name: 'MovieDetail', params: { id: movie.id } }" class="movie-card">
    <div class="movie-poster">
      <img :src="movie.poster" :alt="movie.title">
    </div>
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
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.3s ease;
  text-decoration: none;
  color: inherit;
  width: 100%;
  max-width: 200px;
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  aspect-ratio: 2 / 3;
  overflow: hidden;
}

.movie-poster img {
  width: 100%;
  height: 100%;
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
</style>