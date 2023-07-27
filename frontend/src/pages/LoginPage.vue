<script lang="ts" setup>
import { reactive, ref } from "vue";
import FormControl from "../components/ui/FormControl.vue";
import { loginWithEmailSchema } from "../utils/validator";
import router from "../router";
import useUserStore from "../stores/user";
import usePlaylistStore from "../stores/playlist";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const email = ref("");
const password = ref("");

const $user = useUserStore();
const $playlist = usePlaylistStore();

const validation = reactive({
  email: {
    invalid: false,
    valid: false,
    message: "",
  },
  password: {
    valid: false,
    invalid: false,
    message: "",
  },
});

const isSubmitting = ref(false);

const onSubmit = async () => {
  isSubmitting.value = true;

  const res = loginWithEmailSchema.safeParse({
    email: email.value,
    password: password.value,
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
    await $user.login({
      email: email.value,
      password: password.value,
    });

    vuert.emit({
      message: `Success! Welcome back ${$user.name}! Redirecting to home page`,
      icon: "fa-circle-check",
      timeout: 500,
      type: "success",
      dismissible: true,
    });

    $playlist.$reset();

    setTimeout(() => {
      router.push({ name: "home" });
    }, 900);
  } catch (error: any) {
    vuert.emit({
      message: error.message,
      icon: "fa-circle-exclamation",
      timeout: 2500,
      type: "error",
      dismissible: true,
    });
  }

  isSubmitting.value = false;
};
</script>

<template>
  <div class="container mt-4 text-center">
    <div class="row">
      <div class="col">
        <h1 class="text-spt-primary">Login</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <p>
          Access your <span class="text-spt-primary">account</span> to unlock
          all features.
        </p>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col col-lg-6 col-xl-6 col-xxl-6">
        <form class="needs-validation" novalidate @submit.prevent="onSubmit">
          <FormControl
            v-model:value="email"
            type="email"
            id="email"
            label="Email address"
            :invalid="validation.email.invalid"
            :valid="validation.email.valid"
            :invalid-message="validation.email.message"
          />
          <FormControl
            v-model:value="password"
            type="password"
            id="password"
            label="Password"
            :invalid="validation.password.invalid"
            :valid="validation.password.valid"
            :invalid-message="validation.password.message"
          />
          <div class="d-grid mt-4">
            <button
              type="submit"
              class="btn btn-spt-primary"
              :class="isSubmitting ? 'disabled' : ''"
            >
              <span
                v-if="isSubmitting"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Login
            </button>
          </div>
        </form>
      </div>
      <div class="row">
        <p class="text-secondary mt-2">
          Don't have and account?
          <RouterLink
            :to="{ name: 'register' }"
            class="fw-bold text-spt-primary"
            >Register</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
