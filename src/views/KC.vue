<template>
  <div style="height: 100vh;">

    <v-layout fill-height row>
      <!-- Information Selection Drawer -->
      <v-flex shrink>
        <v-navigation-drawer v-model="drawer" permanent class="nav" style="border-right: 1px solid rgba(118, 118, 188, 0.4)">

          <v-list class="mt-4" two-line>
            <!-- Search Selection -->
            <v-list-tile active-class="info" class="pl-3 pt-0 animated fast slideInDown">
              <v-list-tile-content>
                <v-combobox v-model="selectedSearch"
                            class="overflow-y-hidden overflow-x-hidden"
                            :items="search"
                            :loading="loading"
                            append-icon="search"
                            hint="Search using keywords; app, issue, etc."
                            color="info"
                            :filter="searchData"
                            clearable
                            label="Search">
                    <template slot="selection" slot-scope="{ item, index }">
                      <p class="ma-0 pa-0" v-if="item && item.tool">{{item.tool}}: &nbsp;&nbsp; {{item.issue}}</p>
                      <p v-else></p>
                    </template>
                    <template slot="item" slot-scope="{ item, index }">
                        <div class="animated faster fadeIn">
                          <small><strong>{{item.tool}}: &nbsp;&nbsp;</strong></small>
                          <small>{{item.issue}}</small>
                        </div>
                    </template>
                </v-combobox>
              </v-list-tile-content>
            </v-list-tile>

            <v-divider></v-divider>

            <!-- Application Selection -->
            <v-list-tile active-class="info" class="pl-3 pt-0 mt-4 animated faster slideInLeft">
              <v-list-tile-content>
                <v-combobox v-model="selectedApp"
                            :items="applications"
                            :loading="loading"
                            color="info"
                            clearable
                            label="Application">
                </v-combobox>
              </v-list-tile-content>
            </v-list-tile>

            <!-- Category Selection -->
            <v-list-tile active-class="info" class="mt-4 pl-3 pt-0 animated faster slideInLeft">
              <v-list-tile-content>
                <v-combobox v-model="selectedCategory"
                            :disabled="!selectedApp || selectedApp.length === 0"
                            :items="categories"
                            :loading="loading"
                            color="info"
                            clearable
                            label="Category">
                </v-combobox>
              </v-list-tile-content>
            </v-list-tile>

            <!-- Sub Category Selection -->
            <v-list-tile active-class="info" class="mt-4 pl-3 pt-0 animated faster slideInLeft">
              <v-list-tile-content>
                <v-combobox v-model="selectedSubCategory"
                            :disabled="!selectedCategory || selectedCategory.length === 0"
                            :items="subCategories"
                            :loading="loading"
                            color="info"
                            clearable
                            label="Sub category">
                </v-combobox>
              </v-list-tile-content>
            </v-list-tile>

            <!-- Issue Selection -->
            <v-list-tile active-class="info" class="mt-4 pl-3 pt-0 animated faster slideInLeft" style="height: 80px;">
              <v-list-tile-content>
                <v-combobox v-model="selectedIssue"
                            :disabled="!selectedSubCategory || selectedSubCategory.length === 0"
                            :items="issues"
                            :loading="loading"
                            color="info"
                            clearable
                            label="Issue">
                </v-combobox>
              </v-list-tile-content>
            </v-list-tile>

            <!-- Update Content -->
            <v-list-tile active-class="info" class="mt-4 mx-3 pt-0 animated fast slideInUp">
              <v-list-tile-content>
                <v-btn name="open submission dialog"
                       color="info"
                       block
                       @click="toggleDialog">
                  <v-icon class="pr-2">add</v-icon>
                  Submit Content
                </v-btn>
              </v-list-tile-content>
            </v-list-tile>

          </v-list>

        </v-navigation-drawer>
      </v-flex>

      <!-- Results -->
      <v-flex xs12 mx-3>

        <v-layout fill-height row align-center justify-center wrap>
          <!-- Placeholder -->
          <transition name="auth-animation"
                      mode="out-in"
                      enter-active-class="animated faster fadeIn delay-1s"
                      leave-active-class="animated faster fadeOutUp">
            <v-flex xs12 v-if="!selectedIssue" mt-3 mb-3 text-xs-center>
              <p class="hildaLight">Use the menu on the left to start searching!</p>
            </v-flex>
          </transition>

          <!-- Docs -->
          <transition name="auth-animation"
                      mode="out-in"
                      enter-active-class="animated faster slideInRight delay-1s"
                      leave-active-class="animated faster slideOutRight">
            <v-flex xs12 v-if="docs && docs.length > 0" mt-3 mb-3>
              <v-card>
                <v-card-title primary-title class="hildaLight space-small ma-0 darkCard">Related Documentation</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-btn :disabled="!docs"
                         name="download document"
                         color="info"
                         :href="docs"
                         target="_blank">
                    <v-icon class="pr-2">cloud_download</v-icon>
                    Download Document
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-flex>
          </transition>

          <!-- Script -->
          <transition name="auth-animation"
                      mode="out-in"
                      enter-active-class="animated faster slideInRight delay-1s"
                      leave-active-class="animated faster slideOutRight">
            <v-flex xs12 v-if="script && script.length > 0" mb-3 mt-3>
              <v-card>
                <v-card-title primary-title class="hildaLight space-small ma-0 darkCard">Script</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-textarea v-model="script"
                              id="script"
                              flat
                              auto-grow
                              color="info">
                  </v-textarea>

                  <v-divider></v-divider>

                  <v-btn :disabled="!script"
                         name="download document"
                         color="info"
                         class="mt-3"
                         :href="`mailto:someone@example.com?Subject=AnA Support Reply&Body=${encodeURIComponent(script)}`">
                    <v-icon class="pr-2">email</v-icon>
                    Send Email
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-flex>
          </transition>

          <!-- Work Instructions -->
          <transition name="auth-animation"
                      mode="out-in"
                      enter-active-class="animated faster slideInRight delay-1s"
                      leave-active-class="animated faster slideOutRight">
            <v-flex xs12 v-if="workInstructions && workInstructions.length > 0">
              <v-card>
                <v-card-title primary-title class="hildaLight space-small ma-0 darkCard">Work Instructions</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-textarea v-model="workInstructions"
                              flat
                              auto-grow
                              readonly
                              color="info">
                  </v-textarea>
                </v-card-text>
              </v-card>
            </v-flex>
          </transition>

        </v-layout>

      </v-flex>

    </v-layout>

    <!-- Submit Dialog -->
    <submit-dialog></submit-dialog>

  </div>
</template>

<script>
import axios from "axios";
import { alertMixin } from "../mixins/alertMixin";
import SubmitDialog from "../components/SubmitDialog";

export default {
  name: "KC",
  components: { SubmitDialog },
  computed: {
    kc: {
      get: function() {
        return this.$store.getters.kc;
      },
      set: function() {
        this.$store.commit("kc");
      }
    }
  },
  data: () => ({
    drawer: null,
    loading: false,
    applications: [],
    categories: [],
    subCategories: [],
    issues: [],
    script: "",
    workInstructions: "",
    docs: "",
    search: [],
    selectedSearch: null,
    selectedApp: "",
    selectedCategory: "",
    selectedSubCategory: "",
    selectedIssue: ""
  }),
  mounted: function() {
    this.getApplications();
    this.getSearch();
  },
  mixins: [alertMixin],
  methods: {
    searchData: function(item, queryText) {
      const qt = queryText.toLowerCase();
      return (
        item &&
        ((item.tool && item.tool.toLowerCase().includes(qt)) ||
          (item.category && item.category.toLowerCase().includes(qt)) ||
          (item.subCategory && item.sub_category.toLowerCase().includes(qt)) ||
          (item.issue && item.issue.toLowerCase().includes(qt)))
      );
    },
    getApplications: function() {
      const route = "dbquery.php";
      const params = new URLSearchParams();
      params.append("tools", "true");

      this.makeRequest(route, params)
        .then(response => {
          this.applications = response.data.sort();
        })
        .catch(err => {
          return err;
        });
    },
    getCategories: function() {
      const route = "dbquery.php";
      const params = new URLSearchParams();
      params.append("table", this.selectedApp);
      params.append("tool", this.selectedApp);

      this.makeRequest(route, params)
        .then(response => {
          this.categories = response.data.sort();
        })
        .catch(err => {
          return err;
        });
    },
    getSearch: function() {
      const route = "search.php";
      const params = new URLSearchParams();
      params.append("search", "true");

      this.makeRequest(route, params)
        .then(response => {
          this.search = response.data.sort();
        })
        .catch(err => {
          return err;
        });
    },
    getSubCategories: function() {
      const route = "dbquery.php";
      const params = new URLSearchParams();
      params.append("table", this.selectedApp);
      params.append("tool", this.selectedApp);
      params.append("category", this.selectedCategory);

      this.makeRequest(route, params)
        .then(response => {
          this.subCategories = response.data.sort();
        })
        .catch(err => {
          return err;
        });
    },
    getIssues: function() {
      const route = "dbquery.php";
      const params = new URLSearchParams();
      params.append("table", this.selectedApp);
      params.append("tool", this.selectedApp);
      params.append("category", this.selectedCategory);
      params.append("sub_category", this.selectedSubCategory);

      this.makeRequest(route, params)
        .then(response => {
          this.issues = response.data.sort();
        })
        .catch(err => {
          return err;
        });
    },
    getResults: function() {
      const route = "dbquery.php";
      const params = new URLSearchParams();
      params.append("table", this.selectedApp);
      params.append("tool", this.selectedApp);
      params.append("category", this.selectedCategory);
      params.append("sub_category", this.selectedSubCategory);
      params.append("issue", this.selectedIssue);

      this.makeRequest(route, params)
        .then(response => {
          this.script = response.data[0] || "";
          params.append("flag", "true");
          return this.makeRequest(route, params);
        })
        .then(response => {
          this.workInstructions = response.data[0] || "";
          params.delete("flag");
          params.append("doc", "true");
          return this.makeRequest(route, params);
        })
        .then(response => {
          this.docs = response.data[0] || "";
        })
        .catch(err => {
          return err;
        });
    },
    makeRequest: function(route, params) {
      const base = "http://138.85.123.229/php";
      const _this = this;

      return new Promise((resolve, reject) => {
        axios
          .post(`${base}/${route}`, params)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            _this.setAlert(
              `Error retrieving data, status code ${err.response.status}`,
              "#DC2D37",
              5000
            );
            reject(err);
          });
      });
    },
    toggleDialog: function() {
      this.$store.commit("submitDialog", true);
    }
  },
  watch: {
    selectedApp: function() {
      if (this.selectedApp && this.selectedApp.length > 0) {
        this.getCategories();
      } else {
        this.selectedCategory = "";
        this.selectedSubCategory = "";
        this.selectedIssue = "";
        this.categories = [];
        this.subCategories = [];
        this.issues = [];
      }
    },
    selectedCategory: function() {
      if (this.selectedCategory && this.selectedCategory.length > 0) {
        this.getSubCategories();
      } else {
        this.selectedSubCategory = "";
        this.selectedIssue = "";
        this.subCategories = [];
        this.issues = [];
      }
    },
    selectedSubCategory: function() {
      if (this.selectedSubCategory && this.selectedSubCategory.length > 0) {
        this.getIssues();
      } else {
        this.selectedIssue = "";
        this.issues = [];
      }
    },
    selectedIssue: function() {
      if (this.selectedIssue && this.selectedIssue.length > 0) {
        this.getResults();
      } else {
        this.docs = "";
        this.script = "";
        this.workInstructions = "";
      }
    },
    selectedSearch: {
      deep: true,
      handler: function() {
        if (
          this.selectedSearch &&
          this.selectedSearch.tool &&
          this.selectedSearch.category &&
          this.selectedSearch.sub_category &&
          this.selectedSearch.issue
        ) {
          this.selectedApp = this.selectedSearch.tool;
          this.selectedCategory = this.selectedSearch.category;
          this.selectedSubCategory = this.selectedSearch.sub_category;
          this.selectedIssue = this.selectedSearch.issue;
        }
      }
    }
  }
};
</script>

<style scoped>
.darkCard {
  background: var(--e-light-layer-0);
  color: var(--e-dark-text);
}
</style>
