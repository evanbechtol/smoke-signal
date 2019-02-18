<template>
  <div style="height: 100vh;" class="home page">
    <v-container :class="$vuetify.breakpoint.name === 'xs' ? 'pa-0 ma-0' : ''">
      <v-layout row wrap justify-center align-center fill-height>
        <v-flex xs12>
          <grid :headers="headers" :items="items">
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
import MenuBtn from "../components/MenuBtn";
import JwtExpiry from "../components/JWTExpiry";
import Grid from "../components/Grid";

const COLORS = ["info", "warning", "error", "success"];
const ICONS = {
  info: "mdi-information",
  warning: "mdi-alert",
  error: "mdi-alert-circle",
  success: "mdi-check-circle"
};

export default {
  name: "home",
  mixins: [themeMixin],
  components: {
    JwtExpiry,
    MenuBtn,
    Grid
  },
  computed: {},
  data: () => ({
    menuItems: [
      { title: "Some Action 1" },
      { title: "Some Action 2" },
      { title: "Some Action 3" },
      { title: "Some Action 4" }
    ],
    headers: [
      { text: "Name", align: "left", value: "name" },
      { text: "App", align: "left", value: "app" },
      { text: "Category", align: "left", value: "category" },
      { text: "Duration", align: "left", value: "duration" },
      { text: "Hero", align: "left", value: "hero" }
    ],
    items: [
      {
        name: "VDC 01",
        app: 72,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: null
      },
      {
        name: "VDC 02",
        app: 56,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: "eevabec"
      },
      {
        name: "VDC 03",
        app: 98,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: null
      },
      {
        name: "VDC 04",
        app: 45,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: "eevabec"
      },
      {
        name: "VDC 05",
        app: 32,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: null
      },
      {
        name: "VDC 06",
        app: 55,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: "eevabec"
      },
      {
        name: "VDC 07",
        app: 81,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: null
      },
      {
        name: "VDC 08",
        app: 34,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: "eevabec"
      },
      {
        name: "VDC 09",
        app: 25,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: null
      },
      {
        name: "VDC 10",
        app: 26,
        category: "Troubleshooting",
        duration: "1 hour",
        hero: "eevabec"
      }
    ]
  }),
  beforeDestroy() {},
  created() {},
  mounted() {},
  methods: {
    genColor() {
      return COLORS[Math.floor(Math.random() * 3)];
    },
    genIcon(color) {
      return ICONS[color];
    }
  }
};
</script>

<style scoped>
.dashCard {
  height: 320px;
}
</style>
