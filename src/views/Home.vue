<template>
  <div style="height: 100vh;" class="home page mt-5">
    <v-container :class="$vuetify.breakpoint.name === 'xs' ? 'pa-0 ma-0' : ''">
      <v-layout row wrap justify-center align-center fill-height>
        <v-flex xs12>
          <grid
            :headers="headers"
            :items="gridItems"
            :loading="loading"
            v-on:refreshCordGrid="getCordGridItems"
          >
            <template v-slot:title>
              <h1>Active Cords</h1>
            </template>
          </grid>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import MenuBtn from "../components/MenuBtn";
import JwtExpiry from "../components/JWTExpiry";
import Grid from "../components/Grid";

const ICONS = {
  info: "mdi-information",
  warning: "mdi-alert",
  error: "mdi-alert-circle",
  success: "mdi-check-circle"
};

export default {
  name: "home",
  mixins: [themeMixin, cordMixin],
  components: {
    JwtExpiry,
    MenuBtn,
    Grid
  },
  computed: {},
  data: () => ({
    loading: false,
    menuItems: [
      { title: "Some Action 1" },
      { title: "Some Action 2" },
      { title: "Some Action 3" },
      { title: "Some Action 4" }
    ],
    headers: [
      { text: "Title", align: "left", value: "title" },
      { text: "Name", align: "left", value: "name" },
      { text: "App", align: "left", value: "app" },
      { text: "Category", align: "left", value: "category" },
      { text: "Duration", align: "left", value: "duration" },
      { text: "Hero", align: "left", value: "hero" }
    ],
    gridItems: []
  }),
  beforeDestroy() {},
  created() {
    this.getCordGridItems();
  },
  mounted() {},
  methods: {
    genIcon(color) {
      return ICONS[color];
    },
    getCordGridItems() {
      this.loading = true;
      this.getCords()
        .then(response => {
          this.gridItems = response.data.data;
          this.loading = false;
        })
        .catch(err => {
          alertMixin.setAlert(
            err.error || err.message || "Unknown error occurred",
            "#DC2D37",
            0
          );
          this.loading = false;
        });
    }
  }
};
</script>

<style scoped>
.dashCard {
  height: 320px;
}
</style>
