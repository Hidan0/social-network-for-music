<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "Playlist title",
  },
  author: {
    type: String,
    default: "Author",
  },
  description: {
    type: String,
    defeault: "",
  },
  tags: {
    type: [String],
    default: [],
  },
});
</script>

<template>
  <div class="card" style="width: 18rem">
    <h6 v-if="tags" class="card-header">
      <div class="row">
        <div
          v-for="tag in tags"
          class="tag border border-success bg-spt-primary rounded-4 text-dark me-1 mt-1 ph-2"
        >
          #{{ tag }}
        </div>
      </div>
    </h6>
    <div class="card-body">
      <h5 class="card-title">{{ title }}</h5>
      <p class="card-text">{{ description }}</p>
    </div>
    <div class="card-footer text-body-secondary">by {{ author }}</div>
  </div>
</template>

<style scoped lang="css">
.tag {
  width: fit-content;
}
</style>
