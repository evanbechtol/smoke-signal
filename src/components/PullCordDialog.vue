<template>
  <v-dialog v-model="dialog" persistent :fullscreen="$vuetify.breakpoint.name === 'xs'" >
    <v-card :dark="isDark" :color="`accent ${darken}`">
      <v-card-title primary-title class="bg hildaLight space-small dark-l0 ma-0">
        Pull My Cord
        <v-spacer></v-spacer>
        <v-btn color="primary"
               flat
               dark
               @click="cancel">
          <v-icon color="#f2f2f2">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-container grid-list-md fluid>
          <v-layout wrap row>
            <v-flex xs12 sm6 d-flex>
              <v-layout column justify-center>
                <v-flex xs12 sm4>
                  <v-text-field box
                                label="Title"
                                type="text"
                                v-model="cord.title"
                                color="info"
                                hint="What is the problem?"
                                required></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field box
                                label="Application"
                                type="text"
                                v-model="cord.app"
                                color="info"
                                hint="What application is this related to?"
                                required></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field box
                                label="Duration"
                                type="text"
                                readonly :value="cord.openedOn"
                                color="info"
                                hint="This is auto-populated"
                                required></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field box
                                label="Category"
                                type="text"
                                v-model="cord.category"
                                color="info"
                                hint="Ex) Bug Fix, Troubleshooting, Deployment, Admin, etc."
                                required></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            
            <v-flex xs12 sm6 align-self-center grow>
              <v-layout fill-height column align-center justify-center>
                <v-flex grow>
                  <div>
                    <v-img height="240" v-if="cord.img"></v-img>
                    <v-img v-else height="240">
                      <v-icon size="240">image</v-icon>
                    </v-img>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
            
            <v-flex xs12>
              <v-textarea color="info"
                          box
                          label="Issue Description"
                          v-model="cord.description"
                          hint="Provide a brief description of the issue, use details!"
                          counter
                          required>
              </v-textarea>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer v-if="$vuetify.breakpoint.name !== 'xs'"></v-spacer>
        <v-btn color="error darken-1" depressed @click="cancel" :block="$vuetify.breakpoint.name === 'xs'">
          <v-icon class="mr-2">close</v-icon>Cancel
        </v-btn>
        <v-btn color="success darken-1" :disabled="!valid"  depressed @click="save" :block="$vuetify.breakpoint.name === 'xs'">
          <v-icon class="mr-2">check</v-icon>Pull It!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { assetMixin } from "../mixins/assetMixin.js";

export default {
  name: "PullCordDialog",
  mixins: [themeMixin, assetMixin],
  components: {},
  computed: {},
  data: function() {
    return {
      dialog: this.initialDialog,
      cord: {},
      valid: false
    };
  },
  created() {
    this.getDateTime();
  },
  methods: {
    cancel() {
      this.$emit("closeDialog");
    },
    save() {
      //Todo: save the stuff
      // Object.assign(this.desserts[this.editedIndex], this.editedItem);
    },
    getDateTime() {
      const now = new Date();
      this.cord.openedOn = now.toISOString();
    }
  },
  props: ["initialDialog"],
  watch: {
    initialDialog: function() {
      this.dialog = this.initialDialog;
      this.getDateTime();
    }
  }
};
</script>

<style scoped>
</style>
