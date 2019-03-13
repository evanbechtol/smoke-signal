import { mapState } from "vuex";

export const alertMixin = {
  computed: {
    alert: {
      get() {
        return this.$store.state.alertModule.alert;
      },
      set(value) {
        this.$store.commit("alertModule/alert", value);
      }
    },
    ...mapState([
      "cordPullNotification",
      "cordPullMessage",
      "notificationLink"
    ]),
    ...mapState({
      alertColor: state => state.alertModule.alertColor,
      alertMessage: state => state.alertModule.alertMessage,
      alertSeverity: state => state.alertModule.alertSeverity,
      alertTimeout: state => state.alertModule.alertTimeout
    })
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
