<template>
  <v-card  :color="`accent ${fromSystem ? 'darken-1' : ''}`" :dark="fromSystem">
    <v-card-title class="hildaLight space-small pa-0">
      <v-spacer v-if="fromUser"></v-spacer>
      {{ user }}
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text style="padding: 8px !important;">
  
      <v-layout v-if="fromUser" column wrap fill-height align-end justify-start>
        <v-flex xs12 text-xs-right pb-3>
          {{ message }}
        </v-flex>
      </v-layout>
      
      <v-layout v-if="fromSystem" column wrap fill-height align-start justify-start>
        <v-flex xs12 text-xs-right pb-3>
          {{ message }}
        </v-flex>
      </v-layout>
      <v-layout row fill-height align-center justify-start>
        <v-flex xs12>
          <v-layout row class="space-small pa-0">
            <v-icon small>check</v-icon>
            <v-icon small>check</v-icon>
            <small>{{ time }}</small>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ChatMessage",
  mixins: [],
  components: {},
  computed: {},
  data: () => ({}),
  props: {
    fromSystem: {
      type: Boolean,
      default: false
    },
    fromUser: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    },
    user: {
      type: Object,
      default: function() {
        return {};
      }
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
</style>
