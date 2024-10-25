import axios from "axios";
import AuthService from "./auth.service";
import router from "@/router";

const api = axios.create({
  baseURL: "http://symfony.mmi-troyes.fr:8319/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/ld+json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout();
      router.push("/login");
      return Promise.reject(
        new Error("Session expirée. Veuillez vous reconnecter.")
      );
    }
    return Promise.reject(error);
  }
);

export default api;
