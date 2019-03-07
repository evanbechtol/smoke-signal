<template>
  <v-app>
    <div id="app" :class="theme">
      <main>
        <Toolbar color="primary" />
        <transition
          name="routerAnimation"
          enter-active-class="animated faster fadeIn"
        >
          <router-view></router-view>
        </transition>
        <!--<Footer color="primary"/>-->
        <v-snackbar
          :color="alertColor"
          class="animated faster heartBeat"
          :dark="isDark"
          v-model="alert"
          :multi-line="mode === 'multi-line'"
          :timeout="alertTimeout"
          top
          :vertical="mode === 'vertical'"
        >
          <v-icon class="pr-4">{{ getAlertIcon() }}</v-icon>
          {{ alertMessage }}
          <v-btn :dark="isDark" icon @click="toggleAlert(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-snackbar>

        <v-bottom-sheet
          v-if="user && isAuthenticated"
          :inset="$vuetify.breakpoint.name === 'xs'"
          :value="cordPullNotification"
          :hide-overlay="$vuetify.breakpoint.name !== 'xs'"
        >
          <v-toolbar dark>
            <v-icon class="ml-1 mr-2">{{ alertSeverity }}</v-icon>
            <v-toolbar-title class="hildaLight space-small">
              {{ cordPullMessage.message }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark icon @click="closeCordPullNotification">
                <v-icon>close</v-icon>
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-card tile>
            <v-card-text>
              <v-layout row wrap fill-height>
                <v-flex xs12>
                  <p class="hildaLight">
                    <strong>{{ cordPullMessage.data.title }}</strong>
                  </p>
                </v-flex>
                <v-flex xs12>
                  <div style="height: 100px; overflow-x: hidden;">
                    <div v-html="cordPullMessage.data.description"></div>
                  </div>
                </v-flex>
                <v-flex xs12>
                  <v-btn
                    depressed
                    color="info"
                    class="ml-0 mt-4"
                    dark
                    @click="goToCord"
                    :block="$vuetify.breakpoint.name === 'xs'"
                  >
                    Check it out!
                    <v-icon class="ml-2">navigate_next</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-bottom-sheet>

        <!--<badge-card></badge-card>-->
      </main>
    </div>
  </v-app>
</template>

<script>
import { themeMixin } from "./mixins/themeMixin.js";
import Toolbar from "./components/Toolbar";
import Footer from "./components/Footer";
import { alertMixin } from "./mixins/alertMixin";
import { authMixin } from "./mixins/authMixin";
import { socketMixin } from "./mixins/socketMixin";
import BadgeCard from "./components/BadgeCard";

export default {
  name: "app",
  mixins: [themeMixin, alertMixin, authMixin, socketMixin],
  components: { BadgeCard, Footer, Toolbar },
  created() {
    const color = this.isDark ? "#181818" : "#e0e0e0";
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (token) {
      this.$store.commit("token", token);
      this.setExpiry();
    }

    if (user) {
      this.$store.commit("user", user);
    }

    document.getElementById("html").style.height = "100vh";
    document.getElementById("body").style.height = "100vh";
    document.getElementById("html").style.backgroundColor = color;
    document.getElementById("body").style.backgroundColor = color;

    const theme = localStorage.getItem("vueAppTemplate-theme");

    if (theme !== null) {
      this.$store.commit("theme", theme);
    } else {
      this.$store.commit("theme", this.isDark ? "dark" : "light");
    }
    // For E-Auth application authentication
    this.authenticateApp();
  },
  data() {
    return {
      color: "#0c0c0c",
      y: "top",
      x: null,
      mode: ""
    };
  },
  methods: {
    goToCord: function() {
      this.$store.commit("cordPullNotification", false);
      this.$router.push({ path: this.notificationLink });
    }
  },
  mounted() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      this.$store.commit("token", token);
      this.setExpiry();
    }

    if (user) {
      this.$store.commit("user", user);
    }
  },
  watch: {}
};
</script>

<style>
@import "https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css";
@import "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons";

html,
body {
  height: 100vh;
  margin: 0 auto 0;
}
#app {
  font-family: "Hilda-Regular", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page {
  width: inherit;
}
</style>
