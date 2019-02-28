<template>
  <v-container
    style="height: 100vh;"
    class="light-l1 profile page"
    :class="isSmall ? 'px-1' : 'px-4'"
  >
    <v-layout row wrap align-start justify-center fill-height mt-5>
      <v-flex xs12 sm12 md4 mt-5 class="animated fast slideInLeft">
        <v-layout column justify-start align-space-around fill-height>
          <v-flex xs12 sm6 grow>
            <v-card :dark="isDark">
              <v-card-title
                class="hildaLight bg dark space-small big mx-0 mt-0"
              >
                User Details
              </v-card-title>
              <v-card-text>
                <v-text-field
                  :dark="isDark"
                  name="username"
                  label="Signum"
                  color="info"
                  readonly
                  :value="user.username"
                  prepend-inner-icon="lock"
                  type="text"
                >
                </v-text-field>
                <v-text-field
                  :dark="isDark"
                  name="name"
                  label="Name"
                  color="info"
                  readonly
                  :value="`${user.firstname} ${user.lastname}`"
                  prepend-inner-icon="lock"
                  type="text"
                >
                </v-text-field>
                <v-text-field
                  :dark="isDark"
                  name="email"
                  label="Email"
                  color="info"
                  readonly
                  :value="user.email"
                  prepend-inner-icon="lock"
                  :append-icon="emailVerified ? 'verified_user' : 'warning'"
                  persistent-hint
                  :hint="
                    emailVerified
                      ? 'Email verified'
                      : 'Email has not been verified'
                  "
                  type="email"
                >
                </v-text-field>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 grow mt-4>
            <v-card :dark="isDark">
              <v-card-title
                class="hildaLight bg dark space-small big mx-0 mt-0"
              >
                Statistics
              </v-card-title>
              <v-card-text>
                <v-text-field
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
                </v-text-field>
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
                ></v-select>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text class="ma-0 pa-0">
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
    emailVerified: function() {
      return this.user.is_email_verified === true;
    },
    filteredCords: function() {
      return this.selectItemType === "myActiveCords"
        ? this.activeCords
        : this.resolvedCords;
    }
  },
  data: () => ({
    activeCords: [],
    resolvedCords: [],
    selectItemType: "myActiveCords",
    selectItems: [
      { label: "My Active Cords", value: "myActiveCords" },
      { label: "My Resolved Cords", value: "myResolvedCords" }
    ],
    userStats: []
  }),
  created() {},
  mounted() {
    this.getCordsByUser(this.userString, "Open")
      .then(response => {
        this.activeCords = response.data.data;
      })
      .catch(err => {
        this.setAlert(err.response.data.error, "#DC2D37", 0);
      });

    this.getUserStats(this.userString)
      .then(response => {
        this.userStats = response.data.data;
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
</style>
