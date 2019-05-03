<template>
  <v-container fluid full-width class="metrics page"> </v-container>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";

export default {
  name: "metrics",
  mixins: [themeMixin],
  data: () => ({
    applications: [],
    avgRating: null,
    loading: false,
    selectedApp: "",
    metrics: {
      appName: "",
      overallSus: "",
      submissions: [],
      labels: [],
      values: []
    }
  })
};
</script>
