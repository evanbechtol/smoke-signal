import axios from "axios";
import { TokenService } from "../services/tokenService";

const appCode = process.env.VUE_APP_EAUTH_APP_CODE;
const serviceUrl = process.env.VUE_APP_API_BASE;
const ApiService = {
  init(baseURL) {
    axios.defaults.baseURL = baseURL;
  },

  setHeader() {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${TokenService.getToken()}`;
  },

  removeHeader() {
    axios.defaults.headers.common = {};
  },

  get(resource) {
    return axios.get(resource);
  },

  post(resource, data) {
    return axios.post(resource, data);
  },

  put(resource, data) {
    return axios.put(resource, data);
  },

  delete(resource) {
    return axios.delete(resource);
  },
  /**
   * @description Perform a custom Axios request.
   * @param data {object} Object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   * @returns {AxiosPromise}
   */
  customRequest(data) {
    return axios(data);
  },
  userAppsRegister(body = null, response = null) {
    return new Promise((resolve, reject) => {
      const isValid = body && !!body.project;
      if (isValid) {
        const routeApp = "userApps/createUserApps";
        const options = {
          method: "POST",
          headers: { Authorization: `Bearer ${appCode}` },
          data: {
            user: { _id: response.data.user._id, username: response.data.user.username },
            apps: body.project
          },
          url: `${serviceUrl}/${routeApp}`
        };
        ApiService.customRequest(options)
          .then(response => {
            if (response) {
              return resolve(response);
            }
          })
          .catch(err => {
            return reject(err);
          });
      }
    });
  }
};

export { ApiService };
