import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    alert: false,
    alertClass: "",
    alertColor: "#DC2D37",
    alertMessage: "",
    alertSeverity: "error",
    alertTimeout: 5000,
    app: "",
    appToken: null,
    badgeCard: false,
    cordPullMessage: {
      data: {
        _id: "",
        app: "",
        category: "",
        description: "",
        puller: { _id: "", username: "" },
        title: ""
      }
    },
    cordPullNotification: false,
    expiryDetails: {
      iat: "",
      exp: "",
      tokenLife: ""
    },
    gridItems: [],
    isAuthenticated: false,
    isConnected: false,
    isDark: false,
    isExpiryIntervalSet: false,
    notificationLink: "",
    selectedCord: null,
    socketMessage: "",
    theme: "light",
    token: null,
    user: null
  },
  getters: {
    alert: state => state.alert,
    alertClass: state => state.alertClass,
    alertColor: state => state.alertColor,
    alertMessage: state => state.alertMessage,
    alertSeverity: state => state.alertSeverity,
    alertTimeout: state => state.alertTimeout,
    appToken: state => state.appToken,
    badgeCard: state => state.badgeCard,
    cordPullNotification: state => state.cordPullNotification,
    cordPullMessage: state => state.cordPullMessage,
    expiryDetails: state => state.expiryDetails,
    gridItems: state => state.gridItems,
    isConnected: state => state.isConnected,
    isDark: state => state.isDark,
    isAuthenticated: state => state.isAuthenticated,
    isExpiryIntervalSet: state => state.isExpiryIntervalSet,
    notificationLink: state => state.notificationLink,
    selectedCord: state => state.selectedCord,
    socketMessage: state => state.socketMessage,
    theme: state => state.theme,
    token: state => state.token,
    user: state => state.user
  },
  mutations: {
    alert: function(state, payload) {
      state.alert = payload;
    },
    alertClass: function(state, payload) {
      state.alertClass = payload;
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
    appToken: function(state, payload) {
      state.appToken = payload;
    },
    badgeCard: function(state, payload) {
      state.badgeCard = payload;
    },
    cordPullNotification: function(state, payload) {
      state.cordPullNotification = payload;
    },
    cordPullMessage: function(state, payload) {
      state.cordPullMessage = payload;
    },
    expiryDetails: function(state, payload) {
      state.expiryDetails = payload;
    },
    gridItems: function(state, payload) {
      state.gridItems = payload;
    },
    isDark: function(state, payload) {
      localStorage.setItem("vueAppTemplate-isDark", JSON.stringify(payload));
      state.isDark = payload;
    },
    isConnected: function(state, payload) {
      state.isConnected = payload;
    },
    isAuthenticated: function(state, payload) {
      state.isAuthenticated = payload;
    },
    isExpiryIntervalSet: function(state, payload) {
      state.isExpiryIntervalSet = payload;
    },
    notificationLink: function(state, payload) {
      state.notificationLink = payload;
    },
    selectedCord: function(state, payload) {
      state.selectedCord = payload;
    },
    SOCKET_CONNECT(state) {
      state.isConnected = true;
    },
    SOCKET_DISCONNECT(state) {
      state.isConnected = false;
    },
    SOCKET_REFRESH_ITEM(state, payload) {
      state.selectedCord = payload;
    },
    socketMessage: function(state, payload) {
      state.socketMessage = payload;
    },
    theme: function(state, payload) {
      // This can be modified to retrieve from API instead of localstorage
      localStorage.setItem(
        "vueAppTemplate-theme",
        typeof payload !== "string" ? JSON.stringify(payload) : payload
      );
      state.theme = payload;
      state.isDark = state.theme === "dark";
    },
    token: function(state, payload = null) {
      if (payload) {
        let parsedPayload =
          typeof payload === "string" ? payload : JSON.stringify(payload);
        localStorage.setItem("token", parsedPayload);
      } else {
        localStorage.removeItem("token");
      }

      state.token = payload;
    },
    user: function(state, payload) {
      if (payload) {
        let parsedPayload =
          typeof payload === "string" ? payload : JSON.stringify(payload);
        localStorage.setItem("user", parsedPayload);
      } else {
        localStorage.removeItem("user");
      }

      state.user = typeof payload === "string" ? JSON.parse(payload) : payload;
    }
  },
  actions: {}
});
