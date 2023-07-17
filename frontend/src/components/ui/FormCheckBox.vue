<script setup lang="ts">
defineProps({
  id: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  required: {
    default: false,
    type: Boolean,
  },
  value: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{ (event: "update", value: boolean) }>();

const onInput = (evt: Event) => {
  const input = evt.target as HTMLInputElement;

  emit("update", input.value as unknown as boolean);
};
</script>

<template>
  <div class="mb-3">
    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        :id="id"
        :checked="value"
        :name="id"
        @input="onInput"
        :required="required"
      />
      <label class="form-check-label" :for="id">{{ label }}</label>
    </div>
  </div>
</template>
