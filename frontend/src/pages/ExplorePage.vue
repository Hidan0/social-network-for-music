<script setup lang="ts">
import { Ref, ref } from "vue";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

import usePlaylistStore from "../stores/playlist";
import useUserStore from "../stores/user";

import Spinner from "../components/ui/Spinner.vue";
import PlaylistCard from "../components/ui/PlaylistCard.vue";
import SuspenseLayout from "../components/layout/SuspenseLayout.vue";
import SearchTrackRow from "../components/SearchTrackRow.vue";
import { PlaylistData, TrackData } from "../stores/playlist/types";
import playlist from "../stores/playlist";

const $playlist = usePlaylistStore();
const $user = useUserStore();

const searchResults: Ref<TrackData[]> = ref([]);
const searchResultsPlaylist: Ref<PlaylistData[]> = ref([]);

const userPlaylists: Ref<{ id: string; title: string }[]> = ref([]);

const hasNotSearchedYet = ref(true);
const isSearchingTracks = ref(true);

const searchQuery = ref("");
const artistQuery = ref("");
const albumQuery = ref("");
const yearQuery = ref("");

const searchPlaylistQuery = ref("");

const emptyTrackResults = ref(true);
const isFetching = ref(true);
const hasFailed = ref(false);
const onSearchTrack = async () => {
  try {
    if (searchQuery.value === "") return;

    isFetching.value = true;
    hasFailed.value = false;

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

    isFetching.value = false;
    hasFailed.value = false;
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

const emptyPlaylistsResults = ref(true);
const onSearchPlaylist = async () => {
  try {
    if (searchPlaylistQuery.value === "") return;

    isFetching.value = true;
    hasFailed.value = false;
    emptyPlaylistsResults.value = true;

    const playlists = await $playlist.getAvailablePlaylists();
    hasNotSearchedYet.value = false;

    const keyWords = searchPlaylistQuery.value.toLowerCase().split(" ");

    const titles = playlists.filter((playlist: PlaylistData) => {
      if (
        keyWords.find((word: string) =>
          playlist.title.toLowerCase().includes(word)
        )
      )
        return true;
      else return false;
    });

    const tags = playlists.filter((playlist: PlaylistData) =>
      playlist.tags.find((tag: string) => keyWords.includes(tag.toLowerCase()))
    );

    const data = [...tags, ...titles];

    if (data.length > 0) {
      emptyPlaylistsResults.value = false;
      await Promise.all(
        data.map(async (playlist: PlaylistData) => {
          const authorName = await $user.getUsernameFromUserId(playlist.author);
          playlist.author = authorName;
          return playlist;
        })
      );

      searchResultsPlaylist.value = data;
    }

    isFetching.value = false;
    hasFailed.value = false;
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

const fetchUserPlaylists = async () => {
  try {
    let data = await $playlist.getLibraryPlaylists();

    data.forEach((playlist: PlaylistData) =>
      userPlaylists.value.push({ id: playlist._id, title: playlist.title })
    );
  } catch (error: any) {
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
              v-model="searchPlaylistQuery"
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
        <SuspenseLayout :loading="isFetching" :failed="hasFailed">
          <template #loader>
            <div class="row justify-content-center mt-3">
              <Spinner />
            </div>
          </template>
          <template #default>
            <div v-if="isSearchingTracks">
              <div class="row" v-if="!emptyTrackResults">
                <div class="col mt-3">
                  <SearchTrackRow
                    v-for="track in searchResults"
                    :track="track"
                    :user-playlists="userPlaylists"
                  />
                </div>
              </div>
              <div class="row" v-else>
                <h5 class="text-secondary mt-3">No results found</h5>
              </div>
            </div>
            <div v-else-if="!isSearchingTracks">
              <div class="row" v-if="!emptyPlaylistsResults">
                <div
                  class="col-auto mt-3"
                  v-for="playlist in searchResultsPlaylist"
                >
                  <PlaylistCard
                    :title="playlist.title"
                    :author="playlist.author"
                    :description="playlist.description"
                    :tags="playlist.tags"
                    :id="playlist._id"
                  />
                </div>
              </div>
              <div class="row" v-else>
                <h5 class="text-secondary mt-3">No results found</h5>
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
