<script setup lang="ts">
import usePlaylistStore from "../stores/playlist";
import { convertMsToTime } from "../utils";

const $playlist = usePlaylistStore();

const props = defineProps({
  id: {
    type: String,
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
  imgSrc: {
    type: String,
    required: true,
  },
  songTitle: {
    type: String,
    required: true,
  },
  songAuthor: {
    type: String,
    required: true,
  },
  songAlbum: {
    type: String,
    required: true,
  },
  songDuration: {
    type: Number,
    required: true,
  },
});

const removeTrack = async () => {
  try {
    await $playlist.removeTrackFromPlaylist(props.id, props.playlistId);
  } catch (error: any) {
    console.log(error);
  }
};
</script>

<template>
  <div class="row align-items-center text-center px-2 py-1">
    <div class="col-1">{{ index }}</div>
    <div class="col-3 col-md-auto">
      <img :src="imgSrc" />
    </div>
    <div class="col">
      <div class="row text-spt-primary">{{ songTitle }}</div>
      <div class="row text-secondary">{{ songAuthor }}</div>
    </div>
    <div class="col d-none d-md-block">{{ songAlbum }}</div>
    <div class="col-1 d-none d-md-block">
      {{ convertMsToTime(songDuration) }}
    </div>
    <div class="col-1">
      <span
        class="fa-solid fa-times bg-danger rounded-5 text-white px-2 py-1"
        style="cursor: pointer"
        @click="removeTrack"
      >
      </span>
    </div>
  </div>
</template>
