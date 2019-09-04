export const gridMixin = {
  data: () => ({
    loading: false
  }),
  computed: {
    chipBg: function() {
      return this.isDark ? "#393939" : "#dddddd";
    }
  },
  methods: {
    getCordGridItems(status = "Open") {
      this.loading = true;
      this.getCordsByStatus(status)
        .then(response => {
          this.$store.commit("gridItems", response.data.data);
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
          this.loading = false;
        })
        .catch(err => {
          this.setAlert(
            err.error ||
              err.message ||
              err.response.data.error ||
              "Unknown error occurred",
            "#DC2D37",
            0
          );
          this.loading = false;
        });
    },
    gridCustomSort(items, index, isDesc) {
      items.sort((a, b) => {
        switch (index) {
          case "title":
          case "app":
          case "category":
            if (!isDesc) {
              return this.$compareString(a[index], b[index]);
            } else {
              return this.$compareString(b[index], a[index]);
            }
          case "duration":
            if (!isDesc) {
              return this.$compareString(a.openedOn, b.openedOn);
            } else {
              return this.$compareString(b.openedOn, a.openedOn);
            }
          case "hero":
            if (!isDesc) {
              return this.$compareString(a.rescuers.length, b.rescuers.length);
            } else {
              return this.$compareString(b.rescuers.length, a.rescuers.length);
            }
          case "name":
            if (!isDesc) {
              return this.$compareString(a.puller.username, b.puller.username);
            } else {
              return this.$compareString(b.puller.username, a.puller.username);
            }
        }
      });
      return items;
    },
    gridResolvedCustomSort(items, index, isDesc) {
      items.sort((a, b) => {
        switch (index) {
          case "title":
          case "app":
          case "category":
            if (!isDesc) {
              return this.$compareString(
                a[index].toLowerCase(),
                b[index].toLowerCase()
              );
            } else {
              return this.$compareString(
                b[index].toLowerCase(),
                a[index].toLowerCase()
              );
            }
          case "resolvedOn":
            if (!isDesc) {
              return this.$compareString(a.resolvedOn, b.resolvedOn);
            } else {
              return this.$compareString(b.resolvedOn, a.resolvedOn);
            }
          case "hero":
            if (!isDesc) {
              return this.$compareString(a.rescuers.length, b.rescuers.length);
            } else {
              return this.$compareString(b.rescuers.length, a.rescuers.length);
            }
          case "name":
            if (!isDesc) {
              return this.$compareString(a.puller.username, b.puller.username);
            } else {
              return this.$compareString(b.puller.username, a.puller.username);
            }
        }
      });
      return items;
    },
    selectedChip: function(value) {
      return this.selectItemType === value;
    },
    setSelectedItemType(value) {
      this.selectItemType = this.selectItemType === value ? "all" : value;
    },
    updateGridItems(itemType) {
      this.gridItemType = this.gridItemType === itemType ? "all" : itemType;
    }
  },
  watch: {
    selectItemType: function(value) {
      this.gridItemType = value;
    }
  }
};
