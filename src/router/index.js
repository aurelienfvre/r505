import Vue from 'vue'
import VueRouter from 'vue-router'
import IcecreamStore from '../components/IcecreamStore.vue'
import TemperatureFaces from '../components/TemperatureFaces.vue'
import MonkeyEmojis from '../components/MonkeyEmojis.vue'
import LoginForm from '../components/LoginForm.vue'
import BasketComponent from '../components/BasketComponent.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: { template: '<div>Welcome to Vue Exercises</div>' }
    },
    { path: '/icecream', name: 'Icecream', component: IcecreamStore },
    { path: '/temperature', name: 'Temperature', component: TemperatureFaces },
    { path: '/monkeys', name: 'Monkeys', component: MonkeyEmojis },
    { path: '/login', name: 'Login', component: LoginForm },
    { path: '/basket', name: 'Basket', component: BasketComponent }
]

const router = new VueRouter({
    routes
})

export default router