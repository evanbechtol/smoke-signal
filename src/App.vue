<template>
  <v-app id="app" :dark="isDark">
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

    <!-- Cord Notification Card -->
    <cord-notification-card
      :show-notification-card="showNotificationCard"
      v-on:closeCordPullNotification="closeCordPullNotification"
    ></cord-notification-card>

    <!--<badge-card></badge-card>-->
  </v-app>
</template>

<script>
import { themeMixin } from "./mixins/themeMixin.js";
import Toolbar from "./components/Toolbar";
import { alertMixin } from "./mixins/alertMixin";
import { authMixin } from "./mixins/authMixin";
import { socketMixin } from "./mixins/socketMixin";
import { TokenService } from "./services/tokenService";
import { ThemeService } from "./services/themeService";
import { UserService } from "./services/userService";
import { cordMixin } from "./mixins/cordMixin";
import CordNotificationCard from "./components/CordNotificationCard";
//import BadgeCard from "./components/BadgeCard";

export default {
  name: "app",
  mixins: [alertMixin, authMixin, cordMixin, themeMixin, socketMixin],
  components: { CordNotificationCard, /*BadgeCard, Footer,*/ Toolbar },
  created() {
    this.init();
    const theme = ThemeService.getTheme();

    if (theme !== null) {
      this.$store.commit("theme", theme);
    } else {
      this.$store.commit("theme", this.isDark ? "dark" : "light");
    }
    // For E-Auth application authentication
    this.authenticateApp();
  },
  computed: {
    showNotificationCard: function() {
      return !!(this.user && this.isAuthenticated && this.cordPullNotification);
    }
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
    closeCordPullNotification() {
      this.$store.commit("cordPullNotification", false);
    },
    goToCord() {
      this.$store.commit("cordPullNotification", false);
      this.$router.push({ path: this.notificationLink });
    },
    init() {
      const token = TokenService.getToken();
      const user = UserService.getUser();

      if (token) {
        this.$store.commit("token", token);
        this.setExpiry();
      }

      if (user) {
        this.$store.commit("user", JSON.parse(user));
      }
    }
  },
  mounted() {
    this.init();
  },
  watch: {}
};
</script>

<style>
@import "https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css";
@import "https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900|Material+Icons";

#app {
  font-family: "Hilda-Regular", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
