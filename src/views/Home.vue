<template>
  <div style="height: 100vh;" class="home page mt-5">
    <v-container :class="$vuetify.breakpoint.name === 'xs' ? 'pa-0 ma-0' : ''">
      <v-layout row wrap justify-center align-center fill-height>
        <v-flex xs12>
          <v-layout row wrap justify-space-between align-center fill-height>
            <v-flex xs12 sm4>
              <v-card tile class="mx-1 my-2">
                <v-card-title
                  class="hildaLight space-small dark text-xs-center mx-0"
                  style="background-color: var(--e-dark-status-red)"
                >
                  <v-icon class="mr-3">error</v-icon> Critical Cords
                </v-card-title>
                <v-card-text class="text-xs-center">
                  <p class="hildaLight space-small big">
                    {{ criticalCords.length }}
                  </p>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4>
              <v-card tile class="mx-1 my-2">
                <v-card-title
                  class="hildaLight space-small dark text-xs-center mx-0"
                  style="background-color: var(--e-dark-status-orange)"
                >
                  <v-icon class="mr-3">warning</v-icon> Moderate Cords
                </v-card-title>
                <v-card-text class="text-xs-center">
                  <p class="hildaLight space-small big">
                    {{ moderateCords.length }}
                  </p>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4>
              <v-card tile class="mx-1 my-2">
                <v-card-title
                  class="hildaLight space-small dark text-xs-center mx-0"
                  style="background-color: var(--e-dark-status-green)"
                >
                  <v-icon class="mr-3">info</v-icon> New Cords
                </v-card-title>
                <v-card-text class="text-xs-center">
                  <p class="hildaLight space-small big">
                    {{ newCords.length }}
                  </p>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs12 v-if="$vuetify.breakpoint.name !== 'xs'">
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

        <v-flex v-else xs12 v-for="(item, index) in gridItems" :key="index">
          <v-card tile class="my-3">
            <v-card-title
              class="hildaLight space-small mx-0 mt-0 bg white--text"
            >
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <v-layout row wrap fill-height>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Application"
                    :value="item.app"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Category"
                    :value="item.category"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Duration"
                    :value="computeDuration(item.openedOn)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    readonly
                    v-model="item.description"
                    label="Description"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn block color="primary" :to="`/cord/${item._id}`">
                View Details
                <v-icon class="ml-2">navigate_next</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
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
import { socketMixin } from "../mixins/socketMixin";

const ICONS = {
  info: "mdi-information",
  warning: "mdi-alert",
  error: "mdi-alert-circle",
  success: "mdi-check-circle"
};

export default {
  name: "home",
  mixins: [themeMixin, cordMixin, alertMixin, socketMixin],
  components: {
    JwtExpiry,
    MenuBtn,
    Grid
  },
  computed: {
    gridItems: {
      get: function() {
        return this.$store.getters.gridItems;
      },
      set: function(payload) {
        this.$store.commit("gridItems", payload);
      }
    }
  },
  data: () => ({
    criticalCords: [],
    moderateCords: [],
    newCords: [],
    loading: false,
    headers: [
      { text: "Title", align: "left", value: "title" },
      { text: "Name", align: "left", value: "name" },
      { text: "App", align: "left", value: "app" },
      { text: "Category", align: "left", value: "category" },
      { text: "Duration", align: "left", value: "duration" },
      { text: "Hero", align: "left", value: "hero" }
    ]
  }),
  beforeDestroy() {},
  created() {
    this.getCordGridItems();
  },
  mounted() {
    if (this.selectedCord) {
      this.leaveSelectedCordRoom(this.selectedCord._id);
    }
  },
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
          this.setAlert(
            err.error ||
              err.message ||
              err.response.data.error ||
              "Unknown error occurred",
            "#DC2D37",
            0
          );
          this.loading = false;
        });
    }
  },
  watch: {
    gridItems: function() {
      //debugger;
      const _this = this;
      this.criticalCords = this.gridItems.filter(function(elem) {
        return _this.computeDuration(elem.openedOn).includes("Days");
      });

      this.moderateCords = this.gridItems.filter(function(elem) {
        return (
          !_this.computeDuration(elem.openedOn).includes("Days") &&
          _this.computeDuration(elem.openedOn).includes("Hrs")
        );
      });

      this.newCords = this.gridItems.filter(function(elem) {
        return (
          !_this.computeDuration(elem.openedOn).includes("Days") &&
          !_this.computeDuration(elem.openedOn).includes("Hrs")
        );
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
