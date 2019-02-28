<template>
  <v-container style="height: 100vh;" class="light-l1 profile page">
    <v-layout row wrap align-start justify-start fill-height mt-5>
      <v-flex xs12 sm12 md4 ma-5 class="animated fast slideInLeft">
        <v-text-field
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
          name="email"
          label="Email"
          color="info"
          readonly
          :value="user.email"
          prepend-inner-icon="lock"
          :append-icon="emailVerified ? 'verified_user' : 'warning'"
          persistent-hint
          :hint="
            emailVerified ? 'Email verified' : 'Email has not been verified'
          "
          type="email"
        >
        </v-text-field>
      </v-flex>

      <v-flex xs12 sm12 md6 mt-5 mx-4>
        <v-card class="animated fast slideInRight">
          <v-card-title class="hildaLight dark ma-0 pt-4 pl-3 pb-0">
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
          <v-card-text>
            <v-list three-line>
              <template v-for="(item, index) in filteredCords">
                <v-layout
                  row
                  align-center
                  justify-start
                  fill-height
                  :key="`layout-${index}`"
                >
                  <v-flex xs12 grow>
                    <v-list-tile :key="`tile-${index}`" class="mb-3" @click="">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ item.app }}</v-list-tile-title>
                        <div class="ml-3">
                          <v-list-tile-sub-title
                            ><strong>Category:</strong>
                            {{ item.category }}</v-list-tile-sub-title
                          >
                          <v-list-tile-sub-title
                            ><strong>Opened on:</strong>
                            {{ item.openedOn }}</v-list-tile-sub-title
                          >
                        </div>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-flex>
                </v-layout>
                <v-divider
                  v-if="index !== filteredCords.length - 1"
                  class="mb-3"
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
    ]
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
  },
  methods: {},
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

<style scoped></style>
