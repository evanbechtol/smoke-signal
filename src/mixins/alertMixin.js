import { mapState } from "vuex";
import { AlertService } from "../services/alertService";

export const alertMixin = {
  computed: {
    alert: {
      get() {
        return this.$store.state.alertModule.alert;
      },
      set(value) {
        this.$store.commit("alert", value);
      }
    },
    ...mapState({
      alertColor: state => state.alertModule.alertColor,
      alertMessage: state => state.alertModule.alertMessage,
      alertSeverity: state => state.alertModule.alertSeverity,
      alertTimeout: state => state.alertModule.alertTimeout
    })
  },
  methods: {
    setAlert(message, color, timeout) {
      AlertService.setAlert(message, color, timeout);
    },
    toggleAlert(value) {
      AlertService.toggleAlert(value);
    },
    getAlertIcon() {
      AlertService.getAlertIcon(this.alertSeverity);
    }
  }
};
