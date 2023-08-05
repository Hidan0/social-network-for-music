<script setup lang="ts">
import { Ref, ref } from "vue";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

import usePlaylistStore from "../stores/playlist";

import Spinner from "../components/ui/Spinner.vue";
import SuspenseLayout from "../components/layout/SuspenseLayout.vue";
import SearchTrackRow from "../components/SearchTrackRow.vue";
import { PlaylistData, TrackData } from "../stores/playlist/types";

const $playlist = usePlaylistStore();

const searchResults: Ref<TrackData[]> = ref([]);

const userPlaylists: Ref<{ id: string; title: string }[]> = ref([]);

const hasNotSearchedYet = ref(true);
const isSearchingTracks = ref(true);

const searchQuery = ref("");
const artistQuery = ref("");
const albumQuery = ref("");
const yearQuery = ref("");

const emptyTrackResults = ref(true);

const isFetchingTrack = ref(true);
const hasFailedTrack = ref(false);
const onSearchTrack = async () => {
  try {
    if (searchQuery.value === "") return;
    isFetchingTrack.value = true;

    const tracks = await $playlist.searchByTrack(
      searchQuery.value,
      artistQuery.value,
      albumQuery.value,
      yearQuery.value
    );

    if (tracks.length === 0) emptyTrackResults.value = true;
    else emptyTrackResults.value = false;

    searchResults.value = tracks;

    hasNotSearchedYet.value = false;

    isFetchingTrack.value = false;
    hasFailedTrack.value = false;
  } catch (error: any) {
    isFetchingTrack.value = false;
    hasFailedTrack.value = true;

    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
};

const isFetchingPlaylist = ref(true);
const hasFailedPlaylist = ref(false);
const onSearchPlaylist = async () => {
  try {
  } catch (error: any) {
    isFetchingPlaylist.value = false;
    hasFailedPlaylist.value = true;

    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
};

const fetchUserPlaylists = async () => {
  try {
    let data = await $playlist.getLibraryPlaylists();

    data.forEach((playlist: PlaylistData) =>
      userPlaylists.value.push({ id: playlist._id, title: playlist.title })
    );
  } catch (error: any) {
    hasFailedTrack.value = true;
    vuert.emit({
      message: error.message,
      icon: "fa-circle-exclamation",
      timeout: 2500,
      type: "error",
      dismissible: true,
    });
  }
};

fetchUserPlaylists();
</script>

<template>
  <div class="container text-center">
    <div class="row align-items-center">
      <div class="col">
        <h2 class="text-spt-primary my-3 text-start">
          <span class="fa-solid fa-globe"></span>
          Explore
        </h2>
      </div>
      <div class="col">
        <span
          class="badge me-1 curs"
          :class="
            isSearchingTracks ? 'text-bg-spt-primary' : 'text-bg-secondary'
          "
          @click="isSearchingTracks = true"
          >Tracks</span
        >
        <span
          class="badge curs"
          :class="
            !isSearchingTracks ? 'text-bg-spt-primary' : 'text-bg-secondary'
          "
          @click="isSearchingTracks = false"
          >Playlists</span
        >
      </div>
    </div>
    <div class="row">
      <div class="col" v-if="isSearchingTracks">
        <form novalidate @submit.prevent="onSearchTrack">
          <div class="row">
            <div class="col">
              <div class="input-group rounded">
                <input
                  v-model="searchQuery"
                  type="search"
                  class="form-control rounded"
                  placeholder="What do you want to listen to?"
                />
                <button type="submit" class="btn btn-outline-spt-primary">
                  <span class="fa-solid fa-search"></span>
                </button>
              </div>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col">
              <input
                v-model="artistQuery"
                type="search"
                class="form-control rounded"
                placeholder="Artist"
              />
            </div>
            <div class="col">
              <input
                v-model="albumQuery"
                type="search"
                class="form-control rounded"
                placeholder="Album"
              />
            </div>
            <div class="col">
              <input
                v-model="yearQuery"
                type="search"
                class="form-control rounded"
                placeholder="Year"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="col" v-else>
        <form novalidate @submit.prevent="onSearchPlaylist">
          <div class="input-group rounded">
            <input
              v-model="searchQuery"
              type="search"
              class="form-control rounded"
              placeholder="Playlist name or tags"
            />
            <button type="submit" class="btn btn-outline-spt-primary">
              <span class="fa-solid fa-search"></span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <div v-if="!hasNotSearchedYet">
        <SuspenseLayout
          :loading="isFetchingTrack"
          :failed="hasFailedTrack"
          v-if="isSearchingTracks"
        >
          <template #loader>
            <div class="row justify-content-center mt-3">
              <Spinner />
            </div>
          </template>
          <template #default>
            <div class="row" v-if="!emptyTrackResults">
              <div class="col mt-2">
                <SearchTrackRow
                  v-for="track in searchResults"
                  :track="track"
                  :user-playlists="userPlaylists"
                />
              </div>
            </div>
            <div class="row" v-else>
              <h5 class="text-secondary mt-3">
                No results found for "{{ searchQuery }}"
              </h5>
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
                We're sorry, but we were unable to search.<br />
                This could be due to various and multiple reasons... Please, try
                again or get back to the
                <RouterLink class="text-spt-primary" :to="{ name: 'home' }"
                  >home</RouterLink
                >.
              </p>
            </div>
          </template>
        </SuspenseLayout>
        <SuspenseLayout
          v-else
          :loading="isFetchingPlaylist"
          :failed="hasFailedPlaylist"
        >
          <template #loader>
            <div class="row justify-content-center mt-3">
              <Spinner />
            </div>
          </template>
          <template #default> </template>
          <template #error>
            <div class="row">
              <h3 class="my-4 text-danger">
                <span class="fa-solid fa-circle-exclamation"></span>
                Something went wrong
                <span class="fa-solid fa-circle-exclamation"></span>
              </h3>
              <p>
                We're sorry, but we were unable to search.<br />
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
    </div>
  </div>
</template>

<style lang="css" scoped>
.curs {
  cursor: pointer;
}
</style>
