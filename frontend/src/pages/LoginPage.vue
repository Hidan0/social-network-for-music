<script lang="ts" setup>
import { reactive, ref } from "vue";
import FormControl from "../components/ui/FormControl.vue";
import { loginWithEmailSchema } from "../utils/validator";
import router from "../router";
import useUserStore from "../stores/user";

const email = ref("");
const password = ref("");

const $user = useUserStore();

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

const onSubmit = async () => {
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

    console.log(
      `Success! Welcome back ${$user.name}! Redirecting to home page`
    );
    router.push({ name: "home" });
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};
</script>

<template>
  <div class="container mt-4 text-center">
    <div class="row">
      <div class="col">
        <h1 class="text-primary">Login</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <p>
          Access your <span class="text-primary">account</span> to unlock all
          features.
        </p>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-6">
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
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
      <div class="row">
        <p class="text-secondary mt-2">
          Don't have and account?
          <RouterLink :to="{ name: 'register' }" class="fw-bold"
            >Register</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
</template>
