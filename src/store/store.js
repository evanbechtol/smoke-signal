import Vue from "vue";
import Vuex from "vuex";
import alertModule from "./modules/alertModule";
import themeModule from "./modules/themeModule";
import authModule from "./modules/authModule";
import cordModule from "./modules/cordModule";
import socketModule from "./modules/socketModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    alertModule,
    authModule,
    cordModule,
    themeModule,
    socketModule
  },
  state: {
    badgeCard: false
  },
  getters: {},
  mutations: {
    badgeCard: function(state, payload) {
      state.badgeCard = payload;
    }
  },
  actions: {}
});
