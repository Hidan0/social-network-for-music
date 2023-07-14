<script setup lang="ts">
import { onBeforeMount, onMounted, reactive, ref, Ref } from "vue";
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

const playlistData = reactive({
  _id: "",
  author: "",
  title: "",
  description: "",
  tags: [],
  isPrivate: true,
  tracks: [],
  collaborators: [],
} as PlaylistData);

const numeberOfTraks = ref(0);
const totalDuration = ref("");

const authorName = ref("");

const userIsACollab = ref(false);
const userIsOwner = ref(false);

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

    playlistData._id = data._id;
    playlistData.author = data.author;
    playlistData.isPrivate = data.isPrivate;
    playlistData.description = data.description;
    playlistData.tags = data.tags;
    playlistData.tracks = data.tracks;
    playlistData.title = data.title;
    playlistData.collaborators = data.collaborators;

    authorName.value = await $user.getUsernameFromUserId(data.author);

    if (data.collaborators.includes($user.id!)) userIsACollab.value = true;
    if (data.author === $user.id!) userIsOwner.value = true;

    numeberOfTraks.value = data.tracks.length;

    if (data.tracks.length > 0) {
      try {
        const tracks = await $playlist.getTracks(data.tracks);
        playlistTracks.value = tracks;

        let dur = 0;
        tracks.forEach((track: TrackData) => {
          dur += track.duration;
        });

        totalDuration.value = convertMsToTime(dur);
      } catch (error: any) {
        console.log("Can not get tracks");
      }
    }
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
        <p>
          {{ playlistData.isPrivate ? "Private Playlist" : "Public Playlist" }}
        </p>
        <h1 class="text-white">{{ playlistData.title }}</h1>
        <p>{{ authorName }} ● {{ numeberOfTraks }} songs {{ totalDuration }}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-1">
        <button class="btn rounded-5" v-if="userIsACollab">
          <span class="fa-regular fa-user-plus"></span>
        </button>
        <button class="btn rounded-5" v-if="userIsOwner">
          <span class="fa-solid fa-users"></span>
        </button>
      </div>
      <div class="col-1">
        <button class="btn rounded-5">
          <span class="fa-regular fa-pen-to-square"></span>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <TrackRow
          v-for="(track, index) in playlistTracks"
          :index="index + 1"
          :track="track"
          :playlist-id="playlistId"
          @removed="fetchData"
        />
      </div>
    </div>
  </div>
</template>
