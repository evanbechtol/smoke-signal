<template>
  <div class="resolvedCords page mt-5">
    <v-container fluid fill-height :class="isSmall ? 'pa-0 ma-0' : ''">
      <v-layout
        v-if="isAuthenticated && user && gridItems"
        mt-5
        row
        wrap
        justify-center
        align-start
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
                    Resolved Cords List
                  </p>
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex shrink align-self-center mt-3>
                  <v-text-field
                    :dark="isDark"
                    v-model="search"
                    class="hidden-xs-only"
                    style="max-width: 300px; border: 1px solid var(--e-gray); padding: 0 4px;"
                    solo-inverted
                    :background-color="`accent ${darken}`"
                    flat
                    color="info"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
                  >
                  </v-text-field>
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
                      v-if="myCords"
                      :color="chipBg"
                      :dark="isDark"
                      :selected="selectedChip('myCords')"
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
                resolved
                :headers="headers"
                :items="filteredGridItems"
                :custom-sort="gridResolvedCustomSort"
                :loading="loading"
                :search="search"
                v-on:refreshCordGrid="getCordGridItems('Resolved')"
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
      v-on:refreshCordGrid="getCordGridItems('Resolved')"
    ></pull-cord-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import { socketMixin } from "../mixins/socketMixin";
import { authMixin } from "../mixins/authMixin";
import { gridMixin } from "../mixins/gridMixin";
import { TimeService } from "../services/timeService";
import PullCordDialog from "../components/PullCordDialog";
import Grid from "../components/Grid";

export default {
  name: "resolvedCords",
  mixins: [
    alertMixin,
    authMixin,
    cordMixin,
    gridMixin,
    socketMixin,
    themeMixin
  ],
  components: {
    PullCordDialog,
    Grid
  },
  computed: {
    filteredGridItems: function() {
      return this.gridItemType === "all" ? this.gridItems : this.myCords;
    }
  },
  data: () => ({
    pullingCord: false,
    gridItemType: "all",
    search: "",
    selectItemType: "all",
    selectItems: [
      { label: "All Resolved Cords", value: "all" },
      { label: "My Resolved Cords", value: "myCords" }
    ],
    loading: false,
    headers: [
      { text: "Title", align: "left", value: "title" },
      { text: "Name", align: "left", value: "name" },
      { text: "App", align: "left", value: "app" },
      { text: "Category", align: "left", value: "category" },
      { text: "Resolved On", align: "left", value: "resolvedOn" },
      { text: "Hero", align: "left", value: "hero" }
    ]
  }),
  created() {
    if (!this.user) {
      this.$router.push({ path: "/login", name: "login" });
    } else if (this.appToken) {
      this.getCordGridItems("Resolved");
    } else if (!this.appToken) {
      this.authenticateApp();
    }
  },
  mounted() {
    if (this.selectedCord) {
      this.leaveSelectedCordRoom(this.selectedCord._id);
    }

    if (!this.categoryList.length) {
      this.getCategoryList()
        .then(response => {
          const data =
            response && response.data && response.data.data
              ? response.data.data
              : [];
          const list = [];
          data.forEach(function(elem) {
            list.push(elem.name);
          });

          this.$store.commit("categoryList", list);
        })
        .catch(err => {
          this.setAlert(err, "#DC2D37", 0);
        });
    }
  },
  methods: {
    computeDuration: TimeService.computeDuration,
    msToTime: TimeService.msToTime
  },
  watch: {
    appToken: function() {
      this.getCordGridItems("Resolved");
    }
  }
};
</script>

<style scoped></style>
