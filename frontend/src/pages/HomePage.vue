<script setup lang="ts">
import { onMounted, ref } from "vue";
import useUserStore from "../stores/user";
import router from "../router";

import NavBar from "../components/NavBar.vue";

const $user = useUserStore();

const authenticated = ref("");

onMounted(async () => {
  try {
    const isAuth = await $user.verify();
    if (isAuth) {
      authenticated.value = "Authenticated";
    } else {
      router.push({ name: "login" });
    }
  } catch (error: any) {
    router.push({ name: "login" });
  }
});
</script>

<template>
  <NavBar />
  <h1>{{ authenticated }}</h1>
</template>
