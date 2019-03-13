import Vue from "vue";
import Vuex from "vuex";
import { TimeService } from "../services/timeService";
import alertModule from "./modules/alertModule";
import themeModule from "./modules/themeModule";
import authModule from "./modules/authModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    alertModule,
    authModule,
    themeModule
  },
  state: {
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
    gridItems: [],
    isConnected: false,
    notificationLink: "",
    selectedCord: null,
    socketMessage: ""
  },
  getters: {
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
    badgeCard: function(state, payload) {
      state.badgeCard = payload;
    },
    cordPullNotification: function(state, payload) {
      state.cordPullNotification = payload;
    },
    cordPullMessage: function(state, payload) {
      state.cordPullMessage = payload;
    },
    gridItems: function(state, payload) {
      state.gridItems = payload;
    },
    isConnected: function(state, payload) {
      state.isConnected = payload;
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
    }
  },
  actions: {}
});
