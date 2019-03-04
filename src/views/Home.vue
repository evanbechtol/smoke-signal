<template>
  <div style="height: 100vh;" class="home page mt-5">
    <v-container fluid :class="isSmall ? 'pa-0 ma-0' : ''">
      <v-layout
        v-if="isAuthenticated && user"
        row
        wrap
        justify-center
        align-center
        fill-height
      >
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

        <!-- For large screens -->
        <v-flex xs12 v-if="!isSmall">
          <!--<v-card
            class="animated fast slideInRight"
            :dark="isDark"
            :color="`accent ${darken}`"
            height="200px"
          >
            <v-card-title class="hildaLight ma-0 pt-4 pl-3 pb-0 bg">
              <v-layout row wrap fill-height justify-start align-center>
                <v-flex xs12 sm4>
                  <v-select
                    dense
                    solo-inverted
                    flat
                    dark
                    v-model="selectItemType"
                    :items="selectItems"
                    item-text="label"
                    item-value="value"
                    :hint="`Number of cords: ${filteredGridItems.length}`"
                    persistent-hint
                  >
                  </v-select>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex shrink>
                  <v-tooltip right class="ml-3">
                    <template #activator="data">
                      <v-btn
                        depressed
                        color="error"
                        class="mb-4"
                        v-on="data.on"
                        @click="pullingCord = !pullingCord"
                      >
                        <v-icon class="mr-3">flag</v-icon>Pull Cord
                      </v-btn>
                    </template>
                    <span>{{ "Pull My Cord" }}</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card-text
              class="ma-0 pa-0"
              style="max-height: 486px; overflow-y: scroll;"
            >
              <v-list three-line class="py-0">
                <template v-for="(item, index) in filteredGridItems">
                  <v-list-tile
                    :key="`tile-${index}`"
                    class="tileHover py-2"
                    @click="goToSelectedCord(item)"
                  >
                    <v-list-tile-content>
                      <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                      <div class="ml-3">
                        <v-list-tile-sub-title>
                          <strong>Application:</strong>
                          {{ item.app }}
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title>
                          <strong>Category:</strong>
                          {{ item.category }}
                        </v-list-tile-sub-title>
                        <v-list-tile-sub-title>
                          <strong>Opened on:</strong>
                          {{
                            new Date(item.openedOn).toLocaleDateString("en-US")
                          }}
                        </v-list-tile-sub-title>
                      </div>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-icon>navigate_next</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider
                    v-if="index !== filteredGridItems.length - 1"
                    :key="`divider-${index}`"
                  ></v-divider>
                </template>
              </v-list>
            </v-card-text>
          </v-card>-->

          <grid
            :headers="headers"
            :items="filteredGridItems"
            :custom-sort="gridCustomSort"
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

        <!-- For small screens -->
        <v-flex v-else xs12 v-for="(item, index) in gridItems" :key="index">
          <v-card tile :dark="isDark" :color="`accent ${darken}`" class="my-3">
            <v-card-title
              class="hildaLight space-small mx-0 mt-0 bg white--text"
            >
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <v-layout row wrap fill-height>
                <v-flex xs12>
                  <v-text-field
                    :color="`info ${darken}`"
                    readonly
                    label="Application"
                    :value="item.app"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    :color="`info ${darken}`"
                    readonly
                    label="Category"
                    :value="item.category"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    :color="`info ${darken}`"
                    readonly
                    label="Duration"
                    :value="computeDuration(item.openedOn)"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    :color="`info ${darken}`"
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

      <v-layout v-else align-center justify-center column fill-height>
        <v-flex grow>
          <div class="hildaLight">Please login to view this page</div>
        </v-flex>
        <v-flex grow>
          <img
            src="https://media.giphy.com/media/5Zesu5VPNGJlm/giphy.gif"
            alt="please login"
          />
        </v-flex>
      </v-layout>
    </v-container>
    <pull-cord-dialog
      :initial-dialog="pullingCord"
      v-on:closeDialog="pullingCord = false"
      v-on:refreshCordGrid="getCordGridItems"
    ></pull-cord-dialog>
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
import PullCordDialog from "../components/PullCordDialog";

export default {
  name: "home",
  mixins: [themeMixin, cordMixin, alertMixin, socketMixin, authMixin],
  components: {
    CircleCard,
    JwtExpiry,
    MenuBtn,
    Grid,
    PullCordDialog
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
    pullingCord: false,
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
    if (this.user) {
      this.getCordGridItems();
    } else {
      this.$router.push({ path: "/login", name: "login" });
    }
  },
  mounted() {
    if (this.selectedCord) {
      this.leaveSelectedCordRoom(this.selectedCord._id);
    }
  },
  methods: {
    gridCustomSort(items, index, isDesc) {
      items.sort((a, b) => {
        switch (index) {
          case "title":
          case "app":
          case "category":
            if (!isDesc) {
              return compareString(a[index], b[index]);
            } else {
              return compareString(b[index], a[index]);
            }
          case "duration":
            if (!isDesc) {
              return compareString(a.openedOn, b.openedOn);
            } else {
              return compareString(b.openedOn, a.openedOn);
            }
          case "hero":
            if (!isDesc) {
              return compareString(a.rescuers.length, b.rescuers.length);
            } else {
              return compareString(b.rescuers.length, a.rescuers.length);
            }
          case "name":
            if (!isDesc) {
              return compareString(a.puller.username, b.puller.username);
            } else {
              return compareString(b.puller.username, a.puller.username);
            }
        }
      });
      return items;
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
      if (this.user) {
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

        if (this.user) {
          this.myCords = this.gridItems.filter(function(elem) {
            return elem.puller.username === _this.user.username;
          });
        }
      }
    }
  }
};

/**
 * @description Compare strings
 * @param a {string} First String to compare
 * @param b {string} Second String to compare
 * @returns {number} Returns -1 if a < b. Returns 1 if a > b. Returns 0 if strings are equivalent
 */
function compareString(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
</script>

<style scoped>
.dashCard {
  height: 320px;
}
</style>
