<template>
  <v-container
    fluid
    class="light-l1 profile page"
    :class="isSmall ? 'px-1 mx-0' : 'px-4'"
  >
    <v-layout row wrap align-start justify-center fill-height mt-5>
      <v-flex xs12 sm12 md5 mt-5 class="animated fast slideInLeft">
        <v-layout row wrap justify-center align-space-around fill-height>
          <v-flex xs12 grow>
            <v-card :dark="isDark" height="85vh">
              <v-card-title class="hildaLight space-small big mx-0 mt-0 ml-2">
                Statistics
              </v-card-title>
              <v-card-text v-if="userStatsInitialized && userStats.length > 0">
                <v-layout row align-center justify-center fill-height>
                  <v-flex
                    xs6
                    sm4
                    text-xs-center
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
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 sm12 md6 mt-5 :class="isSmall ? 'mx-0' : 'mx-4'">
        <v-card
          class="animated fast slideInRight"
          :dark="isDark"
          :color="`accent ${darken}`"
          height="85vh"
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
                  :hint="`Number of cords: ${filteredCords.length}`"
                  persistent-hint
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text
            class="ma-0 pa-0"
            style="max-height: 486px; overflow-y: scroll;"
          >
            <v-list three-line class="py-0">
              <template v-for="(item, index) in filteredCords">
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
                  v-if="index !== filteredCords.length - 1"
                  :key="`divider-${index}`"
                ></v-divider>
              </template>
            </v-list>
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
import CircleCard from "../components/CircleCard";

export default {
  name: "Profile",
  components: { CircleCard },
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
        ? this.activeCords
        : this.selectItemType === "myResolvedCords"
        ? this.resolvedCords
        : this.rescueCords;
    }
  },
  data: () => ({
    initialized: false,
    userStatsInitialized: false,
    activeCords: [],
    rescueCords: [],
    resolvedCords: [],
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
          this.activeCords = response.data.data;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });

      const query = {
        rescuers: { _id: this.user._id, username: this.user.username }
      };
      this.getCords(100, 0, JSON.stringify(query))
        .then(response => {
          this.rescueCords = response.data.data;
          this.initialized = true;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    }
  },
  watch: {
    appToken: function() {
      this.initPage();
    },
    selectItemType: function(value) {
      if (value === "myResolvedCords" && this.resolvedCords.length === 0) {
        this.getCordsByUser(this.userString, "Resolved")
          .then(response => {
            this.resolvedCords = response.data.data;
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
.vertDiv {
  border-right: 1px dashed var(--e-gray);
  height: 120px;
}
.tileHover:hover {
  background-color: var(--e-dark-brand-blue) !important;
}
</style>
