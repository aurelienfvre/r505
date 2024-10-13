<template>
  <router-link :to="{ name: 'ActorDetail', params: { id: actor.id } }" class="actor-card">
    <div class="actor-photo">
      <img :src="actor.photo" :alt="actor.name">
    </div>
    <div class="actor-info">
      <h3>{{ actor.name }}</h3>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ActorCard',
  props: {
    actor: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.actor-card {
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

.actor-card:hover {
  transform: translateY(-5px);
}

.actor-photo {
  aspect-ratio: 1 / 1;
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
  font-size: 1rem;
  text-align: center;
}
</style>