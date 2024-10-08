<template>
  <div id="login-form">
    <form @submit.prevent="handleLogin">
      <h2>{{ title }}</h2>
      <p>Remplissez ce formulaire pour vous connecter.</p>
      <hr>

      <label for="email"><b>Email</b></label>
      <input type="text" v-model="email" placeholder="Entrez votre courriel" id="email" name="email" required>

      <label for="psw"><b>Mot de passe</b></label>
      <input type="password" v-model="password" placeholder="Entrez votre mot de passe" id="psw" name="psw" required>

      <p><button type="submit">Se connecter</button></p>
      <p v-if="error" class="error">{{ error }}</p>
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
      title: 'Authentification',
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    ...mapActions(useSession, ['login']),
    handleLogin() {
      if (this.email === 'test@test.com' && this.password === 'test1234') {
        this.login({ user: { email: this.email } });
        this.error = '';
      } else {
        this.error = 'Email ou mot de passe incorrect';
      }
    }
  }
}
</script>

<style scoped>
#login-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

input {
  width: 100%;
  padding: 10px;
  margin: 5px 0 20px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  opacity: 0.8;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>