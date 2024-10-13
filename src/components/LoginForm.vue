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
      <button type="submit" class="submit-btn">Se connecter</button>
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
    handleLogin() {
      if (this.email === 'test@test.com' && this.password === 'test1234') {
        this.login({ user: { email: this.email } })
        this.$router.push('/search')
      } else {
        this.error = 'Email ou mot de passe incorrect'
      }
    }
  }
}
</script>

<style scoped>
.login-form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #2980b9;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}
</style>