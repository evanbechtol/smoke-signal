import Vue from "vue";
import Vuex from "vuex";
import { TimeService } from "../services/timeService";
import alertModule from "./modules/alertModule";
import themeModule from "./modules/themeModule";
import authModule from "./modules/authModule";
import cordModule from "./modules/cordModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    alertModule,
    authModule,
    cordModule,
    themeModule
  },
  state: {
    badgeCard: false,
    isConnected: false,
    socketMessage: ""
  },
  getters: {},
  mutations: {
    badgeCard: function(state, payload) {
      state.badgeCard = payload;
    },
    isConnected: function(state, payload) {
      state.isConnected = payload;
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
