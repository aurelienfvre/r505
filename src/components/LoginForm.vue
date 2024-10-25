<template>
  <div class="login-form">
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="btn-submit" :disabled="loading">
        {{ loading ? "Connexion..." : "Se connecter" }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import { useSession } from "@/stores/session";

export default {
  name: "LoginForm",
  data() {
    return {
      email: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    ...mapActions(useSession, ["login"]),
    async handleLogin() {
      this.loading = true;
      this.error = "";
      try {
        await this.login({
          email: this.email,
          password: this.password,
        });
        this.$router.push("/");
      } catch (error) {
        this.error = error.message || "Erreur de connexion";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
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
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  font-size: 1rem;
  box-sizing: border-box;
}

.btn-submit {
  width: 100%;
  padding: 0.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.btn-submit:hover {
  opacity: 0.9;
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}

.forgot-password {
  text-align: center;
  margin-top: 1rem;
}

.forgot-password a {
  color: var(--accent-color);
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}
</style>
