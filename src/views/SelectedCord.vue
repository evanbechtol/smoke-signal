<template>
  <v-container :class="isSmall ? 'pa-0' : 'mt-5'">
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
          :class="isSmall ? 'mt-0' : 'mt-5'"
          :style="isSmall ? 'z-index: 99' : 'z-index: default'"
        >
          <v-card-title
            primary-title
            class="bg hildaLight space-small dark-l0 ma-0"
          >
            <div v-if="selectedCord && !loading">
              <v-tooltip bottom v-if="isSmall">
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
                            class="animated faster fadeIn"
                            :key="`rescuer-${index}`"
                          >
                            <v-tooltip bottom offset-x>
                              <template #activator="data">
                                <v-chip
                                  v-on="data.on"
                                  :close="canRemoveRescuer(rescuer)"
                                  :color="COLORS[index % 3]"
                                  @input="removeRescuer(rescuer)"
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
                              <span>{{
                                canRemoveRescuer(rescuer)
                                  ? "Stop rescuing?"
                                  : rescuer.username
                              }}</span>
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

                          <v-item class="pulse" v-if="showRescueButton">
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
                        label="Status"
                        type="text"
                        v-model="selectedCord.status"
                        readonly
                        dark
                        :background-color="!isResolved ? 'success' : 'purple'"
                        color="primary"
                      ></v-text-field>
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
                        :box="readonly.app"
                        :outline="!readonly.app"
                        label="Application"
                        type="text"
                        v-model="selectedCord.app"
                        :readonly="readonly.app"
                        color="info"
                        @change="appChanged"
                      >
                        <v-tooltip
                          bottom
                          offset-y
                          slot="append"
                          v-if="isMine && !isResolved"
                        >
                          <template #activator="data">
                            <v-icon
                              v-on="data.on"
                              :disabled="isResolved"
                              @click="readonly.app = !readonly.app"
                              >{{ readonly.app ? "edit" : "save" }}
                            </v-icon>
                          </template>
                          <span>Click to edit</span>
                        </v-tooltip>
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-text-field
                        box
                        :label="isResolved ? 'Opened On' : 'Duration'"
                        type="text"
                        :value="
                          isResolved
                            ? new Date(
                                selectedCord.openedOn
                              ).toLocaleDateString('en-US')
                            : computeDuration(selectedCord.openedOn)
                        "
                        readonly
                        :background-color="
                          isResolved
                            ? ''
                            : computeDurationBg(selectedCord.openedOn)
                        "
                        :dark="selectedCord.status !== 'Resolved'"
                        color="primary"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-text-field
                        :box="readonly.category"
                        :outline="!readonly.category"
                        label="Category"
                        type="text"
                        v-model="selectedCord.category"
                        :readonly="readonly.category"
                        color="info"
                        @change="categoryChanged"
                      >
                        <v-tooltip
                          bottom
                          offset-y
                          slot="append"
                          v-if="isMine && !isResolved"
                        >
                          <template #activator="data">
                            <v-icon
                              v-on="data.on"
                              :disabled="isResolved"
                              @click="readonly.category = !readonly.category"
                              >{{ readonly.category ? "edit" : "save" }}
                            </v-icon>
                          </template>
                          <span>Click to edit</span>
                        </v-tooltip>
                      </v-text-field>
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
                    :box="readonly.description"
                    :outline="!readonly.description"
                    label="Issue Description"
                    :readonly="readonly.description"
                    v-model="selectedCord.description"
                    @change="descriptionChanged"
                  >
                    <v-tooltip
                      bottom
                      offset-y
                      slot="append"
                      v-if="isMine && !isResolved"
                    >
                      <template #activator="data">
                        <v-icon
                          v-on="data.on"
                          :disabled="isResolved"
                          @click="readonly.description = !readonly.description"
                          >{{ readonly.description ? "edit" : "save" }}
                        </v-icon>
                      </template>
                      <span>Click to edit</span>
                    </v-tooltip>
                  </v-textarea>
                </v-flex>

                <v-flex xs12>
                  <v-flex xs12>
                    <v-combobox
                      v-model="selectedCord.tags"
                      :items="selectedCord.tags"
                      :color="`info ${darken}`"
                      :dark="isDark"
                      :readonly="readonly.tags"
                      hide-selected
                      hint="Add some tags/keywords"
                      label="Tags"
                      box
                      multiple
                      persistent-hint
                      small-chips
                    >
                      <v-tooltip
                        bottom
                        offset-y
                        slot="append"
                        v-if="isMine && !isResolved"
                      >
                        <template #activator="data">
                          <v-icon
                            v-on="data.on"
                            :disabled="isResolved"
                            @click="readonly.tags = !readonly.tags"
                            >{{ readonly.tags ? "edit" : "save" }}
                          </v-icon>
                        </template>
                        <span>Click to edit</span>
                      </v-tooltip>
                      <template
                        slot="selection"
                        slot-scope="{ item, parent, selected }"
                      >
                        <v-chip color="info" :selected="selected" label small>
                          <span class="pr-2">
                            {{ item }}
                          </span>
                          <v-icon
                            small
                            @click="parent.selectItem(item)"
                            v-if="!readonly.tags"
                          >
                            close
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-combobox>
                  </v-flex>
                </v-flex>

                <v-flex xs12>
                  <div class="hildaLight space-small">
                    Discussion
                    <v-tooltip right v-if="!(addingToDiscussion || isResolved)">
                      <template #activator="data">
                        <v-btn
                          icon
                          v-if="!addingToDiscussion"
                          color="success"
                          v-on="data.on"
                          :disabled="isResolved"
                          @click="addingToDiscussion = !addingToDiscussion"
                        >
                          <v-icon>note_add</v-icon>
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
                                :block="isSmall"
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
                                :block="isSmall"
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

                  <div
                    style="max-height: 500px; overflow-y: auto; overflow-x: hidden;"
                  >
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
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions v-if="selectedCord && isMine && !isResolved">
            <v-tooltip right>
              <template #activator="data">
                <v-btn
                  v-on="data.on"
                  :block="isSmall"
                  color="purple darken-1"
                  :disabled="unpullDisabled"
                  depressed
                  dark
                  @click="confirmCloseDialog = true"
                  >Unpull Cord</v-btn
                >
              </template>
              <span>My blocker is resolved!</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog v-model="confirmCloseDialog" persistent :fullscreen="isSmall">
      <v-card :dark="isDark" :color="`accent ${darken}`">
        <v-card-title
          primary-title
          class="bg hildaLight space-small dark-l0 ma-0"
        >
          Are you sure?
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text>
          Are you sure that you want to un-pull this cord? By clicking
          <strong>"Proceed"</strong>, you agree that this blocker is now
          resolved. If this issue is still blocking you from completing a task,
          click <strong>"Go Back"</strong>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="error darken-1"
            depressed
            @click="confirmCloseDialog = false"
            :block="isSmall"
          >
            <v-icon class="mr-2">arrow_back</v-icon>Go Back
          </v-btn>

          <v-spacer v-if="$vuetify.breakpoint.name !== 'xs'"></v-spacer>

          <v-btn
            color="success darken-1"
            depressed
            @click="unpullCord"
            :block="isSmall"
          >
            Proceed<v-icon class="ml-2">check</v-icon></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { assetMixin } from "../mixins/assetMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin";
import { authMixin } from "../mixins/authMixin";
import { socketMixin } from "../mixins/socketMixin";

export default {
  name: "SelectedCord",
  mixins: [
    themeMixin,
    assetMixin,
    cordMixin,
    alertMixin,
    authMixin,
    socketMixin
  ],
  components: {},
  computed: {
    showRescueButton() {
      const user = this.user;
      return this.selectedCord &&
        this.selectedCord.status === "Open" &&
        this.selectedCord.rescuers
        ? this.selectedCord.rescuers.filter(function(elem) {
            return elem.username === user.username;
          }).length === 0
        : false;
    },
    unpullDisabled() {
      return !(
        this.user.username === this.selectedCord.puller.username &&
        this.user._id === this.selectedCord.puller._id &&
        this.selectedCord.status === "Open"
      );
    },
    isResolved: function() {
      return this.selectedCord.status === "Resolved";
    },
    isMine: function() {
      return this.selectedCord.puller.username === this.user.username;
    }
  },
  data: function() {
    return {
      addingToDiscussion: false,
      confirmCloseDialog: false,
      discussion: "",
      loading: false,
      readonly: {
        app: true,
        category: true,
        description: true,
        tags: true
      }
    };
  },
  created() {
    if (!this.selectedCord) {
      this.loading = true;
      this.getCordById(this.id)
        .then(response => {
          const cord = response.data.data;
          this.$store.commit("selectedCord", cord);
          this.joinSelectedCordRoom(cord._id);
          this.loading = false;
        })
        .catch(err => {
          this.setAlert(err.message, "#DC2D37", 0);
          this.loading = false;
        });
    }
  },
  methods: {
    appChanged() {
      if (this.readonly.app) {
        this.save();
      }
    },
    categoryChanged() {
      if (this.readonly.category) {
        this.save();
      }
    },
    descriptionChanged() {
      if (this.readonly.description) {
        this.save();
      }
    },
    canRemoveRescuer(rescuer) {
      return (
        this.selectedCord.status === "Open" &&
        rescuer.username === this.user.username
      );
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
    removeRescuer(rescuer) {
      // eslint-disable-next-line
      this.selectedCord.rescuers = this.selectedCord.rescuers.filter(function(elem) {
        return elem.username !== rescuer.username;
      });

      this.save();
    },
    rescue() {
      const data = {
        rescuers: [{ _id: this.user._id, username: this.user.username }]
      };
      this.updateRescuers(this.selectedCord._id, data)
        .then(() => {
          this.setAlert("Cord updated successfully!", "#288964", 5000);
          this.refreshItem(this.selectedCord._id);
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    save() {
      this.updateCord(this.selectedCord._id, this.selectedCord)
        .then(response => {
          this.setAlert("Cord updated successfully!", "#288964", 5000);
          response.data.data.discussion.forEach(function(elem) {
            return convertStringToDate(elem);
          });
          this.refreshItem(this.selectedCord._id);
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    unpullCord() {
      this.selectedCord.status = "Resolved";
      this.save();
      this.confirmCloseDialog = false;
    },
    updateDiscussion() {
      this.selectedCord.discussion.push({
        time: new Date().toISOString(),
        user: { _id: this.user._id, username: this.user.username },
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
    },
    "selectedCord.tags": {
      handler: function(after, before) {
        if (after.length !== before.length) {
          this.save();
        }
      }
    }
  }
};

function convertStringToDate(item) {
  return new Date(item);
}
</script>

<style scoped>
.pulse:hover {
  animation: pulse 1s infinite;
}
</style>
