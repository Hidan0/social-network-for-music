<script setup lang="ts">
import { computed } from "vue";
import NavBar from "./components/NavBar.vue";
import Alert from "./components/ui/Alert.vue";
import useUserStore from "./stores/user";
import router from "./router";

const $user = useUserStore();

const showBar = computed(() => {
  return (
    $user.isLogged &&
    router.currentRoute.value.name !== "login" &&
    router.currentRoute.value.name !== "register"
  );
});
</script>

<template>
  <NavBar v-if="showBar" />
  <div class="container position-absolute top-10 start-50 translate-middle-x">
    <div class="row justify-content-center">
      <Alert />
    </div>
  </div>
  <RouterView></RouterView>
</template>

<style lang="scss">
@import "@/assets/scss/index";
</style>
