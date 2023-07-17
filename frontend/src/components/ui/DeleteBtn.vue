<script setup lang="ts">
const emit = defineEmits<{
  (event: "click"): void;
}>();

const handleClick = () => {
  emit("click");
};
</script>

<template>
  <button
    type="button"
    class="btn btn-danger btn-sm rounded-5"
    @click="handleClick"
  >
    <span class="fa-solid fa-times text-white"></span>
  </button>
</template>
