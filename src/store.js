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
    appToken: state => state.appToken,
    gridItems: state => state.gridItems,
    socketMessage: state => state.socketMessage,
    criticalCords: state => {
      return state.gridItems.filter(function(elem) {
        return computeDuration(elem.openedOn).includes("Days");
      });
    },
    darken: state => {
      return state.isDark === true ? "darken-1" : "";
    },
    moderateCords: state => {
      return state.gridItems.filter(function(elem) {
        return (
          !computeDuration(elem.openedOn).includes("Days") &&
          computeDuration(elem.openedOn).includes("Hrs")
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
          !computeDuration(elem.openedOn).includes("Days") &&
          !computeDuration(elem.openedOn).includes("Hrs")
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

function computeDuration(date) {
  const now = new Date();
  const openedOn = new Date(date);
  return msToTime(parseInt(now - openedOn));
}

function msToTime(duration) {
  const seconds = (duration / 1000).toFixed(1);
  const minutes = (duration / (1000 * 60)).toFixed(1);
  const hours = (duration / (1000 * 60 * 60)).toFixed(1);
  const days = (duration / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return seconds + " Sec";
  } else if (minutes < 60) {
    return minutes + " Min";
  } else if (hours < 24) {
    return hours + " Hrs";
  } else {
    return days + " Days";
  }
}
