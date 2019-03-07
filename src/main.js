import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidate from "vee-validate";
import VTooltip from "v-tooltip";
import VueSocketIO from "vue-socket.io";
import Vuetify from "vuetify";
import SocketIO from "socket.io-client";
import "vuetify/dist/vuetify.min.css";
import "./registerServiceWorker";
import "./css/materialIcons.css";
import "./css/e-font.css";
import "./css/eColors.css";
import "./css/animate.css";
import theme from "./themes";

Vue.use(VeeValidate);
Vue.use(VTooltip);
Vue.use(Vuetify, { theme });

Vue.prototype.$apiBase = process.env.VUE_APP_API_BASE;
Vue.prototype.$appUrl = process.env.VUE_APP_URL;

const options = { path: process.env.VUE_APP_SOCKET_PATH };

const settings = {
  debug: false,
  connection: SocketIO(
    `${
      process.env.NODE_ENV === "production"
        ? process.env.VUE_APP_URL
        : process.env.VUE_APP_API_BASE
    }`,
    options
  ), // Change to process.env.VUE_APP_API_BASE for '/smoke-signal-service' NSP on production
  vuex: {
    store,
    actionPrefix: "SOCKET_",
    mutationPrefix: "SOCKET_"
  }
};

Vue.use(new VueSocketIO(settings));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
