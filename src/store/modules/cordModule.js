import { TimeService } from "../../services/timeService";
import { UserService } from "../../services/userService";

export default {
  state: {
    categoryList: [],
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
    categoryList: function(state, payload) {
      state.categoryList = payload;
    },
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
      const user = JSON.parse(UserService.getUser());
      return state.gridItems.filter(function(elem) {
        return user && user.username
          ? elem.puller.username === user.username
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
