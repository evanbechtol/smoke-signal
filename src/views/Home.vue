<template>
  <div style="height: 100vh;" class="home page mt-5">
    <v-container :class="isSmall ? 'pa-0 ma-0' : ''">
      <v-layout row wrap justify-center align-center fill-height>
        <v-flex xs12 class="hidden-xs-only">
          <v-layout row wrap justify-space-between align-center fill-height>
            <v-flex xs12 sm4>
              <v-card tile flat :dark="isDark" class="mx-1 my-2">
                <v-card-title
                  class="hildaLight space-small dark text-xs-center mx-0"
                  style="background-color: var(--e-dark-status-red)"
                >
                  <v-icon class="mr-3">error</v-icon> Critical Cords
                </v-card-title>
                <v-card-text class="text-xs-center">
                  <v-tooltip bottom offset-y>
                    <template #activator="data">
                      <!-- <v-btn
                        v-on="data.on"
                        dark
                        large
                        fab
                        style="font-size: 2em;"
                        color="error"
                      >
                        {{ criticalCords.length }}
                      </v-btn>-->
                      <circle-card
                        color="error"
                        :value="criticalCords.length"
                      ></circle-card>
                    </template>
                    <span>Toggle Viewing Critical Cords</span>
                  </v-tooltip>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4>
              <v-card tile flat :dark="isDark" class="mx-1 my-2">
                <v-card-title
                  class="hildaLight space-small dark text-xs-center mx-0"
                  style="background-color: var(--e-dark-status-orange)"
                >
                  <v-icon class="mr-3">warning</v-icon> Moderate Cords
                </v-card-title>
                <v-card-text class="text-xs-center">
                  <v-tooltip bottom offset-y>
                    <template #activator="data">
                      <!--<v-btn
                        v-on="data.on"
                        dark
                        large
                        fab
                        style="font-size: 2em;"
                        color="orangeWarning"
                      >
                        {{ moderateCords.length }}
                      </v-btn>-->
                      <circle-card
                        color="orangeWarning"
                        :value="moderateCords.length"
                      ></circle-card>
                    </template>
                    <span>Toggle Viewing Moderate Cords</span>
                  </v-tooltip>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4>
              <v-card tile flat :dark="isDark" class="mx-1 my-2">
                <v-card-title
                  class="hildaLight space-small dark text-xs-center mx-0"
                  style="background-color: var(--e-dark-status-green)"
                >
                  <v-icon class="mr-3">info</v-icon> New Cords
                </v-card-title>
                <v-card-text class="text-xs-center">
                  <v-tooltip bottom offset-y>
                    <template #activator="data">
                      <!--<v-btn
                        v-on="data.on"
                        dark
                        large
                        fab
                        style="font-size: 2em;"
                        color="success"
                      >
                        {{ newCords.length }}
                      </v-btn>-->
                      <circle-card
                        color="success"
                        :value="newCords.length"
                      ></circle-card>
                    </template>
                    <span>Toggle Viewing New Cords</span>
                  </v-tooltip>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs12 v-if="!isSmall">
          <grid
            :headers="headers"
            :items="filteredGridItems"
            :loading="loading"
            v-on:refreshCordGrid="getCordGridItems"
          >
            <template v-slot:title>
              <v-select
                dense
                solo-inverted
                flat
                class="mt-3"
                v-model="selectItemType"
                :items="selectItems"
                item-text="label"
                item-value="value"
              ></v-select>
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
import { authMixin } from "../mixins/authMixin";
import CircleCard from "../components/CircleCard";

export default {
  name: "home",
  mixins: [themeMixin, cordMixin, alertMixin, socketMixin, authMixin],
  components: {
    CircleCard,
    JwtExpiry,
    MenuBtn,
    Grid
  },
  computed: {
    filteredGridItems: function() {
      return this.gridItemType === "all"
        ? this.gridItems
        : this.gridItemType === "criticalCords"
        ? this.criticalCords
        : this.gridItemType === "moderateCords"
        ? this.moderateCords
        : this.gridItemType === "newCords"
        ? this.newCords
        : this.myCords;
    },
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
    myCords: [],
    newCords: [],
    gridItemType: "all",
    selectItemType: "all",
    selectItems: [
      { label: "All Cords", value: "all" },
      { label: "Critical Cords", value: "criticalCords" },
      { label: "Moderate Cords", value: "moderateCords" },
      { label: "My Cords", value: "myCords" },
      { label: "New Cords", value: "newCords" }
    ],
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
    },
    updateGridItems(itemType) {
      this.gridItemType = this.selectedItemType =
        this.gridItemType === itemType ? "all" : itemType;
    }
  },
  watch: {
    selectItemType: function(value) {
      this.gridItemType = value;
    },
    gridItems: function() {
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

      this.myCords = this.gridItems.filter(function(elem) {
        return elem.puller.username === _this.user.username;
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
