<template>
  <div>
    <v-toolbar v-bind:color="color" dark app>
      <v-toolbar-side-icon
        @click.stop="drawer = !drawer"
        style="margin: 8px;"
      ></v-toolbar-side-icon>
      <v-toolbar-title class="space-base" style="margin: 8px;">
        <router-link class="link white--text" to="/">
          AnA Hero
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <slot name="installer"></slot>

      <v-btn
        v-if="user && user.username"
        flat
        @click.stop="rightDrawer = !rightDrawer"
        style="margin: 8px;"
        class="mr-2 px-3"
      >
        <v-icon class="mr-3">perm_identity</v-icon>
        {{ user.username }}
      </v-btn>
    </v-toolbar>

    <!-- LEFT DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      class="nav"
      :style="{ backgroundColor: '#0c0c0c' }"
      :mini-variant="mini"
      app
      dark
      temporary
    >
      <v-list class="pt-0">
        <v-list-tile-title class="ml-3 my-4">
          <p class="hildaLight">Menu</p>
        </v-list-tile-title>
        <v-divider></v-divider>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          active-class="dark-info"
          :to="{ path: item.path }"
        >
          <v-list-tile-content class="ml-1">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- RIGHT DRAWER -->
    <v-navigation-drawer
      v-if="user"
      right
      v-model="rightDrawer"
      class="nav"
      :style="{ backgroundColor: '#0c0c0c' }"
      :mini-variant="mini"
      app
      dark
      temporary
    >
      <v-layout column fill-height align-space-around justify-center>
        <v-flex xs12 mt-5 shrink>
          <v-layout column align-space-around justify-center mt-4>
            <v-flex xs12 text-xs-center>
              <v-icon size="100">perm_identity</v-icon>
            </v-flex>
            <v-flex xs12 class="hildaLight white--text" text-xs-center>
              {{ user.username }}
            </v-flex>
            <v-flex xs12>
              <jwt-expiry
                v-if="isAuthenticated && token"
                :expiry-details="expiryDetails"
              ></jwt-expiry>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>

          <v-flex xs12 ml-3 mt-3>
            <p class="hildaLight white--text">My Settings</p>
          </v-flex>

          <v-flex xs12>
            <v-layout row align-center justify-start>
              <v-flex xs6 class="white--text" ml-3>Switch Theme</v-flex>
              <v-flex xs6>
                <v-switch
                  v-model="themeSwitch"
                  :label="switchLabel"
                  :dark="isDark"
                  :color="isDark ? 'accent darken-1' : 'info'"
                ></v-switch>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
          </v-flex>

          <v-flex xs12 ml-3 mt-3>
            <p class="hildaLight white--text mb-4">User Details</p>
            <v-layout column align-start justify-start>
              <v-flex xs12 mb-0 shrink>
                <p class="subheading white--text">
                  Signum
                </p>
              </v-flex>
              <v-flex xs12 mt-0 class="userDetail">
                <p class="white--text">{{ user.username }}</p>
              </v-flex>

              <v-flex xs12 mb-0 shrink>
                <p class="subheading white--text">
                  Name
                </p>
              </v-flex>
              <v-flex xs12 mt-0 class="userDetail">
                <p class="white--text">
                  {{ user.firstname }} {{ user.lastname }}
                </p>
              </v-flex>

              <v-flex xs12 mb-0 shrink>
                <p class="subheading white--text">
                  Email
                </p>
              </v-flex>
              <v-flex xs12 mt-0 class="userDetail">
                <p class="white--text">{{ user.email }}</p>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12 align-self-center mt-5>
            <v-btn block outline @click="logout">
              Sign Out
            </v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { authMixin } from "../mixins/authMixin.js";
import JwtExpiry from "./JWTExpiry";

export default {
  name: "toolbar",
  components: { JwtExpiry },
  mixins: [authMixin, themeMixin],
  props: {
    color: String
  },
  computed: {
    switchLabel: function() {
      return this.isDark ? "Dark" : "Light";
    }
  },
  data() {
    return {
      themeSwitch: true,
      rightDrawer: false,
      drawer: null,
      mini: false,
      right: null,
      items: [
        {
          title: "Dashboard",
          icon: "dashboard",
          path: "/"
        },
        {
          title: "Resolved Cords",
          icon: "assignment_turned_in",
          path: "/resolved"
        },
        { title: "Admin", icon: "settings", path: "/admin" },
        { title: "My Profile", icon: "settings", path: "/profile" },
        { title: "About", icon: "settings", path: "/about" }
      ],
      themes: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" }
      ]
    };
  },
  created() {
    this.themeSwitch = this.theme === "light";
    if (!this.isExpiryIntervalSet) {
      const _this = this;
      setInterval(function() {
        _this.setExpiry();
      }, 60000);
      this.$store.commit("isExpiryIntervalSet", true);
    }
  },
  methods: {
    toggleTheme(value) {
      this.$store.commit("theme", value.toLowerCase());
    }
  },
  watch: {
    themeSwitch: function(value) {
      this.toggleTheme(value ? "light" : "dark");
    }
  }
};
</script>

<style scoped>
.link {
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  align-items: center;
  text-decoration: none;
  height: 100%;
}

.userDetail {
  position: relative;
  top: -10px;
}
</style>
