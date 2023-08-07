<script setup lang="ts">
import FormControl from "./ui/FormControl.vue";
import FormCheckBox from "./ui/FormCheckBox.vue";
import { computed, reactive, ref } from "vue";
import usePlaylistStore from "../stores/playlist";

import { createPlaylistSchema } from "../utils/validator";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const $playlist = usePlaylistStore();

const emit = defineEmits<{
  (event: "updated"): void;
}>();

defineProps({
  id: {
    type: String,
    required: true,
  },
});

const title = ref("");
const description = ref("");
const rawTags = ref("");
const tags = computed(() => {
  return rawTags.value.split(" ");
});
const isPrivate = ref(false);

const validation = reactive({
  title: {
    invalid: false,
    valid: false,
    message: "",
  },
  description: {
    valid: false,
    invalid: false,
    message: "",
  },
  tags: {
    invalid: false,
    valid: false,
    message: "",
  },
});

const isSubmitting = ref(false);
const onSubmit = async () => {
  isSubmitting.value = true;

  const res = createPlaylistSchema.safeParse({
    title: title.value,
    description: description.value,
    tags: tags.value,
    isPrivate: isPrivate.value,
  });

  if (!res.success) {
    const issues = res.error.issues;

    Object.entries(validation).forEach(([key, value]) => {
      const issue = issues.find((issue) => issue.path.includes(key));
      if (issue) {
        value.invalid = true;
        value.valid = false;
        value.message = issue.message;
      } else {
        value.valid = true;
        value.invalid = false;
        value.message = "";
      }
    });
    isSubmitting.value = false;
    return;
  }

  Object.entries(validation).forEach(([_, value]) => {
    value.valid = true;
    value.invalid = false;
    value.message = "";
  });

  try {
    await $playlist.createPlaylist({
      title: title.value,
      description: description.value,
      tags: tags.value,
      isPrivate: isPrivate.value,
    });

    vuert.emit({
      message: "Playlist created!",
      timeout: 1000,
      icon: "fa-circle-check",
      type: "success",
      dismissible: true,
    });

    emit("updated");
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
          <h1 class="modal-title fs-5" :id="`${id}Title`">Create playlist</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form class="needs-validation" novalidate @submit.prevent="onSubmit">
            <FormControl
              type="text"
              id="title"
              label="Title"
              v-model:value="title"
              :invalid="validation.title.invalid"
              :valid="validation.title.valid"
              :invalid-message="validation.title.message"
            />
            <FormControl
              type="text"
              id="description"
              label="Description"
              v-model:value="description"
              :invalid="validation.description.invalid"
              :valid="validation.description.valid"
              :invalid-message="validation.description.message"
            />
            <FormControl
              type="text"
              id="tags"
              label="Tags"
              v-model:value="rawTags"
              :invalid="validation.tags.invalid"
              :valid="validation.tags.valid"
              :invalid-message="validation.tags.message"
            />
            <FormCheckBox
              id="isPrivate"
              label="Private playlist"
              v-model:value="isPrivate"
            />
            <div class="d-grid mt-4">
              <button type="submit" class="btn btn-spt-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
