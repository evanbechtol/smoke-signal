import { mapState, mapGetters } from "vuex";
import { TimeService } from "../services/timeService";
import { ApiService } from "../services/apiService";

const baseUrl = process.env.VUE_APP_API_BASE;

export const cordMixin = {
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
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
      return ApiService.customRequest(options);
    },
	/**
     * @description Attempts to retrieve a cord by the Object ID provided for cord details page
     * 
     */
	 openItem(item) {
      this.getCordById(item._id)
        .then(response => {
          const cord = response.data.data;
          this.$store.commit("selectedCord", cord);
          this.$router.push({ path: `/cord/${cord._id}`, props: cord });
          this.joinSelectedCordRoom(cord._id);
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
          this.loading = false;
        })
        .catch(err => {
          this.setAlert(err.message, "#DC2D37", 0);
        });
    }
	
	
	
  }
};
