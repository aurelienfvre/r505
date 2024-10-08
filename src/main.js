import Vue from 'vue'
import App from './App.vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

Vue.use(PiniaVuePlugin)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

new Vue({
  render: h => h(App),
  pinia
}).$mount('#app')