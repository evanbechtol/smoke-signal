<template>
  <div class="light metric page" style="min-height: 100vh;">
    
    <!-- SUS Info Dialog -->
    <v-dialog v-model="susDialog" :fullscreen="breakpoint === 'xs'">
      <v-card tile flat>
        <v-card-title primary-title class="hildaLight space-small">
          About System Usability Scores
          <v-spacer></v-spacer>
            <v-btn color="primary"
                   flat
                   @click="toggleSusDialog">
              <v-icon color="#4e4e4e">mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        
        <v-divider></v-divider>
        
        <v-card-text>
          <v-layout row wrap align-start justify-start>
            
            <v-flex xs12>
              <p class="hildaLight">What is the System Usability Scale (SUS)?</p>
              <p>The System Usability Scale (SUS) provides a “quick and dirty”, reliable tool for measuring usability. It consists of a 10 item questionnaire with five response options for respondents; from Strongly agree to Strongly disagree.  Originally created by John Brooke in 1986, it allows you to evaluate a wide variety of products and services, including hardware, software, mobile devices, websites and applications.</p>
            </v-flex>
            
            <v-divider></v-divider>
            
            <v-flex xs12 pb-3>
              <p class="hildaLight">Interpreting Scores</p>
              <div>
                <ul>
                  <li>Interpreting scoring can be complex. The participant’s scores for each question are converted to a new number, added together and then multiplied by 2.5 to convert the original scores of 0-40 to 0-100.  <b>Though the scores are 0-100, these are not percentages and should be considered only in terms of their percentile ranking.</b></li>
                  <li>Based on research, a SUS score above a 68 would be considered above average and anything below 68 is below average, however the best way to interpret your results involves “normalizing” the scores to produce a percentile ranking.</li>
                </ul>
              </div>
              
            </v-flex>
            
            <v-divider></v-divider>
  
            <v-flex xs12>
              <p class="hildaLight">Considerations when using a SUS</p>
              <p>If you are considering using a SUS, keep the following in mind:</p>
              <div>
                <ul>
                  <li>The scoring system is somewhat complex</li>
                  <li>There is a temptation, when you look at the scores, since they are on a scale of 0-100, to interpret them as percentages, they are not</li>
                  <li>The best way to interpret your results involves “normalizing” the scores to produce a percentile ranking</li>
                  <li>SUS is not diagnostic - its use is in classifying the ease of use of the site, application or environment being tested</li>
                </ul>
              </div>
            </v-flex>
            
          </v-layout>
          
        </v-card-text>
      </v-card>
    </v-dialog>
    
    <!-- Application combobox -->
    <v-layout column justify-center align-center>
      <v-flex grow mt-2 style="width: 96%;">
        <v-combobox
                v-model="selectedApp"
                :items="applications"
                :loading="loading"
                color="info"
                clearable
                label="Select an application to see metrics for">
        </v-combobox>
      </v-flex>
    </v-layout>
    
    <!-- Metrics Section -->
    <v-layout xs12
              row
              wrap
              justify-start
              align-start
              :class=" $vuetify.breakpoint.smAndUp ? 'mx-3' : 'mx-0'">
  
      <v-flex xs12>
        <transition name="auth-animation"
                    mode="out-in"
                    enter-active-class="animated faster fadeInLeft"
                    leave-active-class="animated faster fadeOut">
          <v-card :color="accent"
                  :class="$vuetify.breakpoint.smAndUp ? 'space-small' : 'my-1'"
                  class="dashCard"
                  v-if="selectedApp.length > 0">
    
            <v-card-title primary-title class="space-small hildaLight ml-2 pa-2">
      
              <v-layout row justify-space-between align-center>
        
                <v-flex shrink>
                  System Usability Score
                </v-flex>
        
                <v-flex shrink>
          
                  <v-combobox dense
                              height="20"
                              style="z-index: 99;"
                              color="info"
                              v-model="selectedChartType"
                              :items="chartTypes"
                              label="Chart Type">
                  </v-combobox>
        
                </v-flex>
      
              </v-layout>
    
            </v-card-title>
    
            <v-card-text :class="$vuetify.breakpoint.smAndUp ? 'mx-auto' : 'mx-0 px-0'">
      
              <v-layout :class="$vuetify.breakpoint.smAndUp ? 'row' : 'column'" wrap>
        
                <v-flex shrink
                        :class="$vuetify.breakpoint.smAndUp ? 'align-self-center mx-3' : 'mb-4'">
          
                  <div>
                    <v-tooltip right class="menuIcon">
                      <v-btn icon small name="help" @click="toggleSusDialog" slot="activator"><v-icon color="#b1b3b4">help</v-icon></v-btn>
                      <span>About your score</span>
                    </v-tooltip>
                  </div>
          
                  <circle-card :menuItems="menuItems"
                               title="System Usability Score"
                               :value="sus"
                               :color="color">
                  </circle-card>
        
                </v-flex>
        
                <v-flex grow>
          
                  <chart ref="chart"
                         :type="selectedChartType"
                         :options="areaOptions"
                         :series="areaSeries">
                  </chart>
        
                </v-flex>
      
              </v-layout>
    
            </v-card-text>
  
          </v-card>
        </transition>
      </v-flex>
      
      <!-- SUS By Role -->
      <v-flex xs12>
        <transition name="auth-animation"
                    mode="out-in"
                    enter-active-class="animated faster fadeInDown delay-1s"
                    leave-active-class="animated faster fadeOutUp">
          <v-card :color="accent"
                  :class="$vuetify.breakpoint.smAndUp ? 'space-small' : 'my-1'"
                  class="dashCard"
                  v-if="selectedApp.length > 0">
            <v-card-title primary-title class="space-small hildaLight ml-2 pa-2">
      
              <v-layout row justify-space-between align-center>
        
                <v-flex shrink>
                  System Usability Score by User Role
                </v-flex>
        
                <v-flex shrink>
          
                  <v-combobox dense
                              height="20"
                              style="z-index: 99;"
                              color="info"
                              v-model="susByRoleChartType"
                              :items="chartTypes"
                              label="Chart Type">
                  </v-combobox>
        
                </v-flex>
      
              </v-layout>
    
            </v-card-title>
    
            <v-flex xs12 class="pt-2">
              <chart ref="chart"
                     :type="susByRoleChartType"
                     :options="susByRoleOptions"
                     :series="susByRoleData">
              </chart>
            </v-flex>
          </v-card>
        </transition>
      </v-flex>
      
      <!-- User Feedback -->
      <v-flex xs12>
        <transition name="auth-animation"
                    mode="out-in"
                    enter-active-class="animated faster fadeInLeft delay-2s"
                    leave-active-class="animated faster fadeOutUp">
          <v-card :color="accent"
                  :class="$vuetify.breakpoint.smAndUp ? 'space-small' : 'my-1'"
                  class="dashCard"
                  style="max-height: 600px; overflow-y: scroll;"
                  v-if="selectedApp.length > 0">
            <v-card-title primary-title class="hildaLight">
              User Feedback
            </v-card-title>
            <v-card-text v-if="avgRating !== null">
              <span class="space-small">Average Rating:</span><v-rating v-model="avgRating" half-increments readonly color="#f2c618" :background-color="accentDark" medium></v-rating>
            </v-card-text>
            <v-card-text>
              <v-card color="#f2f2f2"
                      v-for="(item, index) in susOverTimeData"
                      :key="index"
                      elevation="0"
                      style="border-bottom: 1px solid #242424;"
                      class="mb-2"
                      v-if="item.role && item.name">
                <v-card-title class="pb-0 pl-2" v-if="item.rating">
                  <v-rating v-model="item.rating" readonly color="#f2c618" :background-color="accentDark" medium></v-rating>
                </v-card-title>
                <v-card-text class="pt-1" v-if="item.name && item.role && item.dateSubmitted">
                  <v-layout column>
                    <v-flex xs12>
                      <div class="hildaLight"><v-icon>account_circle</v-icon> {{ item.name }}, {{ item.role }}</div>
                    </v-flex>
                    <div class="ml-4 pl-1">
                      <v-flex xs12>
                        Submitted on: {{ convertDate(item.dateSubmitted) }}
                      </v-flex>
                      <v-flex xs12 class="mt-3" v-if="item.remarks && item.remarks.length > 0">
                        <div style="font-size: 1.25em;">Remarks</div>
                        <em style="font-size: 1.1em;">"{{ item.remarks }}"</em>
                      </v-flex>
                      <v-flex xs12 class="mt-3" v-if="item.suggestion && item.suggestion.length > 0">
                        <div style="font-size: 1.25em;">Suggestions</div>
                        <em style="font-size: 1.1em;">"{{ item.suggestion }}"</em>
                      </v-flex>
                    </div>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-card-text>
          </v-card>
        </transition>
      </v-flex>
    </v-layout>
    
  </div>
</template>

<script>
// @ is an alias to /src
import Chart from "../components/Chart";
import { themeMixin } from "../mixins/themeMixin.js";
import MenuBtn from "../components/MenuBtn";
import axios from "axios";
import CircleCard from "../components/CircleCard";

export default {
  name: "metrics",
  mixins: [themeMixin],
  components: {
    MenuBtn,
    Chart,
    CircleCard
  },
  computed: {
    app: {
      get: function() {
        return this.$store.getters.app;
      },
      set: function() {
        this.$store.commit("app");
      }
    },
    color: function() {
      return this.sus >= 68
        ? `success ${this.darken}`
        : this.sus >= 60
          ? `warning ${this.darken}`
          : `error ${this.darken}`;
    }
  },
  data: () => ({
    accent: "#f2f2f2",
    accentDark: "#242424",
    applications: [],
    avgRating: null,
    loading: false,
    selectedApp: "",
    sus: 0,
    susDialog: false,
    metrics: {
      appName: "",
      overallSus: "",
      submissions: [],
      labels: [],
      values: []
    },
    susOverTimeData: [{ data: [] }],
    susByRoleChartType: "heatmap",
    susByRoleOptions: {
      colors: [
        "#0084F0",
        "#8E45B0",
        "#288964",
        "#E66E19",
        "#DCAF00",
        "#DC2D37"
      ],
      dataLabels: {
        enabled: true,
        horizontal: true,
        position: "right"
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        title: {
          text: "Number of Submissions"
        }
      },
      yaxis: {
        title: {
          text: "System Usability Score"
        }
      },
      tooltip: {
        x: {
          format: "dd/MM/yy"
        },
        y: {
          formatter: undefined,
          title: {
            formatter: () => "SUS"
          }
        }
      }
    },
    susByRoleData: [{ name: "", data: [] }],
    susByRoleDataBackup: [{ data: [] }],
    areaOptions: {
      colors: ["#0084F0"],
      dataLabels: {
        enabled: true,
        position: "right"
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        title: {
          text: "Submission date"
        },
        type: "datetime"
      },
      yaxis: {
        title: {
          text: "System Usability Score"
        }
      },
      tooltip: {
        x: {
          format: "dd/MM/yy"
        },
        y: {
          formatter: undefined,
          title: {
            formatter: () => "SUS"
          }
        }
      }
    },
    areaSeries: [{ data: [] }],
    selectedChartType: "line",
    chartTypes: [
      "line",
      "area",
      // "bar",
      // "histogram",
      // "pie",
      // "donut",
      // "radialBar",
      "scatter",
      // "bubble",
      "heatmap"
    ],
    menuItems: [
      { title: "Some Action 1" },
      { title: "Some Action 2" },
      { title: "Some Action 3" },
      { title: "Some Action 4" }
    ]
  }),
  beforeDestroy() {},
  created() {
    this.breakpoint = this.$vuetify.breakpoint.name;
  },
  mounted() {
    this.getApplications();
  },
  methods: {
    convertDate: function(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    },
    getSus: function() {
      const route = `${this.selectedApp}/sus`,
        _this = this;
      this.makeRequest(route)
        .then(response => {
          _this.sus = response.data.sus;
        })
        .catch(err => {
          return err;
        });
    },
    getSusOverTime: function() {
      const route = `${this.selectedApp}/susByDate`,
        _this = this;
      this.makeRequest(route)
        .then(response => {
          response.data[0].submissions.forEach(elem => {
            /*_this.metrics.labels.push(
              _this.convertDate(Date.parse(elem.dateSubmitted))
            );
            _this.metrics.values.push(elem.sus);*/

            _this.areaSeries[0].data.push([
              Date.parse(elem.dateSubmitted),
              elem.sus
            ]);
          });
        })
        .catch(err => {
          return err;
        });
    },
    getApplications: function() {
      this.toggleLoadingState();

      const route = "applications",
        _this = this;
      this.makeRequest(route)
        .then(response => {
          _this.applications = response.data;
          _this.toggleLoadingState();
        })
        .catch(err => {
          return err;
        });
    },
    getOverallRating: function() {
      const route = `${this.selectedApp}/rating`,
        _this = this;
      this.makeRequest(route)
        .then(response => {
          const data = response.data;
          if (data.overallRating !== null) {
            _this.avgRating = data.overallRating;
          }
        })
        .catch(err => {
          return err;
        });
    },
    getApplicationMetrics: function() {
      const route = this.selectedApp,
        _this = this;
      this.makeRequest(route)
        .then(response => {
          _this.susOverTimeData = response.data || [];

          for (let i = 0; i < response.data.length; i++) {
            let elem = response.data[i];
            if (!(elem.overallSus && elem.overallRating)) {
              if (!elem.remarks) {
                elem.remarks = elem.survey.remarks;
              }

              if (!elem.suggestion) {
                elem.suggestion = elem.survey.suggestion;
              }

              if (!elem.rating && elem.survey.rating) {
                elem.rating = elem.survey.rating;
              }
            }
          }
        })
        .catch(err => {
          return err;
        });
    },
    getApplicationMetricsPerRole: function() {
      const route = `${this.selectedApp}/role`,
        _this = this;
      this.makeRequest(route)
        .then(response => {
          response.data.map(elem => {
            if (elem._id && elem.avgSus) {
              _this.susByRoleData.push({ name: elem._id, data: elem.sus });
            }
          });
        })
        .catch(err => {
          return err;
        });
    },
    makeRequest: function(route) {
      const _this = this;
      const base = "https://sus-service.herokuapp.com/metrics";
      return new Promise((resolve, reject) => {
        axios
          .get(`${base}/${route}`)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            _this.$store.commit("alert", true);
            _this.$store.commit("alertColor", "#DC2D37");
            _this.$store.commit(
              "alertMessage",
              `Error retrieving metrics data, status code ${
                err.response.status
              }`
            );
            reject(err);
          });
      });
    },
    toggleSusDialog: function() {
      this.susDialog = !this.susDialog;
    },
    toggleLoadingState: function() {
      this.loading = !this.loading;
    }
  },
  watch: {
    selectedApp: function() {
      this.avgRating = null;
      this.areaSeries = [{ data: [] }];
      this.susOverTimeData = [{ data: [] }];
      this.susByRoleData = [{ name: "", data: [] }];
      if (this.selectedApp.length > 0) {
        this.getSus();
        this.getOverallRating();
        this.getSusOverTime();
        this.getApplicationMetrics();
        this.getApplicationMetricsPerRole();
      }
    }
  }
};
</script>
