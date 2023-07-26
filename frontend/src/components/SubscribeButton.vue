<script setup lang="ts">
import { ref } from "vue";
import usePlaylistStore from "../stores/playlist";
import useUserStore from "../stores/user";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const $playlist = usePlaylistStore();
const $user = useUserStore();

const props = defineProps({
  playlistId: {
    type: String,
    required: true,
  },
  isFollowing: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: "update:is-following", isFollowing: boolean): void;
}>();

const isSubmitting = ref(false);
const toggleFollowPlaylist = async () => {
  isSubmitting.value = true;
  try {
    if (!props.isFollowing) {
      await $playlist.followPlaylist(props.playlistId);

      vuert.emit({
        message: "You started following this playlist!",
        icon: "fa-circle-info",
        timeout: 1000,
        type: "info",
        dismissible: true,
      });
      emit("update:is-following", true);
    } else {
      await $playlist.removeCollaboratorFromPlaylist(
        props.playlistId,
        $user.id!
      );

      vuert.emit({
        message: "You unfollowed this playlist!",
        icon: "fa-circle-info",
        timeout: 1000,
        type: "info",
        dismissible: true,
      });
      emit("update:is-following", false);
    }
  } catch (error: any) {
    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
  isSubmitting.value = false;
};
</script>

<template>
  <button
    type="button"
    class="btn rounded-5"
    :class="isSubmitting ? 'disabled' : ''"
    @click="toggleFollowPlaylist"
  >
    <span v-if="isFollowing" class="fa-regular fa-user-minus"></span>
    <span v-else class="fa-regular fa-user-plus"></span>
  </button>
</template>
