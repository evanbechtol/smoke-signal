import { AuthService } from "../services/authService";
import { mapState } from "vuex";

export const authMixin = {
  data: () => ({
    defaultMessage: {
      type: String,
      value: ""
    },

    tokenLife: {
      type: String
    },

    intervalMessages: {
      type: Array,
      value: []
    }
  }),

  computed: {
    ...mapState({
      appToken: state => state.authModule.appToken,
      expiryDetails: state => state.authModule.expiryDetails,
      isAuthenticated: state => state.authModule.isAuthenticated,
      isExpiryIntervalSet: state => state.authModule.isExpiryIntervalSet,
      user: state => state.authModule.user,
      token: state => state.authModule.token
    })
  },

  methods: {
    /**
     * @description Authenticate the application, and store the returned JWT if provided
     */
    authenticateApp() {
      return AuthService.authenticateApp();
    },

    eAuthForgotPassword(body = null) {
      return AuthService.eAuthForgotPassword(body);
    },

    eAuthLogin(body = null) {
      return AuthService.eAuthLogin(body);
    },

    eAuthRegister(body = null) {
      return AuthService.eAuthRegister(body);
    },

    eAuthUpdateUserData(body = null) {
      return AuthService.eAuthUpdateUserData(body);
    },

    getUnixTime() {
      return (new Date().getTime() / 1000) | 0;
    },

    logout() {
      AuthService.logout();
    },
    setExpiry(
      token = this.token,
      whenToWarn = this.whenToWarn,
      isAuthenticated = this.isAuthenticated
    ) {
      AuthService.setExpiry(token, whenToWarn, isAuthenticated);
    },

    setSeverity(minutes) {
      return AuthService.setSeverity(minutes);
    },

    validateApp(appToken = this.appToken) {
      return AuthService.validateApp(appToken);
    },
    validateUser(token = this.token) {
      return AuthService.validateUser(token);
    }
  },

  props: {
    frequency: {
      type: Number,
      default: 10
    },

    whenToWarn: {
      type: Number,
      default: 5
    }
  }
};
