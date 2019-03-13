export default {
  state: {
    isConnected: false,
    socketMessage: ""
  },
  mutations: {
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
  actions: {},
  getters: {}
};
