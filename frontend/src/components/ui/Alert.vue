<script setup lang="ts">
import { AlertHandler } from "@byloth/vuert";

const boostrapAdapter = (type: string) => {
  switch (type) {
    case "error":
      return "danger";
    default:
      return type;
  }
};
</script>

<template>
  <AlertHandler v-slot="{ alert, isOpen, resolve }">
    <Transition appear name="slide">
      <div
        v-if="isOpen"
        class="alert"
        :class="`alert-${boostrapAdapter(alert.type)}`"
      >
        <span
          v-if="alert.type === 'error'"
          class="fa-solid fa-circle-exclamation"
        ></span>
        <span
          v-else-if="alert.type === 'success'"
          class="fa-solid fa-circle-check"
        ></span>

        {{ alert.message }}
        <button
          v-if="alert.dismissible"
          class="alert__close"
          @click="resolve()"
        >
          <span class="fa-solid fa-circle-xmark"></span>
        </button>
      </div>
    </Transition>
  </AlertHandler>
</template>

<style scoped lang="css">
.alert__close {
  background-color: transparent;
  border: none;
  float: right;
  opacity: 0.5;
  transition: opacity 200ms ease-in-out;
}
.alert__close:hover {
  opacity: 1;
}

.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
