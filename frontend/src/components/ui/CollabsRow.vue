<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

import useUserStore from "../../stores/user";
import usePlaylistStore from "../../stores/playlist";

import DeleteBtn from "./DeleteBtn.vue";

const $user = useUserStore();
const $playlist = usePlaylistStore();

const props = defineProps({
  playlistId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (event: "removed"): void;
}>();

const username = ref("");

const loadUsername = async () => {
  try {
    const _username = await $user.getUsernameFromUserId(props.userId);

    username.value = _username;
  } catch (error: any) {
    console.log("Can not get " + props.userId);
  }
};

const removeCollaborator = async () => {
  try {
    await $playlist.removeCollaboratorFromPlaylist(
      props.playlistId,
      props.userId
    );
    emit("removed");
  } catch (error: any) {
    console.log("Can not remove collaborator " + props.userId);
  }
};

onBeforeMount(loadUsername);
</script>

<template>
  <div class="row align-items-center text-left px-2 py-1">
    <div class="col">{{ username }}</div>
    <div class="col-2">
      <DeleteBtn @click="removeCollaborator" />
    </div>
  </div>
</template>
