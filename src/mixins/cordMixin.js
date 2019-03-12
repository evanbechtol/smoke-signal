import axios from "axios";
import { mapState } from "vuex";
import { TimeService } from "../services/timeService";

const baseUrl = process.env.VUE_APP_API_BASE;

export const cordMixin = {
  computed: {
    ...mapState(["gridItems", "selectedCord"])
  },
  methods: {
    computeDurationBg(duration) {
      return TimeService.computeDuration(duration).includes("Days")
        ? "error"
        : TimeService.computeDuration(duration).includes("Hrs")
        ? "orangeWarning"
        : "success";
    },
    /**
     * @description Attempts to create a new cord using the body provided
     * @param data {object} Body to be used to crete a new cord
     * @returns {Promise} Returns promise for request being generated
     */
    createCord(data) {
      const route = `cords/create`;
      const options = {
        method: "POST",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`,
        data
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to delete a cord matching the provided Object ID
     * @param id {string} Object ID for the cord to delete
     * @returns {Promise} Returns promise for request being generated
     */
    deleteCord(id) {
      const route = `cords/${id}`;
      const options = {
        method: "DELETE",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
    /**
     * @description
     * @param limit {number} Optional - Controls page size (number of objects returned)
     * @param skip {number} Optional - Offset for pagination
     * @param query [string | object] Optional - Query to be used to retrieve data
     * @returns {Promise} Returns promise for request being generated
     */
    getCords(limit = 100, skip = 0, query = null) {
      const route = `cords/get?limit=${limit}&skip=${skip}&query=${
        query === null ? "" : query
      }`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to retrieve a cord by the Object ID provided
     * @param id {string} Object ID for the cord to retrieve
     * @returns {Promise} Returns promise for request being generated
     */
    getCordById(id) {
      const route = `cords/${id}`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to retrieve files for the cord matching the Object ID provided
     * @param id {string} Object ID for the cord to retrieve files for
     * @returns {Promise} Returns promise for request being generated
     */
    getFilesByCordId(id) {
      const route = `cords/files/${id}`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to upload files for the cord matching the Object ID provided
     * @param id {string} Object ID for the cord to upload files for
     * @param body {*} File data to be uploaded
     * @returns {Promise} Returns promise for request being generated
     */
    uploadFileByCordId(id, body) {
      const route = `cords/upload/${id}`;
      const options = {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.$store.getters.appToken}`,
          "Content-Type": "multipart/form-data"
        },
        url: `${baseUrl}/${route}`,
        data: body
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to retrieve all cords with the status provided
     * @param status {string} Case-sensitive Status to search for
     * @returns {Promise} Returns promise for request being generated
     */
    getCordsByStatus(status) {
      const route = `cords/status/${status}`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to retrieve all cords with the status and user provided
     * @param user {object} Object matching the user to search for
     * @param status {string} Case-sensitive Status to search for
     * @returns {Promise} Returns promise for request being generated
     */
    getCordsByUser(user, status = "Open") {
      const route = `cords/user/${user}?status=${status}`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to retrieve statistics for user provided
     * @param user {object} Object matching the user to search for
     * @returns {Promise} Returns promise for request being generated
     */
    getUserStats(user) {
      const route = `cords/stats/${user}`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to update the cord matching the provided Object ID
     * @param id {string} Object ID for the cord to update
     * @param data {object} Body to use when updating the cord
     * @returns {Promise} Returns promise for request being generated
     */
    updateCord(id, data) {
      const route = `cords/${id}`;
      const options = {
        method: "PUT",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`,
        data
      };
      return makeRequest(options);
    },
    /**
     * @description Attempts to update the cord rescuers for the cord matching the provided Object ID
     * @param id {string} Object ID for the cord to update
     * @param data {object} Body to use when updating the cord
     * @returns {Promise} Returns promise for request being generated
     */
    updateRescuers(id, data) {
      const route = `cords/rescuers/${id}`;
      const options = {
        method: "PUT",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`,
        data
      };
      return makeRequest(options);
    }
  }
};

/**
 * @description
 * @param options {object}
 * @returns {Promise} Returns a promise for the axios request being made.
 *   Will resolve if request was made successfully, will reject otherwise
 */
function makeRequest(options = null) {
  const bodyMethods = ["POST", "PUT"];
  const isBodyRequired = bodyMethods.includes(options.method);
  const isValid = options && options.method && options.url;

  return new Promise((resolve, reject) => {
    if (isValid) {
      if (isBodyRequired && !options.data) {
        return reject(
          // Request invalid; options object not valid to perform request
          respondError("Request not made: required body property not provided")
        );
      } else {
        axios(options)
          .then(response => {
            return resolve(response);
          })
          .catch(err => {
            return reject(err);
          });
      }
    } else {
      // Request invalid; options object not valid to perform request
      return reject(respondError("Request not made: options object invalid"));
    }
  });
}

function respondError(message) {
  return { success: false, error: message };
}
