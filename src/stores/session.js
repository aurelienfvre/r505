import { defineStore } from "pinia";

export const useSession = defineStore('session', {
    persist: true,
    state: () => ({
        user: null,
        loggedIn: false
    }),
    actions: {
        login(credentials) {
            // Ici, vous devriez normalement faire une requête à votre API pour vérifier les identifiants
            if (credentials.email === 'test@test.com' && credentials.password === 'test1234') {
                this.loggedIn = true;
                this.user = { email: credentials.email };
                return Promise.resolve();
            } else {
                return Promise.reject('Identifiants invalides');
            }
        },
        logout() {
            this.loggedIn = false;
            this.user = null;
        }
    }
});