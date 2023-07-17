<script setup lang="ts">
import { PropType } from "vue";

import CollabsRow from "./ui/CollabsRow.vue";

const emit = defineEmits<{
  (event: "updated"): void;
}>();

defineProps({
  id: {
    type: String,
    required: true,
  },
  collabIds: {
    type: Array as PropType<string[]>,
    required: true,
  },
  playlistId: {
    type: String,
    required: true,
  },
});

const updatedCollaborators = () => emit("updated");
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
          <h1 class="modal-title fs-5" :id="`${id}Title`">
            Manage collaborators
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row" v-if="collabIds.length === 0">
            <h5 class="text-center">
              No collaborators <span class="fa-regular fa-face-sad-tear"></span>
            </h5>
          </div>
          <CollabsRow
            v-for="collabId in collabIds"
            :playlist-id="playlistId"
            :user-id="collabId"
            @removed="updatedCollaborators"
          />
        </div>
      </div>
    </div>
  </div>
</template>
