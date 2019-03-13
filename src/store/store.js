import Vue from "vue";
import Vuex from "vuex";
import { TokenService } from "../services/tokenService";
import { UserService } from "../services/userService";
import { TimeService } from "../services/timeService";
import themeModule from "./modules/themeModule";
import alertModule from "./modules/alertModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    alertModule,
    themeModule
  },
  state: {
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
    isExpiryIntervalSet: false,
    notificationLink: "",
    selectedCord: null,
    socketMessage: "",
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
