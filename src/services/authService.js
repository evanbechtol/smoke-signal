import store from "../store/store";
import router from "../router";
import { ApiService } from "./apiService";
import { TimeService } from "./timeService";
import { AlertService } from "./alertService";

const base = process.env.VUE_APP_EAUTH;
const apiBase = process.env.VUE_APP_API_BASE;
const appCode = process.env.VUE_APP_EAUTH_APP_CODE;
const appUrl = process.env.VUE_APP_URL;

const AuthService = {
  /**
   * @description Authenticate the application, and store the returned JWT if provided
   */
  authenticateApp() {
    const route = "e_auth/auth/apps";
    const options = {
      method: "POST",
      headers: { Authorization: `Bearer ${appCode}` },
      url: `${base}/${route}`,
      data: { tokenLife: "999999s" }
    };

    return ApiService.customRequest(options);
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

        ApiService.customRequest(options)
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
              params.append("email", body.email);
              params.append("support_team_email", "evan.bechtol@ericsson.com");
              params.append("support_team_phone", "469-417-9422");
              params.append("url", `${appUrl}/resetPassword?id=`);

              const generateNewPwOptions = {
                url: `${base}/${generateNewPwRoute}`,
                method: "POST",
                data: params,
                headers: {
                  Authorization: `Bearer ${appCode}`,
                  "Content-Type": "application/x-www-form-urlencoded"
                }
              };

              return ApiService.customRequest(generateNewPwOptions);
            }
          })
          .then(response => {
            if (response && response.data && response.data.success === true) {
              AlertService.setAlert(
                "Request submitted. If an email is associated to that account, you will receive an email to reset your password.",
                "#288964",
                0
              );
              return resolve();
            }
          })
          .catch(err => {
            AlertService.setAlert(
              "Request unable to be submitted at this time.",
              "#DC2D37",
              0
            );
            return reject(err);
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
            tokenLife: body.tokenLife || "999999s"
          },
          url: `${base}/${route}`
        };

        ApiService.customRequest(options)
          .then(response => {
            if (response && response.data) {
              const parsedToken = window.jwt_decode(response.data.token);
              store.commit("token", response.data.token || null);
              store.commit(
                "user",
                response.data.user || parsedToken.user || null
              );
              store.commit("isAuthenticated", true);
              this.setExpiry(response.data.token, 5, true);
              return resolve(response);
            }
          })
          .catch(err => {
            return reject(err);
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
        !!body.lastName &&
        !!body.project;

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

        ApiService.customRequest(options)
          .then(response => {
            if (response && response.data && response.data.user) {
              return resolve(response);
            }
          })
          .catch(err => {
            return reject(err);
          });
      }
    });
  },
  heroLogin(user) {
    return new Promise((resolve, reject) => {
      const route = "auth";
      const options = {
        method: "POST",
        headers: { Authorization: `Bearer ${appCode}` },
        data: user,
        url: `${apiBase}/${route}`
      };

      ApiService.customRequest(options)
        .then(response => {
          const userRetrieved =
            response &&
            response.data &&
            response.data.data &&
            response.data.data.user;

          if (userRetrieved) {
            return resolve(response.data.data);
          } else {
            return reject(response.data.error);
          }
        })
        .catch(err => {
          return reject(err);
        });
    });
  },
  logout() {
    router.push({ path: "/login", name: "login" });
    store.commit("user", null);
    store.commit("token", null);
  },
  setColor(minutes) {
    return minutes <= 1
      ? "error"
      : minutes > 1 && minutes <= 5
      ? "warning"
      : minutes > 5 && minutes <= 10
      ? "info"
      : "info";
  },
  setExpiry(token, whenToWarn, isAuthenticated) {
    if (token !== null && token.length) {
      const decoded = window.jwt_decode(token);
      const expires = decoded.exp;
      const rightNow = TimeService.getUnixTime();
      const minutes = Math.floor((expires - rightNow) / 60);
      const expiryDetails = {
        warning: minutes <= whenToWarn,
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

      store.commit("expiryDetails", expiryDetails);

      if (minutes > 0 && isAuthenticated === false) {
        store.commit("isAuthenticated", true);
        store.commit("user", decoded.user || {});
      } else if (isAuthenticated) {
        if (minutes > 0 && minutes <= whenToWarn) {
          AlertService.setAlert(
            expiryDetails.message,
            expiryDetails.color,
            5000
          );
        }

        if (minutes <= 0) {
          this.logout();
        }
      } else {
        this.logout();
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
  validateApp(appToken) {
    const route = "e_auth/validate/apps";
    return new Promise(resolve => {
      ApiService.get(`${base}/${route}?token=${appToken}`)
        .then(response => {
          if (response && response.data) {
            store.commit("appToken", response.data.token || null);
            return resolve();
          }
        })
        .catch(err => {
          if (err && err.response && err.response.status === 403) {
            return this.authenticateApp();
          }
        })
        .then(response => {
          if (response && response.data && response.data.success === true) {
            store.commit("appToken", response.data.token || null);
          }
        })
        .catch(err => {
          AlertService.setAlert(
            `Error authenticating app: ${err}`,
            "#DC2D37",
            0
          );
          return err;
        });
    });
  },
  validateUser(token) {
    const route = "e_auth/validate";
    return new Promise((resolve, reject) => {
      ApiService.get(`${base}/${route}?token=${token}`)
        .then(response => {
          if (response && response.data) {
            return resolve(response);
          }
        })
        .catch(err => {
          return reject(err);
        });
    });
  }
};

export { AuthService };
