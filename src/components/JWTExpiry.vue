<template>
  <v-flex xs12 style="width: 100%;">
    <v-card :dark="isDark" :color="expiryDetails.color" class="px-0 mx-0" tile>
      <v-layout align-center justify-center fill-height>
        <v-flex text-xs-center pt-3>
          <p>{{ expiryDetails.exp }}</p>
        </v-flex>
      </v-layout>
    </v-card>
  </v-flex>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin";

export default {
  name: "jwt-expiry",
  mixins: [themeMixin],
  props: ["expiryDetails"]
};
</script>

<style scoped></style>
