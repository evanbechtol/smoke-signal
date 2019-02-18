<template>
  <div style="height: 100vh;" class="home page">

  </div>

</template>

<script>
// @ is an alias to /src
import ImgModal from "../components/ImgModal";
import Chart from "../components/Chart";
import { themeMixin } from "../mixins/themeMixin.js";
import MenuBtn from "../components/MenuBtn";
import JwtExpiry from "../components/JWTExpiry";
import CircleCard from "../components/CircleCard";
import FeedbackCard from "../components/FeedbackCard";
import ChatMessage from "../components/ChatMessage";

const COLORS = ["info", "warning", "error", "success"];
const ICONS = {
  info: "mdi-information",
  warning: "mdi-alert",
  error: "mdi-alert-circle",
  success: "mdi-check-circle"
};

export default {
  name: "home",
  mixins: [themeMixin],
  components: {
    ChatMessage,
    FeedbackCard,
    CircleCard,
    JwtExpiry,
    MenuBtn,
    ImgModal,
    Chart
  },
  computed: {},
  data: () => ({
    selectedChartType: "area",
    chartTypes: [
      "line",
      "area",
      "bar",
      "histogram",
      "pie",
      "donut",
      "radialBar",
      "scatter",
      "bubble",
      "heatmap"
    ],
    chartData: [
      ["Year", "Sales", "Expenses", "Profit"],
      ["2014", 1000, 400, 200],
      ["2015", 1170, 460, 250],
      ["2016", 660, 1120, 300],
      ["2017", 1030, 540, 350]
    ],
    chartOptions: {
      chart: {
        title: "Company Performance",
        subtitle: "Sales, Expenses, and Profit: 2014-2017"
      },
      hAxis: {
        textStyle: {
          color: function() {
            return this.isDark ? "#fafafa" : "#4e4e4e";
          }
        }
      },
      vAxis: {
        textStyle: {
          color: function() {
            return this.isDark ? "#fafafa" : "#4e4e4e";
          }
        }
      },
      height: 320,
      backgroundColor: {
        fill: "#f2f2f2",
        fillOpacity: 0.4
      }
    },
    menuItems: [
      { title: "Some Action 1" },
      { title: "Some Action 2" },
      { title: "Some Action 3" },
      { title: "Some Action 4" }
    ],
    interval: null,
    logItems: [
      {
        id: 1,
        color: `info`,
        icon: ICONS["info"]
      },
      {
        id: 2,
        color: `success`,
        icon: ICONS["success"]
      },
      {
        id: 3,
        color: `warning`,
        icon: ICONS["warning"]
      }
    ],
    nonce: 4,
    e6: 1,
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      rowsPerPage: 4
    },
    headers: [
      {
        text: "Criticality",
        align: "left",
        value: "criticality"
      },
      { text: "Asset Name", align: "left", value: "asset" },
      { text: "Compliance Score", align: "left", value: "complianceScore" }
    ],
    items: [
      {
        value: false,
        criticality: "Extreme",
        asset: "VDC 01",
        complianceScore: 72
      } /*,
      {
        value: false,
        criticality: 'High',
        asset: "VDC 02",
        complianceScore: 56,
      },
      {
        value: false,
        criticality: 'High',
        asset: "VDC 03",
        complianceScore: 98,
      },
      {
        value: false,
        criticality: 'Extreme',
        asset: "VDC 04",
        complianceScore: 45,
      },
      {
        value: false,
        criticality: 'Extreme',
        asset: "VDC 05",
        complianceScore: 32,
      },
      {
        value: false,
        criticality: 'Low',
        asset: "VDC 06",
        complianceScore: 55,
      },
      {
        value: false,
        criticality: 'High',
        asset: "VDC 07",
        complianceScore: 81,
      },
      {
        value: false,
        criticality: 'Low',
        asset: "VDC 08",
        complianceScore: 34,
      },
      {
        value: false,
        criticality: 'Low',
        asset: "VDC 09",
        complianceScore: 25,
      },
      {
        value: false,
        criticality: 'High',
        asset: "VDC 10",
        complianceScore: 26,
      }*/
    ],
    size: "sm",
    list: [],
    areaSeries: [
      {
        name: "CPU",
        data: [31, 40, 28, 51, 42, 95, 100]
      },
      {
        name: "Memory",
        data: [11, 32, 45, 32, 34, 52, 41]
      }
    ],
    areaOptions: {
      colors: ["#0084F0", "#DC2D37"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: [
          "2018-09-19T00:00:00",
          "2018-09-19T01:30:00",
          "2018-09-19T02:30:00",
          "2018-09-19T03:30:00",
          "2018-09-19T04:30:00",
          "2018-09-19T05:30:00",
          "2018-09-19T06:30:00"
        ]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    },
    radialOptions: {
      series: [67],
      colors: ["#a56ebe"],
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%"
          },
          track: {
            show: true,
            background: "#4e4e4e"
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: "#fff",
              fontSize: "13px"
            },
            value: {
              color: "#fff",
              fontSize: "30px",
              show: true
            }
          }
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#0084F0"],
          stops: [0, 100]
        }
      },
      stroke: {
        lineCap: "round"
      },
      labels: ["Compliance Score"]
    },
    radialSeries: [Math.floor(Math.random() * Math.floor(100))]
  }),
  beforeDestroy() {
    this.stop();
  },
  created() {},
  mounted() {},
  methods: {
    addEvent() {
      let { color, icon } = this.genAlert();

      const previousColor = this.logItems[0].color;

      while (previousColor === color) {
        color = this.genColor();
      }

      this.logItems.unshift({
        id: this.nonce++,
        color,
        icon
      });

      if (this.nonce > 6) {
        this.logItems.pop();
      }
    },
    genAlert() {
      const color = this.genColor();

      return {
        color,
        icon: this.genIcon(color)
      };
    },
    genColor() {
      return COLORS[Math.floor(Math.random() * 3)];
    },
    genIcon(color) {
      return ICONS[color];
    },
    start() {
      this.interval = setInterval(this.addEvent, 3000);
    },
    stop() {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};
</script>

<style scoped>
.dashCard {
  height: 320px;
}
</style>
