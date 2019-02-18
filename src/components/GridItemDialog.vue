<template>
  <v-dialog v-model="initialDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <slot name="header" class="headline"></slot>
      </v-card-title>
      
      <v-card-text>
        <v-container grid-list-md>
          <v-layout wrap>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Dessert name"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Calories"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Fat (g)"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Carbs (g)"></v-text-field>
            </v-flex>
            <v-flex xs12 sm6 md4>
              <v-text-field label="Protein (g)"></v-text-field>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="cancel">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";

export default {
  name: "GridItemDialog",
  mixins: [themeMixin],
  components: {},
  computed: {},
  data: function() {
    return {
      dialog: this.editDialog
    };
  },
  methods: {
    cancel() {
      this.$emit("cancelItemEdit");
    },
    save() {
      //Todo: save the stuff
      Object.assign(this.desserts[this.editedIndex], this.editedItem);
    }
  },
  props: ["initialDialog"],
  watch: {
    editDialog: function() {
      this.dialog = this.initialDialog;
    }
  }
};
</script>

<style scoped>
</style>
