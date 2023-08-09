<script setup lang="ts">
import SuspenseLayout from "../components/layout/SuspenseLayout.vue";
import Spinner from "../components/ui/Spinner.vue";
import GenrePill from "../components/GenrePill.vue";
import { computed, ref } from "vue";
import useUserState from "../stores/user";
import { useVuert } from "@byloth/vuert";
import { Ref } from "vue";

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
const onChange = (evt: Event) => {
  selectedGenre.value = (evt.target as HTMLSelectElement).value;
};

const searchArtistInput = ref("");
const fetchedArtists: Ref<string[]> = ref([]);
const searchArtists = async () => {
  if (searchArtistInput.value.length <= 2) {
    fetchedArtists.value = [];
    return;
  }
  fetchedArtists.value = await $user.searchArtists(searchArtistInput.value);
};

const updateFavArtists = async () => {};
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
                    @change="onChange"
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
                <GenrePill v-for="_genre in userGenres" :genre="_genre" />
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
                @change="onChange"
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
                  :class="isAddingGenre ? 'disabled' : ''"
                >
                  <span
                    v-if="isAddingGenre"
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
          <div class="col col-lg-6 col-xl-6 col-xxl-6"></div>
        </div>
      </div>
    </div>
  </div>
</template>
