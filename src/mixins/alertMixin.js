export const alertMixin = {
  computed: {
    alert: {
      get: function() {
        return this.$store.getters.alert;
      },
      set: function() {
        this.$store.commit("alert");
      }
    },
    cordPullNotification: {
      get: function() {
        return this.$store.getters.cordPullNotification;
      },
      set: function() {
        this.$store.commit("cordPullNotification");
      }
    },
    cordPullMessage: {
      get: function() {
        return this.$store.getters.cordPullMessage;
      },
      set: function() {
        this.$store.commit("cordPullMessage");
      }
    },
    alertColor: {
      get: function() {
        return this.$store.getters.alertColor;
      },
      set: function() {
        this.$store.commit("alertColor");
      }
    },
    alertMessage: {
      get: function() {
        return this.$store.getters.alertMessage;
      },
      set: function() {
        this.$store.commit("alertMessage");
      }
    },
    alertSeverity: {
      get: function() {
        return this.$store.getters.alertSeverity;
      },
      set: function() {
        this.$store.commit("alertSeverity");
      }
    },
    alertTimeout: {
      get: function() {
        return this.$store.getters.alertTimeout;
      },
      set: function() {
        this.$store.commit("alertTimeout");
      }
    },
    notificationLink: {
      get: function() {
        return this.$store.getters.notificationLink;
      },
      set: function() {
        this.$store.commit("notificationLink");
      }
    }
  },
  methods: {
    /**
     * @description Trigger snackbar (alert) to appear for user, with the message, color, and timeout duration provided
     * @param message {string} Message to appear on the alert
     * @param color {string} HEX code for color of alert to be
     * @param timeout {number} Number of milliseconds to display alert for
     */
    setAlert(message, color, timeout) {
      this.$store.commit("alert", true);
      this.$store.commit("alertMessage", message);
      this.$store.commit("alertColor", color);
      this.$store.commit("alertTimeout", timeout);
    },
    toggleAlert(value) {
      this.$store.commit("alert", value);
    },
    getAlertIcon() {
      return ICONS[this.alertSeverity] || ICONS["error"];
    },
    closeCordPullNotification() {
      this.$store.commit("cordPullNotification", false);
    }
  }
};

const ICONS = {
  info: "mdi-information",
  warning: "mdi-alert",
  error: "mdi-alert-circle",
  success: "mdi-check-circle"
};
