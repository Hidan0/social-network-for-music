<script setup lang="ts">
import { Ref, ref } from "vue";
import PublicPlaylists from "../components/PublicPlaylists.vue";
import SuspenseLayout from "../components/layout/SuspenseLayout.vue";
import SearchTrackRow from "../components/SearchTrackRow.vue";
import Spinner from "../components/ui/Spinner.vue";

import useUserState from "../stores/user";
import usePlaylistStore from "../stores/playlist";

const $user = useUserState();
const $playlist = usePlaylistStore();

import { useVuert } from "@byloth/vuert";
import { PlaylistData, TrackData } from "../stores/playlist/types";

const vuert = useVuert();

const checkIfUserHasSetFavGenres = async () => {
  try {
    if ($user.favoriteGenres === undefined) {
      vuert.emit({
        message:
          "Something went wrong loading user data, please try again later",
        icon: "fa-circle-exclamation",
        timeout: 2500,
        type: "error",
        dismissible: true,
      });
    }

    if ($user.favoriteGenres!.length > 0) return;

    vuert.emit({
      message: "You have not set your favorite genres yet!",
      icon: "fa-triangle-exclamation",
      timeout: 2500,
      type: "warning",
      dismissible: true,
    });
  } catch (error: any) {
    vuert.emit({
      message: `Can not check user favorites due to ${error.message}`,
      icon: "fa-circle-exclamation",
      timeout: 2500,
      type: "error",
      dismissible: true,
    });
  }
};

checkIfUserHasSetFavGenres();

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

const userPlaylists: Ref<{ id: string; title: string }[]> = ref([]);

const emptyTrackResults = ref(false);
const searchResults: Ref<TrackData[]> = ref([]);

const isFetching = ref(false);
const hasFailed = ref(false);
const fetchRecommendations = async () => {
  isFetching.value = true;
  hasFailed.value = false;

  try {
    searchResults.value = await $playlist.getTracksFromRecommendations();

    if (searchResults.value.length === 0) emptyTrackResults.value = true;
    else emptyTrackResults.value = false;

    isFetching.value = false;
  } catch (error: any) {
    vuert.emit({
      message: `Can not download recommendations due to ${error.message}`,
      icon: "fa-circle-exclamation",
      timeout: 2500,
      type: "error",
      dismissible: true,
    });
    hasFailed.value = true;
  }
  isFetching.value = false;
};

const canFetchRecommendations = ref(false);
if ($user.favoriteGenres !== undefined && $user.favoriteGenres.length > 0) {
  canFetchRecommendations.value = true;
  fetchRecommendations();
}
</script>

<template>
  <div class="container text-center">
    <div class="row align-items-center text-center">
      <div class="col">
        <h2 class="text-spt-primary my-3 text-start">
          <span class="fa-solid fa-home"></span>
          Home page
        </h2>
      </div>
    </div>
    <div class="row my-1">
      <PublicPlaylists />
    </div>
    <div class="row my-1">
      <div class="col">
        <h4 class="text-spt-primary my-3 text-start">Recommendations</h4>
        <SuspenseLayout
          :loading="isFetching"
          :failed="hasFailed"
          v-if="canFetchRecommendations"
        >
          <template #loader>
            <div class="row justify-content-center mt-3">
              <Spinner />
            </div>
          </template>
          <template #default>
            <p class="text-start">Here some songs that you might like</p>
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
          </template>
          <template #error>
            <div class="row">
              <h3 class="my-4 text-danger">
                <span class="fa-solid fa-circle-exclamation"></span>
                Something went wrong
                <span class="fa-solid fa-circle-exclamation"></span>
              </h3>
              <p>
                We're sorry, but we were unable to download raccomandations.<br />
                This could be due to various and multiple reasons... Please, try
                again.
              </p>
            </div>
          </template>
        </SuspenseLayout>
        <div v-else class="row">
          <div class="col text-warning">
            <p>
              <i class="fa-regular fa-face-sad-tear"></i> We can not recommend
              anything if you don't set your favorites genres!
            </p>
          </div>
        </div>
      </div>
      <div class="row my-1">
        <div class="col">
          <p>
            Didn't find what you were looking for? <br />
            Try to search
            <RouterLink
              class="fw-bold text-spt-primary"
              :to="{ name: 'explore' }"
              >here</RouterLink
            >!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
