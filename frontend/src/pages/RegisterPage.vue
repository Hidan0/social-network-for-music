<script lang="ts" setup>
import { reactive, ref } from "vue";
import FormControl from "../components/ui/FormControl.vue";
import { registerSchema } from "../utils/validator";
import router from "../router";
import useUserStore from "../stores/user";

import { useVuert } from "@byloth/vuert";

const vuert = useVuert();

const validation = reactive({
  email: {
    invalid: false,
    valid: false,
    message: "",
  },
  username: {
    invalid: false,
    valid: false,
    message: "",
  },
  name: {
    valid: false,
    invalid: false,
    message: "",
  },
  password: {
    valid: false,
    invalid: false,
    message: "",
  },
  confirmPassword: {
    valid: false,
    invalid: false,
    message: "",
  },
});

const $user = useUserStore();

const email = ref("");
const username = ref("");
const name = ref("");
const password = ref("");
const confirmPassword = ref("");

const isSubmitting = ref(false);

const onSubmit = async () => {
  isSubmitting.value = true;

  let res = registerSchema.safeParse({
    email: email.value,
    username: username.value,
    name: name.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
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
    await $user.register({
      email: email.value,
      username: username.value,
      name: name.value,
      password: password.value,
    });

    vuert.emit({
      message: `Success! Welcome ${$user.name}! Redirecting to login page`,
      timeout: 500,
      type: "success",
      dismissible: true,
    });

    setTimeout(() => {
      router.push({ name: "login" });
    }, 900);
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
  <div class="container mt-4 text-center">
    <div class="row">
      <div class="col">
        <h1 class="text-spt-primary">Register</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <p>
          <span class="text-spt-primary">Sign up</span> to unlock all features.
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
            v-model:value="username"
            id="username"
            label="Username"
            :invalid="validation.username.invalid"
            :valid="validation.username.valid"
            :invalid-message="validation.username.message"
          />
          <FormControl
            v-model:value="name"
            id="name"
            label="Name"
            :invalid="validation.name.invalid"
            :valid="validation.name.valid"
            :invalid-message="validation.name.message"
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
          <FormControl
            v-model:value="confirmPassword"
            type="password"
            id="confirmPassword"
            label="Confirm password"
            :invalid="validation.confirmPassword.invalid"
            :valid="validation.confirmPassword.valid"
            :invalid-message="validation.confirmPassword.message"
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
              ></span
              >Register
            </button>
          </div>
        </form>
      </div>
      <div class="row">
        <p class="text-secondary mt-2">
          Already have and account?
          <RouterLink :to="{ name: 'login' }" class="fw-bold text-spt-primary"
            >Login</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
