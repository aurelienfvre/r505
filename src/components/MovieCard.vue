<template>
  <router-link
    :to="{ name: 'MovieDetail', params: { id: movie.id } }"
    class="movie-card"
  >
    <div class="movie-poster">
      <img
        :src="movie.media || 'https://via.placeholder.com/300x450'"
        :alt="movie.title"
      />
    </div>
    <div class="movie-info">
      <h3>{{ movie.title }}</h3>
      <p class="director">{{ movie.director }}</p>
      <p class="year">{{ formatDate(movie.releaseDate) }}</p>
      <div class="movie-rating" v-if="movie.rating">
        <span class="stars">★</span>
        {{ movie.rating }}/5
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      return new Date(date).getFullYear();
    },
  },
};
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
  background-color: var(--background-color);
}

.movie-card:hover {
  transform: translateY(-5px);
}

.movie-poster {
  width: 100%;
  height: 300px;
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
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.director {
  color: var(--text-color);
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.year {
  color: var(--text-color);
  opacity: 0.8;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.movie-rating {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.stars {
  color: gold;
  margin-right: 0.25rem;
}
</style>
