export const socketMixin = {
  sockets: {
    connect: function() {
      this.$store.commit("SOCKET_CONNECT");
    },
    disconnect: function() {
      this.$store.commit("SOCKET_DISCONNECT");
    },
    SOCKET_NOTIFY: function(data) {
      this.$store.commit("cordPullNotification", true);
      this.$store.commit("cordPullMessage", data);
      this.$store.commit("notificationLink", `/cord/${data.data._id}`);
    },
    SOCKET_REFRESH_DISCUSSION: function() {},
    SOCKET_REFRESH_GRID_ALL: function(data) {
      this.$store.commit("gridItems", data);
    },
    SOCKET_REFRESH_GRID_ONE: function(data) {
      this.$store.commit("gridItems", data);
    },
    SOCKET_REFRESH_ITEM: function(data) {
      this.$store.commit("selectedCord", data);
    },
    SOCKET_REFRESH_ERROR: function(data) {
      this.$store.commit("alert", true);
      this.$store.commit("alertMessage", data);
      this.$store.commit("alertColor", "#DC2D37");
      this.$store.commit("alertTimeout", 0);
    }
  },
  methods: {
    joinSelectedCordRoom: function(_id) {
      this.$socket.emit("JOIN_ITEM_ROOM", _id);
    },
    leaveSelectedCordRoom: function(_id) {
      this.$socket.emit("LEAVE_ITEM_ROOM", _id);
    },
    notify: function(data) {
      this.$socket.emit("NOTIFY", data);
    },
    refreshGrid: function() {
      this.$socket.emit("REFRESH_GRID_ALL", { query: { status: "Open" } });
    },
    refreshGridOne: function() {
      this.$socket.emit("REFRESH_GRID_ONE", { query: { status: "Open" } });
    },
    refreshItem: function(_id) {
      this.$socket.emit("REFRESH_ITEM", _id);
    }
  }
};
