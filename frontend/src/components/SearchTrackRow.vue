<script setup lang="ts">
import { PropType } from "vue";
import usePlaylistStore from "../stores/playlist";
import { TrackData } from "../stores/playlist/types";
import { convertMsToTime } from "../utils";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const $playlist = usePlaylistStore();

const props = defineProps({
  track: {
    type: Object as PropType<TrackData>,
    required: true,
  },
  userPlaylists: {
    type: Array as PropType<{ id: string; title: string }[]>,
    required: true,
  },
});

const addToPlaylist = async (id: string, title: string) => {
  try {
    await $playlist.addTrackToPlaylist(id, props.track.id);

    vuert.emit({
      message: `${props.track.name} added to playlist ${title}`,
      icon: "fa-circle-check",
      timeout: 500,
      type: "success",
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
  <div class="row align-items-center text-center px-2 py-1 track">
    <div class="col-3 col-md-auto">
      <img :src="track.imgSrc" />
    </div>
    <div class="col-7 col-sm">
      <div class="row text-spt-primary">{{ track.name }}</div>
      <div class="row text-secondary">{{ track.artist }}</div>
    </div>
    <div class="col d-none d-md-block">{{ track.album }}</div>
    <div class="col-1 d-none d-md-block">
      {{ convertMsToTime(track.duration) }}
    </div>
    <div class="col-1">
      <button
        class="btn"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="fa-regular fa-square-plus text-spt-primary"></span>
      </button>
      <ul class="dropdown-menu">
        <li v-for="playlist in userPlaylists">
          <a
            class="dropdown-item"
            @click="addToPlaylist(playlist.id, playlist.title)"
            >{{ playlist.title }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="css">
.track:hover {
  border: 1px solid #169c46;
  border-radius: 50rem;
}
</style>
