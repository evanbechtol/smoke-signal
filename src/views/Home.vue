<template>
  <div style="height: 100vh;" class="home page mt-5">
    <v-container fluid :class="isSmall ? 'pa-0 ma-0' : ''">
      <v-layout
        v-if="isAuthenticated && user && gridItems"
        mt-5
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
              <v-layout row align-center justify-center fill-height>
                <v-flex grow ml-4 pt-4>
                  <p
                    class="hildaLight"
                    :class="isDark ? 'white--text' : 'dark--text'"
                  >
                    Cords List
                  </p>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex shrink align-self-center mt-3>
                  <v-text-field
                    :dark="isDark"
                    v-model="search"
                    class="hidden-xs-only"
                    style="max-width: 300px; border: 1px solid var(--e-gray); padding: 0 4px;"
                    solo
                    :background-color="`accent ${darken}`"
                    flat
                    color="info"
                    append-icon="search"
                    label="Search By Title"
                    single-line
                    hide-details
                  >
                  </v-text-field>
                </v-flex>
                <v-flex shrink align-self-center mt-1>
                  <v-tooltip bottom offset-y>
                    <template #activator="data">
                      <v-btn
                        v-on="data.on"
                        :dark="isDark"
                        class="ml-4 mt-3"
                        @click="refreshMyGrid"
                        icon
                      >
                        <v-icon>autorenew</v-icon>
                      </v-btn>
                    </template>
                    <span>Refresh Grid</span>
                  </v-tooltip>
                </v-flex>

                <v-flex shrink mt-3 mr-3>
                  <v-tooltip bottom class="ml-3">
                    <template #activator="data">
                      <v-btn
                        depressed
                        v-if="!pullingCord"
                        :color="`info ${darken}`"
                        v-on="data.on"
                        @click="pullingCord = !pullingCord"
                      >
                        Rescue Me
                      </v-btn>
                    </template>
                    <span>Get help!</span>
                  </v-tooltip>
                </v-flex>
              </v-layout>

              <v-flex xs12 class="hidden-xs-only">
                <v-layout
                  row
                  wrap
                  justify-space-between
                  align-center
                  fill-height
                >
                  <!-- CORD FILTER CHIPS -->
                  <v-flex xs12 ml-3 pl-1>
                    <v-chip
                      :color="computeChipBg()"
                      :dark="isDark"
                      :selected="computeSelected('criticalCords')"
                      @click="selectItemType = 'criticalCords'"
                    >
                      <v-avatar>
                        <v-icon class="mx-3" color="error">error</v-icon>
                      </v-avatar>
                      Critical Cords ({{ criticalCords.length }})
                    </v-chip>

                    <v-chip
                      :color="computeChipBg()"
                      :dark="isDark"
                      :selected="computeSelected('moderateCords')"
                      @click="selectItemType = 'moderateCords'"
                    >
                      <v-avatar>
                        <v-icon class="mx-3" color="warning">warning</v-icon>
                      </v-avatar>
                      Moderate Cords ({{ moderateCords.length }})
                    </v-chip>

                    <v-chip
                      :color="computeChipBg()"
                      :dark="isDark"
                      :selected="computeSelected('newCords')"
                      @click="selectItemType = 'newCords'"
                    >
                      <v-avatar>
                        <v-icon class="mx-3" color="info">info</v-icon>
                      </v-avatar>
                      New Cords ({{ newCords.length }})
                    </v-chip>
                    <v-chip
                      :color="computeChipBg()"
                      :dark="isDark"
                      :selected="computeSelected('myCords')"
                      @click="selectItemType = 'myCords'"
                    >
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
                :search="search"
                v-on:refreshCordGrid="getCordGridItems"
              >
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
import { themeMixin } from "../mixins/themeMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import { socketMixin } from "../mixins/socketMixin";
import { authMixin } from "../mixins/authMixin";
import { mapGetters, mapState } from "vuex";
// import MenuBtn from "../components/MenuBtn";
import JwtExpiry from "../components/JWTExpiry";
import Grid from "../components/Grid";
import CircleCard from "../components/CircleCard";
import PullCordDialog from "../components/PullCordDialog";

export default {
  name: "home",
  mixins: [themeMixin, cordMixin, alertMixin, socketMixin, authMixin],
  components: {
    CircleCard,
    JwtExpiry,
    // MenuBtn,
    Grid,
    PullCordDialog
  },
  computed: {
    ...mapState(["gridItems"]),
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
    }
  },
  data: () => ({
    pullingCord: false,
    gridItemType: "all",
    search: "",
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
    computeChipBg() {
      return this.isDark ? "#393939" : "#dddddd";
    },
    computeSelected(value) {
      return this.selectItemType === value;
    },
    gridCustomSort(items, index, isDesc) {
      items.sort((a, b) => {
        switch (index) {
          case "title":
          case "app":
          case "category":
            if (!isDesc) {
              return this.$compareString(a[index], b[index]);
            } else {
              return this.$compareString(b[index], a[index]);
            }
          case "duration":
            if (!isDesc) {
              return this.$compareString(a.openedOn, b.openedOn);
            } else {
              return this.$compareString(b.openedOn, a.openedOn);
            }
          case "hero":
            if (!isDesc) {
              return this.$compareString(a.rescuers.length, b.rescuers.length);
            } else {
              return this.$compareString(b.rescuers.length, a.rescuers.length);
            }
          case "name":
            if (!isDesc) {
              return this.$compareString(a.puller.username, b.puller.username);
            } else {
              return this.$compareString(b.puller.username, a.puller.username);
            }
        }
      });
      return items;
    },
    getCordGridItems() {
      this.loading = true;
      this.getCordsByStatus("Open")
        .then(response => {
          this.$store.commit("gridItems", response.data.data);
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
    refreshMyGrid() {
      this.refreshGridOne();
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
    }
  }
};
</script>

<style scoped></style>
