import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store.js";
import VeeValidate from "vee-validate";
import VTooltip from "v-tooltip";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import "./registerServiceWorker";
import "./css/materialIcons.css";
import "./css/e-font.css";
import "./css/eColors.css";
import "./css/animate.css";
import theme from "./themes";
import { ApiService } from "./services/apiService";
import "./jwt-decode";

Vue.use(VeeValidate);
Vue.use(VTooltip);
Vue.use(Vuetify, { theme });

Vue.prototype.$apiBase = process.env.VUE_APP_API_BASE;
Vue.prototype.$appUrl = process.env.VUE_APP_URL;
Vue.prototype.$compareString = compareString;

Vue.config.productionTip = false;

// Set the base URL of the API
ApiService.init(process.env.VUE_APP_ROOT_API);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

/**
 * @description Compare strings
 * @param a {string} First String to compare
 * @param b {string} Second String to compare
 * @returns {number} Returns -1 if a < b. Returns 1 if a > b. Returns 0 if strings are equivalent
 */
function compareString(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
