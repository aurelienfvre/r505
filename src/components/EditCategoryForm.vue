<template>
  <div class="edit-category-form">
    <h2>Modifier la catégorie</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nom de la catégorie</label>
        <input id="name" v-model="editedCategory.name" type="text" required>
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea id="description" v-model="editedCategory.description"></textarea>
      </div>
      <button type="submit">Mettre à jour la catégorie</button>
      <button type="button" @click="$emit('close')">Annuler</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'EditCategoryForm',
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editedCategory: { ...this.category }
    }
  },
  methods: {
    submitForm() {
      // Ici, vous devriez envoyer les données mises à jour de la catégorie à votre API
      // Pour cet exemple, nous allons simplement émettre les données vers le composant parent
      this.$emit('update-category', this.editedCategory)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.edit-category-form {
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