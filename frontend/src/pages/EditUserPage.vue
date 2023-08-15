<script setup lang="ts">
import SuspenseLayout from "../components/layout/SuspenseLayout.vue";
import Spinner from "../components/ui/Spinner.vue";
import FormControl from "../components/ui/FormControl.vue";
import UserFavoritesPill from "../components/UserFavoritesPill.vue";
import { computed, reactive, ref } from "vue";
import useUserState from "../stores/user";
import { useVuert } from "@byloth/vuert";
import { Ref } from "vue";
import { registerSchema, updateOnlyInfoSchema } from "../utils/validator";
import router from "../router";

const vuert = useVuert();
const $user = useUserState();

const avaiableGenres: Ref<string[]> = ref([]);
const isFetchingGenres = ref(false);
const hasFailedFetchingGenres = ref(false);
const fetchAvaiableGenres = async () => {
  try {
    isFetchingGenres.value = true;
    hasFailedFetchingGenres.value = false;

    avaiableGenres.value = await $user.getAvaiableGenres();

    isFetchingGenres.value = false;
  } catch (error: any) {
    isFetchingGenres.value = false;
    hasFailedFetchingGenres.value = true;

    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
};
fetchAvaiableGenres();

const isAddingGenre = ref(false);
const userGenres = computed(() => $user.favoriteGenres);
const updateFavGenres = async () => {
  try {
    if (selectedGenre.value === "") return;
    isAddingGenre.value = true;

    await $user.addGenreToFavorites(selectedGenre.value);

    isAddingGenre.value = false;
    vuert.emit({
      message: `${selectedGenre.value} added to your favorite genres`,
      timeout: 500,
      icon: "fa-circle-check",
      type: "success",
      dismissible: true,
    });
  } catch (error: any) {
    isAddingGenre.value = false;
    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
};

const selectedGenre = ref("");
const onChangeGenre = (evt: Event) => {
  selectedGenre.value = (evt.target as HTMLSelectElement).value;
};

const searchArtistInput = ref("");
const fetchedArtists: Ref<string[]> = ref([]);
const searchArtists = async () => {
  if (searchArtistInput.value.length <= 2) {
    fetchedArtists.value = [];
    selectedArtist.value = "";
    return;
  }
  fetchedArtists.value = await $user.searchArtists(searchArtistInput.value);
};

const selectedArtist = ref("");
const onChangeArtist = (evt: Event) => {
  selectedArtist.value = (evt.target as HTMLSelectElement).value;
};

const userArtists = computed(() => $user.favoriteArtists);

const isAddingArtist = ref(false);
const updateFavArtists = async () => {
  try {
    if (selectedArtist.value === "") return;
    isAddingArtist.value = false;

    await $user.addArtistToFavorites(selectedArtist.value);

    isAddingArtist.value = false;
    vuert.emit({
      message: `${selectedGenre.value} added to your favorite genres`,
      timeout: 500,
      icon: "fa-circle-check",
      type: "success",
      dismissible: true,
    });
  } catch (error: any) {
    isAddingArtist.value = false;
    vuert.emit({
      message: error.message,
      timeout: 2500,
      icon: "fa-circle-exclamation",
      type: "error",
      dismissible: true,
    });
  }
};

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

const email = ref($user.email!);
const username = ref($user.username!);
const name = ref($user.name!);
const password = ref("");
const confirmPassword = ref("");

const isSubmitting = ref(false);
const updateUserInfo = async () => {
  isSubmitting.value = true;

  let res;
  if (password.value === "" && confirmPassword.value === "")
    res = updateOnlyInfoSchema.safeParse({
      email: email.value,
      name: name.value,
      username: username.value,
    });
  else
    res = registerSchema.safeParse({
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
    if (
      email.value === $user.email &&
      username.value === $user.username &&
      name.value === $user.name &&
      password.value === "" &&
      confirmPassword.value === ""
    ) {
      isSubmitting.value = false;
      vuert.emit({
        message: "Nothing to update!",
        icon: "fa-circle-info",
        timeout: 1000,
        type: "info",
        dismissible: true,
      });
      return;
    }

    if (password.value === "" && confirmPassword.value === "") {
      await $user.updateUserInfo({
        email: email.value,
        username: username.value,
        name: name.value,
      });
    } else {
      await $user.updateUserInfo({
        email: email.value,
        username: username.value,
        name: name.value,
        password: password.value,
      });
    }

    vuert.emit({
      message: `User info updated successfully!`,
      icon: "fa-circle-check",
      timeout: 1000,
      type: "success",
      dismissible: true,
    });
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

const deleteAccount = async () => {
  try {
    await $user.deleteUser();
    setTimeout(() => {
      router.push({ name: "register" });
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
};
</script>

<template>
  <div class="container text-center">
    <div class="row align-items-center text-center">
      <div class="col">
        <h2 class="text-spt-primary my-3 text-start">
          <span class="fa-solid fa-user"></span>
          Your profile
        </h2>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col">
        <h4 class="text-spt-primary my-3 text-start">Favorite genres</h4>
        <SuspenseLayout
          :loading="isFetchingGenres"
          :failed="hasFailedFetchingGenres"
        >
          <template #loader>
            <div class="row">
              <div class="d-flex justify-content-center">
                <Spinner />
              </div>
            </div>
          </template>
          <template #default>
            <form
              class="needs-validation"
              novalidate
              @submit.prevent="updateFavGenres"
            >
              <div class="row">
                <div class="col">
                  <select
                    class="form-select"
                    aria-label="Default select example"
                    @change="onChangeGenre"
                  >
                    <option selected>Select genre</option>
                    <option v-for="genre in avaiableGenres" :value="genre">
                      {{ genre }}
                    </option>
                  </select>
                </div>
                <div class="col-3">
                  <div class="d-grid">
                    <button
                      type="submit"
                      class="btn btn-spt-primary"
                      :class="isAddingGenre ? 'disabled' : ''"
                    >
                      <span
                        v-if="isAddingGenre"
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span
                      >Add genre
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div class="row justify-content-center mt-2">
              <div class="col col-lg-6 col-xl-6 col-xxl-6">
                <UserFavoritesPill
                  v-for="_genre in userGenres"
                  :genre="_genre"
                />
              </div>
            </div>
          </template>
          <template #error>
            <div class="row">
              <h5 class="my-4 text-danger">
                <span class="fa-solid fa-circle-exclamation"></span>
                Something went wrong
                <span class="fa-solid fa-circle-exclamation"></span>
              </h5>
              <p>
                We're sorry, but we were unable to load music genres!.<br />
                This could be due to various and multiple reasons... Please, try
                again.
              </p>
            </div>
          </template>
        </SuspenseLayout>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col">
        <h4 class="text-spt-primary my-3 text-start">Favorite artists</h4>
        <form
          class="needs-validation"
          novalidate
          @submit.prevent="updateFavArtists"
        >
          <div class="row">
            <div class="col">
              <input
                type="text"
                class="form-control"
                placeholder="Search artist"
                @input="searchArtists"
                v-model="searchArtistInput"
              />
            </div>
            <div class="col">
              <select
                class="form-select"
                aria-label="Default select example"
                @change="onChangeArtist"
              >
                <option selected>Select artist</option>
                <option v-for="artist in fetchedArtists" :value="artist">
                  {{ artist }}
                </option>
              </select>
            </div>
            <div class="col-3">
              <div class="d-grid">
                <button
                  type="submit"
                  class="btn btn-spt-primary"
                  :class="isAddingArtist ? 'disabled' : ''"
                >
                  <span
                    v-if="isAddingArtist"
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span
                  >Add artist
                </button>
              </div>
            </div>
          </div>
        </form>
        <div class="row justify-content-center mt-2">
          <div class="col col-lg-6 col-xl-6 col-xxl-6">
            <UserFavoritesPill
              :is-genre="false"
              v-for="artist in userArtists"
              :artist="artist"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col mb-4">
        <h4 class="text-spt-primary my-3 text-start">User info</h4>

        <div class="col">
          <form
            class="needs-validation"
            novalidate
            @submit.prevent="updateUserInfo"
          >
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
                >Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col mb-4">
        <h4 class="text-danger my-3 text-start">Danger zone</h4>
        <div class="d-grid">
          <button type="button" class="btn btn-danger" @click="deleteAccount">
            Delete account (IRREVERSIBLE)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
