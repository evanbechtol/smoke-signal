<template>
  <v-container :class="$vuetify.breakpoint.name === 'xs' ? 'pa-0' : 'mt-5'">
    <v-layout
      row
      fill-height
      v-touch="{
        right: () => goBack()
      }"
    >
      <v-flex xs12>
        <v-card
          :dark="isDark"
          :color="`accent ${darken}`"
          :class="$vuetify.breakpoint.name === 'xs' ? 'mt-0' : 'mt-5'"
          :style="
            $vuetify.breakpoint.name === 'xs'
              ? 'z-index: 99'
              : 'z-index: default'
          "
        >
          <v-card-title
            primary-title
            class="bg hildaLight space-small dark-l0 ma-0"
          >
            <div v-if="selectedCord">
              <v-tooltip bottom v-if="$vuetify.breakpoint.name === 'xs'">
                <template #activator="data">
                  <v-btn
                    fab
                    outline
                    color="accent"
                    v-on="data.on"
                    dark
                    class="mb-2 mr-4"
                    @click="goBack"
                  >
                    <v-icon size="30">arrow_back</v-icon>
                  </v-btn>
                </template>
                <span>Go back</span>
              </v-tooltip>
              <span class="ml-3">{{ selectedCord.title }}</span>
              <v-spacer></v-spacer>
            </div>
            <div
              v-else
              style="z-index: 99; width: 100%;"
              class="text-xs-center"
            >
              <p>Please wait! Loading Data</p>
              <v-progress-linear
                :indeterminate="true"
                color="primary"
              ></v-progress-linear>
            </div>
          </v-card-title>

          <v-card-text v-if="selectedCord">
            <v-container grid-list-md fluid>
              <v-layout wrap row>
                <v-flex xs12 sm6 d-flex>
                  <v-layout column justify-center>
                    <v-flex xs12 sm4>
                      <p class="mb-0">Rescuers</p>
                      <div class="mb-3">
                        <v-item-group multiple>
                          <v-item
                            v-for="(rescuer, index) in selectedCord.rescuers"
                            :key="`rescuer-${index}`"
                          >
                            <v-tooltip bottom offset-x>
                              <template #activator="data">
                                <v-chip
                                  v-on="data.on"
                                  :color="COLORS[index % 3]"
                                  dark
                                >
                                  <!--<v-avatar>
                                      <img
                                        src="https://randomuser.me/api/portraits/men/35.jpg"
                                        alt="Claudius"
                                      />
                                    </v-avatar>-->
                                  {{ getInitials(rescuer.username) }}
                                </v-chip>
                              </template>
                              <span>{{ rescuer.username }}</span>
                            </v-tooltip>
                          </v-item>
                          <!--
                            <v-item>
                              <v-chip
                                close
                                color="success"
                                dark
                                slot-scope="{ active, toggle }"
                                :selected="active"
                              >
                                <v-avatar>
                                  <img
                                    src="https://randomuser.me/api/portraits/women/31.jpg"
                                    alt="Fifi"
                                  />
                                </v-avatar>
                                Fifi Trixiebell
                              </v-chip>
                            </v-item>
    
                            <v-item>
                              <v-chip
                                close
                                color="purple"
                                dark
                                slot-scope="{ active, toggle }"
                                :selected="active"
                              >
                                <v-avatar>
                                  <img
                                    src="https://randomuser.me/api/portraits/women/5.jpg"
                                    alt="Gertrude"
                                  />
                                </v-avatar>
                                Gertrude Von Winkle
                              </v-chip>
                            </v-item>-->

                          <v-item>
                            <v-chip
                              @click="rescue"
                              outline
                              :color="isDark ? 'accent' : 'primary'"
                              :dark="isDark"
                              slot-scope="{ active, toggle }"
                              :selected="active"
                            >
                              <v-avatar>
                                <v-icon alt="add">add</v-icon>
                              </v-avatar>
                              I'll Rescue You!
                            </v-chip>
                          </v-item>
                        </v-item-group>
                      </div>
                      <v-divider></v-divider>
                    </v-flex>

                    <v-flex xs12 sm4>
                      <v-text-field
                        box
                        label="Cord Pulled By"
                        type="text"
                        v-model="selectedCord.puller.username"
                        readonly
                        color="info"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-text-field
                        box
                        label="Application"
                        type="text"
                        v-model="selectedCord.app"
                        readonly
                        color="info"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-text-field
                        box
                        label="Duration"
                        type="text"
                        :value="computeDuration(selectedCord.openedOn)"
                        readonly
                        color="info"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-text-field
                        box
                        label="Category"
                        type="text"
                        v-model="selectedCord.category"
                        readonly
                        color="info"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 sm6 align-self-center grow>
                  <v-layout fill-height column align-center justify-center>
                    <v-flex grow>
                      <div>
                        <v-img height="240" v-if="selectedCord.img"></v-img>
                        <v-img v-else height="240">
                          <v-icon size="240">image</v-icon>
                        </v-img>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12>
                  <v-textarea
                    color="info"
                    box
                    label="Issue Description"
                    v-model="selectedCord.description"
                  ></v-textarea>
                </v-flex>

                <v-flex xs12>
                  <div class="hildaLight space-small">
                    Discussion
                    <v-tooltip right v-if="!addingToDiscussion">
                      <template #activator="data">
                        <v-btn
                          icon
                          v-if="!addingToDiscussion"
                          color="success"
                          v-on="data.on"
                          @click="addingToDiscussion = !addingToDiscussion"
                        >
                          <v-icon>create</v-icon>
                        </v-btn>
                      </template>
                      <span>Add to discussion</span>
                    </v-tooltip>

                    <transition
                      name="auth-animation"
                      mode="out-in"
                      enter-active-class="animated faster fadeIn"
                    >
                      <v-layout column fill-height v-if="addingToDiscussion">
                        <v-flex xs12>
                          <v-textarea
                            v-model="discussion"
                            box
                            counter
                            hint="Must be at least 10 characters"
                          ></v-textarea>
                        </v-flex>
                        <v-flex xs12>
                          <v-layout row wrap fill-height>
                            <v-flex xs12 sm2>
                              <v-btn
                                color="error"
                                class="mb-4"
                                @click="addingToDiscussion = false"
                                :block="$vuetify.breakpoint.name === 'xs'"
                              >
                                <v-icon size="20" class="mr-2">close</v-icon
                                >Cancel
                              </v-btn>
                            </v-flex>
                            <v-flex xs12 sm1>
                              <v-btn
                                @click="updateDiscussion"
                                :disabled="
                                  !addingToDiscussion || discussion.length < 10
                                "
                                :outline="
                                  !addingToDiscussion || discussion.length < 10
                                "
                                color="info"
                                class="mb-4"
                                :block="$vuetify.breakpoint.name === 'xs'"
                              >
                                <v-icon size="20" class="mr-2">create</v-icon
                                >Submit Discussion
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </transition>
                  </div>

                  <v-divider></v-divider>

                  <v-timeline
                    align-top
                    dense
                    v-if="selectedCord.discussion.length > 0"
                  >
                    <v-timeline-item
                      color="pink"
                      small
                      v-for="(content, index) in selectedCord.discussion"
                      :key="`discussion-${index}`"
                    >
                      <v-avatar slot="icon" size="40">
                        <!--<img
                                  src="https://randomuser.me/api/portraits/women/31.jpg"
                                  alt="Fifi"
                          />-->
                        <v-tooltip bottom offset-x>
                          <template #activator="data">
                            <v-chip
                              v-on="data.on"
                              :color="COLORS[index % 3]"
                              dark
                            >
                              <!--<v-avatar>
                                  <img
                                    src="https://randomuser.me/api/portraits/men/35.jpg"
                                    alt="Claudius"
                                  />
                                </v-avatar>-->
                              {{ getInitials(content.user.username) }}
                            </v-chip>
                          </template>
                          <span>{{ content.user.username }}</span>
                        </v-tooltip>
                      </v-avatar>
                      <v-layout pt-3 wrap row fill-height>
                        <v-flex xs12 sm2>
                          <strong>
                            <!--eslint-disable-next-line-->
                              {{ convertStringToDate(content.time).toLocaleDateString("en-us") }} -
                            <!--eslint-disable-next-line-->
                              {{ convertStringToDate(content.time).toLocaleTimeString("en-us") }}
                          </strong>
                        </v-flex>
                        <v-flex grow>
                          <p>{{ content.data }}</p>
                        </v-flex>
                      </v-layout>
                    </v-timeline-item>
                  </v-timeline>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="selectedCord">
            <!--<v-btn color="blue darken-1" flat @click="cancel">Cancel</v-btn>-->
            <v-btn
              :block="$vuetify.breakpoint.name === 'xs'"
              color="blue darken-1"
              depressed
              dark
              @click="save"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { assetMixin } from "../mixins/assetMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin";

export default {
  name: "SelectedCord",
  mixins: [themeMixin, assetMixin, cordMixin, alertMixin],
  components: {},
  computed: {},
  data: function() {
    return {
      addingToDiscussion: false,
      discussion: ""
    };
  },
  created() {
    if (!this.selectedCord) {
      this.getCordById(this.id)
        .then(response => {
          const cord = response.data.data;
          this.$store.commit("selectedCord", cord);
          this.$router.push({ path: `/cord/${cord._id}`, props: cord });
        })
        .catch(err => {
          this.setAlert(err.message, "#DC2D37", 0);
        });
    }
  },
  methods: {
    cancel() {
      this.$emit("cancelItemEdit");
    },
    computeDuration(date) {
      const now = new Date();
      const openedOn = new Date(date);
      return msToTime(parseInt((now - openedOn) / 24));
    },
    convertStringToDate(item) {
      return new Date(item);
    },
    getInitials(item) {
      return item && typeof item === "string"
        ? item.slice(0, 2).toLocaleUpperCase()
        : "";
    },
    goBack() {
      window.history.back();
    },
    rescue() {
      const data = { rescuers: [{ id: 3, username: "epaulam" }] };
      this.updateRescuers(this.selectedCord._id, data)
        .then(response => {
          this.setAlert("Cord updated successfully!", "#288964", 5);
          this.selectedCord = response.data.data;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    save() {
      this.updateCord(this.selectedCord._id, this.selectedCord)
        .then(response => {
          this.setAlert("Cord updated successfully!", "#288964", 5);
          response.data.data.discussion.forEach(function(elem) {
            return convertStringToDate(elem);
          });
          this.selectedCord = response.data.data;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    updateDiscussion() {
      this.selectedCord.discussion.push({
        time: new Date().toISOString(),

        // Todo: This needs to be the authenticated user
        user: { id: 1, username: "eevabec" },
        data: this.discussion
      });

      this.save();
    }
  },
  props: ["id"],
  watch: {
    addingToDiscussion: function() {
      if (this.addingToDiscussion === false) {
        this.discussion = "";
      }
    }
  }
};

function convertStringToDate(item) {
  return new Date(item);
}

function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
</script>

<style scoped></style>
