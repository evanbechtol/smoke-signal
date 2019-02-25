<template>
  <v-footer id="footer" app height="60px" dark inset class="px-0 mb-2" fixed>
    <v-container fluid class="pa-0">
      <v-card flat tile :color="color" class="white--text text-xs-center">
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-3 white--text"
            icon
          >
            <v-icon size="24px">{{ icon }}</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0"> </v-card-text>

        <v-divider></v-divider>

        <v-card-text class="white--text">
          &copy;2018 — <strong>Evan Bechtol</strong>
        </v-card-text>
      </v-card>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  props: ["color"],
  data: () => ({
    icons: [
      "mdi-facebook-box",
      "mdi-twitter-box",
      "mdi-google-plus-box",
      "mdi-linkedin-box",
      "mdi-instagram"
    ]
  })
};
</script>

<style></style>
