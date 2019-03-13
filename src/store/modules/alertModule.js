export default {
  state: {
    alert: false,
    alertClass: "",
    alertColor: "#DC2D37",
    alertMessage: "",
    alertSeverity: "error",
    alertTimeout: 5000
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
    }
  },
  actions: {},
  getters: {}
};
