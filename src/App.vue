<template>
  <v-app>
    <div id="app" :class="theme">
      <main>
        <Toolbar color="primary"/>
        <transition name="routerAnimation" enter-active-class="animated faster fadeIn">
          <router-view></router-view>
        </transition>
        <!--<Footer color="primary"/>-->
        <v-snackbar :color="alertColor"
                    :dark="isDark"
                    v-model="alert"
                    :multi-line="mode === 'multi-line'"
                    :timeout="alertTimeout"
                    :bottom="y === 'bottom'"
                    :top="y === 'top'"
                    :left="x === 'left'"
                    :right="x === 'right'"
                    :vertical="mode === 'vertical'">
          <v-icon class="pr-4">{{getAlertIcon()}}</v-icon>{{ alertMessage }}
          <v-btn :dark="isDark"
                 icon
                 @click="toggleAlert(false)">
            <v-icon>close</v-icon>
          </v-btn>
        </v-snackbar>
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

export default {
  name: "app",
  mixins: [themeMixin, alertMixin, authMixin],
  components: { Footer, Toolbar },
  created() {
    const color = this.isDark ? "#181818" : "#e0e0e0";

    document.getElementById("html").style.height = "100vh";
    document.getElementById("body").style.height = "100vh";
    document.getElementById("html").style.backgroundColor = color;
    document.getElementById("body").style.backgroundColor = color;

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
  methods: {},
  mounted() {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      this.$store.commit("token", token);
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
