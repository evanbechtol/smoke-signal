<template>
  <v-container
    fluid
    style="height: 100vh;"
    class="light-l1 profile page"
    :class="isSmall ? 'px-1 mx-0' : 'px-4'"
  >
    <v-layout row wrap align-start justify-center fill-height mt-5>
      <v-flex xs12 sm12 md5 mt-5 class="animated fast slideInLeft">
        <v-layout column justify-start align-space-around fill-height>
          <v-flex xs12 sm6 grow mt-4>
            <v-card :dark="isDark">
              <v-card-title
                class="hildaLight bg dark space-small big mx-0 mt-0"
              >
                Statistics
              </v-card-title>
              <v-card-text>
                <v-layout
                  row
                  wrap
                  align-start
                  justify-space-between
                  fill-height
                >
                  <v-flex xs6 sm4>
                    <div>
                      <div class="ma-0 hildaLight text-xs-center">
                        Cords Pulled
                      </div>
                      <v-card-text class="ma-0 text-xs-center">
                        <div class="circle">
                          <v-layout align-center justify-center fill-height>
                            <v-flex text-xs-center pt-3>
                              <p
                                class="dark-text hildaLight"
                                style="font-size: 1.6em;"
                              >
                                {{ userStats.cordsPulled }}
                              </p>
                            </v-flex>
                          </v-layout>
                        </div>
                      </v-card-text>
                    </div>
                  </v-flex>
                  <v-flex xs6 sm4>
                    <div>
                      <div class="ma-0 hildaLight text-xs-center">
                        Users Rescued
                      </div>
                      <v-card-text class="ma-0 text-xs-center">
                        <div class="circle">
                          <v-layout align-center justify-center fill-height>
                            <v-flex text-xs-center pt-3>
                              <p
                                class="dark-text hildaLight"
                                style="font-size: 1.6em;"
                              >
                                {{ userStats.rescuesProvided }}
                              </p>
                            </v-flex>
                          </v-layout>
                        </div>
                      </v-card-text>
                    </div>
                  </v-flex>
                  <v-flex xs6 sm4>
                    <div>
                      <div class="ma-0 hildaLight text-xs-center">
                        Most Active App
                      </div>
                      <v-card-text class="ma-0 text-xs-center">
                        <div class="circle">
                          <v-layout align-center justify-center fill-height>
                            <v-flex text-xs-center pt-3>
                              <p
                                class="dark-text hildaLight"
                                style="font-size: 1.6em;"
                              >
                                {{ activeApp || "" }}
                              </p>
                            </v-flex>
                          </v-layout>
                        </div>
                      </v-card-text>
                    </div>
                  </v-flex>
                </v-layout>
                <!-- <v-text-field
                  :dark="isDark"
                  name="cords pulled"
                  label="Cords Pulled"
                  color="info"
                  readonly
                  :value="userStats.cordsPulled"
                  prepend-inner-icon="live_help"
                  type="number"
                >
                </v-text-field>
                <v-text-field
                  :dark="isDark"
                  name="number of rescues"
                  label="Users Rescued"
                  color="info"
                  readonly
                  :value="userStats.rescuesProvided"
                  prepend-inner-icon="verified_user"
                  type="text"
                >
                </v-text-field>
                <v-text-field
                  :dark="isDark"
                  name="app most active on"
                  label="Most Help Provided For"
                  color="info"
                  readonly
                  :value="userStats.mostActiveApp._id"
                  prepend-inner-icon="star"
                  type="text"
                >
                </v-text-field>-->
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
    activeApp: function() {
      return this.userStats.mostActiveApp._id;
    },
    userString: function() {
      return JSON.stringify({
        _id: this.user._id,
        username: this.user.username
      });
    },
    emailVerified: function() {
      return this.user.is_email_verified === true;
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
    activeCords: [],
    rescueCords: [],
    resolvedCords: [],
    selectItemType: "myActiveCords",
    selectItems: [
      { label: "My Active Cords", value: "myActiveCords" },
      { label: "My Resolved Cords", value: "myResolvedCords" },
      { label: "Rescues", value: "myRescueCords" }
    ],
    userStats: {
      cordsPulled: "",
      rescuesProvided: "",
      mostActiveApp: { _id: 0, count: 0 }
    }
  }),
  created() {
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
        this.userStats = response.data.data;
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
      })
      .catch(err => {
        this.setAlert(err.response.data.error, "#DC2D37", 0);
      });
  },
  methods: {
    goToSelectedCord(cord) {
      this.$store.commit("selectedCord", cord);
      this.$router.push({ path: `/cord/${cord._id}`, props: cord });
    }
  },
  watch: {
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
.tileHover:hover {
  background-color: var(--e-dark-brand-blue) !important;
}
.circle {
  height: 100px;
  width: 100px;
  /*background-color: var(--e-dark-brand-blue);*/
  background: var(--e-dark-status-red); /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    var(--e-dark-status-orange),
    var(--e-dark-status-red)
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    var(--e-dark-status-orange),
    var(--e-dark-status-red)
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-radius: 50px;
  margin: 0 auto;
}
</style>
