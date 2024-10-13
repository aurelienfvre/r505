<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-logo">CinéVue</router-link>
      <div class="nav-links">
        <router-link to="/">Accueil</router-link>
        <router-link to="/movies">Films</router-link>
        <router-link to="/actors">Acteurs</router-link>
        <router-link to="/categories">Catégories</router-link>
      </div>
      <div class="nav-profile" v-if="loggedIn">
        <div class="dropdown">
          <button class="dropbtn">{{ user.email }}</button>
          <div class="dropdown-content">
            <router-link to="/profile">Éditer le profil</router-link>
            <a @click="handleLogout">Se déconnecter</a>
          </div>
        </div>
      </div>
      <router-link v-else to="/login" class="nav-login">Se connecter</router-link>
    </nav>
    <router-view class="main-content"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSession } from '@/stores/session'

export default {
  name: 'App',
  computed: {
    ...mapState(useSession, ['loggedIn', 'user'])
  },
  methods: {
    ...mapActions(useSession, ['logout']),
    handleLogout() {
      this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
:root {
  --primary-color: #1a1a1a;
  --secondary-color: #ffffff;
  --accent-color: #ff4081;
  --background-color: #f5f5f5;
  --text-color: #333333;
}

body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-color);
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  color: var(--secondary-color);
}

.nav-logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--secondary-color);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-links a, .nav-login {
  color: var(--secondary-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover, .nav-login:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.main-content {
  flex-grow: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: var(--secondary-color);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: var(--text-color);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: var(--background-color);
}

.dropdown:hover .dropdown-content {
  display: block;
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    margin-top: 1rem;
  }

  .nav-links a, .nav-login {
    text-align: center;
  }

  .nav-profile {
    margin-top: 1rem;
  }
}
</style>