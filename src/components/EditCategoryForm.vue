<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <h2>Modifier la catégorie</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Nom de la catégorie</label>
          <input id="name" v-model="editedCategory.name" type="text" required />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            v-model="editedCategory.description"
          ></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-submit">
            Mettre à jour la catégorie
          </button>
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditCategoryForm",
  props: {
    category: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editedCategory: { ...this.category },
    };
  },
  methods: {
    submitForm() {
      // Ici, vous devriez envoyer les données mises à jour de la catégorie à votre API
      this.$emit("update-category", this.editedCategory);
      this.$emit("close");
    },
  },
};
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
