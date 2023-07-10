import { createRouter, createWebHistory } from "vue-router";

// import config from "./config";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("./pages/HomePage.vue"),
    },
    {
      name: "register",
      path: "/register",
      component: () => import("./pages/RegisterPage.vue"),
    },
    {
      name: "login",
      path: "/login",
      component: () => import("./pages/LoginPage.vue"),
    },
    {
      name: "playlist",
      path: "/playlist",
      component: () => import("./pages/PlaylistDashboard.vue"),
    },
  ],
});

export default router;
