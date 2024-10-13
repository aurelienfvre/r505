<template>
  <div class="add-actor-form">
    <h2>Ajouter un nouvel acteur</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nom</label>
        <input id="name" v-model="actor.name" type="text" required>
      </div>
      <div class="form-group">
        <label for="birthDate">Date de naissance</label>
        <input id="birthDate" v-model="actor.birthDate" type="date" required>
      </div>
      <div class="form-group">
        <label for="nationality">Nationalité</label>
        <input id="nationality" v-model="actor.nationality" type="text" required>
      </div>
      <div class="form-group">
        <label for="biography">Biographie</label>
        <textarea id="biography" v-model="actor.biography" required></textarea>
      </div>
      <div class="form-group">
        <label for="photo">URL de la photo</label>
        <input id="photo" v-model="actor.photo" type="url" required>
      </div>
      <button type="submit">Ajouter l'acteur</button>
      <button type="button" @click="$emit('close')">Annuler</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AddActorForm',
  data() {
    return {
      actor: {
        name: '',
        birthDate: '',
        nationality: '',
        biography: '',
        photo: ''
      }
    }
  },
  methods: {
    submitForm() {
      // Ici, vous devriez envoyer les données de l'acteur à votre API
      // Pour cet exemple, nous allons simplement émettre les données vers le composant parent
      this.$emit('add-actor', this.actor)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.add-actor-form {
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
input[type="date"],
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