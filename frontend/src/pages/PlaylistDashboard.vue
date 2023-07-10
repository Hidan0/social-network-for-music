<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const playlistId = route.params.id;
</script>

<template>
  <div class="container">
    {{ playlistId }}
  </div>
</template>
