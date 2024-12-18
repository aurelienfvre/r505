import axios from "axios";
import AuthService from "./services/auth.service";

axios.defaults.baseURL = "http://symfony.mmi-troyes.fr:8319/api";

// Ajout du token s'il existe
const token = AuthService.getToken();
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Intercepteur pour les requêtes
axios.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
