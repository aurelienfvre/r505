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
  max-width: 400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}
</style>