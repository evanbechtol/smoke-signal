<template>
  <div class="dark-l1 login page">
    <v-layout row justify-start ml-1>
      <v-flex xs12 sm1 class="mt-4">
        <v-img
          :src="getImagePath('econ_rgb.svg')"
          height="160px"
          contain
        ></v-img>
      </v-flex>
    </v-layout>
    <v-layout
      column
      align-center
      justify-center
      fill-height
      style="height: 80vh;"
      text-xs-center
      class="dark"
    >
      <v-flex xs12 style="margin-top: 16vh;">
        <transition
          name="auth-animation"
          mode="out-in"
          enter-active-class="animated faster fadeInDown"
          leave-active-class="animated faster fadeOutUp"
        >
          <v-form
            v-if="loggingIn"
            ref="form"
            v-model="valid"
            class="animated faster fadeInDown"
          >
            <v-text-field
              dark
              box
              name="username"
              color="info darken-1"
              v-model="username"
              :rules="usernameRules"
              label="Username"
              validate-on-blur
              required
            >
            </v-text-field>
            <v-text-field
              dark
              box
              name="password"
              color="info darken-1"
              v-model="password"
              :rules="passwordRules"
              type="password"
              label="Password"
              required
            >
            </v-text-field>
            <v-checkbox
              v-model="checkbox"
              label="Remember me"
              dark
              color="#0084F0"
            >
            </v-checkbox>
            <v-layout row wrap fill-height justify-start align-center>
              <v-flex xs4>
                <v-btn
                  :disabled="!valid"
                  name="login"
                  :color="`info ${darken}`"
                  dark
                  @click="submit"
                >
                  <v-icon dark class="pr-2">exit_to_app</v-icon>
                  login
                </v-btn>
              </v-flex>
              <v-flex xs4>
                <v-btn @click="clear" name="clear form">reset form</v-btn>
              </v-flex>
              <v-flex xs4>
                <v-btn
                  @click="toggleRegistration()"
                  :color="`success darken-1`"
                  name="register"
                >
                  <v-icon dark class="pr-2">how_to_reg</v-icon>
                  Sign Up
                </v-btn>
              </v-flex>
              <v-flex xs12>
                <v-btn
                  flat
                  name="Forgot Password"
                  @click="resetDialog = true"
                  :color="`info darken-1`"
                >
                  <v-icon dark class="pr-2">update</v-icon>
                  Forgot Password
                </v-btn>
              </v-flex>
            </v-layout>
          </v-form>

          <register v-else v-on:cancelRegistration="toggleRegistration()">
          </register>
        </transition>

        <v-dialog v-model="resetDialog" width="500">
          <v-card tile flat color="accent">
            <v-card-title
              primary-title
              class="hildaLight space-small ma-0 darkCard"
              >Password Reset
              <v-spacer></v-spacer>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat dark @click="closeResetDialog">
                  <v-icon color="#f2f2f2">mdi-close</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card-title>

            <v-card-title class="space-small darkCard ma-0">
              <small>Use this form to reset your password</small>
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text>
              <v-form v-model="form" ref="resetForm">
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="email"
                  type="email"
                  color="info darken-1"
                  :rules="emailRules"
                  v-model="email"
                  required
                  placeholder="example@ericsson.com"
                >
                </v-text-field>
              </v-form>
              <v-layout row fill-height align-center justify-center>
                <v-flex xs12 mx-3 mt-3>
                  <v-btn
                    :disabled="!this.form"
                    block
                    color="info"
                    depressed
                    name="Submit Reset Form"
                    @click="submitResetForm"
                  >
                    Submit
                    <v-icon dark>navigate_next</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { alertMixin } from "../mixins/alertMixin";
import { assetMixin } from "../mixins/assetMixin";
import { authMixin } from "../mixins/authMixin";
import { themeMixin } from "../mixins/themeMixin";
import Register from "../components/Register";

export default {
  name: "login",
  components: { Register },
  mixins: [themeMixin, alertMixin, assetMixin, authMixin],
  data: () => ({
    checkbox: false,
    form: false,
    resetDialog: false,
    valid: false,
    email: "",
    emailRules: [
      v => !!v || "Email is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    username: "",
    usernameRules: [
      v => !!v || "Username is required",
      v => (v && v.length > 4) || "Username must at least 4 characters"
    ],
    password: "",
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length >= 6) || "Password must be at least 6 characters"
    ],
    loggingIn: {
      type: Boolean,
      default: false
    }
  }),
  methods: {
    closeResetDialog: function() {
      this.resetDialog = false;
      this.email = "";
      this.$refs.resetForm.reset();
    },
    submit() {
      if (this.$refs.form.validate()) {
        const obj = {
          username: this.username,
          email: this.username,
          password: this.password
        };
        this.validateApp()
          .then(() => {
            return this.eAuthLogin(obj);
          })
          .then(() => {
            this.setAlert("Login Successful", "#288964", 5000);
            this.$router.push(this.$route.params.nextUrl || "/");
          })
          .catch(err => {
            this.setAlert(err, "#DC2D37", 5000);
          });
      }
    },
    submitResetForm() {
      this.eAuthForgotPassword({ email: this.email })
        .then(() => {
          this.email = "";
          this.resetDialog = false;
        })
        .catch(err => {
          return err;
        });
    },
    clear() {
      this.$refs.form.reset();
    },
    toggleRegistration() {
      this.loggingIn = !this.loggingIn;
    }
  },
  mounted() {
    this.valid = false;
  }
};
</script>

<style scoped>
.darkCard {
  background: var(--e-light-layer-0);
  color: var(--e-dark-text);
}
</style>
