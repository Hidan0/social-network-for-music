<script setup lang="ts">
import { Ref, ref } from "vue";

import SuspenseLayout from "../components/layout/SuspenseLayout.vue";
import PlaylistCard from "../components/ui/PlaylistCard.vue";
import { PlaylistData } from "../stores/playlist/types";

import usePlaylistStore from "../stores/playlist";
import useUserStore from "../stores/user";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const $playlist = usePlaylistStore();
const $user = useUserStore();

const empty = ref(true);
const playlists: Ref<PlaylistData[]> = ref([]);
const isFetching = ref(true);
const hasFailed = ref(false);

const loadPublicPlaylists = async () => {
  try {
    let data = await $playlist.getPlaylists();

    if (data) {
      empty.value = false;

      await Promise.all(
        data.map(async (playlist: PlaylistData) => {
          const authorName = await $user.getUsernameFromUserId(playlist.author);
          playlist.author = authorName;
          return playlist;
        })
      );

      playlists.value = data;
    }

    isFetching.value = false;
  } catch (error: any) {
    hasFailed.value = true;
    vuert.emit({
      message: error.message,
      icon: "fa-circle-exclamation",
      timeout: 2500,
      type: "error",
      dismissible: true,
    });
  }
};

loadPublicPlaylists();
</script>

<template>
  <div class="container text-center">
    <h2 class="text-spt-primary my-3 text-start">
      <span class="fa-solid fa-chart-simple"></span>
      Your playlists
    </h2>
    <SuspenseLayout :loading="isFetching" :failed="hasFailed">
      <template #loader>
        <div class="row">
          <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <div class="row" v-if="!empty">
          <div class="col-auto mb-3" v-for="playlist in playlists">
            <PlaylistCard
              :title="playlist.title"
              :author="playlist.author"
              :description="playlist.description"
              :tags="playlist.tags"
              :id="playlist._id"
            />
          </div>
        </div>
        <div class="row" v-if="empty">
          <h5>Your library looks so empty...</h5>
          <!-- TODO -->
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
            We're sorry, but we were unable to load your playlists!.<br />
            This could be due to various and multiple reasons... Please, try
            again.
          </p>
        </div>
      </template>
    </SuspenseLayout>
  </div>
</template>