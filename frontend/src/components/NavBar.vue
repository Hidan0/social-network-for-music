<script setup lang="ts">
import useUserStore from "../stores/user";
import router from "../router";

const $user = useUserStore();

const logout = () => {
  $user.logout();
  router.push({ name: "login" });
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <RouterLink class="navbar-brand text-spt-primary" :to="{ name: 'home' }">
        SNM - Spotify
      </RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar"
        aria-controls="offcanvasNavbar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div class="offcanvas-header">
          <h5
            class="offcanvas-title text-spt-primary"
            id="offcanvasNavbarLabel"
          >
            Menu
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'home' }">
                <i class="fa-solid fa-house"></i> Home
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'explore' }">
                <i class="fa-solid fa-globe"></i> Explore
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'library' }">
                <i class="fa-solid fa-chart-simple"></i> Library
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'edit-user' }">
                <i class="fa-solid fa-user"></i> User
              </RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link text-danger" @click="logout">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
