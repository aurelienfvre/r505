<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="container">
        <router-link to="/" class="logo">CinéVue</router-link>
        <nav class="navigation" :class="{ active: isMenuOpen }">
          <ul>
            <li><router-link to="/">Accueil</router-link></li>
            <li><router-link to="/movies">Films</router-link></li>
            <li><router-link to="/actors">Acteurs</router-link></li>
            <li><router-link to="/categories">Catégories</router-link></li>
          </ul>
        </nav>
        <div class="navbar-actions">
          <button
            @click="toggleDarkMode"
            class="btn-icon"
            aria-label="Toggle dark mode"
          >
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>
          <template v-if="loggedIn">
            <div class="dropdown" :class="{ active: isDropdownOpen }">
              <button
                @click="toggleDropdown"
                class="btn-icon"
                aria-label="User menu"
              >
                <i class="fas fa-user"></i>
              </button>
              <div class="dropdown-content">
                <p class="user-email">{{ user?.email }}</p>
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
          <router-link v-else to="/login" class="btn-login"
            >Se connecter</router-link
          >
        </div>
        <button
          class="menu-toggle"
          @click="toggleMenu"
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <main class="contenu-principal">
      <router-view v-if="$route.name" />
      <router-view v-else name="Home" />
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 CinéVue. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useSession } from "@/stores/session";

export default {
  name: "App",
  data() {
    return {
      isDarkMode: false,
      isMenuOpen: false,
      isDropdownOpen: false,
      isReady: false,
    };
  },
  computed: {
    ...mapState(useSession, ["loggedIn", "user"]),
  },
  created() {
    this.$nextTick(() => {
      this.isReady = true;
      if (this.$route.path === "/" && !this.$route.name) {
        this.$router.push({ name: "Home" });
      }
    });
  },
  methods: {
    ...mapActions(useSession, ["logout"]),
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.body.classList.toggle("dark-mode", this.isDarkMode);
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    handleLogout() {
      this.logout();
      this.$router.push("/login");
      this.isDropdownOpen = false;
    },
  },
  watch: {
    $route(to) {
      if (to.path === "/" && !to.name) {
        this.$router.push({ name: "Home" });
      }
    },
  },
};
</script>

<style>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

:root {
  --background-color: #ffffff;
  --text-color: #333333;
  --border-color: #e5e7eb;
  --accent-color: #3b82f6;
  --hover-color: #f3f4f6;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif;
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
  padding-top: 4rem; /* Pour compenser le header fixed */
}

.container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, var(--accent-color), #4f46e5);
  -webkit-background-clip: text;
  color: transparent;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: translateY(-1px);
}

.navigation {
  position: relative;
  z-index: 999;
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
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.navigation ul li a:hover {
  color: var(--accent-color);
  background-color: var(--hover-color);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1001;
}

.btn-icon {
  position: relative;
  z-index: 1001;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--text-color);
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  color: var(--accent-color);
  background-color: var(--hover-color);
}

.btn-login {
  background-color: var(--accent-color);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.btn-login:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.dropdown {
  position: relative;
  z-index: 1001;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--background-color);
  min-width: 240px;
  border-radius: 0.75rem;
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.dropdown.active .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-email {
  padding: 1rem 1.5rem;
  margin: 0;
  font-weight: 500;
  color: var(--accent-color);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--background-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.dropdown-item:hover {
  background-color: var(--hover-color);
  color: var(--accent-color);
}

.dropdown-item i {
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 2px;
  background-color: var(--text-color);
  margin: 6px 0;
  transition: 0.3s;
  border-radius: 1px;
}

.menu-toggle:hover span {
  background-color: var(--accent-color);
}

.contenu-principal {
  flex: 1 0 auto;
  position: relative;
  z-index: 1;
}

.footer {
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
  text-align: center;
  background-color: var(--background-color);
  position: relative;
  z-index: 2;
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
    display: none;
    width: 100%;
    margin-top: 1rem;
  }

  .navigation.active {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--background-color);
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .navigation ul {
    flex-direction: column;
    gap: 0.5rem;
  }

  .navigation ul li {
    width: 100%;
  }

  .navigation ul li a {
    display: block;
    padding: 0.75rem 1rem;
  }

  .dropdown-content {
    position: fixed;
    top: auto;
    right: 1rem;
    left: 1rem;
    margin-top: 0.5rem;
  }

  .navbar-actions {
    margin-left: auto;
  }
}

@media (max-width: 480px) {
  .btn-login {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .dropdown-content {
    min-width: 200px;
  }

  .user-email {
    font-size: 0.9rem;
  }
}
</style>
