<template>
  <v-container fluid mt-4 px-0 class="light-l1 profile" id="profileContainer">
    <v-flex xs12 ma-0 pa-0 id="parallaxFlex">
      <v-parallax
        height="250"
        :src="getImagePath('profileBanner.png')"
      ></v-parallax>
    </v-flex>

    <!-- Profile Picture -->
    <v-layout
      row
      align-start
      justify-start
      class="profileImg"
      id="profilePicLayout"
    >
      <v-flex xs12 :class="layout">
        <v-avatar size="150">
          <v-img :src="getImagePath('evanbechtolHeadshot.png')"></v-img>
        </v-avatar>
      </v-flex>
    </v-layout>

    <!-- Section Container -->
    <v-container
      id="sectionContainer"
      fluid
      align-center
      grid-list-md
      pt-0
      :class="{ 'px-0': isSmall }"
    >
      <v-layout
        row
        wrap
        align-start
        justify-center
        v-if="!loading"
        class="contentSection"
        id="contentSection"
        :class="{ largeScreenMargin: !isNotLarge, smallScreenMargin: isSmall }"
      >
        <!-- User Information -->
        <v-flex xs12 :class="userNameSection" id="userInfoFlex">
          <v-layout id="userInfoLayout" row wrap align-start justify-start>
            <v-flex xs12 mb-1 id="userInfo">
              <div>
                <span id="username" class="hildaLight userName">
                  {{ user.username }}
                </span>
                <br />
                <span id="name">{{ user.firstname }} {{ user.lastname }}</span>
                <br />
                <span id="email">{{ user.email }}</span>
              </div>
            </v-flex>

            <v-flex xs12 mb-4 id="userStats">
              <v-layout row wrap align-center :class="statLayout">
                <v-flex
                  shrink
                  v-for="(stat, index) in userStats"
                  :key="`stats-flex-${index}`"
                >
                  <strong>{{ stat.label }}:</strong> {{ stat.value }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>

        <!-- Notifications -->
        <v-flex xs12 md6 lg5 id="notificationFlex">
          <v-card
            :dark="isDark"
            :color="contentCardColor"
            flat
            tile
            class="contentCardHeight"
          >
            <v-card-title class="hildaLight space-small big mx-0 mt-0 ml-2">
              Notifications
            </v-card-title>
            <v-card-text>
              <!-- Apps List -->
              <v-layout id="appsLayout" row wrap align-center justify-start>
                <v-flex shrink>
                  <v-subheader>
                    Apps
                    <v-tooltip right class="ml-3" v-if="!editingApps">
                      <template #activator="data">
                        <v-btn
                          small
                          icon
                          @click="toggleAddingApp"
                          v-on="data.on"
                          v-if="!editingApps"
                        >
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Edit application notifications</span>
                    </v-tooltip>
                  </v-subheader>
                </v-flex>

                <v-flex xs12 ml-3>
                  <v-layout
                    row
                    wrap
                    align-center
                    justify-start
                    id="appComboboxLayout"
                  >
                    <v-flex id="appCombobox" xs12>
                      <v-combobox
                        multiple
                        small-chips
                        name="applications"
                        label="Subscribed Applications"
                        :items="appOptions"
                        :readonly="!editingApps"
                        deletable-chips
                        placeholder="You aren't subscribed to any applications"
                        color="info darken-1"
                        id="appSelect"
                        v-model="userApps"
                        required
                        @change="teamsChanged"
                      >
                      </v-combobox>
                    </v-flex>
                    <v-flex xs12 v-if="editingApps">
                      <v-btn
                        depressed
                        outline
                        small
                        :dark="isDark"
                        @click="revertUserApps"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        depressed
                        small
                        :color="`info ${darken - 1}`"
                        @click="saveHeroUserData"
                      >
                        Save
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>

              <v-divider></v-divider>

              <!-- Teams List -->
              <v-layout id="teamsLayout" row wrap align-center justify-start>
                <v-flex id="teamsHeader" shrink>
                  <v-subheader>
                    Teams
                    <v-tooltip right class="ml-3" v-if="!editingTeams">
                      <template #activator="data">
                        <v-btn
                          small
                          icon
                          @click="toggleAddingTeam"
                          v-on="data.on"
                          v-if="!editingTeams"
                        >
                          <v-icon>edit</v-icon>
                        </v-btn>
                      </template>
                      <span>Join and leave teams</span>
                    </v-tooltip>
                  </v-subheader>
                </v-flex>

                <v-flex id="teams" xs12 ml-3>
                  <v-layout
                    row
                    wrap
                    align-center
                    justify-start
                    id="teamComboboxLayout"
                  >
                    <v-flex id="teamCombobox" xs12>
                      <v-combobox
                        multiple
                        small-chips
                        name="applications"
                        label="Subscribed Teams"
                        :items="teamOptions"
                        item-text="name"
                        :readonly="!editingTeams"
                        deletable-chips
                        placeholder="You aren't subscribed to any teams"
                        color="info darken-1"
                        id="teamSelect"
                        v-model="userTeams"
                        @change="teamsChanged"
                        required
                      >
                      </v-combobox>
                    </v-flex>

                    <v-flex id="teamsActions" xs12 v-if="editingTeams">
                      <v-btn
                        depressed
                        outline
                        small
                        :dark="isDark"
                        @click="revertUserTeams"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        depressed
                        small
                        :color="`info ${darken - 1}`"
                        @click="saveHeroTeams"
                      >
                        Save
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- History Section -->
        <v-flex xs12 md6 lg5 id="historyFlex">
          <v-card
            :dark="isDark"
            :color="contentCardColor"
            flat
            tile
            max-height="85vh"
          >
            <v-card-title class="hildaLight space-small big mx-0 mt-0 pa-0">
              <v-toolbar :color="contentCardColor" :dark="isDark" tabs flat>
                <v-toolbar-title>History</v-toolbar-title>

                <template v-slot:extension>
                  <v-tabs
                    v-model="activeTab"
                    :color="contentCardColor"
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
            <v-card-text class="ma-0 pa-0" style="overflow-y: auto;">
              <v-tabs-items v-model="activeTab">
                <v-tab-item
                  lazy
                  v-for="(item, index) in cords"
                  :key="`tab-item-${index}`"
                >
                  <v-card flat>
                    <v-card-text class="pa-0 mt-0 historyCardTextMaxHeight">
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

      <!-- Loading Placeholder -->
      <v-layout
        v-else
        align-center
        justify-center
        fill-height
        mt-5
        id="loadingLayout"
      >
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
    </v-container>
  </v-container>
</template>

<script>
import { alertMixin } from "../mixins/alertMixin";
import { appsMixin } from "../mixins/appsMixin";
import { assetMixin } from "../mixins/assetMixin";
import { authMixin } from "../mixins/authMixin";
import { cordMixin } from "../mixins/cordMixin";
import { heroMixin } from "../mixins/heroMixin";
import { themeMixin } from "../mixins/themeMixin.js";

export default {
  name: "Profile",

  mixins: [
    alertMixin,
    appsMixin,
    assetMixin,
    authMixin,
    cordMixin,
    heroMixin,
    themeMixin
  ],

  computed: {
    layout() {
      const layout =
        this.$vuetify.breakpoint.name === "xs" ||
        this.$vuetify.breakpoint.name === "sm";

      return layout ? "text-xs-center" : "offset-sm2";
    },

    loading() {
      return this.validateLoading || this.statsLoading || this.cordsLoading;
    },

    statLayout() {
      const layout =
        this.$vuetify.breakpoint.name === "xs" ||
        this.$vuetify.breakpoint.name === "sm";

      return layout ? "justify-center" : "justify-start";
    },

    userNameSection() {
      const layout =
        this.$vuetify.breakpoint.name === "xs" ||
        this.$vuetify.breakpoint.name === "sm";
      return layout
        ? "text-xs-center userNameLargeMargin"
        : this.$vuetify.breakpoint.name === "md"
        ? "offset-xs4"
        : "offset-xs3";
    },

    userString() {
      return JSON.stringify({
        _id: this.user._id,
        username: this.user.username
      });
    },

    filteredCords() {
      return this.selectItemType === "myActiveCords"
        ? this.cords[0].value
        : this.selectItemType === "myRescueCords"
        ? this.cords[1].value
        : this.cords[2].value;
    }
  },

  data: () => ({
    activeTab: null,

    appOptions: [],

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

    cordsLoading: false,

    editingApps: false,

    editingTeams: false,

    editingUserInfo: false,

    heroUser: null,

    initialized: false,

    selectItems: [
      { label: "My Active Cords", value: "myActiveCords" },
      { label: "My Resolved Cords", value: "myResolvedCords" },
      { label: "Rescues", value: "myRescueCords" }
    ],

    selectItemType: "myActiveCords",

    statsLoading: false,

    teamsDirty: false,

    teamOptions: [],

    userDataDirty: false,

    userApps: [],

    userTeams: [],

    userStats: [],

    userStatsInitialized: false,

    validateLoading: false
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
      this.validateLoading = true;
      this.statsLoading = true;
      this.cordsLoading = true;

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
        })
        .finally(() => {
          this.validateLoading = false;
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
              value: data.mostActiveApp[0]._id
            }
          );
          this.userStatsInitialized = true;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        })
        .finally(() => {
          this.statsLoading = false;
        });

      this.getCordsByUser(this.userString, "Open")
        .then(response => {
          this.cords[0].value = response.data.data;
          this.initialized = true;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        })
        .finally(() => {
          this.cordsLoading = false;
        });

      this.heroGetUserById(this.user._id)
        .then(response => {
          if (response && response.apps) {
            this.heroUser = response;
          }
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },

    saveHeroUserData() {
      let updatedUser = Object.assign({}, this.heroUser);
      updatedUser.apps = this.userApps;
      updatedUser.teams = this.userTeams;

      this.heroUpdateUser(updatedUser)
        .then(response => {
          if (response) {
            this.setAlert("User updated successfully", "#288964", 1000);
            this.userDataDirty = false;
            this.heroUser = response;
            this.editingApps = false;
            this.editingTeams = false;
          }
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },

    revertUserApps() {
      this.userApps = [];
      this.userApps = this.heroUser.apps || [];
      this.editingApps = false;
    },

    revertUserTeams() {
      this.userTeams = [];
      this.userTeams = this.heroUser.teams || [];
      this.editingTeams = false;
      this.teamsDirty = false;
    },

    saveHeroTeams() {
      let updatedUser = Object.assign({}, this.heroUser);
      updatedUser.teams = this.userTeams;

      this.heroUpdateUserTeams(updatedUser)
        .then(response => {
          this.heroUser = response;
          this.setAlert("User updated successfully", "#288964", 2000);
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        })
        .finally(() => {
          this.userTeams = this.heroUser.teams || [];
          this.editingTeams = false;
          this.teamsDirty = false;
        });
    },

    saveUserData() {
      this.eAuthUpdateUserData(this.user)
        .then(response => {
          if (response && response.data && response.data.user) {
            this.$store.commit("user", response.data.user);
            this.setAlert("User updated successfully", "#288964", 1000);
            this.userDataDirty = false;
          }
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },

    teamsChanged() {
      this.teamsDirty = true;
    },

    toggleAddingApp() {
      this.editingApps = !this.editingApps;
    },

    toggleAddingTeam() {
      this.editingTeams = !this.editingTeams;
    },

    userInfoChanged() {
      this.userDataDirty = true;
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

    editingApps: function(value) {
      if (value && this.appOptions.length < 1) {
        this.getApps().then(response => {
          const data =
            response.data && response.data.data ? response.data.data : [];
          const options = [];
          data.forEach(function(elem) {
            options.push(elem.name);
          });
          this.appOptions = options;
        });
      }
    },

    editingTeams: function(value) {
      if (value && this.teamOptions.length < 1) {
        this.getTeams().then(response => {
          this.teamOptions =
            response.data && response.data.data ? response.data.data : [];
        });
      }
    },

    editingUserInfo: function(value) {
      if (!value && this.userDataDirty) {
        this.saveUserData();
      }
    },

    heroUser: {
      deep: true,
      handler: function(value) {
        this.userApps = value.apps || [];
        this.userTeams = value.teams || [];
      }
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
      } else if (
        value === "myRescueCords" &&
        this.cords[1].value.length === 0
      ) {
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

<style scoped>
.contentCardHeight {
  min-height: 560px;
}

.contentSection {
  position: relative;
  bottom: 150px;
}

.historyCardTextMaxHeight {
  max-height: 68.4vh;
}

.largeScreenMargin {
  margin: 0 6em !important;
}

.notificationList {
  background: transparent !important;
}

.profileImg {
  position: relative;
  bottom: 50px;
  z-index: 2;
}

.smallScreenMargin {
  margin: 0 !important;
}

.userName {
  font-size: 2em;
}

.userNameLargeMargin {
  margin-top: 8em;
}
</style>
