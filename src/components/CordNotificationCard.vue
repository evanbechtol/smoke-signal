<template>
  <v-card
    v-show="showNotificationCard"
    :dark="isDark"
    :color="`accent ${darken}`"
    class="mt-5 ml-5"
    style="position: absolute; right: 200px; z-index: 9999; margin: 0 auto;"
  >
    <v-toolbar :dark="isDark">
      <v-toolbar-title class="hildaLight space-small">
        {{ cordPullMessage.message }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark icon @click="closeCordPullNotification">
          <v-icon>close</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card tile>
      <v-card-text>
        <v-layout row wrap fill-height>
          <v-flex xs12>
            <p class="hildaLight">
              <strong>{{ cordPullMessage.data.title }}</strong>
            </p>
          </v-flex>
          <v-flex xs12>
            <div
              style="height: 100px; overflow-x: hidden;"
              v-html="cordPullMessage.data.description"
            ></div>
          </v-flex>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          depressed
          color="info"
          class="ml-0 mt-4"
          dark
          @click="goToCord"
          :block="isSmall"
        >
          Check it out!
          <v-icon class="ml-2">navigate_next</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-card>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin";
import { cordMixin } from "../mixins/cordMixin";

export default {
  name: "CordNotificationCard",
  mixins: [cordMixin, themeMixin],
  props: {
    showNotificationCard: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  methods: {
    closeCordPullNotification() {
      this.$emit("closeCordPullNotification", true);
    },
    goToCord() {
      this.$store.commit("cordPullNotification", false);
      this.$router.push({ path: this.notificationLink });
    }
  }
};
</script>

<style scoped></style>
