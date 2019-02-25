import "../jwt-decode";
import axios from "axios";

const base = "http://129.192.179.179";
const appCode = "7MLijGzp-2XS0pmevA";

export const authMixin = {
  data: () => ({
    defaultMessage: {
      type: String,
      value: ""
    },
    expiryDetails: {
      type: Object,
      value: {}
    },
    intervalMessages: {
      type: Array,
      value: []
    }
  }),
  computed: {
    appToken: {
      get: function() {
        return this.$store.getters.appToken;
      },
      set: function() {
        this.$store.commit("appToken");
      }
    },
    isAuthenticated: {
      get: function() {
        return this.$store.getters.isAuthenticated;
      },
      set: function() {
        this.$store.commit("isAuthenticated");
      }
    },
    isExpiryIntervalSet: {
      get: function() {
        return this.$store.getters.isExpiryIntervalSet;
      },
      set: function() {
        this.$store.commit("isExpiryIntervalSet");
      }
    },
    user: {
      get: function() {
        return this.$store.getters.user;
      },
      set: function() {
        this.$store.commit("user");
      }
    },
    token: {
      get: function() {
        return this.$store.getters.token;
      },
      set: function() {
        this.$store.commit("token");
      }
    }
  },
  mounted() {
    // This is not needed for firebase authentication
    /*const _this = this;
    this.setExpiry();
    if (!this.isExpiryIntervalSet) {
      setInterval(function() {
        _this.setExpiry();
      }, _this.frequency * 1000);
      this.$store.commit("isExpiryIntervalSet", true);
    }*/
  },
  methods: {
    /**
     * @description Authenticate the application, and store the returned JWT if provided
     */
    authenticateApp() {
      const route = "e_auth/auth/apps";
      const options = {
        method: "POST",
        headers: { Authorization: `Bearer ${appCode}` },
        url: `${base}/${route}`
      };

      axios(options)
        .then(response => {
          if (response && response.data && response.data.success === true) {
            this.$store.commit("appToken", response.data.token || null);
          }
        })
        .catch(err => {
          //Todo: Need to figure out a better way to handle this
          return err;
        });
    },
    /**
     * @description Attempts to validate the app token
     */
    validateApp() {
      const route = "e_auth/validate/apps";

      return new Promise((resolve, reject) => {
        axios
          .get(`${base}/${route}?token=${this.appToken}`)
          .then(response => {
            if (response && response.data) {
              this.$store.commit("appToken", response.data.token || null);
              resolve();
            }
          })
          .catch(err => {
            //Todo: Need to figure out a better way to handle this

            if (err && err.response && err.response.status === 403) {
              this.authenticateApp();
            }
          });
      });
    },
    eAuthForgotPassword(body = null) {
      return new Promise((resolve, reject) => {
        if (body && body.email) {
          const route = `e_auth/users/email/${body.email}`;
          const options = {
            method: "GET",
            headers: { Authorization: `Bearer ${appCode}` },
            url: `${base}/${route}`
          };

          let userId;

          axios(options)
            .then(response => {
              if (
                response.data &&
                response.data.success === true &&
                response.data.data
              ) {
                userId = response.data.data._id;
                const generateNewPwRoute = "e_auth/users/resetPassword";
                let params = new URLSearchParams();

                params.append("user_id", userId);
                params.append("email", this.email);
                params.append(
                  "support_team_email",
                  "evan.bechtol@ericsson.com"
                );
                params.append("support_team_phone", "469-417-9422");
                params.append(
                  "url",
                  `http://138.85.180.144:8080/resetPassword?id=`
                );

                const generateNewPwOptions = {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${appCode}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                  }
                };

                return axios.post(
                  `${base}/${generateNewPwRoute}`,
                  params,
                  generateNewPwOptions
                );
              }
            })
            .then(response => {
              if (response && response.data && response.data.success === true) {
                this.setAlert(
                  "Request submitted. If an email is associated to that account, you will receive an email to reset your password.",
                  "#288964",
                  0
                );
                resolve();
              }
            })
            .catch(err => {
              this.setAlert(
                "Request unable to be submitted at this time.",
                "#DC2D37",
                0
              );
              reject(err);
            });
        }
      });
    },
    eAuthLogin(body = null) {
      return new Promise((resolve, reject) => {
        if (body && body.username && body.password) {
          const route = "e_auth/auth";
          const options = {
            method: "POST",
            headers: { Authorization: `Bearer ${appCode}` },
            data: {
              username: body.username,
              password: body.password,
              tokenLife: body.tokenLife || 900
            },
            url: `${base}/${route}`
          };

          axios(options)
            .then(response => {
              if (response && response.data) {
                this.$store.commit("token", response.data.token || null);
                this.$store.commit("user", response.data.user || null);
                this.$store.commit("isAuthenticated", true);
                this.setExpiry();
                resolve();
              }
            })
            .catch(err => {
              reject(err);
            });
        }
      });
    },
    eAuthRegister(body = null) {
      return new Promise((resolve, reject) => {
        const isValid =
          body &&
          !!body.username &&
          !!body.email &&
          !!body.firstName &&
          !!body.lastName;
        if (isValid) {
          const route = "e_auth/users";
          const options = {
            method: "POST",
            headers: { Authorization: `Bearer ${appCode}` },
            data: {
              username: body.username,
              password: body.password,
              email: body.email,
              firstname: body.firstName,
              lastname: body.lastName
            },
            url: `${base}/${route}`
          };

          axios(options)
            .then(response => {
              if (response && response.data && response.data.user) {
                this.$store.commit("user", response.data.user);
                this.$store.commit("isAuthenticated", true);
                this.setAlert(
                  `Thanks for registering, ${
                    response.data.user.firstname
                  }! You will receive an email to validate your address.`,
                  "#288964",
                  0
                );
                resolve();
              }
            })
            .catch(err => {
              this.setAlert(
                `Error registering user: status code ${err.response.message}`,
                "#DC2D37",
                0
              );
              return err;
            });
        }
      });
    },
    login(body) {
      return new Promise((resolve, reject) => {
        if (!(body && body.email && body.password)) {
          reject("Request body not provided during login");
        }
      });
    },
    logout() {},
    register(body) {
      return new Promise((resolve, reject) => {
        if (!(body && body.email && body.password)) {
          reject("Request body not provided during login");
        }
      });
    },
    setColor(minutes) {
      return minutes <= 1
        ? `error ${this.darken}`
        : minutes > 1 && minutes <= 5
        ? `warning ${this.darken}`
        : minutes > 5 && minutes <= 10
        ? `info ${this.isDark ? "darken-2" : "lighten-2"}`
        : `info ${this.darken}`;
    },
    setExpiry() {
      if (this.token !== null && this.token.length > 1) {
        const decoded = window.jwt_decode(this.token);
        const expires = decoded.exp;
        const rightNow = this.getUnixTime();
        const minutes = Math.floor((expires - rightNow) / 60);
        this.expiryDetails = {
          warning: minutes <= this.whenToWarn,
          expired: expires < rightNow,
          minutes: minutes,
          color: this.setColor(minutes),
          exp:
            minutes === 1
              ? `${minutes} minute remaining in session`
              : `${minutes} minutes remaining in session`,
          message:
            minutes === 1
              ? `You will be logged out in ${minutes} minute, due to inactivity`
              : `You will be logged out in ${minutes} minutes, due to inactivity`
        };

        if (minutes > 0 && this.isAuthenticated === false) {
          this.$store.commit("isAuthenticated", true);
          this.$store.commit("user", decoded.user || {});
        } else if (this.isAuthenticated) {
          if (minutes > 0 && minutes <= 10) {
            this.$store.commit("alert", true);
            this.$store.commit("alertColor", this.expiryDetails.color);
            this.$store.commit("alertMessage", this.expiryDetails.message);
            this.$store.commit("alertSeverity", this.setSeverity(minutes));
          }

          if (minutes <= 0) {
            this.$store.commit("isAuthenticated", false);
            this.$store.commit("user", null);
            this.$store.commit("token", null);
          }
        }
      }
    },
    setSeverity(minutes) {
      return minutes <= 1
        ? "error"
        : minutes > 1 && minutes <= 5
        ? "warning"
        : "info";
    },
    getUnixTime() {
      return (new Date().getTime() / 1000) | 0;
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
