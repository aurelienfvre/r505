import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import MoviesView from "@/views/MoviesView.vue";
import ActorsView from "@/views/ActorsView.vue";
import CategoriesView from "@/views/CategoriesView.vue";
import ProfileView from "@/views/ProfileView.vue";
import MovieDetailView from "@/views/MovieDetailView.vue";
import ActorDetailView from "@/views/ActorDetailView.vue";
import AuthService from "@/services/auth.service";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/movies",
    name: "Movies",
    component: MoviesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/movies/:id",
    name: "MovieDetail",
    component: MovieDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/actors",
    name: "Actors",
    component: ActorsView,
    meta: { requiresAuth: true },
  },
  {
    path: "/actors/:id",
    name: "ActorDetail",
    component: ActorDetailView,
    meta: { requiresAuth: true },
  },
  {
    path: "/categories",
    name: "Categories",
    component: CategoriesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfileView,
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = AuthService.getToken();
    if (!token || !AuthService.isTokenValid()) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
