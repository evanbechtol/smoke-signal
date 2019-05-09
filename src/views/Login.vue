<template>
  <v-container fluid fill-height class="dark-l1 login page">
    <!-- E/// Logo --->
    <v-layout row wrap :class="justification">
      <v-flex xs12 class="pt-5" :class="isSmall ? 'mt-0' : 'mt-5'">
        <v-layout :class="justification">
          <img
            alt="ericsson logo"
            :src="getImagePath('econ_rgb.svg')"
            height="160px"
          />
        </v-layout>
      </v-flex>

      <v-flex xs12>
        <!-- Authentication Form -->
        <v-layout column justify-center text-xs-center align-space-around>
          <v-flex
            xs12
            sm8
            md6
            grow
            :class="isSmall ? 'mt-5' : 'mt-0'"
            :style="isSmall ? 'width: 100%;' : 'width: 30%'"
            align-self-center
          >
            <v-form
              v-if="loggingIn"
              ref="form"
              v-model="valid"
              class="animated faster fadeInDown"
            >
              <v-text-field
                dark
                full-width
                outline
                name="username"
                color="info darken-1"
                v-model="username"
                :rules="usernameRules"
                label="Username"
                required
              >
              </v-text-field>
              <v-text-field
                dark
                full-width
                outline
                name="password"
                color="info darken-1"
                v-model="password"
                :rules="passwordRules"
                type="password"
                label="Password"
                required
              >
              </v-text-field>
              <v-layout column fill-height justify-start align-space-around>
                <v-flex xs12 sm6>
                  <v-btn
                    :disabled="!valid"
                    name="login"
                    block
                    :color="`info ${darken}`"
                    dark
                    @click="submit"
                  >
                    Sign In
                  </v-btn>
                </v-flex>
                <v-flex xs12 mt-4>
                  <v-btn
                    flat
                    name="Forgot Password"
                    @click="resetDialog = true"
                    dark
                  >
                    Forgot Password?
                  </v-btn>
                </v-flex>
                <v-flex xs12>
                  <v-btn
                    flat
                    @click="toggleRegistration()"
                    dark
                    :color="`info darken-1`"
                    name="register"
                  >
                    Sign Up
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-form>

            <v-dialog v-model="resetDialog" :fullscreen="isSmall" width="500">
              <v-card tile flat color="accent" light>
                <v-card-title primary-title class="hildaLight space-small ma-0">
                  Forgot Password?
                </v-card-title>

                <v-card-title class="space-small ma-0">
                  <small>
                    Provide the email associated to your account, and we'll send
                    you instructions to reset your password
                  </small>
                </v-card-title>

                <v-card-text>
                  <v-form v-model="form" ref="resetForm">
                    <v-text-field
                      label="Email"
                      name="email"
                      append-icon="mail_outline"
                      type="email"
                      color="info darken-1"
                      :rules="emailRules"
                      v-model="email"
                      required
                      placeholder="example@ericsson.com"
                    >
                    </v-text-field>
                  </v-form>
                  <v-layout row fill-height align-center justify-end>
                    <v-flex xs6 sm3 mr-1>
                      <v-btn
                        block
                        color="primary"
                        outline
                        dark
                        @click="closeResetDialog"
                      >
                        Cancel
                      </v-btn>
                    </v-flex>
                    <v-flex xs6 sm3 ml-1>
                      <v-btn
                        block
                        :disabled="!this.form"
                        color="info"
                        depressed
                        name="Submit Reset Form"
                        @click="submitResetForm"
                      >
                        Submit
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-flex>

          <v-flex xs12 v-if="!loggingIn" class="animated faster fadeIn">
            <register
              v-on:cancelRegistration="toggleRegistration()"
              :dialog="!loggingIn"
            >
            </register>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { alertMixin } from "../mixins/alertMixin";
import { assetMixin } from "../mixins/assetMixin";
import { authMixin } from "../mixins/authMixin";
import { themeMixin } from "../mixins/themeMixin";

export default {
  name: "login",
  components: { Register: () => import("../components/Register") },
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
  computed: {
    justification: function() {
      return this.isSmall ? "justify-center ml-0 mt-5" : "justify-start ml-5";
    }
  },
  created() {
    const _this = this;
    window.addEventListener("keydown", e => {
      if (_this.$route.name === "login" && e.key === "Enter") {
        _this.submit();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener("keydown", () => {});
    next();
  },
  methods: {
    closeResetDialog() {
      this.resetDialog = false;
      this.email = "";
      this.$refs.resetForm.reset();
    },
    submit() {
      if (this.$refs.form && this.$refs.form.validate()) {
        const obj = {
          username: this.username,
          email: this.username,
          password: this.password
        };
        // Todo: login against hero db 1st, then eAuth
        this.validateApp()
          .then(() => {
            return this.heroLogin({ username: obj.username });
          })
          .then(() => {
            return this.eAuthLogin(obj);
          })
          .then(() => {
            this.$router.push(this.$route.params.nextUrl || "/");
          })
          .catch(err => {
            const errMessage =
              err &&
              err.response &&
              err.response.data &&
              err.response.data.error
                ? err.response.data.error
                : err;
            this.setAlert(errMessage, "#DC2D37", 5000);
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
    toggleRegistration() {
      this.loggingIn = !this.loggingIn;
    }
  },
  mounted() {
    this.valid = false;
  }
};
</script>

<style scoped></style>
