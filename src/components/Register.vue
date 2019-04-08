

<template>
  <v-dialog
    v-model="dialog"
    persistent
    :fullscreen="isSmall"
    :max-width="dialogWidth"
  >
    <v-card color="accent" light tile class="space-small mr-1">
      <v-layout row align-center justify-space-around>
        <v-flex xs12 mt-4>
          <v-stepper
            :value="step"
            class="elevation-0"
            style="background-color: var(--e-light-layer-2)"
          >
            <v-stepper-header>
              <v-stepper-step
                step="1"
                :complete="step > 1"
                :color="computeColor(1)"
              >
                Personal Information
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                step="2"
                :complete="step > 2"
                :color="computeColor(2)"
              >
                Signum and Email
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                step="3"
                :complete="step > 3"
                :color="computeColor(3)"
              >
                Create a password
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step
                step="4"
                :complete="step === 4"
                :color="computeColor(4)"
              >
                Account Created
              </v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-flex>
      </v-layout>

      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text>
            <v-form v-model="form.step1.valid" ref="form1" class="mb-5">
              <v-text-field
                label="First Name"
                name="first name"
                color="info darken-1"
                :rules="nameRules"
                v-model="registerUser.firstName"
                required
              >
              </v-text-field>
              <v-text-field
                label="Last Name"
                name="last name"
                color="info darken-1"
                :rules="nameRules"
                v-model="registerUser.lastName"
                required
              >
              </v-text-field>
            </v-form>

            <span class="caption grey--text text--darken-1">
              All information requested is private and will not be shared with
              anyone
            </span>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="2">
          <v-card-text>
            <v-form v-model="form.step2.valid" ref="form1">
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="email"
                type="email"
                color="info darken-1"
                :rules="emailRules"
                v-model="registerUser.email"
                validate-on-blur
                required
                placeholder="example@ericsson.com"
              >
              </v-text-field>
              <v-text-field
                label="Username/Signum"
                name="username"
                prepend-icon="fingerprint"
                color="info darken-1"
                :rules="usernameRules"
                v-model="registerUser.username"
                required
              >
              </v-text-field>
              <v-combobox
                multiple
                name="project"  
                label="Applications"
                prepend-icon="application"
                :items="appOptions"
                color="info darken-1"
                id="appSelect"
                v-model="registerUser.project" 
                :rules="appRules"
                required
               >
               </v-combobox>
            </v-form>

            <span class="caption grey--text text--darken-1">
              This is the email and username that you will use for your account
            </span>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="3">
          <v-card-text>
            <v-form v-model="form.step3.valid" ref="form2">
              <v-text-field
                ref="password"
                name="password"
                label="Password"
                data-vv-name="password"
                data-vv-delay="300"
                min="6"
                counter
                color="info darken-1"
                v-validate="'required|min:6|max:100'"
                v-model="registerUser.password"
                :error-messages="errors.collect('password')"
                hint="It should be a minimum of 6 characters"
                prepend-icon="lock"
                type="password"
              >
              </v-text-field>

              <v-text-field
                label="Password confirmation"
                data-vv-as="Password confirmation"
                data-vv-name="confirmPassword"
                data-vv-delay="300"
                target="password"
                name="confirm password"
                counter
                color="info darken-1"
                v-validate="'required|confirmed:password'"
                v-model="registerUser.confirmPassword"
                validate-on-blur
                :error-messages="errors.collect('confirmPassword')"
                prepend-icon="lock"
                type="password"
              >
              </v-text-field>
              <span class="caption grey--text text--darken-1">
                Please enter a password for your account
              </span>
            </v-form>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="4">
          <div class="pa-3 text-xs-center">
            <v-icon size="120px" class="mb-3">sentiment_satisfied_alt</v-icon>
            <h3 class="title font-weight-light mb-2">
              Registration successful!
            </h3>
            <span class="caption grey--text">
              Thanks for registering, {{ registerUser.firstName }}! You should
              receive a verification email shortly. Follow the instructions to
              begin using the application!
            </span>
          </div>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn outline color="primary darken-1" name="cancel" @click="cancel()">
          {{ cancelLabel }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="backDisabled || step === 1"
          depressed
          color="primary darken-1"
          name="back"
          @click="step--"
        >
          <v-icon dark class="mr-2">navigate_before</v-icon>
          Back
        </v-btn>
        <v-btn
          :disabled="this.step === 4 || !this.form[`step${this.step}`].valid"
          color="info darken-1"
          depressed
          name="next"
          @click="validateAndNext()"
        >
          Next
          <v-icon dark class="ml-2">navigate_next</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { alertMixin } from "../mixins/alertMixin";
import { authMixin } from "../mixins/authMixin";
import { assetMixin } from "../mixins/assetMixin";
import { themeMixin } from "../mixins/themeMixin";
import { cordMixin } from "../mixins/cordMixin.js";
import { appsMixin } from "../mixins/appsMixin.js";

export default {
  name: "register",

  $_veeValidate: {
    validator: "new"
  },
  mixins: [authMixin, assetMixin, alertMixin, themeMixin, cordMixin, appsMixin],
  computed: {
    cancelLabel() {
      return this.step < 4 ? "Cancel" : "Close";
    },
    dialogWidth() {
      return this.isSmall ? "100%" : "800px";
    },
    email() {
      return this.user.email;
    },
    username() {
      return this.user.username;
    }
  },
  created() {
    let appDetails = [];
    this.getApps().then(response => {
      for (let i = 0; i < response.data.data.length; i++) {
        appDetails[i] = response.data.data[i].name;
      }
      this.appOptions = appDetails;
    });
  },
  data: () => ({
    backDisabled: false,
    appOptions: [],
    dictionary: {
      custom: {
        password: {
          required: () => "Password can not be empty",
          max: "The password field may not be greater than 100 characters",
          min: "The password field may not be lesser than 6 characters"
        },
        password_confirmation: {
          required: () => "Password confirmation can not be empty",
          confirmed: "The password confirmation does not match"
        }
      }
    },
    form: {
      step1: {
        valid: false
      },
      step2: {
        valid: false
      },
      step3: {
        valid: false
      },
      step4: {
        valid: true
      }
    },
    step: 1,
    numSteps: 4,
    registerUser: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      project: "",
      password: "",
      confirmPassword: ""
    },
    nameRules: [v => !!v || "This field is required"],
    emailRules: [
      v => !!v || "Email is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    usernameRules: [
      v => !!v || "Username is required",
      v => (v && v.length > 4) || "Username must at least 4 characters"
    ],
    appRules: [
      v => !!v || "Applications is required",
      v => (v && v.length != 0) || "Applications is required"
    ],
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length > 4) || "Password must be at least 4 characters"
    ],
    confirmPasswordRules: [
      v => !!v || "Confirm password is required",
      v => (v && v.length > 4) || "Password must be at least 4 characters"
    ]
  }),
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.$validator.localize("en", this.dictionary);
    this.$nextTick(function() {
      this.form.step2.valid = false;
      this.form.step3.valid = false;
    });
  },
  methods: {
    cancel() {
      this.$emit("cancelRegistration");
    },
    computeColor: function(step) {
      return this.step === step
        ? "info"
        : this.step > step ? "success" : "#4e4e4e";
    },
    updateProgressBar: function() {
      return Math.ceil(this.step / this.numSteps * 100);
    },
    validateAndNext: function() {
      if (this.form[`step${this.step}`].valid === true) {
        if (this.step === this.numSteps - 1) {
          const obj = {
            firstName: this.registerUser.firstName,
            lastName: this.registerUser.lastName,
            username: this.registerUser.username,
            project: this.registerUser.project,
            email: this.registerUser.email,
            password: this.registerUser.password
          };
          this.eAuthRegister(obj)
            .then(response => {
              this.userAppsRegister(obj, response)
                .then(() => {
                  this.step++;
                  this.backDisabled = true;
                })
                .catch(err => {
                  const errorMessage = err.response.data.message;
                  let alertMessage = "";
                });
            })
            .catch(err => {
              const errorMessage = err.response.data.message;
              let alertMessage = "";

              if (errorMessage) {
                if (errorMessage.includes("E11000")) {
                  alertMessage = "That username already exists, please login";
                } else {
                  alertMessage = errorMessage;
                }
              } else {
                alertMessage = `Registration failed, server responded with: ${
                  err.response.statustext
                }`;
              }

              this.setAlert(
                `Error registering user: ${alertMessage}`,
                "#DC2D37",
                0
              );
            });
        } else {
          this.step++;
        }
      }
    }
  },
  watch: {
    step: function() {
      this.updateProgressBar();
    }
  }
};
</script>
<style scoped>
.large {
  width: 500px;
}

.fill {
  width: 100vw;
}
</style>
