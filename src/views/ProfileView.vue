<template>
  <div class="profile-view">
    <h1>Profil</h1>
    <form @submit.prevent="updateProfile">
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
      <button type="submit">Mettre à jour le profil</button>
    </form>
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
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  opacity: 0.9;
}
</style>