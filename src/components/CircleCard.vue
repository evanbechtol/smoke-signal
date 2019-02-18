<template>
  <!--<v-card :dark="isDark" :color="`accent ${darken}`"
          :class="$vuetify.breakpoint.smAndUp ? 'space-small' : ''"
          class="dashCard"
          style="height: 367px;">
    <v-card-title class="pa-2">
      <p class="hildaLight" style="max-width: 85%; overflow: hidden;">{{ title && title.length < 25 ? title : title.replace( title.substring(25), "..." ) }}</p>
      <v-spacer></v-spacer>
      
      <menu-btn :items="menuItems" class="menuBtn"></menu-btn>
    
    </v-card-title>
    <v-responsive class="px-2 pt-0 mt-2">
      <div class="dashCircle" :class="color">
        <v-layout align-center justify-center fill-height>
          <v-flex text-xs-center pt-3><p class="dark-text hildaLight" style="font-size: 52px;">{{ value }}</p></v-flex>
        </v-layout>
      </div>
      <v-flex xs12 class="mt-4">
        <v-layout column>
          <v-flex xs12>
            <v-expansion-panel>
              <v-expansion-panel-content style="z-index: 99;">
                <div slot="header">Details</div>
                <v-card :color="isDark ? '#4e4e4e' : '#c8c8c8'">
                  <v-card-text>
                    <slot></slot>
                  </v-card-text>
                </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-responsive>
  </v-card>-->
  
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
