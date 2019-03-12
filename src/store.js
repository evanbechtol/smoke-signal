import Vue from "vue";
import Vuex from "vuex";
import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { ThemeService } from "../services/themeService";
import { TimeService} from "../services/timeService";

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
    appToken: state => state.appToken,
    gridItems: state => state.gridItems,
    socketMessage: state => state.socketMessage,
    criticalCords: state => {
      return state.gridItems.filter(function(elem) {
        return TimeService.computeDuration(elem.openedOn).includes("Days");
      });
    },
    darken: state => {
      return state.isDark === true ? "darken-1" : "";
    },
    moderateCords: state => {
      return state.gridItems.filter(function(elem) {
        return (
          !TimeService.computeDuration(elem.openedOn).includes("Days") &&
          TimeService.computeDuration(elem.openedOn).includes("Hrs")
        );
      });
    },
    myCords: state => {
      return state.gridItems.filter(function(elem) {
        return state.user && state.username
          ? elem.puller.username === state.user.username
          : false;
      });
    },
    newCords: state => {
      return state.gridItems.filter(function(elem) {
        return (
          !TimeService.computeDuration(elem.openedOn).includes("Days") &&
          !TimeService.computeDuration(elem.openedOn).includes("Hrs")
        );
      });
    }
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
      ThemeService.setIsDark(payload);
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
      ThemeService.setTheme(payload);
      state.theme = payload;
      state.isDark = state.theme === "dark";
    },
    token: function(state, payload = null) {
      if (payload) {
        TokenService.setToken(payload);
      } else {
        TokenService.deleteToken();
      }

      state.token = payload;
    },
    user: function(state, payload) {
      if (payload) {
        UserService.setUser(payload);
      } else {
        UserService.deleteUser();
      }

      state.user = payload;
    }
  },
  actions: {}
});
