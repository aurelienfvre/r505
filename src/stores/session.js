import { defineStore } from "pinia";
import AuthService from '@/services/auth.service'

export const useSession = defineStore('session', {
    persist: true,
    state: () => ({
        user: null,
        loggedIn: false
    }),
    actions: {
        async login({ email, password }) {
            try {
                const response = await AuthService.login(email, password)
                this.loggedIn = true
                this.user = {
                    email: email,
                    token: response.token
                }
                return Promise.resolve()
            } catch (error) {
                this.loggedIn = false
                this.user = null
                return Promise.reject(error)
            }
        },
        logout() {
            AuthService.logout()
            this.loggedIn = false
            this.user = null
        }
    }
})