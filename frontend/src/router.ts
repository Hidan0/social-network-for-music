import {
  RouteLocationNormalized,
  RouteRecordRaw,
  createRouter,
  createWebHistory,
} from "vue-router";

import useUserStore from "./stores/user";

export type PageOptions = RouteRecordRaw & {
  meta?: {
    requiresAuth?: boolean;
  };
};

const pages: PageOptions[] = [
  {
    name: "home",
    path: "/",
    component: () => import("./pages/HomePage.vue"),
    meta: {
      requiresAuth: true,
    },
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
    path: "/playlist/:id",
    component: () => import("./pages/PlaylistDashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "library",
    path: "/library",
    component: () => import("./pages/LibraryPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "explore",
    path: "/explore",
    component: () => import("./pages/ExplorePage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    name: "edit-user",
    path: "/user",
    component: () => import("./pages/EditUserPage.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: pages,
});

const getByRoute = (
  route: RouteLocationNormalized
): PageOptions | undefined => {
  return pages.find((page) => {
    const path = page.path.replace(/\/:id/g, "");

    const regex = new RegExp(`^${path}(\/|$)`);
    return regex.test(route.path);
  });
};

router.beforeEach(async (to, _from) => {
  const nextPage = getByRoute(to);

  if (nextPage?.meta?.requiresAuth) {
    const $user = useUserStore();
    const isValid = await $user.verify();
    if (!isValid) {
      router.push({ name: "login" });
    }
  }
});

export default router;
