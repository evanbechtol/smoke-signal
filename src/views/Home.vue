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
      { text: "Title", align: "left", value: "title" },
      { text: "Name", align: "left", value: "name" },
      { text: "App", align: "left", value: "app" },
      { text: "Category", align: "left", value: "category" },
      { text: "Duration", align: "left", value: "duration" },
      { text: "Hero", align: "left", value: "hero" }
    ],
    items: [
      {
        title: "500 Status code on login",
        name: "Evan Bechtol",
        app: "Knowledge Catalog",
        category: "Authentication",
        duration: "1 Day 5 hours",
        hero: null
      },
      {
        title: "Button mis-alignment",
        name: "Paul Lamb",
        app: "Ericsson Virtual Assistant",
        category: "Troubleshooting",
        duration: "10 minutes",
        hero: "eevabec"
      },
      {
        title: "Unable to register app",
        name: "Evan Bechtol",
        app: "E-Auth",
        category: "Bug Fix",
        duration: "3 hours",
        hero: null
      },
      {
        title: "Module Not Found",
        name: "Paul Lamb",
        app: "E-Auth",
        category: "Deployment",
        duration: "1 hour",
        hero: "eevabec"
      },
      {
        title: "MySQL has gone away",
        name: "Ravish NV.",
        app: "EAMS",
        category: "Database Error",
        duration: "30 minutes",
        hero: null
      },
      {
        title: "Test 1234 failed",
        name: "Maya K.",
        app: "EAMS",
        category: "Testing and Validation",
        duration: "6 hours",
        hero: "eevabec"
      },
      {
        title: "Unable to reach COP",
        name: "Ravish NV.",
        app: "EAMS",
        category: "Troubleshooting",
        duration: "5 minutes",
        hero: null
      },
      {
        title: "T-Mobile portal build failed",
        name: "Raghavendra",
        app: "Customer Portal",
        category: "Deployment",
        duration: "4 hours",
        hero: "eevabec"
      },
      {
        title: "Undefined variable error",
        name: "Raghavendra",
        app: "Customer Portal",
        category: "Debugging",
        duration: "1 hour 10 minutes",
        hero: null
      },
      {
        title: "Function not being called",
        name: "Raghavendra",
        app: "Customer Portal",
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
