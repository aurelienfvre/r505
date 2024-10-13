<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
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
        <div class="form-actions">
          <button type="submit" class="btn-submit">Ajouter l'acteur</button>
          <button type="button" @click="$emit('close')" class="btn-cancel">Annuler</button>
        </div>
      </form>
    </div>
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
      this.$emit('add-actor', this.actor)
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
input[type="date"],
input[type="url"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
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
.btn-cancel:hover {
  opacity: 0.9;
}
</style>