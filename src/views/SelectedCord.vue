<template>
  <v-container fluid :class="isSmall ? 'pa-0' : 'mt-4'">
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
          <v-card-title primary-title class="hildaLight space-small ma-0">
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
                                  :color="genColor()"
                                  @input="removeRescuer(rescuer)"
                                  dark
                                >
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
                              I'll Be A Hero!
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
                        label="Needs Rescuing"
                        type="text"
                        v-model="selectedCord.puller.username"
                        readonly
                        color="info"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-combobox
                        :box="readonly"
                        :outline="!readonly"
                        label="Application"
                        type="text"
                        v-model="selectedCord.app"
                        color="info"
                        :items="appOptions"
                        @change="appChanged"
                      >
                      </v-combobox>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-text-field
                        box
                        :label="isResolved ? 'Resolved On' : 'Duration'"
                        type="text"
                        :value="
                          isResolved
                            ? new Date(
                                selectedCord.resolvedOn
                              ).toLocaleDateString('en-US')
                            : computeDuration(selectedCord.openedOn)
                        "
                        readonly
                        :background-color="
                          isResolved
                            ? ''
                            : computeDurationBg(selectedCord.openedOn)
                        "
                        :dark="!isResolved"
                        color="primary"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4>
                      <v-combobox
                        :box="readonly"
                        :outline="!readonly"
                        v-model="selectedCord.category"
                        :items="categoryList"
                        label="Category"
                        :readonly="readonly"
                        color="info"
                      >
                      </v-combobox>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12 sm6 align-self-center grow>
                  <transition
                    name="auth-animation"
                    mode="out-in"
                    enter-active-class="animated faster fadeIn"
                    leave-active-class="animated faster fadeOut"
                  >
                    <v-img
                      contain
                      v-if="readonly && files.length > 0"
                      max-height="700"
                      :src="
                        `${$apiBase}/uploads/${
                          this.selectedCord.files
                        }?appToken=${appToken}`
                      "
                    ></v-img>
                    <v-layout
                      v-else
                      fill-height
                      column
                      align-center
                      justify-center
                    >
                      <v-flex xs12 sm6 align-self-center grow>
                        <v-img v-if="readonly" height="240">
                          <v-icon size="240">image</v-icon>
                        </v-img>
                        <upload-file
                          v-else
                          v-on:fileAttached="setFile"
                        ></upload-file>
                      </v-flex>
                    </v-layout>
                  </transition>
                </v-flex>

                <v-flex xs12>
                  <div v-if="readonly" v-html="selectedCord.description"></div>
                  <v-textarea
                    v-if="!readonly"
                    color="info"
                    :box="readonly"
                    :outline="!readonly"
                    label="Issue Description"
                    :readonly="readonly"
                    v-model="selectedCord.description"
                    @change="descriptionChanged"
                  >
                  </v-textarea>
                  <v-divider></v-divider>
                </v-flex>

                <v-flex xs12>
                  <v-flex xs12>
                    <v-combobox
                      v-if="!readonly"
                      v-model="selectedCord.tags"
                      :items="selectedCord.tags"
                      :color="`info ${darken}`"
                      :dark="isDark"
                      :readonly="readonly"
                      hide-selected
                      hint="Add some tags/keywords"
                      label="Tags"
                      multiple
                      persistent-hint
                      small-chips
                    >
                      <template
                        slot="selection"
                        slot-scope="{ item, parent, selected }"
                      >
                        <v-chip
                          color="info"
                          :selected="selected"
                          :dark="!isDark"
                          label
                          small
                        >
                          <span class="pr-2">
                            {{ item }}
                          </span>
                          <v-icon
                            small
                            @click="parent.selectItem(item)"
                            v-if="!readonly"
                          >
                            close
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-combobox>

                    <v-layout
                      v-else
                      row
                      wrap
                      justify-start
                      align-center
                      fill-height
                    >
                      <v-flex
                        shrink
                        v-for="(item, index) in selectedCord.tags"
                        :key="`tag-${index}`"
                      >
                        <v-chip dark color="#a56ebe" label small>
                          <span class="pr-2">
                            {{ item }}
                          </span>
                          <v-icon small v-if="!readonly">
                            close
                          </v-icon>
                        </v-chip>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-flex>

                <v-flex xs12>
                  <div class="hildaLight space-small">
                    Discussion
                  </div>

                  <v-divider></v-divider>

                  <div
                    style="max-height: 1000px; overflow-y: auto; overflow-x: hidden;"
                  >
                    <v-timeline align-top dense v-if="shouldShowDiscussion">
                      <v-timeline-item
                        color="pink"
                        small
                        v-for="(content, index) in selectedCord.discussion"
                        :key="`discussion-${index}`"
                      >
                        <v-avatar slot="icon" size="40">
                          <v-tooltip bottom offset-x>
                            <template #activator="data">
                              <v-chip v-on="data.on" :color="genColor()" dark>
                                {{ getInitials(content.user.username) }}
                              </v-chip>
                            </template>
                            <span>{{ content.user.username }}</span
                            ><br />
                            <span>{{ content.user.email }}</span>
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
                            <p v-html="content.data"></p>
                          </v-flex>
                        </v-layout>
                        <!-- Thread Reply -->
                        <div class="comments_div">
                          <v-timeline
                            v-if="shouldShowComments"
                            class="pt-0"
                            align-top
                            dense
                          >
                            <v-timeline-item
                              v-for="(comment, cIndex) in content.comments"
                              :key="`discussion-${cIndex}`"
                              class="pb-0"
                              color="pink"
                              small
                            >
                              <v-avatar slot="icon" size="40">
                                <v-tooltip bottom offset-x>
                                  <template #activator="data">
                                    <v-chip
                                      :color="genColor()"
                                      dark
                                      v-on="data.on"
                                    >
                                      {{ getInitials(comment.user.username) }}
                                    </v-chip>
                                  </template>
                                  <span>{{ comment.user.username }}</span>
                                </v-tooltip>
                              </v-avatar>
                              <v-layout pt-3 wrap row fill-height>
                                <v-flex xs12 sm2>
                                  <strong>
                                    {{
                                      convertStringToDate(
                                        comment.time
                                      ).toLocaleDateString("en-us")
                                    }}
                                    -
                                    {{
                                      convertStringToDate(
                                        comment.time
                                      ).toLocaleTimeString("en-us")
                                    }}
                                  </strong>
                                </v-flex>
                                <v-flex grow>
                                  <p v-html="comment.data"></p>
                                </v-flex>
                              </v-layout>
                            </v-timeline-item>
                          </v-timeline>
                          <v-flex v-if="selectedIsOpen" grow>
                            <v-layout column fill-height>
                              <v-flex xs12 sm4>
                                <v-text-field
                                  v-model="comment[index]"
                                  class="mt-0"
                                  outline
                                  counter
                                  color="info"
                                  :append-icon="
                                    comment[index] && comment[index].length >= 2
                                      ? 'send'
                                      : undefined
                                  "
                                  hint="Must be at least 2 characters"
                                  placeholder="Reply..."
                                  @click:append="addReply(index)"
                                ></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </div>
                      </v-timeline-item>
                    </v-timeline>
                  </div>
                </v-flex>
                <v-flex grow v-if="selectedIsOpen">
                  <v-layout column fill-height>
                    <v-flex xs12 sm4>
                      <v-text-field
                        v-model="discussion"
                        outline
                        counter
                        color="info"
                        :append-icon="
                          discussion.length >= 10 ? 'send' : undefined
                        "
                        @click:append="updateDiscussion"
                        hint="Must be at least 10 characters"
                        placeholder="Start a discussion!!!"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
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

            <v-btn
              :class="isSmall ? 'ml-0' : 'ml-3'"
              :block="isSmall"
              :outline="readonly"
              :color="readonly ? 'info darken-1' : 'success darken-1'"
              :disabled="unpullDisabled"
              dark
              @click="readonly = !readonly"
            >
              {{ readonly ? "Edit Cord" : "Save Cord" }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="confirmCloseDialog"
      persistent
      :max-width="isSmall ? '100vh' : '500px'"
      :fullscreen="isSmall"
    >
      <v-card :dark="isDark" :color="`accent ${darken}`">
        <v-card-title primary-title class="hildaLight space-small ma-0">
          Are you sure?
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text>
          Are you sure that you want to un-pull this cord?<br /><br />
          By clicking <strong>"Proceed"</strong>, you agree that this blocker is
          now resolved. If this issue is still blocking you from completing a
          task, click <strong>"Go Back"</strong>
        </v-card-text>

        <v-card-actions>
          <v-spacer v-if="$vuetify.breakpoint.name !== 'xs'"></v-spacer>

          <v-btn
            outline
            depressed
            @click="confirmCloseDialog = false"
            :block="isSmall"
          >
            Go Back
          </v-btn>

          <v-btn
            color="info darken-1"
            depressed
            @click="unpullCord"
            :block="isSmall"
          >
            Proceed
          </v-btn>
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
import { appsMixin } from "../mixins/appsMixin";
import UploadFile from "../components/Upload.vue";
import { TimeService } from "../services/timeService";

export default {
  name: "SelectedCord",
  mixins: [
    themeMixin,
    assetMixin,
    cordMixin,
    alertMixin,
    authMixin,
    socketMixin,
    appsMixin
  ],
  components: { UploadFile },
  computed: {
    files: function() {
      return this.selectedCord.files && this.selectedCord.files.length > 0
        ? this.selectedCord.files
        : "";
    },
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
    selectedIsOpen: function() {
      return this.selectedCord.status === "Open";
    },
    shouldShowDiscussion: function() {
      return this.selectedCord.discussion.length > 0;
    },
    shouldShowComments: function() {
      return this.selectedCord.discussion[0].comments.length > 0;
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
      appDirty: false,
      appOptions: [],
      categoryDirty: false,
      descriptionDirty: false,
      addingToDiscussion: false,
      addingToComment: false,
      confirmCloseDialog: false,
      formData: new FormData(),
      discussion: "",
      comment: [],
      loading: false,
      readonly: true
    };
  },
  created() {
    if (!this.appToken) {
      this.authenticateApp();
    }
    if (!this.selectedCord) {
      this.loading = true;
      this.getCordById(this.id)
        .then(response => {
          const cord = response.data.data;
          this.$store.commit("selectedCord", cord);
          this.joinSelectedCordRoom(cord._id);
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
          this.loading = false;
        })
        .catch(err => {
          this.setAlert(err.message, "#DC2D37", 0);
          this.loading = false;
        });
    }
  },
  mounted() {
    this.getApps().then(response => {
      const data =
        response.data && response.data.data ? response.data.data : [];

      data.forEach(function(elem) {
        this.appOptions.push(elem.name);
      });
    });

    if (!this.categoryList.length) {
      this.getCategoryList()
        .then(response => {
          const data =
            response && response.data && response.data.data
              ? response.data.data
              : [];
          const list = [];
          data.forEach(function(elem) {
            list.push(elem.name);
          });

          this.$store.commit("categoryList", list);
        })
        .catch(err => {
          this.setAlert(err, "#DC2D37", 0);
        });
    }
  },
  methods: {
    computeDuration: TimeService.computeDuration,
    msToTime: TimeService.msToTime,
    appChanged() {
      this.appDirty = true;
    },
    categoryChanged() {
      this.categoryDirty = true;
    },
    descriptionChanged() {
      this.descriptionDirty = true;
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
      this.selectedCord.rescuers = this.selectedCord.rescuers.filter(function(
        elem
      ) {
        return elem.username !== rescuer.username;
      });

      if (this.readonly) {
        this.save();
      }
    },
    rescue() {
      const data = {
        rescuers: [{ _id: this.user._id, username: this.user.username }]
      };
      this.updateRescuers(this.selectedCord._id, data)
        .then(() => {
          this.setAlert("Cord updated successfully!", "#288964", 5000);
          this.refreshItem(this.selectedCord._id);
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
          this.loading = false;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    save(refreshGrid = false) {
      this.updateCord(this.selectedCord._id, this.selectedCord)
        .then(response => {
          this.setAlert("Cord updated successfully!", "#288964", 5000);
          response.data.data.discussion.forEach(function(elem) {
            return convertStringToDate(elem);
          });

          // Optionally refresh the grid for other users. This is only necessary
          // when the cord status is changed
          if (refreshGrid) {
            this.refreshGrid();
          }
          this.refreshItem(this.selectedCord._id);
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
          this.loading = false;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    saveComment(index, refreshGrid = false) {
      this.updateCord(this.selectedCord._id, this.selectedCord)
        .then(response => {
          this.setAlert("Your comment updated successfully!", "#288964", 5000);
          response.data.data.discussion[index].comments.forEach(function(elem) {
            return convertStringToDate(elem);
          });

          // Optionally refresh the grid for other users. This is only necessary
          // when the cord status is changed
          if (refreshGrid) {
            this.refreshGrid();
          }
          this.refreshItem(this.selectedCord._id);
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
          this.loading = false;
        })
        .catch(err => {
          this.setAlert(err.response.data.error, "#DC2D37", 0);
        });
    },
    setFile(data) {
      this.formData = data;
    },
    updateFile() {
      if (this.formData && this.formData.get("cordFile") !== null) {
        this.uploadFileByCordId(this.selectedCord._id, this.formData)
          .then(() => {
            this.setAlert("Cord updated successfully!", "#288964", 5000);
            this.refreshItem(this.selectedCord._id);
            return this.validateUser();
          })
          .then(validationResponse => {
            this.$store.commit("token", validationResponse.data.token || null);
            this.setExpiry();
            this.loading = false;
          })
          .catch(err => {
            throw err;
          });
      }
    },
    unpullCord() {
      this.selectedCord.status = "Resolved";
      this.selectedCord.resolvedOn = new Date().toISOString();
      this.save(true);
      this.confirmCloseDialog = false;
    },
    updateDiscussion() {
      if (this.discussion.length >= 10) {
        this.selectedCord.discussion.push({
          time: new Date().toISOString(),
          user: {
            _id: this.user._id,
            username: this.user.username,
            email: this.user.email
          },
          data: this.discussion
        });

        this.save();
        this.discussion = "";
      }
    },
    addReply(index) {
      const content = this.comment[index];
      if (content && content.length >= 2) {
        if (this.selectedCord.discussion[index].comments === undefined) {
          this.selectedCord.discussion[index].comments = [];
        }
        this.selectedCord.discussion[index].comments.push({
          time: new Date().toISOString(),
          user: { _id: this.user._id, username: this.user.username },
          data: content
        });
        this.saveComment(index);
        this.comment[index] = "";
      }
    }
  },
  props: ["id"],
  watch: {
    addingToDiscussion: function() {
      if (this.addingToDiscussion === false) {
        this.discussion = "";
      }
    },
    addingToComment: function() {
      if (this.addingToComment === false) {
        this.comment = "";
      }
    },

    "selectedCord.tags": {
      handler: function(after, before) {
        if (
          this.readonly &&
          after &&
          before &&
          after.length !== before.length
        ) {
          this.save();
        }
      }
    },
    readonly: function() {
      if (
        typeof this.formData.get === "function" &&
        this.formData.get("cordFile")
      ) {
        this.updateFile();
      }

      const dataChanged =
        this.appDirty || this.categoryDirty || this.descriptionDirty;
      if (this.readonly && dataChanged) {
        this.save();
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
.comments_div {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-left: 2%;
  padding-top: 2%;
  border-radius: 20px;
}
</style>
