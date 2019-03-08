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
        <div v-if="appToken" style="width: 100%;">
          <!-- For large screens -->
          <v-flex xs12 v-if="!isSmall">
            <v-card elevation="0" :color="`accent ${darken}`">
              <v-flex xs12 class="hidden-xs-only">
                <v-layout
                  row
                  wrap
                  justify-space-between
                  align-center
                  fill-height
                >
                  <v-flex xs12>
                    <v-chip color="#dddddd">
                      <v-avatar>
                        <v-icon class="mx-3" color="error">error</v-icon>
                      </v-avatar>
                      Critical Cords ({{ criticalCords.length }})
                    </v-chip>

                    <v-chip color="#dddddd">
                      <v-avatar>
                        <v-icon class="mx-3" color="warning">warning</v-icon>
                      </v-avatar>
                      Moderate Cords ({{ moderateCords.length }})
                    </v-chip>

                    <v-chip color="#dddddd">
                      <v-avatar>
                        <v-icon class="mx-3" color="info">info</v-icon>
                      </v-avatar>
                      New Cords ({{ newCords.length }})
                    </v-chip>

                    <v-chip color="#dddddd">
                      <v-avatar>
                        <v-icon class="mx-3" color="purple"
                          >account_circle</v-icon
                        >
                      </v-avatar>
                      My Cords ({{ myCords.length }})
                    </v-chip>
                  </v-flex>
                </v-layout>
              </v-flex>

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
            </v-card>
          </v-flex>

          <!-- For small screens -->
          <v-flex v-else xs12 v-for="(item, index) in gridItems" :key="index">
            <v-card
              tile
              :dark="isDark"
              :color="`accent ${darken}`"
              class="my-3"
            >
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
        </div>

        <div
          v-else
          style="z-index: 99; width: 100%;"
          class="text-xs-center mt-5"
        >
          <p>Please wait! Loading Data</p>
          <v-progress-linear
            :indeterminate="true"
            color="primary"
          ></v-progress-linear>
        </div>
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
import { mapState, mapGetters } from "vuex";

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
    ...mapGetters(["criticalCords", "moderateCords", "myCords", "newCords"]),
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
  created() {
    if (!this.user) {
      this.$router.push({ path: "/login", name: "login" });
    } else if (this.appToken) {
      this.getCordGridItems();
    } else if (!this.appToken) {
      this.authenticateApp();
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
      this.getCordsByStatus("Open")
        .then(response => {
          this.gridItems = response.data.data;
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
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
    appToken: function(value) {
      if (value) {
        this.getCordGridItems();
      }
    },
    selectItemType: function(value) {
      this.gridItemType = value;
    },
    gridItems: function() {
      /*if (this.user) {
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
      }*/
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

<style scoped></style>
