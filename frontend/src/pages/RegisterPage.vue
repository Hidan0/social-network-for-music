<script lang="ts" setup>
import { reactive, ref } from "vue";
import FormControl from "../components/ui/FormControl.vue";
import { registerSchema } from "../utils/validator";
import axios from "axios";
import { API_URL } from "../utils/config";
import router from "../router";

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

const email = ref("");
const username = ref("");
const name = ref("");
const password = ref("");
const confirmPassword = ref("");

const onSubmit = async () => {
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
    return;
  }

  Object.entries(validation).forEach(([_, value]) => {
    value.valid = true;
    value.invalid = false;
    value.message = "";
  });

  try {
    await axios.post(`${API_URL}/auth/register`, {
      email: email.value,
      username: username.value,
      name: name.value,
      password: password.value,
    });

    console.log(`Success! Welcome ${name.value}! Redirecting to login page`);
    router.push({ name: "login" });
  } catch (error: any) {
    console.log(error.response.data.message);
  }
};
</script>

<template>
  <div class="container mt-4 text-center">
    <div class="row">
      <div class="col">
        <h1 class="text-primary">Register</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <p><span class="text-primary">Sign up</span> to unlock all features.</p>
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
            <button type="submit" class="btn btn-primary">Register</button>
          </div>
        </form>
      </div>
      <div class="row">
        <p class="text-secondary mt-2">
          Already have and account?
          <RouterLink :to="{ name: 'login' }" class="fw-bold">Login</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
