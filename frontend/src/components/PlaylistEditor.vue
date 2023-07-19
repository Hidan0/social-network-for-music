<script setup lang="ts">
import FormControl from "./ui/FormControl.vue";
import FormCheckBox from "./ui/FormCheckBox.vue";
import { computed, ref } from "vue";
import usePlaylistStore from "../stores/playlist";

const $playlist = usePlaylistStore();

defineProps({
  id: {
    type: String,
    required: true,
  },
});

const currentTitle = ref($playlist.title!);
const currentDescription = ref($playlist.description!);
const currentTags = computed(() => {
  return $playlist.tags!.join(" ").toString();
});
const currentIsPrivate = ref($playlist.isPrivate!);
</script>

<template>
  <div
    class="modal fade"
    :id="id"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
  >
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
          <form class="needs-validation" novalidate @submit.prevent="">
            <FormControl
              type="text"
              id="title"
              label="Title"
              v-model:value="currentTitle"
            />
            <FormControl
              type="text"
              id="description"
              label="Description"
              v-model:value="currentDescription"
            />
            <FormControl
              type="text"
              id="tags"
              label="Tags"
              v-model:value="currentTags"
            />
            <FormCheckBox
              id="isPrivate"
              label="Private playlist"
              v-model:value="currentIsPrivate"
            />
            <div class="d-grid mt-4">
              <button type="submit" class="btn btn-spt-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
