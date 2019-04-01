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
      row
      align-start
      justify-center
      fill-height
      style="height: 80vh;"
      text-xs-center
      class="dark"
    >
      <v-flex xs12 sm6 style="margin-top: 16vh;">
        <v-form ref="form" v-model="valid" class="animated faster fadeInDown">
          <v-text-field
            autofocus
            dark
            box
            ref="password"
            name="password"
            label="Password"
            data-vv-name="password"
            data-vv-delay="300"
            min="6"
            counter
            color="info darken-1"
            v-validate="'required|min:6|max:100'"
            v-model="password"
            :error-messages="errors.collect('password')"
            hint="It should be a minimum of 6 characters"
            prepend-inner-icon="lock"
            type="password"
          >
          </v-text-field>

          <v-text-field
            dark
            box
            label="Password confirmation"
            data-vv-as="Password confirmation"
            data-vv-name="confirmPassword"
            data-vv-delay="300"
            target="password"
            name="confirm password"
            counter
            color="info darken-1"
            v-validate="'required|confirmed:password'"
            v-model="confirmPassword"
            validate-on-blur
            :error-messages="errors.collect('confirmPassword')"
            hint="Must match the password entered above"
            prepend-inner-icon="lock"
            type="password"
          >
          </v-text-field>
        </v-form>
        <v-layout row fill-height justify-center align-start>
          <v-flex grow>
            <v-btn
              @click="resetPassword"
              color="success darken-1"
              name="rest password"
              :disabled="!valid || !password || !confirmPassword"
              :outline="!valid"
              :depressed="valid"
              block
            >
              <v-icon dark class="pr-2">update</v-icon>
              Reset Password
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";
import axios from "axios";
import { assetMixin } from "../mixins/assetMixin";
import { alertMixin } from "../mixins/alertMixin";

export default {
  name: "ResetPassword",
  mixins: [themeMixin, assetMixin, alertMixin],
  data: () => ({
    password: undefined,
    passwordRules: [
      v => !!v || "Password is required",
      v => (v && v.length > 6) || "Password must be at least 6 characters"
    ],
    confirmPassword: undefined,
    confirmPasswordRules: [
      v => !!v || "Confirm password is required",
      v => (v && v.length > 6) || "Password must be at least 6 characters"
    ],
    resetId: null,
    valid: false
  }),
  created() {
    this.resetId = this.$route.query.id || null;
  },
  methods: {
    clear() {
      this.$refs.form.reset();
    },
    resetPassword() {
      const route = `e_auth/users/forgot/${this.resetId}`;
      const base = process.env.VUE_APP_URL;
      const appCode = process.env.VUE_APP_EAUTH_APP_CODE;
      const options = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${appCode}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      };

      let params = new URLSearchParams();

      params.append("password_updated_on", new Date().toISOString());
      params.append("password", this.password);

      axios
        .patch(`${base}/${route}`, params, options)
        .then(response => {
          if (response && response.data && response.data.success === true) {
            this.setAlert(
              response.data.message || "Password updated successfully",
              "#288964",
              5000
            );
            this.$router.push(this.$route.params.nextUrl || "/login");
          } else {
            this.setAlert(
              response.data.message ||
                "Password was unable to be updated. please try again",
              "#DC2D37",
              5000
            );
          }
        })
        .catch(err => {
          this.setAlert(
            "Password was unable to be updated. please try again",
            "#DC2D37",
            5000
          );

          return err;
        });
    }
  },
  mounted() {
    this.valid = false;
  },
  watch: {}
};
</script>

<style scoped></style>
