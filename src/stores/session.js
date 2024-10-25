import { defineStore } from "pinia";
import AuthService from "@/services/auth.service";

export const useSession = defineStore("session", {
  persist: true,
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: null,
    loggedIn: !!localStorage.getItem("token"),
  }),
  actions: {
    async login({ email, password }) {
      try {
        const result = await AuthService.login(email, password);
        this.token = result.token;
        this.user = result.user;
        this.loggedIn = true;

        // Mettre à jour les en-têtes Axios
        AuthService.setupAxiosInterceptors();

        return Promise.resolve();
      } catch (error) {
        this.token = null;
        this.user = null;
        this.loggedIn = false;
        return Promise.reject(error);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.loggedIn = false;
      AuthService.logout();
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token && AuthService.isTokenValid(),
  },
});
