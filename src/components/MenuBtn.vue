<template>
  <v-menu bottom left>
    <v-btn class="menuBtn" slot="activator" :dark="isDark" icon>
      <v-icon>more_vert</v-icon>
    </v-btn>

    <v-list>
      <!-- eslint-disable-next-line -->
      <v-list-tile v-for="(item, i) in items" :key="i" @click="">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin";

export default {
  mixins: [themeMixin],
  name: "menu-btn",
  props: {
    items: {
      type: Array
    }
  }
};
</script>

<style scoped></style>
