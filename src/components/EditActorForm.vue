<template>
  <div class="edit-actor-form">
    <h2>Modifier l'acteur</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nom</label>
        <input id="name" v-model="editedActor.name" type="text" required>
      </div>
      <div class="form-group">
        <label for="birthDate">Date de naissance</label>
        <input id="birthDate" v-model="editedActor.birthDate" type="date" required>
      </div>
      <div class="form-group">
        <label for="nationality">Nationalité</label>
        <input id="nationality" v-model="editedActor.nationality" type="text" required>
      </div>
      <div class="form-group">
        <label for="biography">Biographie</label>
        <textarea id="biography" v-model="editedActor.biography" required></textarea>
      </div>
      <div class="form-group">
        <label for="photo">URL de la photo</label>
        <input id="photo" v-model="editedActor.photo" type="url" required>
      </div>
      <button type="submit">Mettre à jour l'acteur</button>
      <button type="button" @click="$emit('close')">Annuler</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditActorForm',
  props: {
    actor: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editedActor: JSON.parse(JSON.stringify(this.actor)) // Deep copy
    }
  },
  methods: {
    submitForm() {
      // Ici, vous devriez envoyer les données mises à jour de l'acteur à votre API
      // Pour cet exemple, nous allons simplement émettre les données vers le composant parent
      this.$emit('update-actor', this.editedActor)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.edit-actor-form {
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