<template>
  <div>
    <apexcharts id="chart" height="350" :type="type" :options="options" :series="series"></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import { themeMixin } from "../mixins/themeMixin";

export default {
  mixins: [themeMixin],
  name: "chart",
  components: { apexcharts: VueApexCharts },
  computed: {},
  data: () => ({
    isAlreadyRendered: false
  }),
  props: {
    options: {
      type: Object,
      default: function() {
        return {
          series: []
        };
      }
    },
    series: {
      type: Array,
      default: function() {
        return [];
      }
    },
    type: {
      type: String,
      default: "bar"
    }
  },
  methods: {
    changeChartType(value) {
      this.type = value;
    },
    getColor() {
      this.color = this.isDark ? "#f2f2f2" : "#4e4e4e";
    },
    getClass() {
      return this.isDark ? "#242424" : "#f2f2f2";
    },
    renderChart() {
      if (!this.isAlreadyRendered) {
        this.chart().render();
        this.isAlreadyRendered = true;
      } else {
        this.chart().destroy();
      }
    }
  },
  mounted() {
    /*const _this = this;*/
    /*setInterval(function() {
      const newData = _this.series[0].data.map(() => {
        return Math.floor(Math.random() * Math.floor(100));
      });
      _this.series = [{ data: newData }];
    }, 5000);*/
  },
  watch: {}
};
</script>

<style scoped>
</style>
