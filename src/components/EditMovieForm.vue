<template>
  <div class="edit-movie-form">
    <h2>Modifier le film</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Titre</label>
        <input id="title" v-model="editedMovie.title" type="text" required>
      </div>
      <div class="form-group">
        <label for="year">Année</label>
        <input id="year" v-model="editedMovie.year" type="number" required>
      </div>
      <div class="form-group">
        <label for="director">Réalisateur</label>
        <input id="director" v-model="editedMovie.director" type="text" required>
      </div>
      <div class="form-group">
        <label for="synopsis">Synopsis</label>
        <textarea id="synopsis" v-model="editedMovie.synopsis" required></textarea>
      </div>
      <div class="form-group">
        <label for="poster">URL de l'affiche</label>
        <input id="poster" v-model="editedMovie.poster" type="url" required>
      </div>
      <div class="form-group">
        <label>Acteurs</label>
        <div v-for="(actor, index) in editedMovie.actors" :key="index">
          <input v-model="actor.name" type="text" placeholder="Nom de l'acteur">
          <button type="button" @click="removeActor(index)">Supprimer</button>
        </div>
        <button type="button" @click="addActor">Ajouter un acteur</button>
      </div>
      <div class="form-group">
        <label>Catégories</label>
        <div v-for="category in categories" :key="category.id">
          <input type="checkbox" :id="category.id" :value="category.id" v-model="editedMovie.categoryIds">
          <label :for="category.id">{{ category.name }}</label>
        </div>
      </div>
      <button type="submit">Mettre à jour le film</button>
      <button type="button" @click="$emit('close')">Annuler</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditMovieForm',
  props: {
    movie: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editedMovie: JSON.parse(JSON.stringify(this.movie)), // Deep copy
      categories: [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comédie' },
        { id: 3, name: 'Drame' },
        // Ajoutez d'autres catégories selon vos besoins
      ]
    }
  },
  methods: {
    addActor() {
      this.editedMovie.actors.push({ name: '' })
    },
    removeActor(index) {
      this.editedMovie.actors.splice(index, 1)
    },
    submitForm() {
      // Ici, vous devriez envoyer les données mises à jour du film à votre API
      // Pour cet exemple, nous allons simplement émettre les données vers le composant parent
      this.$emit('update-movie', this.editedMovie)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.edit-movie-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"],
input[type="url"],
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  opacity: 0.9;
}
</style>