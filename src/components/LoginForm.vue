<template>
  <div class="login-form">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit" class="btn-submit">Se connecter</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'pinia'
import { useSession } from '@/stores/session'

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    ...mapActions(useSession, ['login']),
    async handleLogin() {
      try {
        await this.login({ email: this.email, password: this.password })
        this.$router.push('/search')
      } catch (error) {
        this.error = 'Email ou mot de passe incorrect'
      }
    }
  }
}
</script>

<style scoped>
.login-view {
  padding: 2rem 0;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.login-form {
  max-width: 400px;
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
  margin-bottom: 1rem;
}

.btn-submit:hover {
  opacity: 0.9;
}

.forgot-password {
  text-align: center;
}

.forgot-password a {
  color: var(--accent-color);
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>