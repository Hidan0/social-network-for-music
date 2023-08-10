<script setup lang="ts">
import PublicPlaylists from "../components/PublicPlaylists.vue";
import useUserState from "../stores/user";

const $user = useUserState();

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const checkIfUserHasSetFavGenres = async () => {
  try {
    if ($user.favoriteGenres === undefined) {
      vuert.emit({
        message:
          "Something went wrong loading user data, please try again later",
        icon: "fa-circle-exclamation",
        timeout: 2500,
        type: "error",
        dismissible: true,
      });
    }

    if ($user.favoriteGenres!.length > 0) return;

    vuert.emit({
      message: "You have not set your favorite genres yet!",
      icon: "fa-triangle-exclamation",
      timeout: 2500,
      type: "warning",
      dismissible: true,
    });
  } catch (error: any) {
    vuert.emit({
      message: `Can not check user favorites due to ${error.message}`,
      icon: "fa-circle-exclamation",
      timeout: 2500,
      type: "error",
      dismissible: true,
    });
  }
};

checkIfUserHasSetFavGenres();
</script>

<template>
  <div class="container text-center">
    <div class="row align-items-center text-center">
      <div class="col">
        <h2 class="text-spt-primary my-3 text-start">
          <span class="fa-solid fa-home"></span>
          Home page
        </h2>
      </div>
    </div>
    <div class="row my-1">
      <PublicPlaylists />
    </div>
    <div class="row my-1">
      <div class="col">
        <p>
          Didn't find what you were looking for? <br />
          Try to search
          <RouterLink class="fw-bold text-spt-primary" :to="{ name: 'explore' }"
            >here</RouterLink
          >!
        </p>
      </div>
    </div>
  </div>
</template>
