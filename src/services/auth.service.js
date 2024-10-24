import axios from 'axios'
import jwt_decode from 'jwt-decode' // Changement ici

const API_URL = 'http://symfony.mmi-troyes.fr:8319'

class AuthService {
    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/api/auth`, {
                email,
                password
            })

            if (response.data.token) {
                const decodedToken = jwt_decode(response.data.token) // Changement ici
                localStorage.setItem('user', JSON.stringify({
                    token: response.data.token,
                    ...decodedToken
                }))
            }
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Erreur de connexion')
        }
    }

    logout() {
        localStorage.removeItem('user')
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    }

    getToken() {
        const user = this.getCurrentUser()
        return user?.token
    }

    isTokenValid() {
        const token = this.getToken()
        if (!token) return false

        try {
            const decodedToken = jwt_decode(token) // Changement ici
            const currentTime = Date.now() / 1000
            return decodedToken.exp > currentTime
        } catch {
            return false
        }
    }
}

export default new AuthService()