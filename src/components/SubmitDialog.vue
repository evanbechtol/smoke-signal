<template>
  <v-dialog v-model="submitDialog" width="500">
    <v-card tile flat color="accent">
      <v-card-title primary-title class="hildaLight space-small ma-0 darkCard">Content Submission
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary"
                 flat
                 dark
                 @click="closeDialog(true)">
            <v-icon color="#f2f2f2">mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card-title>

      <v-card-title class="space-small darkCard ma-0"><small>Use the form below to submit new content, update existing content, or mark content for deletion</small></v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-form v-model="form" ref="form">
          <v-layout column fill-height align-space-around justify-center wrap>
            <v-flex xs12 mx-3>
              <v-combobox v-model="submission.type"
                          :items="submissionTypes"
                          color="info"
                          clearable
                          :rules="[rules.required]"
                          label="Submission Type">
              </v-combobox>
            </v-flex>

            <v-flex xs12 sm3 mx-3>
              <v-text-field
                v-model="submission.application"
                color="info"
                hint="What application is this for?"
                :rules="[rules.required]"
                label="Application">
              </v-text-field>
            </v-flex>

            <v-flex xs12 sm3 mx-3>
              <v-text-field
                v-model="submission.category"
                color="info"
                hint="Ex) Admin, Troubleshooting, Bug Fixes"
                :rules="[rules.required]"
                label="Category">
              </v-text-field>
            </v-flex>

            <v-flex xs12 sm3 mx-3>
              <v-text-field
                v-model="submission.subCategory"
                color="info"
                hint="Ex) Responses, How To, Accounts"
                :rules="[rules.required]"
                label="Sub Category">
              </v-text-field>
            </v-flex>

            <v-flex xs12 sm3 mx-3>
              <v-text-field
                v-model="submission.issue"
                color="info"
                hint="Ex) Password Reset, Account Locked, Clear Browser Cache"
                :rules="[rules.required]"
                label="Issue">
              </v-text-field>
            </v-flex>

            <v-flex xs12 mx-3>
              <v-textarea
                v-model="submission.script"
                color="info"
                label="Script">
              </v-textarea>
            </v-flex>

            <v-flex xs12 mx-3>
              <v-textarea
                v-model="submission.workInstructions"
                color="info"
                label="Work Instructions">
              </v-textarea>
            </v-flex>

            <v-flex xs12 mx-3>
              <v-text-field
                v-model="submission.documentLink"
                color="info"
                hint="Provide a link to supporting docs"
                label="Document Link">
              </v-text-field>
            </v-flex>

            <v-flex xs12 mx-3>
              <v-text-field
                v-model="submission.name"
                hint="Who are you?"
                :rules="[rules.required]"
                label="Name">
              </v-text-field>
            </v-flex>

            <v-flex xs12  mx-3>
              <v-text-field
                v-model="submission.email"
                hint="Please use your Ericsson email"
                :rules="[rules.required, rules.email]"
                label="E-mail">
              </v-text-field>
            </v-flex>

            <v-flex xs12  mx-3>
              <v-textarea
                v-model="submission.description"
                :rules="[rules.required]"
                label="Description of changes made">
              </v-textarea>
            </v-flex>
          </v-layout>
        </v-form>

        <v-layout row fill-height align-center justify-center>
          <v-flex xs12 mx-3 mt-3>
            <v-btn :disabled="!this.form"
                   block
                   color="info"
                   depressed
                   name="Submit Form"
                   @click="submitForm">
              Submit For Review
              <v-icon dark>navigate_next</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { alertMixin } from "../mixins/alertMixin";

export default {
  name: "SubmitDialog",
  mixins: [alertMixin],
  data: () => ({
    form: false,
    iconStep: 0,
    rules: {
      required: value => !!value || "Required.",
      counter: value => value.length <= 20 || "Max 20 characters",
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Invalid e-mail.";
      }
    },
    submission: {
      type: "",
      application: "",
      category: "",
      subCategory: "",
      issue: "",
      script: "",
      workInstructions: "",
      documentLink: "",
      description: "",
      name: "",
      email: ""
    },
    submissionTypes: ["New", "Update", "Delete"]
  }),
  computed: {
    submitDialog: {
      get: function() {
        return this.$store.getters.submitDialog;
      },
      set: function() {
        this.$store.commit("submitDialog");
      }
    }
  },
  methods: {
    closeDialog: function() {
      this.$store.commit("submitDialog", false);
    },
    makeRequest: function(route, params) {
      const base = "http://138.85.123.229/php";
      const _this = this;

      return new Promise((resolve, reject) => {
        axios
          .post(`${base}/${route}`, params)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            _this.setAlert(
              `Error retrieving data, status code ${err.response.status}`,
              "#DC2D37",
              5000
            );
            reject(err);
          });
      });
    },
    resetForm: function() {
      this.submission = {
        type: "",
        application: "",
        category: "",
        subCategory: "",
        issue: "",
        script: "",
        workInstructions: "",
        documentLink: "",
        description: "",
        name: "",
        email: ""
      };
      this.$refs.form.reset();
    },
    submitForm: function() {
      const route = "email.php";
      const params = new URLSearchParams();
      const _this = this;

      if (this.form) {
        params.append("email", this.submission.email);
        params.append("name", this.submission.name);
        params.append("application", this.submission.application);
        params.append("category", this.submission.category);
        params.append("subcategory", this.submission.subCategory);
        params.append("issue", this.submission.issue);
        params.append("script", this.submission.script);
        params.append("work_instruction", this.submission.workInstructions);
        params.append("document_link", this.submission.documentLink);
        params.append("type", this.submission.type);
        params.append("description", this.submission.description);
        params.append("submit", "submit");

        this.makeRequest(route, params)
          .then(response => {
            _this.setAlert(
              "Your content has been submitted for review!",
              "#288964",
              5000
            );
            _this.resetForm();
            return response;
          })
          .catch(err => {
            return err;
          });
      }
    }
  }
};
</script>

<style scoped>
.darkCard {
  background: var(--e-light-layer-0);
  color: var(--e-dark-text);
}
</style>
