import { TokenService } from "../../services/tokenService";
import { UserService } from "../../services/userService";

export default {
  state: {
    appToken: null,
    expiryDetails: {
      iat: "",
      exp: "",
      tokenLife: ""
    },
    isAuthenticated: false,
    isExpiryIntervalSet: false,
    token: null,
    user: null
  },
  mutations: {
    appToken: function(state, payload) {
      state.appToken = payload;
    },
    expiryDetails: function(state, payload) {
      state.expiryDetails = payload;
    },
    isAuthenticated: function(state, payload) {
      state.isAuthenticated = payload;
    },
    isExpiryIntervalSet: function(state, payload) {
      state.isExpiryIntervalSet = payload;
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
  actions: {},
  getters: {
    // eslint-disable-next-line
    appToken: (state, getters) => {
      return state.appToken;
    }
  }
};
