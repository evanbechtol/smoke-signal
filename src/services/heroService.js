import { ApiService } from "./apiService";

const apiBase = process.env.VUE_APP_API_BASE;
const appCode = process.env.VUE_APP_EAUTH_APP_CODE;

const HeroService = {
  /**
   * @description Retrieve the user from the application MongoDB
   * @param id {string} MongoDB Object Id for user to retrieve
   * @returns {Promise<any>}
   */
  heroGetUserById(id) {
    return new Promise((resolve, reject) => {
      const query = JSON.stringify({ "user._id": id });
      const route = `users?query=${query}`;
      const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${appCode}` },
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

  /**
   * @description Updates hero user data in MongoDB
   * @param user {object} User information to update
   * @returns {Promise<any>}
   */
  heroUpdateUser(user) {
    return new Promise((resolve, reject) => {
      const route = `users/${user._id}`;
      const options = {
        method: "PUT",
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

  /**
   * @description Updates hero user data in MongoDB
   * @param user {object} User information to update
   * @returns {Promise<any>}
   */
  heroUpdateUserTeams(user) {
    return new Promise((resolve, reject) => {
      const route = `users/${user._id}/teams`;
      const options = {
        method: "PUT",
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

  /**
   * @description Login against the Hero MongoDB. Only checks to make sure
   * that the user exists in the DB, and doesn't authenticate with password.
   * That is the responsibility of E-Auth
   * @param user {object} User information to login with
   * @returns {Promise<any>}
   */
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
  }
};

export { HeroService };
