import { TimeService } from "../../services/timeService";

export default {
  state: {
    cordPullMessage: {
      data: {
        _id: "",
        app: "",
        category: "",
        description: "",
        puller: { _id: "", username: "" },
        title: ""
      },
      message: "A cord has just been pulled!"
    },
    cordPullNotification: false,
    gridItems: [],
    notificationLink: "",
    selectedCord: null
  },
  mutations: {
    cordPullNotification: function(state, payload) {
      state.cordPullNotification = payload;
    },
    cordPullMessage: function(state, payload) {
      state.cordPullMessage = payload;
    },
    gridItems: function(state, payload) {
      state.gridItems = payload;
    },
    notificationLink: function(state, payload) {
      state.notificationLink = payload;
    },
    selectedCord: function(state, payload) {
      state.selectedCord = payload;
    }
  },
  actions: {},
  getters: {
    // eslint-disable-next-line
    gridItems: (state, getters) => {
      return state.gridItems;
    },
    // eslint-disable-next-line
    criticalCords: (state, getters) => {
      return state.gridItems.filter(function(elem) {
        return TimeService.computeDuration(elem.openedOn).includes("Days");
      });
    },
    // eslint-disable-next-line
    moderateCords: (state, getters) => {
      return state.gridItems.filter(function(elem) {
        return (
          !TimeService.computeDuration(elem.openedOn).includes("Days") &&
          TimeService.computeDuration(elem.openedOn).includes("Hrs")
        );
      });
    },
    // eslint-disable-next-line
    myCords: (state, getters) => {
      return state.gridItems.filter(function(elem) {
        return state.user && state.username
          ? elem.puller.username === state.user.username
          : false;
      });
    },
    newCords: state => {
      return state.gridItems.filter(function(elem) {
        return (
          !TimeService.computeDuration(elem.openedOn).includes("Days") &&
          !TimeService.computeDuration(elem.openedOn).includes("Hrs")
        );
      });
    }
  }
};
