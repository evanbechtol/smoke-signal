import { mapState, mapGetters } from "vuex";

export const themeMixin = {
  data: function() {
    return {
      COLORS: ["info", "purple", "success", "error"]
    };
  },
  computed: {
    ...mapState({
      theme: state => state.themeModule.theme,
      isDark: state => state.themeModule.isDark
    }),
    ...mapGetters(["darken"]),
    isSmall: function() {
      return this.$vuetify.breakpoint.name === "xs";
    }
  },
  methods: {
    genColor() {
      return this.COLORS[Math.floor(Math.random() * 4)];
    },
    toggleTheme(value) {
      const color = this.isDark ? "#181818" : "#e0e0e0";
      this.$store.commit("theme", value.toLowerCase());
      document.getElementById("html").style.backgroundColor = color;
      document.getElementById("body").style.backgroundColor = color;
    }
  }
};
