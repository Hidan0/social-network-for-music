<script setup lang="ts">
import useUserState from "../stores/user";
import { useVuert } from "@byloth/vuert";

const vuert = useVuert();
const $user = useUserState();

const props = defineProps({
  genre: {
    type: String,
    required: true,
  },
});

const handleClick = async () => {
  try {
    await $user.removeGenreFromFavorites(props.genre);

    vuert.emit({
      message: `${props.genre} removed successfully`,
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
        {{ genre }}
      </div>
      <div class="col-auto" style="cursor: pointer" @click="handleClick">
        <i class="fa-solid fa-xmark"></i>
      </div>
    </div>
  </div>
</template>
