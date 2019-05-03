<template>
  <v-container fluid fill-height class="notFound page">
    <v-layout row wrap fill-height justify-center align-center>
      <v-flex xs12 text-xs-right>
        <div class="content">
          <h1 class="hildaLight display-3">404: Page Not Found</h1>
          <p>
            This page doesn't exist, you just found a glitch in the matrix
          </p>
          <v-btn
            class="animated slow headShake"
            id="myBtn"
            color="#0c0c0c"
            dark
            :to="{ path: '/' }"
            large
            >Take me home!</v-btn
          >
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";

export default {
  name: "NotFound",
  mixins: [themeMixin]
};
</script>

<style scoped>
#myBtn {
  animation-delay: 2s;
  animation-iteration-count: infinite;
}

#myBtn:hover {
  background-color: var(--e-light-brand-blue) !important;
}
</style>
