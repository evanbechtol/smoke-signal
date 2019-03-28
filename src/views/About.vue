<template>
  <v-container fluid fill-height class="home page">

    <v-layout row wrap fill-height align-start justify-center>
      
      <v-flex xs12 shrink mb-5>
        <v-parallax height="20" >
        </v-parallax>
      </v-flex>

      <v-flex xs12 sm12 mb-5 mx-1>
        <v-card elevation="0" class="animated faster slideInLeft">
          <v-card-title class="darkCard">
            <h1 class="hildaLight" style="font-size: 3em;">What is it?</h1>
          </v-card-title>
          <v-card-text style="font-size: 1.3em;">
            <p>The purpose of Smoke Signal is to enable users to signal when a problem is encountered, and has blocked them from completing a task. When a user has encountered a problem, they simply "pull their cord". This notifies other users that a colleague is blocked and needs assistance. Users are able to associate helpful information with their issues, allowing "rescuers" to better help the blocked user.</p>
            <p>Rescuers are simply users that aid in issue resolution. An issue could also have one, or many rescuers. Once an issue has been resolved, the cord is no longer pulled. However, a user could still have other cords pulled for different issues. This allows a user to break a large problem down into smaller issues.</p>
            <p>The overall goal of the application is to reduce time spent by users being blocked, encourage users to seek help sooner, and reward users for both helping and seeking help.</p>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 mb-5>
        <v-card elevation="0" class="animated faster slideInRight">
          <v-card-title class="darkCard">
            <h1 class="hildaLight" style="font-size: 3em;">Whom do I contact for support?</h1>
          </v-card-title>
          <v-card-text style="font-size: 1.3em;">
            <p>For any application support inquiries, including feature requests & bugs, please use the button below to send an email for help! Be sure to include as much information as possible to help answer your question.</p>
            <v-btn name="support email"
                   class="ma-0"
                   color="info"
                   href="mailto:evan.bechtol@ericsson.com?Subject=AnA Smoke Signal Support">
              <v-icon class="pr-2">email</v-icon>
              Send Email
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";
import { authMixin } from "../mixins/authMixin";
import { assetMixin } from "../mixins/assetMixin";

export default {
  name: "home",
  mixins: [authMixin, assetMixin, themeMixin],
  components: {},
  data: () => ({}),
  created() {
    if (!this.user) {
      // this.$router.push({ path: "/login", name: "login" });
    } else if (this.appToken) {
      // Do something once your app is ready
    } else if (!this.appToken) {
      this.authenticateApp();
    }
  },
  methods: {}
};
</script>

<style scoped>
</style>
