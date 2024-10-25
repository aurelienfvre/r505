<template>
  <router-link
    :to="{ name: 'ActorDetail', params: { id: actor.id } }"
    class="actor-card"
  >
    <div class="actor-photo">
      <img
        :src="actor.media || 'https://via.placeholder.com/300x300'"
        :alt="fullName"
      />
    </div>
    <div class="actor-info">
      <h3>{{ fullName }}</h3>
      <p class="nationality">{{ actor.nationality }}</p>
      <p class="movies-count" v-if="actor.movies">
        {{ actor.movies.length }} films
      </p>
      <div class="awards" v-if="actor.awards">
        <i class="fas fa-award"></i>
        {{ actor.awards }} prix
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "ActorCard",
  props: {
    actor: {
      type: Object,
      required: true,
    },
  },
  computed: {
    fullName() {
      return `${this.actor.firstname || ""} ${
        this.actor.lastname || ""
      }`.trim();
    },
  },
};
</script>

<style scoped>
.actor-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  background-color: var(--background-color);
  transition: transform 0.3s ease;
}

.actor-card:hover {
  transform: translateY(-5px);
}

.actor-photo {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.actor-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actor-info {
  padding: 1rem;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.nationality {
  font-size: 0.9rem;
  color: var(--text-color);
  opacity: 0.8;
  margin: 0.25rem 0;
}

.movies-count {
  font-size: 0.9rem;
  color: var(--text-color);
  margin: 0.25rem 0;
}

.awards {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: gold;
  margin-top: 0.5rem;
}
</style>
