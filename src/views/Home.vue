<template>
  <div style="height: 100vh;" class="home page mt-5">
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
        id: 1,
        title: "500 Status code on login",
        name: "Evan Bechtol",
        app: "Knowledge Catalog",
        category: "Authentication",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: null,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 2,
        title: "Button mis-alignment",
        name: "Paul Lamb",
        app: "Ericsson Virtual Assistant",
        category: "Troubleshooting",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: "eevabec",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 3,
        title: "Unable to register app",
        name: "Evan Bechtol",
        app: "E-Auth",
        category: "Bug Fix",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: null,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 4,
        title: "Module Not Found",
        name: "Paul Lamb",
        app: "E-Auth",
        category: "Deployment",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: "eevabec",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 5,
        title: "MySQL has gone away",
        name: "Ravish NV.",
        app: "EAMS",
        category: "Database Error",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: null,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 6,
        title: "Test 1234 failed",
        name: "Maya K.",
        app: "EAMS",
        category: "Testing and Validation",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: "eevabec",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 7,
        title: "Unable to reach COP",
        name: "Ravish NV.",
        app: "EAMS",
        category: "Troubleshooting",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: null,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 8,
        title: "T-Mobile portal build failed",
        name: "Raghavendra",
        app: "Customer Portal",
        category: "Deployment",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: "eevabec",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 9,
        title: "Undefined variable error",
        name: "Raghavendra",
        app: "Customer Portal",
        category: "Debugging",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: null,
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
      },
      {
        id: 10,
        title: "Function not being called",
        name: "Raghavendra",
        app: "Customer Portal",
        category: "Troubleshooting",
        openedOn: generateRandomDate(new Date(2019, 0, 1), new Date()),
        hero: "eevabec",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ornare suspendisse sed nisi lacus."
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

function generateRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}
</script>

<style scoped>
.dashCard {
  height: 320px;
}
</style>
