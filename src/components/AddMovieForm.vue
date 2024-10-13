<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Ajouter un nouveau film</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="title">Titre</label>
          <input id="title" v-model="movie.title" type="text" required>
        </div>
        <div class="form-group">
          <label for="year">Année</label>
          <input id="year" v-model="movie.year" type="number" required>
        </div>
        <div class="form-group">
          <label for="director">Réalisateur</label>
          <input id="director" v-model="movie.director" type="text" required>
        </div>
        <div class="form-group">
          <label for="synopsis">Synopsis</label>
          <textarea id="synopsis" v-model="movie.synopsis" required></textarea>
        </div>
        <div class="form-group">
          <label for="poster">URL de l'affiche</label>
          <input id="poster" v-model="movie.poster" type="url" required>
        </div>
        <div class="form-group">
          <label>Acteurs</label>
          <div v-for="(actor, index) in movie.actors" :key="index" class="actor-input">
            <input v-model="actor.name" type="text" placeholder="Nom de l'acteur">
            <button type="button" @click="removeActor(index)" class="btn-remove">Supprimer</button>
          </div>
          <button type="button" @click="addActor" class="btn-add">Ajouter un acteur</button>
        </div>
        <div class="form-group">
          <label>Catégories</label>
          <div v-for="category in categories" :key="category.id" class="category-checkbox">
            <input type="checkbox" :id="category.id" :value="category.id" v-model="movie.categoryIds">
            <label :for="category.id">{{ category.name }}</label>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-submit">Ajouter le film</button>
          <button type="button" @click="$emit('close')" class="btn-cancel">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddMovieForm',
  data() {
    return {
      movie: {
        title: '',
        year: null,
        director: '',
        synopsis: '',
        poster: '',
        actors: [],
        categoryIds: []
      },
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
      this.movie.actors.push({ name: '' })
    },
    removeActor(index) {
      this.movie.actors.splice(index, 1)
    },
    submitForm() {
      // Ici, vous devriez envoyer les données du film à votre API
      this.$emit('add-movie', this.movie)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--background-color);
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input[type="text"],
input[type="number"],
input[type="url"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
}

.actor-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn-remove,
.btn-add {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-remove {
  background-color: #ef4444;
  color: white;
}

.btn-add {
  background-color: var(--accent-color);
  color: white;
}

.category-checkbox {
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-submit,
.btn-cancel {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-submit {
  background-color: var(--accent-color);
  color: white;
}

.btn-cancel {
  background-color: #9ca3af;
  color: white;
}

.btn-submit:hover,
.btn-cancel:hover,
.btn-remove:hover,
.btn-add:hover {
  opacity: 0.9;
}
</style>