<script setup lang="ts">
import useUserState from "../stores/user";
import { useVuert } from "@byloth/vuert";

const vuert = useVuert();
const $user = useUserState();

const props = defineProps({
  isGenre: {
    type: Boolean,
    default: true,
  },
  genre: {
    type: String,
  },
  artist: {
    type: String,
  },
});

const handleClick = async () => {
  try {
    if (props.isGenre) await $user.removeGenreFromFavorites(props.genre);
    else await $user.removeArtistFromFavorites(props.artist);

    vuert.emit({
      message: `${
        props.isGenre ? props.genre : props.artist
      } removed successfully`,
      timeout: 500,
      icon: "fa-circle-info",
      type: "info",
      dismissible: true,
    });
  } catch (error: any) {
    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
};
</script>

<template>
  <div
    class="badge rounded-pill text-bg-spt-primary mx-1"
    style="width: fit-content"
  >
    <div class="row">
      <div class="col">
        {{ isGenre ? genre : artist }}
      </div>
      <div class="col-auto" style="cursor: pointer" @click="handleClick">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
  </div>
</template>
