import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alert: false,
    alertColor: "#DC2D37",
    alertMessage: "",
    alertSeverity: "error",
    alertTimeout: 5000,
    app: "",
    appToken: null,
    isDark: false,
    isAuthenticated: false,
    isExpiryIntervalSet: false,
    selectedCord: null,
    theme: "light",
    token: null,
    /*"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6eyJuYW1lIjoiRXZhbiBCZWNodG9sIiwidXNlcm5hbWUiOiJlZXZhYmVjIiwic2lnbnVtIjoiZWV2YWJlYyIsImVtYWlsIjoiZXZhbi5iZWNodG9sQGVyaWNzc29uLmNvbSIsImlzQWRtaW4iOmZhbHNlfSwiZXhwIjoxNTQyMTE3MDExLCJpYXQiOjE1NDIxMTYwMTF9.DOPCqBNH2dflBuc8UP3uN57063il6138fTygZhQFcW8"*/
    user: null
  },
  getters: {
    alert: state => state.alert,
    alertColor: state => state.alertColor,
    alertMessage: state => state.alertMessage,
    alertSeverity: state => state.alertSeverity,
    alertTimeout: state => state.alertTimeout,
    app: state => state.app,
    appToken: state => state.appToken,
    isDark: state => state.isDark,
    isAuthenticated: state => state.isAuthenticated,
    isExpiryIntervalSet: state => state.isExpiryIntervalSet,
    selectedCord: state => state.selectedCord,
    theme: state => state.theme,
    token: state => state.token,
    user: state => state.user
  },
  mutations: {
    alert: function(state, payload) {
      state.alert = payload;
    },
    alertColor: function(state, payload) {
      state.alertColor = payload;
    },
    alertMessage: function(state, payload) {
      state.alertMessage = payload;
    },
    alertSeverity: function(state, payload) {
      state.alertSeverity = payload;
    },
    alertTimeout: function(state, payload) {
      state.alertTimeout = payload;
    },
    app: function(state, payload) {
      state.app = payload;
    },
    appToken: function(state, payload) {
      state.appToken = payload;
    },
    isDark: function(state, payload) {
      localStorage.setItem("vueAppTemplate-isDark", JSON.stringify(payload));
      state.isDark = payload;
    },
    isAuthenticated: function(state, payload) {
      state.isAuthenticated = payload;
    },
    isExpiryIntervalSet: function(state, payload) {
      state.isExpiryIntervalSet = payload;
    },
    selectedCord: function(state, payload) {
      state.selectedCord = payload;
    },
    theme: function(state, payload) {
      // This can be modified to retrieve from API instead of localstorage
      localStorage.setItem("vueAppTemplate-theme", JSON.stringify(payload));
      state.theme = payload;
      state.isDark = state.theme === "dark";
    },
    token: function(state, payload) {
      if (payload) {
        let parsedPayload =
          typeof payload === "string" ? payload : JSON.stringify(payload);
        localStorage.setItem("token", parsedPayload);
      } else {
        payload = null;
      }

      state.token = payload;
    },
    user: function(state, payload) {
      let parsedPayload =
        typeof payload === "string" ? payload : JSON.stringify(payload);
      localStorage.setItem("user", parsedPayload);

      let storePayload =
        typeof payload === "string" ? JSON.parse(payload) : payload;
      state.user = storePayload;
    }
  },
  actions: {}
});
