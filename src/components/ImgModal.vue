<template>
  <v-dialog v-model="imgDialog" fullscreen>
    <v-card tile flat :class="theme" :color="getColor()">
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary"
               flat
               @click="closeDialog">
          <v-icon :color="isDark ? '#f2f2f2' : '#4e4e4e'">mdi-close</v-icon>
        </v-btn>
      </v-card-actions>

      <v-divider></v-divider>
      <div style='background-color: #0c0c0c;'>
        <v-img :src="getImg()" contain height="91.4vh"></v-img>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ImgModal",
  props: ["src"],
  computed: {
    imgDialog: {
      get: function() {
        return this.$store.getters.imgDialog;
      },
      set: function() {
        this.$store.commit("imgDialog");
      }
    },
    theme: {
      get: function() {
        return this.$store.getters.theme;
      },
      set: function() {
        this.$store.commit("theme");
      }
    }
  },
  methods: {
    closeDialog: function() {
      this.$store.commit("imgDialog", false);
    },
    getColor() {
      return this.theme === "dark" ? "#242424" : "#f2f2f2";
    },
    getImg: function() {
      return this.src === null ? "" : this.src;
    }
  }
};
</script>

<style scoped>
</style>
