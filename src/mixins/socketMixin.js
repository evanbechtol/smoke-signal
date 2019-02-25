export const socketMixin = {
  sockets: {
    connect: function() {
      console.log("socket connected");
    },
    customEmit: function(data) {
      console.log(
        `this method was fired by the socket server. eg: io.emit("customEmit", ${data})`
      );
    }
  },
  methods: {}
};
