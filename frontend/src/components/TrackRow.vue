<script setup lang="ts">
import { PropType } from "vue";
import usePlaylistStore from "../stores/playlist";
import { TrackData } from "../stores/playlist/types";
import { convertMsToTime } from "../utils";

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
  <div class="row align-items-center text-center px-2 py-1">
    <div class="col-1">{{ index }}</div>
    <div class="col-3 col-md-auto">
      <img :src="track.imgSrc" />
    </div>
    <div class="col">
      <div class="row text-spt-primary">{{ track.name }}</div>
      <div class="row text-secondary">{{ track.artist }}</div>
    </div>
    <div class="col d-none d-md-block">{{ track.album }}</div>
    <div class="col-1 d-none d-md-block">
      {{ convertMsToTime(track.duration) }}
    </div>
    <div class="col-1">
      <button class="btn btn-danger btn-sm rounded-5" @click="removeTrack">
        <span class="fa-solid fa-times text-white"> </span>
      </button>
    </div>
  </div>
</template>
