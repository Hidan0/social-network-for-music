<script setup lang="ts"></script>

<template>
  <nav class="navbar bg-body-tertiary">
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
              <RouterLink class="nav-link active" :to="{ name: 'home' }">
                Home
              </RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Explore</a>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" :to="{ name: 'library' }">
                Library
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
