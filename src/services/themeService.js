const THEME_KEY = "eri-theme";
const IS_DARK_KEY = "eri-theme-is-dark";

/**
 * Manage how Access Theme is being stored and retrieved from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instance.
 **/
const ThemeService = {
  getTheme() {
    return localStorage.getItem(THEME_KEY);
  },

  setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
  },

  deleteTheme() {
    localStorage.removeItem(THEME_KEY);
  },
  getIsDark() {
    return localStorage.getItem(IS_DARK_KEY);
  },

  setIsDark(isDark) {
    localStorage.setItem(IS_DARK_KEY, isDark);
  },

  deleteIsDark() {
    localStorage.removeItem(IS_DARK_KEY);
  }
};

export { ThemeService };
