<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">CinéVue</router-link>
        <nav class="navigation" :class="{ 'active': isMenuOpen }">
          <ul>
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/movies">Films</router-link></li>
            <li><router-link to="/actors">Acteurs</router-link></li>
            <li><router-link to="/categories">Catégories</router-link></li>
          </ul>
        </nav>
        <div class="navbar-actions">
          <button @click="toggleDarkMode" class="btn-icon" aria-label="Toggle dark mode">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          <template v-if="loggedIn">
            <div class="dropdown" :class="{ 'active': isDropdownOpen }">
              <button @click="toggleDropdown" class="btn-icon" aria-label="User menu">
                <i class="fas fa-user"></i>
              </button>
              <div class="dropdown-content">
                <p class="user-email">{{ user.email }}</p>
                <router-link to="/profile" class="dropdown-item">
                  <i class="fas fa-user-cog"></i>
                  <span>Profil</span>
                </router-link>
                <router-link to="/settings" class="dropdown-item">
                  <i class="fas fa-cog"></i>
                  <span>Paramètres</span>
                </router-link>
                <button @click="handleLogout" class="dropdown-item">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </template>
          <router-link v-else to="/login" class="btn-login">Se connecter</router-link>
        </div>
        <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <main class="main-content">
      <router-view />

    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 CinéVue. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useSession } from '@/stores/session'

export default {
  name: 'App',
  data() {
    return {
      isDarkMode: false,
      isMenuOpen: false,
      isDropdownOpen: false
    }
  },
  computed: {
    ...mapState(useSession, ['loggedIn', 'user'])
  },
  methods: {
    ...mapActions(useSession, ['logout']),
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      document.body.classList.toggle('dark-mode', this.isDarkMode)
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },
    handleLogout() {
      this.logout()
      this.$router.push('/login')
      this.isDropdownOpen = false
    }
  }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --border-color: #e5e7eb;
  --accent-color: #3b82f6;
  --hover-color: #f3f4f6;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.5;
  margin: 0;
  padding: 0;
  transition: background-color 0.3s ease, color 0.3s ease;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-color);
  text-decoration: none;
}

.navigation ul {
  display: flex;
  gap: 1.5rem;
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.navigation ul li a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.navigation ul li a:hover {
  color: var(--accent-color);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.btn-icon:hover {
  color: var(--accent-color);
}

.btn-login {
  background-color: var(--accent-color);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.btn-login:hover {
  opacity: 0.9;
}

.dropdown {
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: var(--background-color);
  min-width: 200px;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 1;
}

.dropdown.active .dropdown-content {
  display: block;
}

.user-email {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: bold;
  color: var(--accent-color);
  margin: 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
}

.dropdown-item:hover {
  background-color: var(--hover-color);
}

.dropdown-item i {
  margin-right: 0.5rem;
  width: 20px;
  text-align: center;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--text-color);
  margin: 5px 0;
  transition: 0.3s;
}

.main-content {
  flex: 1 0 auto;
  padding: 2rem 0;
}

.footer {
  border-top: 1px solid var(--border-color);
  padding: 1rem 0;
  text-align: center;
}

/* Dark mode styles */
.dark-mode {
  --background-color: #1f2937;
  --text-color: #f9fafb;
  --border-color: #374151;
  --hover-color: #374151;
}

/* Responsive styles */
@media (max-width: 768px) {
  .header .container {
    flex-wrap: wrap;
  }

  .menu-toggle {
    display: block;
  }

  .navigation {
    flex-basis: 100%;
    display: none;
    margin-top: 1rem;
  }

  .navigation.active {
    display: block;
  }

  .navigation ul {
    flex-direction: column;
    align-items: flex-start;
  }

  .navigation ul li {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .navbar-actions {
    margin-left: auto;
  }
}
</style>