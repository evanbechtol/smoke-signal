<template>
  <div>
    <v-card :color="`accent ${darken}`" elevation="0" :dark="isDark" class="bg">
      <v-toolbar card
                 height="40px"
                 dark
                 class="my-4 pt-2 bg"
                 flat>
        <v-card-title primary-title class="hildaLight space-small pl-0 ml-0">
          <slot name="title"></slot>
          <v-tooltip right class="ml-3">
            <template #activator="data">
              <v-btn icon
                     :color="pullingCord === true ? 'success' : 'error'"
                     class="animated slow pulse infinite"
                     v-on="data.on"
                     @click="pullingCord = !pullingCord">
                <v-icon>{{ pullingCord === true ? "clear" : "flag" }}</v-icon>
              </v-btn>
            </template>
            <span>{{ "Pull My Cord" }}</span>
          </v-tooltip>
        </v-card-title>
      
        <v-spacer></v-spacer>
      
        <v-text-field v-model="search"
                      style="max-width: 300px;"
                      color="primary"
                      append-icon="search"
                      label="Search"
                      single-line
                      hide-details>
        </v-text-field>
      
        <v-tooltip bottom>
          <template #activator="data">
            <v-btn icon class="ml-4 mt-3" v-on="data.on">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>
          <span>Options</span>
        </v-tooltip>
    
      </v-toolbar>
      <v-data-table
              :headers="headers"
              :items="items"
              :search="search">
        <template slot="items" slot-scope="props">
          <tr @click="openEditDialog(props.item)" class="row">
            <td>{{ props.item.title }}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.app }}</td>
            <td>{{ props.item.category }}</td>
            <td>{{ computeDuration(props.item.openedOn) }}</td>
            <td>{{ props.item.hero || "" }}</td>
          </tr>
        </template>
        <v-alert slot="no-results" :value="true" color="error" icon="warning">
          Your search for "{{ search }}" found no results.
        </v-alert>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";

export default {
  name: "Grid",
  mixins: [themeMixin, cordMixin],
  computed: {},
  data: () => ({
    pullingCord: false,
    editDialog: false,
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
    }
  },
  methods: {
    openEditDialog(item) {
      /*this.selectedItem = Object.assign({}, item);
      this.editDialog = true;*/
      this.$store.commit("selectedCord", item);
      this.$router.push({ path: `/cord/${item.id}`, props: item });
    },
    closeEditDialog() {
      this.selectedItem = null;
      this.editDialog = false;
    },
    computeDuration(date) {
      const now = new Date();
      const openedOn = new Date(date);
      return msToTime(parseInt((now - openedOn) / 24));
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
