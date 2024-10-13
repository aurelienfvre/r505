<template>
  <div class="login-view">
    <h1>Connexion</h1>
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'

export default {
  name: 'LoginView',
  components: {
    LoginForm
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