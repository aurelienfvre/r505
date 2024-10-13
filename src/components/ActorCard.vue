<template>
  <router-link :to="{ name: 'ActorDetail', params: { id: actor.id } }" class="actor-card">
    <img :src="actor.photo" :alt="actor.name" class="actor-photo">
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
  width: 200px;
  background-color: var(--secondary-color);
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: var(--text-color);
  transition: transform 0.3s ease;
}

.actor-card:hover {
  transform: translateY(-5px);
}

.actor-photo {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.actor-info {
  padding: 1rem;
}

h3 {
  margin: 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .actor-card {
    width: 150px;
  }

  .actor-photo {
    height: 150px;
  }
}
</style>