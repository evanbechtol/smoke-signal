import { ApiService } from "../services/apiService";
const baseUrl = process.env.VUE_APP_API_BASE;

export const notificationMixin = {
  methods: {
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
      return ApiService.customRequest(options);
    },
    /**
     * @description Attempts to update the read timestamp for the tool notification matching the provided Object ID
     * @param id {string} Object ID for the cord to update
     * @param data {object} Body to use after updating the tool notification to re-generate the data
     * @returns {Promise} Returns promise for request being generated
     */
	updateNotification(id, limit = 5, skip = 0, query = null) {
	  const data = { limit: limit, skip:skip, query:query };	 
      const route = `notifications/${id}`;
      const options = {
        method: "PUT",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`,
        data
      };
      return ApiService.customRequest(options);
    }
	
  }
};