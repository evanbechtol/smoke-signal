<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container
    fluid
    fill-height
    class="light-l1 profile"
    :class="isSmall ? 'px-1 mx-0' : 'px-4'"
  >
    <v-layout column justify-center fill-height mt-5>
      <!-- Statistics Section -->
      <v-flex xs12 mt-5 class="animated fast slideInLeft">
        <v-layout row wrap justify-center align-space-around fill-height>
          <v-flex xs12 grow>
            <v-card :dark="isDark" :color="`accent ${darken}`">
              <v-card-title class="hildaLight space-small big mx-0 mt-0 ml-2">
                Statistics
              </v-card-title>
              <v-card-text>
                <v-layout
                  row
                  wrap
                  align-center
                  justify-center
                  fill-height
                  v-if="userStatsInitialized && userStats.length > 0"
                >
                  <v-flex
                    xs12
                    sm4
                    text-xs-center
                    self-
                    v-for="(item, index) in userStats"
                    :key="`stat-flex-${index}`"
                  >
                    <v-layout row align-center justify-start ml-2>
                      <v-flex shrink>
                        <p
                          class="hildaLight"
                          style="font-size: 3em;"
                          :class="isDark ? 'white--text' : 'dark--text'"
                        >
                          {{ item.value }}
                        </p>
                      </v-flex>
                      <v-flex shrink ml-4>
                        <div
                          class="ma-0 hildaLight text-xs-center subheading"
                          :class="isDark ? 'white--text' : 'dark--text'"
                        >
                          {{ item.label }}
                        </div>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>

                <v-layout v-else align-center justify-center fill-height>
                  <v-flex xs12 align-self-center text-xs-center>
                    <div>
                      <p>Hang tight, we're crunching numbers!</p>
                      <v-progress-linear
                        :indeterminate="true"
                        color="info"
                      ></v-progress-linear>
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <!-- History Section -->
      <v-flex xs12 class="mb-3" :class="isSmall ? 'mt-0' : 'mt-5'">
        <v-card
          class="animated fast slideInRight"
          :dark="isDark"
          :color="`accent ${darken}`"
          max-height="85vh"
        >
          <v-card-title class="hildaLight space-small big mx-0 mt-0 pa-0">
            <v-toolbar :color="`accent ${darken}`" :dark="isDark" tabs flat>
              <v-toolbar-title>History</v-toolbar-title>

              <template v-slot:extension>
                <v-tabs
                  v-model="activeTab"
                  :color="`accent ${darken}`"
                  :dark="isDark"
                  slider-color="info"
                  @change="updateSelectItemType"
                >
                  <v-tab v-for="(item, index) in cords" :key="index">
                    {{ item.label }}
                  </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>
          </v-card-title>
          <v-card-text class="ma-0 pa-0" style="overflow-y: scroll;">
            <v-tabs-items v-model="activeTab">
              <v-tab-item
                lazy
                v-for="(item, index) in cords"
                :key="`tab-item-${index}`"
              >
                <v-card flat>
                  <v-card-text class="pa-0 mt-0" style="max-height: 68.4vh;">
                    <v-list three-line class="py-0">
                      <template v-for="(item, index) in filteredCords">
                        <v-list-tile
                          :style="{ backgroundColor: `accent ${darken}` }"
                          :key="`tile-${index}`"
                          @click="goToSelectedCord(item)"
                        >
                          <v-list-tile-content>
                            <v-list-tile-title>
                              {{ item.title }}
                            </v-list-tile-title>
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
                                  new Date(item.openedOn).toLocaleDateString(
                                    "en-US"
                                  )
                                }}
                              </v-list-tile-sub-title>
                            </div>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-icon>navigate_next</v-icon>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-divider
                          v-if="index !== filteredCords.length - 1"
                          :key="`divider-${index}`"
                        ></v-divider>
                      </template>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { alertMixin } from "../mixins/alertMixin";
import { authMixin } from "../mixins/authMixin";
import { cordMixin } from "../mixins/cordMixin";

export default {
  name: "Profile",
  mixins: [themeMixin, alertMixin, authMixin, cordMixin],
  computed: {
    userString: function() {
      return JSON.stringify({
        _id: this.user._id,
        username: this.user.username
      });
    },
    filteredCords: function() {
      return this.selectItemType === "myActiveCords"
        ? this.cords[0].value
        : this.selectItemType === "myRescueCords"
        ? this.cords[1].value
        : this.cords[2].value;
    }
  },
  data: () => ({
    activeTab: null,
    initialized: false,
    userStatsInitialized: false,
    cords: [
      {
        label: "Active Cords",
        value: []
      },
      {
        label: "Rescues",
        value: []
      },
      {
        label: "Resolved Cords",
        value: []
      }
    ],
    selectItemType: "myActiveCords",
    selectItems: [
      { label: "My Active Cords", value: "myActiveCords" },
      { label: "My Resolved Cords", value: "myResolvedCords" },
      { label: "Rescues", value: "myRescueCords" }
    ],
    userStats: []
  }),
  created() {
    if (this.appToken && !this.initialized) {
      this.initPage();
    }
  },
  methods: {
    goToSelectedCord(cord) {
      this.$store.commit("selectedCord", cord);
      this.$router.push({ path: `/cord/${cord._id}`, props: cord });
    },
    initPage() {
      this.validateUser()
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
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
        });

      this.getUserStats(this.userString)
        .then(response => {
          const data = response.data.data;
          this.userStats.push(
            {
              label: "Cords Pulled",
              value: data.cordsPulled
            },
            {
              label: "Users Rescued",
              value: data.rescuesProvided
            },
            {
              label: "Most Active App",
              value: data.mostActiveApp._id
            }
          );
          this.userStatsInitialized = true;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
      this.getCordsByUser(this.userString, "Open")
        .then(response => {
          this.cords[0].value = response.data.data;
          this.initialized = true;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    updateSelectItemType(value) {
      this.activeTab = value;
      this.selectItemType =
        value === 0
          ? "myActiveCords"
          : value === 1
          ? "myRescueCords"
          : "myResolvedCords";
    }
  },
  watch: {
    appToken: function() {
      this.initPage();
    },
    selectItemType: function(value) {
      if (value === "myResolvedCords" && this.cords[2].value.length === 0) {
        this.getCordsByUser(this.userString, "Resolved")
          .then(response => {
            this.cords[2].value = response.data.data;
          })
          .catch(err => {
            this.setAlert(err.response.data.error, "#DC2D37", 0);
          });
      } else if (value === "myRescueCords" && this.cords[1].value.length === 0) {
        const query = {
          rescuers: { _id: this.user._id, username: this.user.username }
        };
        this.getCords(100, 0, JSON.stringify(query))
          .then(response => {
            this.cords[1].value = response.data.data;
            this.initialized = true;
          })
          .catch(err => {
            this.setAlert(err.response.data.error, "#DC2D37", 0);
          });
      }
    }
  }
};
</script>

<style scoped></style>
