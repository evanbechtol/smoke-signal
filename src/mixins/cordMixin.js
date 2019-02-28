import axios from "axios";

const baseUrl = "http://localhost:3000";

export const cordMixin = {
  computed: {
    selectedCord: {
      get: function() {
        return this.$store.getters.selectedCord;
      },
      set: function(payload) {
        this.$store.commit("selectedCord", payload);
      }
    }
  },
  methods: {
    computeDuration(date) {
      const now = new Date();
      const openedOn = new Date(date);
      return msToTime(parseInt(now - openedOn));
    },
    computeDurationBg(duration) {
      return this.computeDuration(duration).includes("Days")
        ? "error"
        : this.computeDuration(duration).includes("Hrs")
        ? "orangeWarning"
        : "success";
    },
    /**
     * @description Attempts to create a new cord using the body provided
     * @param data {object} Body to be used to crete a new cord
     * @returns {Promise} Returns promise for request being generated
     */
    createCord(data) {
      const route = `cords`;
      const options = {
        method: "POST",
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
      const route = `cords/status/Open?limit=${limit}&skip=${skip}&query=${
        query === null ? "" : query
      }`;
      const options = {
        method: "GET",
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
        url: `${baseUrl}/${route}`
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

function msToTime(duration) {
  const seconds = (duration / 1000).toFixed(1);
  const minutes = (duration / (1000 * 60)).toFixed(1);
  const hours = (duration / (1000 * 60 * 60)).toFixed(1);
  const days = (duration / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return seconds + " Sec";
  } else if (minutes < 60) {
    return minutes + " Min";
  } else if (hours < 24) {
    return hours + " Hrs";
  } else {
    return days + " Days";
  }
  //return `${days > 0 ? days + " Days " : ""} ${hours} Hours ${minutes} Minutes`;
}
