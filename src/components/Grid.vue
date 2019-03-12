<template>
  <v-container fluid>
    <v-layout row align-center justify-center>
      <v-flex grow>
        <v-data-table
          class="cordTable"
          :dark="isDark"
          :headers="headers"
          :items="items"
          :custom-sort="customSort"
          :search="search"
          :loading="gridLoading"
        >
          <template slot="items" slot-scope="props">
            <tr @click="openItem(props.item)" class="row">
              <td>{{ props.item.title }}</td>
              <td>{{ props.item.puller.username }}</td>
              <td>{{ props.item.app }}</td>
              <td>{{ props.item.category }}</td>
              <td>
                {{
                  resolved
                    ? new Date(props.item.resolvedOn).toLocaleDateString(
                        "en-US"
                      )
                    : computeDuration(props.item.openedOn)
                }}
              </td>
              <td>
                <v-avatar
                  v-for="(rescuer, index) in props.item.rescuers"
                  size="30"
                  :key="index"
                  :color="COLORS[index % 3]"
                  class="white--text mx-1"
                >
                  {{ getInitials(rescuer.username) }}
                </v-avatar>
              </td>
            </tr>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { authMixin } from "../mixins/authMixin";
import PullCordDialog from "./PullCordDialog.vue";
import MenuBtn from "./MenuBtn";
import { socketMixin } from "../mixins/socketMixin";
import { TimeService } from "../services/timeService";

export default {
  name: "Grid",
  mixins: [themeMixin, cordMixin, socketMixin, authMixin],
  components: { MenuBtn, PullCordDialog },
  data: () => ({
    gridLoading: false,
    pullingCord: false,
    selectedItem: null
  }),
  props: {
    customSort: {
      type: Function
    },
    headers: {
      type: Array,
      default: function() {
        return [];
      }
    },
    items: {
      type: Array,
      default: function() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    resolved: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      required: true,
      default: ""
    }
  },
  methods: {
    computeDuration: TimeService.computeDuration,
    msToTime: TimeService.msToTime,
    getInitials(item) {
      return item && typeof item === "string"
        ? item.slice(0, 2).toLocaleUpperCase()
        : "";
    },
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
  },
  watch: {
    loading: function() {
      this.gridLoading = this.loading;
    }
  }
};
</script>

<style scoped>
.v-table__overflow {
  font-size: 10em;
  background: transparent !important;
}
.row:hover {
  background: rgba(0, 132, 240, 0.8) !important;
  color: #f2f2f2;
  cursor: pointer;
}
</style>
