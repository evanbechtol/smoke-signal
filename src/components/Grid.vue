<template>
  <v-card :color="`accent ${darken}`">
    <v-toolbar card
               height="40px"
               :color="`accent ${darken}`"
               dark
               extended
               flat>
      <v-spacer></v-spacer>
      
      <v-text-field v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details>
      </v-text-field>
      
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table
            :headers="headers"
            :items="items"
            :search="search">
      <template slot="items" slot-scope="props">
        <td v-for="(col) in Object.keys(props.item)" :key="col">{{ props.item[col] }}</td>
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
</v-card>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";

export default {
  name: "Grid",
  mixins: [themeMixin],
  components: {},
  computed: {},
  data: () => ({
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
  beforeCreate() {},
  created() {},
  beforeDestroy() {},
  destroyed() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  methods: {},
  watch: {}
};
</script>

<style scoped>
</style>
