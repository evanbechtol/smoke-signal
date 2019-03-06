import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidate from "vee-validate";
import VTooltip from "v-tooltip";
import VueClipboards from "vue-clipboards";
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
Vue.use(VueClipboards);
Vue.use(Vuetify, { theme });
//Vue.use(VueAxios, axios);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: SocketIO(process.env.VUE_APP_API_BASE, {
      path: process.env.VUE_APP_SOCKET_PATH
    }),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
