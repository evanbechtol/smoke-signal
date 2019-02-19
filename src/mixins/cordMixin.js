export const cordMixin = {
  computed: {
    selectedCord: {
      get: function() {
        return this.$store.getters.selectedCord;
      },
      set: function(payload) {
        this.$store.commit("selectedCord", payload);
      }
    }
  }
};
