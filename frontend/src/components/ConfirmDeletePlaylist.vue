<script setup lang="ts">
import { ref } from "vue";
import usePlaylistStore from "../stores/playlist";

import router from "../router";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

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
});

const isSubmitting = ref(false);

const deletePlaylist = async () => {
  isSubmitting.value = true;

  try {
    await $playlist.deletePlaylist(props.playlistId);

    vuert.emit({
      message: "Playlist deleted! Redirecting to library...",
      timeout: 500,
      icon: "fa-circle-check",
      type: "success",
      dismissible: true,
    });

    setTimeout(() => {
      router.push({ name: "library" });
    }, 900);
  } catch (error: any) {
    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }

  isSubmitting.value = false;
};
</script>

<template>
  <div class="modal fade" :id="id" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" :id="`${id}Title`">Edit playlist</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row my-1">
            <h5>
              Are you sure you want to
              <span class="text-danger">delete</span> this playlist?
            </h5>
          </div>
          <div class="row">
            <div class="col">
              <div class="d-grid">
                <button
                  type="button"
                  class="btn btn-danger"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  :class="isSubmitting ? 'disabled' : ''"
                  @click="deletePlaylist"
                >
                  <span
                    v-if="isSubmitting"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Delete playlist
                </button>
              </div>
            </div>
            <div class="col">
              <div class="d-grid">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
