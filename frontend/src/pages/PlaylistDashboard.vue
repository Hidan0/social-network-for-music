<script setup lang="ts">
import { onBeforeMount, onMounted, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import usePlaylistStore from "../stores/playlist";
import { PlaylistData, TrackData } from "../stores/playlist/types";
import useUserStore from "../stores/user";

import { convertMsToTime } from "../utils";

import TrackRow from "../components/TrackRow.vue";

const route = useRoute();

const $playlist = usePlaylistStore();
const $user = useUserStore();

const playlistId = route.params.id as string;

const playlistTracks: Ref<TrackData[]> = ref([]);

const title = ref("");
const isPrivate = ref(true);
const author = ref("TODO");
const numeberOfTraks = ref(0);
const totalDuration = ref("");

const checkUser = async () => {
  try {
    const isAuth = await $user.verify();
    if (!isAuth) {
      router.push({ name: "login" });
    }
  } catch (error: any) {
    router.push({ name: "login" });
  }
};

const fetchData = async () => {
  try {
    const data: PlaylistData = await $playlist.getPlaylistById(playlistId);

    isPrivate.value = data.isPrivate;
    title.value = data.title;
    numeberOfTraks.value = data.tracks.length;
    author.value = await $user.getUsernameFromUserId(data.author);

    try {
      const tracks = await $playlist.getTracks(data.tracks);
      playlistTracks.value = tracks;

      let dur = 0;
      tracks.forEach((track: TrackData) => {
        dur += track.duration;
      });

      totalDuration.value = convertMsToTime(dur);
    } catch (_: any) {}
  } catch (error: any) {
    router.push({ name: "home" });
  }
};

onBeforeMount(checkUser);
onMounted(fetchData);
</script>

<template>
  <div class="container">
    <div class="row mt-4 border-bottom">
      <div class="col">
        <p>{{ isPrivate ? "Private Playlist" : "Public Playlist" }}</p>
        <h1 class="text-white">{{ title }}</h1>
        <p>{{ author }} ● {{ numeberOfTraks }} songs {{ totalDuration }}</p>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <TrackRow
          v-for="(track, index) in playlistTracks"
          :index="index + 1"
          :img-src="track.imgSrc"
          :song-title="track.name"
          :song-author="track.artist"
          :song-album="track.album"
          :song-duration="track.duration"
        />
      </div>
    </div>
  </div>
</template>
