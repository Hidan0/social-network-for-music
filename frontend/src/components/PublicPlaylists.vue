<script setup lang="ts">
import { Ref, onMounted, ref } from "vue";

import PlaylistCard from "./ui/PlaylistCard.vue";
import { PlaylistData } from "../stores/playlist/types";

import usePlaylistStore from "../stores/playlist";

const $playlist = usePlaylistStore();

const empty = ref(true);
const playlists: Ref<PlaylistData[]> = ref([]);

const onMount = async () => {
  try {
    const data = await $playlist.getPublicPlaylists();

    if (data) {
      empty.value = false;
      playlists.value = data;
    }
  } catch (error: any) {}
};

onMounted(onMount);
</script>

<template>
  <div class="container text-center mt-5">
    <div class="row" v-if="!empty">
      <div class="col mb-3" v-for="playlist in playlists">
        <PlaylistCard
          :title="playlist.title"
          :author="playlist.author.username"
          :description="playlist.description"
          :tags="playlist.tags"
          :id="playlist._id"
        />
      </div>
    </div>
    <div class="row" v-if="empty">
      <h3 class="text-spt-primary">There is no public playlist!</h3>
      <p><a class="fw-bold text-spt-primary">Create one</a> yourself!</p>
      <!-- TODO -->
    </div>
  </div>
</template>
