<script lang="ts" setup>
import { ref } from "vue";

import FormControl from "../components/ui/FormControl.vue";

import { loginSchema } from "../utils/validator";

const email = ref("");
const password = ref("");

const onSubmit = async () => {
  let res = loginSchema.safeParse({
    email: email.value,
    password: password.value,
  });

  if (!res.success) {
    console.log("nope");
    return;
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
            placeholder="local-name@domain"
          />
          <FormControl
            v-model:value="password"
            type="password"
            id="password"
            placeholder="Password"
            label="Password"
          />
          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary">Register</button>
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
