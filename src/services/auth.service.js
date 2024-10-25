import axios from "axios";
import jwt_decode from "jwt-decode";

const API_URL = "http://symfony.mmi-troyes.fr:8319/api";

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(
        `${API_URL}/auth`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login response:", response.data);

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return {
          token,
          user: jwt_decode(token),
        };
      }
    } catch (error) {
      console.error("Login error:", error.response);
      throw new Error(error.response?.data?.message || "Erreur de connexion");
    }
  }

  logout() {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }

  getToken() {
    return localStorage.getItem("token");
  }

  setupAxiosInterceptors() {
    const token = this.getToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return true;
    }
    return false;
  }

  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwt_decode(token);
      const isValid = decoded.exp * 1000 > Date.now();
      if (!isValid) {
        this.logout();
      }
      return isValid;
    } catch {
      return false;
    }
  }
}

export default new AuthService();
