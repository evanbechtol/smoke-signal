<template>
  <v-card :color="`accent ${darken}`" elevation="0">
    <v-toolbar card
               height="40px"
               :color="`accent ${darken}`"
               :dark="isDark"
               class="my-4 pt-2"
               flat>
      <v-card-title primary-title class="hildaLight space-small pl-0 ml-0">
        <slot name="title"></slot>
      </v-card-title>
      
      <v-spacer></v-spacer>
      
      <v-text-field v-model="search"
                    style="max-width: 300px;"
                    color="info"
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
        <!--<td v-for="(col) in Object.keys(props.item)" :key="col">{{ props.item[col] }}</td>-->
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.app }}</td>
        <td>{{ props.item.category }}</td>
        <td>{{ props.item.duration }}</td>
        <td>
          <div v-if="props.item.hero && props.item.hero.length > 0">{{ props.item.hero }}</div>
          <div v-else>
            <v-btn @click="toggleRegistration()" :color="`info darken-1`" name="register" class="ma-0">
              <v-icon dark class="pr-2">work_outline</v-icon>
              Rescue
            </v-btn>
          </div>
        </td>
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
  }
};
</script>

<style scoped>
</style>
