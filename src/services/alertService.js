import store from "../store/store";

const ICONS = {
  info: "mdi-information",
  warning: "mdi-alert",
  error: "mdi-alert-circle",
  success: "mdi-check-circle"
};

const AlertService = {
  /**
   * @description Trigger snackbar (alert) to appear for user, with the message, color, and timeout duration provided
   * @param message {string} Message to appear on the alert
   * @param color {string} HEX code for color of alert to be
   * @param timeout {number} Number of milliseconds to display alert for
   */
  setAlert(message, color, timeout) {
    store.commit("alert", true);
    store.commit("alertMessage", message);
    store.commit("alertColor", color);
    store.commit("alertTimeout", timeout);
  },
  toggleAlert(value) {
    store.commit("alert", value);
  },
  getAlertIcon(severity) {
    return ICONS[severity] || ICONS["error"];
  }
};

export { AlertService };
