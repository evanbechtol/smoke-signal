import { ThemeService } from "../../services/themeService";

export default {
  state: {
    isDark: false,
    theme: "light"
  },
  mutations: {
    isDark: function(state, payload) {
      ThemeService.setIsDark(payload);
      state.isDark = payload;
    },
    theme: function(state, payload) {
      state.theme = payload;
      state.isDark = state.theme === "dark";
      ThemeService.setTheme(payload);
      ThemeService.setIsDark(state.isDark);
    }
  },
  actions: {},
  getters: {
    darken: (state, getters) => {
      return state.isDark === true ? "darken-1" : "";
    }
  }
};
