<template>
  <div>
    <v-card :color="`accent ${darken}`" elevation="0" :dark="isDark" class="bg">
      <v-toolbar card height="40px" dark class="my-4 pt-2 bg" flat>
        <v-card-title primary-title class="hildaLight space-small pl-0 ml-0">
          <slot name="title"></slot>
          <v-tooltip right class="ml-3">
            <template #activator="data">
              <v-btn
                icon
                v-if="!pullingCord"
                color="error"
                class="animated slow pulse infinite"
                v-on="data.on"
                @click="pullingCord = !pullingCord"
              >
                <v-icon>flag</v-icon>
              </v-btn>
            </template>
            <span>{{ "Pull My Cord" }}</span>
          </v-tooltip>
        </v-card-title>

        <v-spacer></v-spacer>

        <v-text-field
          v-model="search"
          class="hidden-xs-only"
          style="max-width: 300px;"
          color="primary"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        >
        </v-text-field>
        <v-tooltip bottom offset-y>
          <template #activator="data">
            <v-btn class="ml-4 mt-3" @click="refreshMyGrid" icon>
              <v-icon>refresh</v-icon>
            </v-btn>
          </template>
          <span>Refresh Grid</span>
        </v-tooltip>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :loading="gridLoading"
      >
        <template slot="items" slot-scope="props">
          <tr @click="openItem(props.item)" class="row">
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.puller.username }}</td>
            <td>{{ props.item.app }}</td>
            <td>{{ props.item.category }}</td>
            <td>{{ computeDuration(props.item.openedOn) }}</td>
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
    </v-card>

    <pull-cord-dialog
      :initial-dialog="pullingCord"
      v-on:closeDialog="pullingCord = false"
      v-on:refreshCordGrid="refreshCordGrid"
    ></pull-cord-dialog>
  </div>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import PullCordDialog from "./PullCordDialog.vue";
import MenuBtn from "./MenuBtn";
import { socketMixin } from "../mixins/socketMixin";

export default {
  name: "Grid",
  mixins: [themeMixin, cordMixin, socketMixin],
  components: { MenuBtn, PullCordDialog },
  computed: {},
  data: () => ({
    gridLoading: false,
    pullingCord: false,
    selectedItem: null,
    search: ""
  }),
  props: {
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
    }
  },
  methods: {
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
        })
        .catch(err => {
          this.setAlert(err.message, "#DC2D37", 0);
        });
    },
    computeDuration(date) {
      const now = new Date();
      const openedOn = new Date(date);
      return msToTime(parseInt((now - openedOn) / 24));
    },
    refreshCordGrid() {
      this.$emit("refreshCordGrid");
    },
    refreshMyGrid() {
      this.refreshGridOne();
    }
  },
  watch: {
    loading: function() {
      this.gridLoading = this.loading;
    }
  }
};

function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
</script>

<style scoped>
.row:hover {
  background: rgba(0, 132, 240, 0.8) !important;
  color: #f2f2f2;
  cursor: pointer;
}
</style>
