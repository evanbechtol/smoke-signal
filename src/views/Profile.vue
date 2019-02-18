<template>
    <div style="height: 100vh;" class="light-l1 profile page">
        <v-layout row
                  wrap
                  align-start
                  justify-start
                  fill-height>
            <v-flex xs12 sm12 md4 ma-5 class="animated fast slideInLeft">
                <v-text-field
                  name="username"
                  label="Signum"
                  color="info"
                  readonly
                  :value="user.username"
                  prepend-inner-icon="lock"
                  type="text">
                </v-text-field>
                <v-text-field
                  name="name"
                  label="Name"
                  color="info"
                  readonly
                  :value="`${user.firstname} ${user.lastname}`"
                  prepend-inner-icon="lock"
                  type="text">
                </v-text-field>
                <v-text-field
                  name="email"
                  label="Email"
                  color="info"
                  readonly
                  :value="user.email"
                  prepend-inner-icon="lock"
                  :append-icon="user.is_email_verified === true ? 'verified_user' : 'warning'"
                  persistent-hint
                  :hint="user.is_email_verified === true ? 'Email verified' : 'Email has not been verified'"
                  type="email">
                </v-text-field>
            </v-flex>

            <v-flex xs12 sm12 md6 mt-5 mx-4>
                <v-card class="animated fast slideInRight">
                    <v-card-title class="hildaLight ml-3" style="font-size: 1.7em;">
                       Favorite Searches
                    </v-card-title>
                    <small class="ml-4 pl-2">This is a work in progress and for demonstration only</small>
                    <v-card-text>
                        <v-list three-line>
                            <template v-for="(item, index) in favorites">
                                    <v-layout row align-center justify-start fill-height :key="`layout-${index}`">
                                        <v-flex xs1 shrink>
                                            <v-tooltip absolute left>
                                                <v-btn slot="activator" flat icon @click="removeItem(index)">
                                                    <v-icon>mdi-close</v-icon>
                                                </v-btn>
                                                <span>Remove item</span>
                                            </v-tooltip>
                                        </v-flex>
                                        <!--<v-flex xs9 grow>
                                            <v-list-tile :key="`tile-${index}`" class="mb-3" @click="">
                                                <v-list-tile-content>
                                                    <v-list-tile-title>{{item.app}}</v-list-tile-title>
                                                    <div class="ml-3">
                                                        <v-list-tile-sub-title><strong>Category:</strong> {{item.category}}</v-list-tile-sub-title>
                                                        <v-list-tile-sub-title><strong>Subcategory:</strong> {{item.subCategory}}</v-list-tile-sub-title>
                                                        <v-list-tile-sub-title><strong>Issue:</strong> {{item.issue}}</v-list-tile-sub-title>
                                                    </div>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-flex>-->
                                    </v-layout>
                                <v-divider v-if="index !== favorites.length - 1" class="mb-3" :key="`divider-${index}`"></v-divider>
                            </template>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { alertMixin } from "../mixins/alertMixin";
import { authMixin } from "../mixins/authMixin";

export default {
  name: "Profile",
  mixins: [themeMixin, alertMixin, authMixin],
  data: () => ({
    favorites: [
      {
        app: "Consilium",
        category: "Admin",
        subCategory: "Access",
        issue: "User Password Reset"
      },
      {
        app: "Consilium",
        category: "Admin",
        subCategory: "Action Items",
        issue: "Move Action Items"
      },
      {
        app: "Consilium",
        category: "Admin",
        subCategory: "Change Request",
        issue: "Delete"
      },
      {
        app: "Consilium",
        category: "Admin",
        subCategory: "Daily Monitoring",
        issue: "Failed Process"
      }
    ]
  }),
  methods: {
    removeItem: function(index) {
      if (index >= 0 && index < this.favorites.length) {
        this.favorites.splice(index, 1);
      }
    }
  }
};
</script>

<style scoped>
</style>
