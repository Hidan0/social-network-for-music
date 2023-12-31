<script setup lang="ts">
import { PropType } from "vue";
import usePlaylistStore from "../stores/playlist";
import { TrackData } from "../stores/playlist/types";
import { convertMsToTime } from "../utils";

import DeleteBtn from "./ui/DeleteBtn.vue";

const $playlist = usePlaylistStore();

const props = defineProps({
  track: {
    type: Object as PropType<TrackData>,
    required: true,
  },
  playlistId: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  userCanRemove: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (event: "removed"): void;
}>();

const removeTrack = async () => {
  try {
    await $playlist.removeTrackFromPlaylist(props.track.id, props.playlistId);
    emit("removed");
  } catch (error: any) {
    console.log(error);
  }
};
</script>

<template>
  <div class="row align-items-center text-center px-2 py-1 track">
    <div class="col-1">{{ index }}</div>
    <div class="col-3 col-md-auto">
      <img :src="track.imgSrc" />
    </div>
    <div class="col-6 col-sm">
      <div class="row text-spt-primary">{{ track.name }}</div>
      <div class="row text-secondary">{{ track.artist }}</div>
    </div>
    <div class="col d-none d-md-block">{{ track.album }}</div>
    <div class="col-1 d-none d-md-block">
      {{ convertMsToTime(track.duration) }}
    </div>
    <div class="col-1" v-if="userCanRemove">
      <DeleteBtn @click="removeTrack" />
    </div>
  </div>
</template>

<style scoped lang="css">
.track:hover {
  border: 1px solid #169c46;
  border-radius: 50rem;
}
</style>
