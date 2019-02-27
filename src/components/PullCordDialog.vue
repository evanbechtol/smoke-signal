<template>
  <v-dialog v-model="dialog" persistent :fullscreen="isSmall">
    <v-card :dark="isDark" :color="`accent ${darken}`">
      <v-card-title
        primary-title
        class="bg hildaLight space-small dark-l0 ma-0"
      >
        Pull My Cord
        <v-spacer></v-spacer>
        <v-btn color="primary" flat dark @click="cancel">
          <v-icon color="#f2f2f2">mdi-close</v-icon>
        </v-btn>
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
                      counter
                      max="30"
                      :rules="[rules.required, rules.maximum]"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field
                      box
                      label="Application"
                      type="text"
                      v-model="cord.app"
                      color="info"
                      hint="What application is this related to?"
                      required
                      counter
                      max="20"
                      :rules="[rules.required, rules.maximum]"
                    >
                    </v-text-field>
                  </v-flex>
                  <v-flex xs12 sm4>
                    <!--<v-text-field
                      box
                      label="Duration"
                      type="text"
                      readonly
                      :value="cord.openedOn"
                      color="info"
                      hint="This is auto-populated"
                      required
                    >
                    </v-text-field>-->
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
                      counter
                      max="20"
                      :rules="[rules.required, rules.maximum]"
                    >
                    </v-text-field>
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
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer v-if="!isSmall"></v-spacer>
        <v-btn
          color="error darken-1"
          depressed
          @click="cancel"
          :block="isSmall"
        >
          <v-icon class="mr-2">close</v-icon>Cancel
        </v-btn>
        <v-btn
          color="success darken-1"
          :disabled="!formValid"
          depressed
          @click="save"
          :block="isSmall"
        >
          <v-icon class="mr-2">check</v-icon>Pull It!</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { assetMixin } from "../mixins/assetMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { authMixin } from "../mixins/authMixin";
import { socketMixin } from "../mixins/socketMixin";

export default {
  name: "PullCordDialog",
  mixins: [
    themeMixin,
    assetMixin,
    alertMixin,
    cordMixin,
    authMixin,
    socketMixin
  ],
  components: {},
  computed: {},
  data: function() {
    return {
      cord: {},
      dialog: this.initialDialog,
      formValid: false,
      rules: {
        required: value => !!value || "Required.",
        minimum: value =>
          (value && value.length >= 10) || "Must be at least 10 characters",
        maximum: value =>
          (value && value.length <= 30) || "Please limit to 30 characters"
      }
    };
  },
  created() {},
  methods: {
    cancel() {
      this.$refs.form.reset();
      this.$emit("closeDialog");
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
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
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
