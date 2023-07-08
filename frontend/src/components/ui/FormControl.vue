<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: "text",
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
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
  valid: {
    default: false,
    type: Boolean,
  },
  validMessage: {
    default: "Looks good!",
    type: String,
  },
  invalid: {
    default: false,
    type: Boolean,
  },
  invalidMessage: {
    default: "Can't be blank!",
    type: String,
  },
  value: {
    default: "",
    type: String,
  },
});
</script>

<template>
  <div class="form-floating mb-3">
    <input
      :type="type"
      class="form-control"
      :id="id"
      :required="required"
      :placeholder="placeholder"
      :value="value"
    />
    <label :for="id">{{ label }}</label>
    <div v-if="valid" class="valid-feedback">
      {{ validMessage }}
    </div>
    <div v-if="invalid" class="invalid-feedback">
      {{ invalidMessage }}
    </div>
  </div>
</template>
