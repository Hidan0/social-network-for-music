<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import useUserStore from "./stores/user";

const $user = useUserStore();
</script>

<template>
  <NavBar v-if="$user.isLogged" />
  <RouterView></RouterView>
</template>

<style lang="scss">
@import "@/assets/scss/index";
</style>
