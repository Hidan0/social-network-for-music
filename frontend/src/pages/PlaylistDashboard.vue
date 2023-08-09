<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import { useRoute } from "vue-router";
import usePlaylistStore from "../stores/playlist";
import { TrackData } from "../stores/playlist/types";
import useUserStore from "../stores/user";

import { convertMsToTime } from "../utils";

import TrackRow from "../components/TrackRow.vue";
import SubscribeButton from "../components/SubscribeButton.vue";
import SuspenseLayout from "../components/layout/SuspenseLayout.vue";

import CollaboratorManager from "../components/CollaboratorManager.vue";
const collabManagerId = "manageCollabs";

import PlaylistEditor from "../components/PlaylistEditor.vue";
const editPlaylistId = "editPlaylist";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const route = useRoute();

const $playlist = usePlaylistStore();
const $user = useUserStore();

const playlistId = computed((): string => {
  if (typeof route.params.id === "string") return route.params.id;
  else return route.params.id[0];
});

const playlistTracks: Ref<TrackData[]> = ref([]);
const numeberOfTraks = ref(0);
const totalDuration = ref("");

const authorName = ref("");

const userIsACollab = ref(false);
const userIsOwner = ref(false);

const isFetching = ref(true);
const hasFailed = ref(false);
const fetchData = async () => {
  try {
    isFetching.value = true;
    hasFailed.value = false;

    await $playlist.setPlaylist(playlistId.value);

    authorName.value = await $user.getUsernameFromUserId($playlist.author!);

    if ($playlist.collaborators!.includes($user.id!))
      userIsACollab.value = true;
    if ($playlist.author! === $user.id!) userIsOwner.value = true;

    const tracksId = $playlist.tracks!;
    numeberOfTraks.value = tracksId.length;

    if (tracksId.length > 0) {
      try {
        const tracks = await $playlist.getTracks(tracksId);
        playlistTracks.value = tracks;

        let dur = 0;
        tracks.forEach((track: TrackData) => {
          dur += track.duration;
        });

        totalDuration.value = convertMsToTime(dur);
      } catch (error: any) {
        hasFailed.value = true;
        vuert.emit({
          message: error.message,
          timeout: 2500,
          icon: "fa-circle-exclamation",
          type: "error",
          dismissible: true,
        });
      }
    }

    isFetching.value = false;
  } catch (error: any) {
    isFetching.value = false;
    hasFailed.value = true;
    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
};

fetchData();
</script>

<template>
  <div class="container">
    <SuspenseLayout :loading="isFetching" :failed="hasFailed">
      <template #loader>
        <div class="row mt-4 border-bottom">
          <div class="col">
            <p><span class="placeholder col-3"></span></p>
            <h1 class="text-white"><span class="placeholder col-7"></span></h1>
            <p><span class="placeholder col-5"></span></p>
          </div>
        </div>
        <div class="row justify-content-center mt-3">
          <div class="spinner-border text-spt-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </template>
      <template #default>
        <CollaboratorManager
          :id="collabManagerId"
          :playlist-id="playlistId"
          @updated="fetchData"
        />
        <PlaylistEditor
          :id="editPlaylistId"
          :playlist-id="playlistId"
          @updated="fetchData"
        />
        <div class="row mt-4">
          <div class="col">
            <p>
              {{ $playlist.isPrivate ? "Private Playlist" : "Public Playlist" }}
            </p>
            <h1 class="text-white">{{ $playlist.title! }}</h1>
            <p class="mb-1">
              {{ authorName }} ● {{ numeberOfTraks }} songs {{ totalDuration }}
            </p>
          </div>
        </div>
        <div class="row border-bottom mb-2">
          <div class="col-1" v-if="!userIsOwner">
            <SubscribeButton
              :playlist-id="playlistId"
              v-model:is-following="userIsACollab"
            />
          </div>
          <div class="col-1" v-if="userIsOwner">
            <button
              class="btn rounded-5"
              data-bs-toggle="modal"
              :data-bs-target="'#' + collabManagerId"
            >
              <span class="fa-solid fa-users"></span>
            </button>
          </div>
          <div class="col-1" v-if="userIsOwner">
            <button
              class="btn rounded-5"
              data-bs-toggle="modal"
              :data-bs-target="'#' + editPlaylistId"
            >
              <span class="fa-regular fa-pen-to-square"></span>
            </button>
          </div>
        </div>
        <div class="row">
          <div class="col" v-if="playlistTracks.length !== 0">
            <TrackRow
              v-for="(track, index) in playlistTracks"
              :index="index + 1"
              :track="track"
              :playlist-id="playlistId"
              @removed="fetchData"
            />
          </div>
          <div class="col text-center mt-3" v-else>
            <h5 v-if="userIsOwner || userIsACollab">
              <RouterLink class="text-spt-primary" :to="{ name: 'explore' }"
                >Add</RouterLink
              >
              some songs!
            </h5>
            <h5 v-else>
              <i class="fa-solid fa-robot"></i> this place looks so empty...
            </h5>
          </div>
        </div>
      </template>
      <template #error>
        <div class="row">
          <h3 class="my-4 text-danger">
            <span class="fa-solid fa-circle-exclamation"></span>
            Something went wrong
            <span class="fa-solid fa-circle-exclamation"></span>
          </h3>
          <p>
            We're sorry, but we were unable to load this playlist data.<br />
            This could be due to various and multiple reasons... Please, try
            again or get back to the
            <RouterLink class="text-spt-primary" :to="{ name: 'home' }"
              >home</RouterLink
            >.
          </p>
        </div>
      </template>
    </SuspenseLayout>
  </div>
</template>
