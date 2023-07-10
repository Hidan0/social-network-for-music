<script setup lang="ts">
import { onMounted } from "vue";
import useUserStore from "../stores/user";
import router from "../router";

import PublicPlaylists from "../components/PublicPlaylists.vue";

const $user = useUserStore();

onMounted(async () => {
  try {
    const isAuth = await $user.verify();
    if (!isAuth) {
      router.push({ name: "login" });
    }
  } catch (error: any) {
    router.push({ name: "login" });
  }
});
</script>

<template>
  <div class="container">
    <div class="row">
      <PublicPlaylists />
    </div>
  </div>
</template>
