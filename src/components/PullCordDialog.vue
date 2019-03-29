<template>
  <v-dialog v-model="dialog" persistent :fullscreen="isSmall">
    <v-card :dark="isDark" :color="`accent ${darken}`">
      <v-card-title class="hildaLight space-small ml-4">
        Rescue Me
      </v-card-title>

      <v-card-text>
        <v-container grid-list-md fluid>
          <v-form v-model="formValid" ref="form">
            <v-layout wrap row>
              <v-flex xs12 sm6 d-flex>
                <v-layout column justify-center>
                  <v-flex xs12 sm4>
                    <v-text-field
                      box
                      label="Title"
                      type="text"
                      v-model="cord.title"
                      color="info"
                      hint="What is the problem?"
                      required
                      max="100"
                      :rules="[rules.required, rules.maximum]"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-combobox
                      box
                      label="Application"
                      type="text"
                       item-text="name"
                      item-value="name"
                      v-model="cord.app"
                      text-color="info"
                      color="info"
                      :items="appOptions"
                      :rules="[(v) => !!v || 'Item is required']"
                      required                
                    >
                    </v-combobox>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field
                      box
                      label="Category"
                      type="text"
                      v-model="cord.category"
                      color="info"
                      hint="Ex) Bug Fix, Troubleshooting, Deployment, Admin, etc."
                      required
                      max="20"
                      :rules="[rules.required, rules.maximum]"
                    >
                    </v-text-field>
                  </v-flex>
                </v-layout>
              </v-flex>

              <v-flex xs12 sm6 align-self-start grow>
                <upload-file v-on:fileAttached="setFile"></upload-file>
              </v-flex>

              <v-flex xs12>
                <v-textarea
                  color="info"
                  box
                  label="Issue Description"
                  v-model="cord.description"
                  hint="Provide a brief description of the issue, use details!"
                  counter
                  :rules="[rules.required, rules.minimum]"
                  required
                >
                </v-textarea>
              </v-flex>

              <v-flex xs12>
                <v-combobox
                  v-model="cord.tags"
                  :items="cord.tags"
                  :color="`info ${darken}`"
                  :dark="isDark"
                  :search-input.sync="search"
                  hide-selected
                  hint="Add some tags/keywords"
                  label="Tags"
                  box
                  multiple
                  persistent-hint
                  small-chips
                >
                  <template
                    slot="selection"
                    slot-scope="{ item, parent, selected }"
                  >
                    <v-chip color="info" :selected="selected" label small dark>
                      <span class="pr-2">
                        {{ item }}
                      </span>
                      <v-icon small @click="parent.selectItem(item)">
                        close
                      </v-icon>
                    </v-chip>
                  </template>
                </v-combobox>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer v-if="!isSmall"></v-spacer>
        <v-btn outline depressed @click="cancel" :block="isSmall"
          >Cancel
        </v-btn>
        <v-btn
          color="info darken-1"
          :disabled="!formValid"
          depressed
          @click="save"
          :block="isSmall"
          >Pull It!
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { authMixin } from "../mixins/authMixin";
import { socketMixin } from "../mixins/socketMixin";
import UploadFile from "./Upload.vue";

export default {
  name: "PullCordDialog",
  mixins: [themeMixin, alertMixin, cordMixin, authMixin, socketMixin],
  components: { UploadFile },
 
  data: function() {
    var appDetails=[];
    this.getApps()
       .then(response => {   
         for(let i = 0;i < response.data.data.length;i++)
         {
          appDetails[i] = response.data.data[i].name;
         }     
         this.appOptions = appDetails;      
       });
      return { 
      cord: {},
      appOptions: [],
      dialog: this.initialDialog,
      formData: new FormData(),
      formValid: false,
      rules: {
        required: value => !!value || "Required.",
        minimum: value =>
          (value && value.length >= 10) || "Must be at least 10 characters",
        maximum: value =>
          (value && value.length <= 100) || "Please limit to 100 characters"
      },
      search: ""
    
    };

     
 
     
  },

  methods: {
    cancel() {
      this.$refs.form.reset();
      this.$emit("closeDialog");
    },
    action(){
      console.log("aaaa");
    },
   
    save() {
      this.cord.puller = { _id: this.user._id, username: this.user.username };
      this.cord.openedOn = this.getDateTime();
      this.createCord(this.cord)
        .then(response => {
          this.$refs.form.reset();
          this.$emit("closeDialog");
          this.$emit("refreshCordGrid");
          this.setAlert("Cord pulled successfully!", "#288964", 10);
          this.refreshGrid();
          this.notify({
            message: "A cord has just been pulled!",
            data: response.data.data
          });

          if (this.formData && this.formData.get("cordFile") !== null) {
            this.uploadFileByCordId(response.data.data._id, this.formData)
              .then(() => {})
              .catch(err => {
                throw err;
              });
          }
        })
        .catch(err => {
          this.setAlert(err, "#DC2D37", 0);
        });
    },
    setFile(data) {
      this.formData = data;
    },
    getDateTime() {
      return new Date().toISOString();
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

<style scoped></style>
