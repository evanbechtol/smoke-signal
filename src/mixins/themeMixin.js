export const themeMixin = {
computed: {
    isDark: {
      get: function() {
        return this.$store.getters.isDark;
      },
      set: function() {
        this.$store.commit("isDark");
      }
    },
    theme: {
      get: function() {
        return this.$store.getters.theme;
      },
      set: function() {
        this.$store.commit("theme");
      }
    },
    darken: function() {
      return this.isDark === true ? "darken-1" : "";
    }
  },
  methods: {
    toggleTheme(value) {
      const color = this.isDark ? "#181818" : "#e0e0e0";
      this.$store.commit("theme", value.toLowerCase());
      document.getElementById("html").style.backgroundColor = color;
      document.getElementById("body").style.backgroundColor = color;
    }
  }
};
