<template>
  <v-flex
    xs12
    :class="{
      large: $vuetify.breakpoint.smAndUp,
      fill: $vuetify.breakpoint.xsOnly
    }"
  >
    <v-card
      :color="`accent ${darken}`"
      :dark="isDark"
      tile
      class="space-small mr-1"
      max-width="500"
    >
      <v-flex offset-xs11>
        <v-tooltip bottom class="menuIcon">
          <v-btn
            icon
            flat
            small
            depressed
            id="cancelBtn"
            slot="activator"
            color="error darken-1"
            class="mt-2 mr-3"
            @click="cancel()"
            name="cancel"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <span>Cancel Registration</span>
        </v-tooltip>
      </v-flex>
      <v-card-title class="title font-weight-regular justify-space-between">
        <v-progress-linear
          :value="registerCompletion"
          color="info darken-1"
        ></v-progress-linear>
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="primary lighten-2"
          class="subheading white--text"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>

      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text>
            <v-form v-model="form.step1.valid" ref="form1">
              <v-text-field
                label="First Name"
                name="first name"
                color="info darken-1"
                :rules="nameRules"
                v-model="user.firstName"
                required
                placeholder="John/Jane"
              >
              </v-text-field>
              <v-text-field
                label="Last Name"
                name="last name"
                color="info darken-1"
                :rules="nameRules"
                v-model="user.lastName"
                required
                placeholder="Doe"
              >
              </v-text-field>
            </v-form>

            <span class="caption grey--text text--darken-1">
              This information is private and will not be shared
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
                v-model="user.email"
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
                v-model="user.username"
                required
                placeholder="eevabec"
              >
              </v-text-field>
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
                v-model="user.password"
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
                v-model="user.confirmPassword"
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
              Account creation successful
            </h3>
            <span class="caption grey--text">Thanks for signing up!</span>
          </div>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          :disabled="backDisabled || step === 1"
          depressed
          color="primary darken-1"
          name="back"
          @click="step--"
        >
          <v-icon dark>navigate_before</v-icon>
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!this.form[`step${this.step}`].valid"
          color="info darken-1"
          depressed
          name="next"
          @click="validateAndNext()"
        >
          Next
          <v-icon dark>navigate_next</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<script>
import { alertMixin } from "../mixins/alertMixin";
import { authMixin } from "../mixins/authMixin";
import { assetMixin } from "../mixins/assetMixin";
import { themeMixin } from "../mixins/themeMixin";

export default {
  name: "register",
  $_veeValidate: {
    validator: "new"
  },
  mixins: [authMixin, assetMixin, alertMixin, themeMixin],
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Personal Information";
        case 2:
          return "Signum and Email";
        case 3:
          return "Create a password";
        default:
          return "Account created";
      }
    },
    email() {
      return this.user.email;
    },
    username() {
      return this.user.username;
    },
    registerCompletion() {
      return this.updateProgressBar();
    }
  },
  data: () => ({
    backDisabled: false,
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
      }
    },
    step: 1,
    numSteps: 4,
    user: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
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
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length > 4) || "Password must be at least 4 characters"
    ],
    confirmPasswordRules: [
      v => !!v || "Confirm password is required",
      v => (v && v.length > 4) || "Password must be at least 4 characters"
    ]
  }),
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
    updateProgressBar: function() {
      return Math.ceil((this.step / this.numSteps) * 100);
    },
    validateAndNext: function() {
      if (this.form[`step${this.step}`].valid === true) {
        if (this.step === this.numSteps - 1) {
          const obj = {
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            username: this.user.username,
            email: this.user.email,
            password: this.user.password
          };
          this.eAuthRegister(obj)
            .then(() => {
              return this.eAuthLogin(obj);
            })
            .then(response => {
              this.step++;
              this.backDisabled = true;
              this.$store.commit("user", response.data.user);
              this.$store.commit("isAuthenticated", true);
              this.setAlert(
                `Thanks for registering, ${
                  response.data.user.firstname
                }! You will receive an email to validate your address.`,
                "#288964",
                0
              );
              this.$router.push(this.$route.params.nextUrl || "/");
            })
            .catch(err => {
              this.setAlert(
                `Error registering user: status code ${err.response.message}`,
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
