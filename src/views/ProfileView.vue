<template>
  <div class="profile-view">
    <div class="container">
      <h1>Profil</h1>
      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="profile.email" type="email" required>
        </div>
        <div class="form-group">
          <label for="name">Nom</label>
          <input id="name" v-model="profile.name" type="text" required>
        </div>
        <div class="form-group">
          <label for="password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
          <input id="password" v-model="profile.newPassword" type="password">
        </div>
        <button type="submit" class="btn-submit">Mettre à jour le profil</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSession } from '@/stores/session'

export default {
  name: 'ProfileView',
  data() {
    return {
      profile: {
        email: '',
        name: '',
        newPassword: ''
      }
    }
  },
  computed: {
    ...mapState(useSession, ['user'])
  },
  mounted() {
    this.profile.email = this.user.email
    this.profile.name = this.user.name
  },
  methods: {
    ...mapActions(useSession, ['updateUser']),
    async updateProfile() {
      try {
        await this.updateUser(this.profile)
        alert('Profil mis à jour avec succès')
      } catch (error) {
        alert('Erreur lors de la mise à jour du profil')
      }
    }
  }
}
</script>

<style scoped>
.profile-view {
  padding: 2rem 0;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.profile-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-submit:hover {
  opacity: 0.9;
}
</style>