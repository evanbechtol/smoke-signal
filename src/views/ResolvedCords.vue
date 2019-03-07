<template>
  <div style="height: 100vh;" class="home page mt-5">
    <v-container :class="isSmall ? 'pa-0 ma-0' : ''">
      <v-layout row wrap justify-center align-center fill-height>
        <v-flex xs12 v-if="!isSmall">
          <grid
            resolved
            :headers="headers"
            :items="filteredGridItems"
            :loading="loading"
            v-on:refreshCordGrid="getCordGridItems"
          >
            <template v-slot:title>
              <v-select
                dense
                solo-inverted
                flat
                class="mt-3"
                v-model="selectItemType"
                :items="selectItems"
                item-text="label"
                item-value="value"
              ></v-select>
            </template>
          </grid>
        </v-flex>

        <v-flex
          v-else
          xs12
          v-for="(item, index) in filteredGridItems"
          :key="index"
        >
          <v-card tile class="my-3">
            <v-card-title
              class="hildaLight space-small mx-0 mt-0 bg white--text"
            >
              {{ item.title }}
            </v-card-title>
            <v-card-text>
              <v-layout row wrap fill-height>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Application"
                    :value="item.app"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Category"
                    :value="item.category"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    readonly
                    label="Opened On"
                    :value="new Date(item.openedOn).toLocaleDateString('en-US')"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    readonly
                    v-model="item.description"
                    label="Description"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn block color="primary" :to="`/cord/${item._id}`">
                View Details
                <v-icon class="ml-2">navigate_next</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import MenuBtn from "../components/MenuBtn";
import JwtExpiry from "../components/JWTExpiry";
import Grid from "../components/Grid";
import { socketMixin } from "../mixins/socketMixin";
import { authMixin } from "../mixins/authMixin";
import CircleCard from "../components/CircleCard";

export default {
  name: "resolvedCords",
  mixins: [themeMixin, cordMixin, alertMixin, socketMixin, authMixin],
  components: {
    CircleCard,
    JwtExpiry,
    MenuBtn,
    Grid
  },
  computed: {
    filteredGridItems: function() {
      return this.gridItemType === "all" ? this.gridItems : this.myCords;
    },
    gridItems: {
      get: function() {
        return this.$store.getters.gridItems;
      },
      set: function(payload) {
        this.$store.commit("gridItems", payload);
      }
    }
  },
  data: () => ({
    myCords: [],
    gridItemType: "all",
    selectItemType: "all",
    selectItems: [
      { label: "All Resolved Cords", value: "all" },
      { label: "My Resolved Cords", value: "myCords" }
    ],
    loading: false,
    headers: [
      { text: "Title", align: "left", value: "title" },
      { text: "Name", align: "left", value: "name" },
      { text: "App", align: "left", value: "app" },
      { text: "Category", align: "left", value: "category" },
      { text: "Opened On", align: "left", value: "openedOn" },
      { text: "Resolved On", align: "left", value: "resolvedOn" },
      { text: "Hero", align: "left", value: "hero" }
    ]
  }),
  created() {
    if (!this.appToken) {
      this.authenticateApp();
    }
    this.getCordGridItems();
  },
  mounted() {
    if (this.selectedCord) {
      this.leaveSelectedCordRoom(this.selectedCord._id);
    }
  },
  methods: {
    getCordGridItems() {
      this.loading = true;
      this.getCordsByStatus("Resolved")
        .then(response => {
          this.gridItems = response.data.data;
          this.loading = false;
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
    updateGridItems(itemType) {
      this.gridItemType = this.gridItemType === itemType ? "all" : itemType;
    }
  },
  watch: {
    selectItemType: function(value) {
      this.gridItemType = value;
    },
    gridItems: function() {
      const _this = this;

      this.myCords = this.gridItems.filter(function(elem) {
        return elem.puller.username === _this.user.username;
      });
    }
  }
};
</script>

<style scoped>
.dashCard {
  height: 320px;
}
</style>
