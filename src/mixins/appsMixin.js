import { ApiService } from "../services/apiService";
const baseUrl = process.env.VUE_APP_API_BASE;

export const appsMixin = {
  methods: {
    /**
     * @description
     * @param query [string | object] Optional - Query to be used to retrieve data
     * @returns {Promise} Returns promise for request being generated
     */
    getApps(query = null) {
      const route = `apps/?${query === null ? "" : "query=" + query}`;
      const options = {
        method: "GET",
        headers: { authorization: `Bearer ${this.$store.getters.appToken}` },
        url: `${baseUrl}/${route}`
      };
      return ApiService.customRequest(options);
    }
  }
};
