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
    </v-layout>
  </v-container>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { alertMixin } from "../mixins/alertMixin";
import { authMixin } from "../mixins/authMixin";

export default {
  name: "Profile",
  mixins: [themeMixin, alertMixin, authMixin],
  computed: {
    emailVerified: function() {
      return this.user.is_email_verified === true;
    }
  },
  data: () => ({}),
  methods: {}
};
</script>

<style scoped></style>
