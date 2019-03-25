import axios from "axios";
import { mapState, mapGetters } from "vuex";
import { TimeService } from "../services/timeService";

const baseUrl = process.env.VUE_APP_API_BASE;

export const notificationMixin = {
  computed: {
    ...mapState({
      cordPullMessage: state => state.cordModule.cordPullMessage,
      cordPullNotification: state => state.cordModule.cordPullNotification,
      gridItems: state => state.cordModule.gridItems,
      notificationLink: state => state.cordModule.notificationLink,
      selectedCord: state => state.cordModule.selectedCord
    }),
    ...mapGetters([
      "criticalCords",
      "gridItems",
      "moderateCords",
      "myCords",
      "newCords"
    ])
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
     * @description
     * @param limit {number} Optional - Controls page size (number of objects returned)
     * @param skip {number} Optional - Offset for pagination
     * @param query [string | object] Optional - Query to be used to retrieve data
     * @returns {Promise} Returns promise for request being generated
     */
    getNotifications(limit = 5, skip = 0, query = null) {
      const route = `notifications/get/list?limit=${limit}&skip=${skip}&query=${
        query === null ? "" : query
      }`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return makeRequest(options);
    },
	updateNotification(id, limit = 5, skip = 0, query = null) {
	  const data = { limit: limit, skip:skip, query:query };	 
      const route = `notifications/${id}`;
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
