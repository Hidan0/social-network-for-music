<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: "text",
  },
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
  valid: {
    default: false,
    type: Boolean,
  },
  validMessage: {
    default: "",
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

const emit = defineEmits(["update:value"]);

const onInput = (evt: Event) => {
  const input = evt.target as HTMLInputElement;

  emit("update:value", input.value);
};
</script>

<template>
  <div class="mb-3">
    <div
      class="form-floating"
      :class="{ 'is-valid': valid, 'is-invalid': invalid }"
    >
      <input
        :type="type"
        class="form-control"
        :class="{ 'is-valid': valid, 'is-invalid': invalid }"
        :id="id"
        :required="required"
        :placeholder="label"
        :value="value"
        @input="onInput"
      />
      <label :for="id">{{ label }}</label>
    </div>
    <div v-if="valid" class="valid-feedback">
      {{ validMessage }}
    </div>
    <div v-if="invalid" class="invalid-feedback">
      {{ invalidMessage }}
    </div>
  </div>
</template>
