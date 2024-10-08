<template>
  <li class="film">
    <img class="poster" :src="film.poster" :alt="film.title + ' poster'"/>
    <div class="film-details">
      <h3>{{ film.title }}</h3>
      <p class="rating">Rating: {{ film.metascore }}</p>
      <p><strong>Released:</strong> {{ film.released }}</p>
      <p><strong>Director:</strong> {{ film.director }}</p>
      <p><strong>Actors:</strong> {{ film.actors }}</p>
      <p class="plot">{{ film.plot }}</p>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Film',
  props: {
    film: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.film {
  display: flex;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.poster {
  width: 150px;
  margin-right: 20px;
}

.film-details {
  flex: 1;
}

h3 {
  margin-top: 0;
}

.plot {
  font-style: italic;
}
</style>