<template>
  <div>
    <v-toolbar v-bind:color="color" dark fixed app>
      <v-toolbar-side-icon
        @click.stop="drawer = !drawer"
        style="margin: 8px;"
      ></v-toolbar-side-icon>
      <v-toolbar-title class="space-base" style="margin: 8px;">
        <router-link class="link white--text" to="/">
          AnA Smoke Signal
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <router-link class="link" to="/login" name="help">
          <v-tooltip bottom class="menuIcon">
            <v-btn slot="activator" icon name="help"
              ><v-icon>account_circle</v-icon></v-btn
            >
            <span>Login</span>
          </v-tooltip>
        </router-link>

        <router-link v-if="isAuthenticated && user.email" class="link" to="/">
          <v-tooltip bottom class="menuIcon">
            <v-btn slot="activator" icon @click="logout()">
              <v-icon>logout</v-icon>
            </v-btn>
            <span>Logout</span>
          </v-tooltip>
        </router-link>
      </v-toolbar-items>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      class="nav"
      :style="{ backgroundColor: '#0c0c0c' }"
      :mini-variant="mini"
      absolute
      app
      dark
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile v-if="mini" @click.stop="mini = !mini">
          <v-list-tile-action>
            <v-icon>chevron_right</v-icon>
          </v-list-tile-action>
        </v-list-tile>

        <v-list-group value="true">
          <v-list-tile
            slot="activator"
            avatar
            tag="div"
            v-if="isAuthenticated || user"
          >
            <v-list-tile-avatar>
              <v-icon large>fingerprint</v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>
                {{ user.username || user.email }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/profile">
            <v-list-tile-title>
              <v-icon class="mx-4">face</v-icon>My Profile
            </v-list-tile-title>
          </v-list-tile>
        </v-list-group>
      </v-list>

      <jwt-expiry v-if="isAuthenticated && token"></jwt-expiry>

      <v-list class="pt-0" dense>
        <v-divider light class="mb-1"></v-divider>
        <v-list-tile id="selectContainer" class="mt-3">
          <v-select
            id="select"
            class="mb-2 pt-3"
            dark
            dense
            :items="themes"
            @change="toggleTheme"
            label="Theme Selection"
          >
          </v-select>
        </v-list-tile>
        <v-divider light class="py-1 mt-2"></v-divider>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          active-class="dark-info"
          :to="{ path: item.path }"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
  props: ["color"],
  data() {
    return {
      drawer: null,
      mini: false,
      right: null,
      items: [
        { title: "Login", icon: "account_circle", path: "/login" },
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
        { title: "Admin", icon: "settings", path: "/admin" }
      ],
      themes: ["Dark", "Light"]
    };
  },
  created() {},
  methods: {
    toggleTheme(value) {
      this.$store.commit("theme", value.toLowerCase());
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

#select {
  width: 300px !important;
}

#selectContainer {
  padding: 0 0 !important;
}

.menuIcon {
  position: relative;
  top: 8px;
}
</style>
