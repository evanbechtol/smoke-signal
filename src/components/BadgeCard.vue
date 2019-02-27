<template>
  <transition
    name="auth-animation"
    mode="out-in"
    enter-active-class="animated faster slideInUp"
    leave-active-class="animated faster slideOutDown"
  >
    <v-bottom-sheet
      :class="isSmall ? 'mobile' : 'desktop'"
      :inset="!isSmall"
      :value="badgeCard"
      :hide-overlay="!isSmall"
      :max-width="isSmall ? '100%' : '20%'"
    >
      <v-card :dark="isDark" :color="`accent ${darken}`" height="400">
        <v-card-title
          primary-title
          class="hildaLight big space-small dark ma-0"
        >
          Badge Awarded!
          <v-spacer></v-spacer>
          <v-btn color="primary" flat dark @click="cancel">
            <v-icon color="#f2f2f2">mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-layout column fill-height justify-center align-center>
            <v-flex xs12 align-self-center>
              <div class="circle"></div>
            </v-flex>
            <v-flex xs12 mt-4>
              <p>Here is some card text</p>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </transition>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { assetMixin } from "../mixins/assetMixin.js";
import { authMixin } from "../mixins/authMixin";
import { socketMixin } from "../mixins/socketMixin";
import { badgeMixin } from "../mixins/badgeMixin";

export default {
  name: "BadgeCard",
  mixins: [themeMixin, assetMixin, authMixin, socketMixin, badgeMixin],
  components: {},
  computed: {},
  data: function() {
    return {
      badgeDisplay: ""
    };
  },
  created() {},
  mounted() {},
  methods: {
    cancel() {
      this.$store.commit("badgeCard", false);
    }
  },
  watch: {}
};
</script>

<style scoped>
.circle {
  height: 200px;
  width: 200px;
  background-color: var(--e-dark-status-green);
  border-radius: 100px;
}

.mobile {
  position: absolute;
}

.desktop {
  position: absolute !important;
  right: 87px !important;
}
</style>
