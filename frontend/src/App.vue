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

<template class="content-wrapper">
  <div class="content-wrapper">
    <NavBar v-if="showBar" />
    <div
      class="container position-fixed top-10 start-50 translate-middle-x alert_index"
    >
      <div class="row justify-content-center">
        <Alert />
      </div>
    </div>
    <RouterView></RouterView>
    <div class="footer text-center justify-content-center bg-body-tertiary">
      <div class="row align-self-center">
        <div class="row">
          <div class="col">
            Built by
            <a
              href="https://github.com/Hidan0"
              class="text-spt-primary"
              target="_blank"
              >Riccardo Monilia</a
            >
          </div>
        </div>
        <div class="row">
          <div class="col">
            <a
              href="https://github.com/Hidan0/social-network-for-music"
              class="text-spt-primary"
              target="_blank"
              >Source code</a
            >

            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              class="text-spt-primary"
              target="_blank"
            >
              (CC-BY-NC-SA 4.0)</a
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/scss/index";

.alert_index {
  z-index: 1057;
}
.content-wrapper {
  margin: 0 0 100px;
}

.footer {
  display: flex;
  position: absolute;
  bottom: 0;
  height: 100px;
  width: 100%;
  overflow: hidden;
}
</style>
