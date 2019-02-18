<template>
  <div class="dashCircle" :class="color">
    <v-layout align-center justify-center fill-height>
      <v-flex text-xs-center pt-3><p class="dark-text hildaLight" style="font-size: 52px;">{{ value }}</p></v-flex>
    </v-layout>
  </div>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import MenuBtn from "../components/MenuBtn";

export default {
  name: "CircleCard",
  mixins: [themeMixin],
  components: { MenuBtn },
  computed: {},
  data: () => ({}),
  props: {
    color: {
      type: String,
      default: "`info ${darken}`"
    },
    menuItems: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: ""
    },
    value: {
      type: Number,
      default: 0
    }
  },
  beforeCreate() {},
  created() {},
  beforeDestroy() {},
  destroyed() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  methods: {},
  watch: {}
};
</script>

<style scoped>
.dashCircle {
  margin: 0 auto;
  height: 150px;
  width: 150px;
  border-radius: 90px;
}

.menuBtn {
  position: relative;
  bottom: 8px;
  left: 16px;
}
</style>
