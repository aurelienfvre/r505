<template>
  <div id="app">
    <h1>Vue.js Movie App</h1>
    <div v-if="loggedIn" class="user-info">
      Bienvenue, {{ user.email }}
      <button @click="logout">Se déconnecter</button>
    </div>
    <LoginForm v-if="!loggedIn" />
    <SearchFilm v-if="loggedIn" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSession } from '@/stores/session'
import LoginForm from './components/LoginForm.vue'
import SearchFilm from './components/SearchFilm.vue'

export default {
  name: 'App',
  components: {
    LoginForm,
    SearchFilm
  },
  computed: {
    ...mapState(useSession, ['loggedIn', 'user'])
  },
  methods: {
    ...mapActions(useSession, ['logout'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
}

.user-info {
  margin-bottom: 20px;
}
</style>