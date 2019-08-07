<template>
  <v-container fill-height :class="isSmall ? 'pa-0' : 'mt-4'">
    <v-layout
      row
      align-start
      justify-center
      v-touch="{
        right: () => goBack()
      }"
    >
      <v-flex xs12 sm10 lg8 xl8>
        <!-- Cord Title -->
        <v-card-title
          primary-title
          class="hildaLight space-small mx-0 mb-0 mt-5 px-2 pb-0"
        >
          <v-layout row wrap>
            <!-- Loading text -->
            <v-flex v-if="loading" xs12 pa-0 ma-0>
              <div style="z-index: 9; width: 100%;" class="text-xs-center">
                <small>Loading Data</small>
                <v-progress-linear
                  :indeterminate="true"
                  color="info"
                ></v-progress-linear>
              </div>
            </v-flex>

            <!-- Go Back Button -->
            <v-flex shrink mr-2 align-self-start v-if="readonly">
              <v-tooltip bottom v-if="isSmall">
                <template #activator="data">
                  <v-btn
                    left
                    bottom
                    fab
                    small
                    :color="`info $[darken}`"
                    v-on="data.on"
                    :dark="isDark"
                    @click="goBack"
                    style="position: relative; left: 8px; bottom: 32px; z-index: 4;"
                  >
                    <v-icon size="30">arrow_back</v-icon>
                  </v-btn>
                </template>
                <span>Go back</span>
              </v-tooltip>
            </v-flex>

            <!-- Cord Title Text -->
            <v-flex v-if="selectedCord" xs12>
              <div class="animated titleFadeInLeft">
                <v-layout row wrap align-start justify-start py-0 my-0 ml-3>
                  <v-flex xs12>
                    <span class="pt-5 header" v-if="readonly">
                      {{ selectedCord.title }}
                    </span>
                  </v-flex>

                  <small v-if="readonly">
                    <v-flex xs12>
                      {{ selectedCord.app }} {{ selectedCord.category }}
                    </v-flex>

                    <v-flex xs12 style="font-size: 0.75em;">
                      Pulled {{ computeDuration(selectedCord.openedOn) }} ago
                    </v-flex>
                  </small>
                </v-layout>

                <br />

                <!-- Application & Category -->
                <span class="ml-3" v-if="!readonly">
                  <v-layout row wrap ml-3 pl-0>
                    <v-flex xs12>
                      <v-text-field
                        v-model="selectedCord.title"
                        label="Title"
                        outline
                        :dark="isDark"
                        :color="`info ${darken}`"
                        @change="titleChanged"
                      >
                        {{ selectedCord.title }}
                      </v-text-field>
                    </v-flex>
                    <v-flex shrink mr-2>
                      <v-text-field
                        v-model="selectedCord.app"
                        label="Application"
                        outline
                        :dark="isDark"
                        :color="`info ${darken}`"
                        @change="appChanged"
                      >
                        {{ selectedCord.app }}
                      </v-text-field>
                    </v-flex>
                    <v-flex shrink>
                      <v-text-field
                        v-model="selectedCord.category"
                        label="Category"
                        outline
                        :dark="isDark"
                        :color="`info ${darken}`"
                        @change="categoryChanged"
                      >
                        {{ selectedCord.category }}
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </span>
              </div>
            </v-flex>
          </v-layout>
        </v-card-title>

        <v-divider class="mx-3"></v-divider>

        <!-- Cord Content -->
        <v-card-text
          v-if="selectedCord"
          class="px-0 animated contentFadeInDown"
        >
          <v-container grid-list-md fluid fill-height pt-0>
            <v-layout wrap row>
              <!-- Description -->
              <v-flex xs12 mb-0>
                <div v-html="selectedCord.description" v-if="readonly"></div>
                <tip-tap
                  v-else
                  :editable="!readonly"
                  :content="selectedCord.description"
                  v-on:contentChanged="updateDescription"
                ></tip-tap>
              </v-flex>

              <!-- File -->
              <v-flex xs12 align-self-center grow v-if="files.length > 0">
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
                    <!-- File Uploader -->
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

              <!-- Cord Information -->
              <v-flex xs12>
                <v-layout column justify-center mt-2>
                  <!-- Tags -->
                  <v-flex xs12 px-0>
                    <v-combobox
                      v-if="!readonly"
                      v-model="selectedCord.tags"
                      :items="selectedCord.tags"
                      :color="`info ${darken}`"
                      :dark="isDark"
                      :readonly="readonly"
                      hide-selected
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

                    <v-layout v-else row justify-start align-center fill-height>
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

                      <v-spacer></v-spacer>

                      <v-flex shrink mx-0>
                        <v-btn
                          v-if="readonly && !isResolved && isMine"
                          class="mx-0 px-0"
                          :block="isSmall"
                          small
                          flat
                          :color="`info ${darken}`"
                          :disabled="unpullDisabled"
                          :dark="isDark"
                          @click="readonly = !readonly"
                        >
                          Edit
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-flex>

                  <!-- Rescuers -->
                  <v-flex xs12>
                    <v-layout row>
                      <v-flex grow>
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
                                    :color="COLORS[index % 4]"
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
                                small
                                slot-scope="{ active }"
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
                      </v-flex>

                      <v-spacer></v-spacer>

                      <!-- Puller -->
                      <v-flex shrink>
                        <v-card
                          elevation="0"
                          :color="`accent ${darken}`"
                          class="px-3 py-2"
                        >
                          <small>
                            Pulled on
                            {{ new Date(selectedCord.openedOn).toDateString() }}
                          </small>

                          <br />

                          <v-avatar class="mr-2" size="26" tile>
                            <v-img
                              :src="getImagePath('evanbechtolHeadshot.png')"
                            />
                          </v-avatar>
                          {{ user.username }}
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>

              <!-- Discussion -->
              <v-flex xs12>
                <v-divider></v-divider>

                <div class="timeline">
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
                            <v-chip
                              v-on="data.on"
                              :color="COLORS[index % 4]"
                              dark
                            >
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
                            {{
                              convertStringToDate(
                                content.time
                              ).toLocaleDateString("en-us")
                            }}
                            -
                            <!--eslint-disable-next-line-->
                            {{
                              convertStringToDate(
                                content.time
                              ).toLocaleTimeString("en-us")
                            }}
                          </strong>
                        </v-flex>
                        <v-flex grow>
                          <p v-html="content.data"></p>
                        </v-flex>
                      </v-layout>
                    </v-timeline-item>
                  </v-timeline>
                </div>
              </v-flex>

              <!-- Add to discussion -->
              <v-flex
                shrink
                v-if="selectedIsOpen && !addingComment"
                my-0
                align-self-start
              >
                <v-btn
                  class="mx-0"
                  :color="`info ${darken}`"
                  flat
                  small
                  depressed
                  tag="a"
                  @click="addingComment = true"
                >
                  Add a comment
                </v-btn>
              </v-flex>

              <v-flex
                shrink
                v-if="selectedIsOpen && !addingComment"
                my-0
                align-self-start
              >
                <v-btn
                  id="addAnswerBtn"
                  v-if="!isResolved && readonly && !addingAnswer"
                  color="purple darken-1"
                  flat
                  small
                  depressed
                  dark
                  @click="addingAnswer = true"
                  >Add Answer
                </v-btn>
              </v-flex>

              <!-- Add Comment -->
              <v-flex id="commentFlex" grow v-if="shouldShowAddComment">
                <v-layout column fill-height>
                  <v-flex xs12 sm4>
                    <tip-tap
                      :editable="addingComment"
                      :content="discussion"
                      v-on:contentChanged="updateComment"
                    ></tip-tap>
                  </v-flex>

                  <v-layout row wrap align-center justify-start>
                    <v-flex shrink>
                      <v-btn
                        small
                        depressed
                        outline
                        flat
                        @click="cancelAddingDiscussion"
                        :dark="isDark"
                      >
                        Cancel
                      </v-btn>
                    </v-flex>

                    <v-flex shrink>
                      <v-btn
                        small
                        depressed
                        v-if="shouldShowAddComment"
                        :disabled="discussion.length < 2"
                        @click="updateDiscussion"
                        :color="`info ${darken}`"
                      >
                        Add comment
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-flex>

              <!-- Add Answer -->
              <v-flex id="addAnswerFlex" xs12 v-if="shouldShowAnswerInput" mt-2>
                <v-layout column fill-height>
                  <v-flex id="answerInput" xs12 sm4>
                    <tip-tap
                      :editable="addingAnswer"
                      :content="answer"
                      v-on:contentChanged="updateAnswer"
                    ></tip-tap>
                  </v-flex>

                  <v-layout
                    id="answerActions"
                    row
                    wrap
                    align-center
                    justify-start
                  >
                    <v-flex shrink>
                      <v-btn
                        id="cancelAnswerBtn"
                        small
                        depressed
                        outline
                        flat
                        @click="cancelAddingAnswer"
                        :dark="isDark"
                      >
                        Cancel
                      </v-btn>
                    </v-flex>

                    <v-flex shrink>
                      <v-btn
                        id="submitAnswerBtn"
                        small
                        depressed
                        :disabled="answer.length < 1"
                        @click="addAnswer"
                        :color="`info ${darken}`"
                      >
                        Add Answer
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-flex>

              <!-- Answers -->
              <v-flex id="answerFlex" xs12 v-if="shouldShowAnswers">
                <template v-for="(answer, answerIndex) in selectedCord.answers">
                  <v-card
                    flat
                    :key="`answer-${answerIndex}`"
                    :dark="isDark"
                    :color="`accent ${darken}`"
                  >
                    <v-card-text>
                      <v-layout row wrap align-center>
                        <!-- answer content -->
                        <v-flex xs12>
                          <v-textarea
                            v-if="editingAnswerIndex !== answerIndex"
                            id="`answer-${answerIndex}`"
                            flat
                            v-html="answer.answer"
                          ></v-textarea>

                          <tip-tap
                            v-else
                            :editable="typeof editingAnswerIndex === 'number'"
                            :content="answer.answer"
                            v-on:contentChanged="updateSubmittedAnswer"
                          ></tip-tap>
                        </v-flex>

                        <!-- Answer Actions -->
                        <v-flex
                          id="answerActionsFlex"
                          shrink
                          v-if="!isResolved && answer.user._id === user._id"
                        >
                          <v-layout
                            row
                            justify-start
                            align-center
                            fill-height
                            mt-2
                          >
                            <v-flex
                              shrink
                              mx-0
                              v-if="editingAnswerIndex !== answerIndex"
                            >
                              <v-btn
                                class="mx-0 px-0"
                                small
                                flat
                                :color="`info ${darken}`"
                                :disabled="isResolved"
                                :dark="isDark"
                                @click="editAnswer(answer._id, answerIndex)"
                              >
                                Edit
                              </v-btn>
                            </v-flex>

                            <v-flex
                              shrink
                              mx-0
                              v-if="editingAnswerIndex === answerIndex"
                            >
                              <v-btn
                                class="mx-0 px-0"
                                small
                                depressed
                                :color="`success ${darken}`"
                                :disabled="isResolved"
                                :dark="isDark"
                                @click="saveEditedAnswer(answer, answer._id)"
                              >
                                Save
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>

                        <v-spacer></v-spacer>

                        <v-flex shrink>
                          <!-- Answered On Card -->
                          <v-card
                            elevation="0"
                            :color="`accent ${darken}`"
                            :dark="isDark"
                          >
                            <small>
                              Answered On
                              {{ new Date(answer.createdOn).toDateString() }}
                            </small>

                            <br />

                            <v-avatar class="mr-2" size="26" tile>
                              <v-img
                                :src="getImagePath('evanbechtolHeadshot.png')"
                              />
                            </v-avatar>
                            {{ answer.user.username }}
                          </v-card>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                </template>
              </v-flex>

              <!-- Actions -->
              <v-flex xs12 mt-4>
                <v-card-actions class="px-0">
                  <v-tooltip right>
                    <template #activator="data">
                      <v-btn
                        v-if="showUnpullButton && readonly"
                        v-on="data.on"
                        :block="isSmall"
                        color="purple darken-1"
                        :disabled="unpullDisabled"
                        depressed
                        dark
                        @click="confirmCloseDialog = true"
                        >Unpull Cord
                      </v-btn>
                    </template>
                    <span>My blocker is resolved!</span>
                  </v-tooltip>

                  <v-btn
                    v-if="!readonly"
                    :block="isSmall"
                    :outline="readonly"
                    :color="readonly ? 'info darken-1' : 'success darken-1'"
                    :disabled="unpullDisabled"
                    dark
                    @click="readonly = !readonly"
                  >
                    Save Changes
                  </v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
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
import { TimeService } from "../services/timeService";

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

  components: {
    UploadFile: () => import("../components/Upload.vue"),
    TipTap: () => import("../components/TipTap.vue")
  },

  computed: {
    descriptionBgColor() {
      return this.readonly ? "transparent" : `accent ${this.darken}`;
    },

    disableAnswerSubmit() {
      return this.answer.length < 20;
    },

    discussionAppendIcon() {
      return this.discussion.length >= 2 ? "send" : undefined;
    },

    files() {
      return this.selectedCord.files && this.selectedCord.files.length > 0
        ? this.selectedCord.files
        : "";
    },

    showUnpullButton() {
      return this.selectedCord && this.isMine && !this.isResolved;
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

    shouldShowAnswers() {
      return this.selectedCord.answers && this.selectedCord.answers.length;
    },

    shouldShowAnswerInput() {
      return this.selectedIsOpen && this.addingAnswer;
    },

    shouldShowAddComment() {
      return this.selectedIsOpen && this.addingComment;
    },

    selectedIsOpen() {
      return this.selectedCord.status === "Open";
    },

    shouldShowDiscussion() {
      return this.selectedCord.discussion.length > 0;
    },

    shouldShowComments() {
      const comments = this.selectedCord.discussion[0].comments;
      return comments && comments.length > 0;
    },

    unpullDisabled() {
      return !(
        this.user.username === this.selectedCord.puller.username &&
        this.user._id === this.selectedCord.puller._id &&
        this.selectedCord.status === "Open"
      );
    },

    isResolved() {
      return this.selectedCord.status === "Resolved";
    },

    isMine() {
      return this.selectedCord.puller.username === this.user.username;
    }
  },

  data: function() {
    return {
      answer: "",
      addingAnswer: false,
      addingComment: false,
      addingReply: [],
      addingToComment: false,
      addingToDiscussion: false,
      appDirty: false,
      categoryDirty: false,
      comment: [],
      confirmCloseDialog: false,
      descriptionDirty: false,
      discussion: "",
      editingAnswerIndex: undefined,
      formData: new FormData(),
      loading: false,
      readonly: true,
      reply: "",
      titleDirty: false
    };
  },

  created() {
    if (!this.appToken) {
      this.authenticateApp()
        .then(response => {
          if (response && response.data && response.data.success === true) {
            this.$store.commit("appToken", response.data.token || null);
            this.getSelectedCord();
          }
        })
        .catch(err => {
          this.setAlert(`Error authenticating app: ${err}`, "#DC2D37", 0);
          return err;
        });
    } else if (!this.selectedCord) {
      this.getSelectedCord();
    }
  },

  methods: {
    computeDuration: TimeService.computeDuration,

    msToTime: TimeService.msToTime,

    addAnswer() {
      if (this.answer.length) {
        if (!(this.selectedCord.answers || this.selectedCord.answers.length)) {
          this.selectedCord.answers = [];
        }

        this.selectedCord.answers.push({
          time: new Date().toISOString(),
          user: { _id: this.user._id, username: this.user.username },
          data: this.answer
        });

        this.setupSaveAnswer();
      }
    },

    addToDiscussion() {
      this.updateDiscussion();
    },

    appChanged() {
      this.appDirty = true;
    },

    cancelAddingAnswer() {
      this.answer = "";
      this.addingAnswer = false;
    },

    cancelAddingDiscussion() {
      this.discussion = "";
      this.addingComment = false;
    },

    cancelAddingReply() {
      this.reply = "";
      this.addingReply = false;
    },

    categoryChanged() {
      this.categoryDirty = true;
    },

    titleChanged() {
      this.titleDirty = true;
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

    editAnswer(answerId, answerIndex) {
      if (answerId && typeof answerIndex === "number") {
        this.editingAnswerIndex = answerIndex;
      }
    },

    getInitials(item) {
      return item && typeof item === "string"
        ? item.slice(0, 2).toLocaleUpperCase()
        : "";
    },

    getSelectedCord() {
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
          this.setAlert(
            (err &&
              err.response &&
              err.response.data &&
              err.response.data.error) ||
              "Error Occurred updating rescuers",
            "#DC2D37",
            0
          );
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

    setupSaveAnswer() {
      const answer = {
        user: { _id: this.user._id, username: this.user.username },
        answer: this.answer
      };

      this.saveAnswer(this.selectedCord._id, answer)
        .then(() => {
          this.setAlert("Answer successfully!", "#288964", 5000);
          /*response.data.data.answer.forEach(function(elem) {
            return convertStringToDate(elem);
          });*/

          this.refreshItem(this.selectedCord._id);
          this.answer = "";
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

    updateAnswer(value) {
      this.answer = value;
    },

    updateComment(value) {
      this.discussion = value;
    },

    updateDescription(value) {
      if (!this.readonly) {
        this.selectedCord.description = value;
        this.descriptionDirty = true;
      }
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

    updateSubmittedAnswer(value) {
      if (typeof this.editingAnswerIndex === "number" && value) {
        this.selectedCord.answers[this.editingAnswerIndex].answer = value;
      }
    },

    unpullCord() {
      this.selectedCord.status = "Resolved";
      this.selectedCord.resolvedOn = new Date().toISOString();
      this.save(true);
      this.confirmCloseDialog = false;
    },

    updateDiscussion() {
      if (this.discussion.length >= 2) {
        this.selectedCord.discussion.push({
          time: new Date().toISOString(),
          user: { _id: this.user._id, username: this.user.username },
          data: this.discussion
        });

        this.save();
        this.discussion = "";
      }
    },

    saveEditedAnswer(answer, answerId) {
      if (answer && answerId) {
        // Todo: Pass selectedCord._id, answer to API to be saved
        // Todo: When save is complete, refresh selectedCord
        this.updateEditedAnswer(this.selectedCord._id, answer)
          .then(response => {
            this.$store.commit("selectedCord", response.data.data);
            this.setAlert("Answer updated successfully!", "#288964", 5000);
          })
          .catch(err => {
            this.setAlert(`Error updating answer: ${err}`, "#DC2D37", 0);
          })
          .finally(() => {
            this.editingAnswerIndex = undefined;
          });
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
        this.discussion = "";
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
        this.appDirty ||
        this.categoryDirty ||
        this.descriptionDirty ||
        this.titleDirty;

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
.timeline {
  max-height: 1000px;
  overflow-y: auto;
  overflow-x: hidden;
}

.header {
  font-size: 2rem;
}

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

.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.fast {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes titleFadeInLeft {
  0% {
    opacity: 0;
    -webkit-transform: translateX(-40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateX(0);
  }
}

@keyframes titleFadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.titleFadeInLeft {
  -webkit-animation-name: titleFadeInLeft;
  animation-name: titleFadeInLeft;
}

@-webkit-keyframes titleFadeOutLeft {
  0% {
    opacity: 1;
    -webkit-transform: translateX(0);
  }
  100% {
    opacity: 0;
    -webkit-transform: translateX(-20px);
  }
}

@keyframes titleFadeOutLeft {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-20px);
  }
}

.titleFadeOutLeft {
  -webkit-animation-name: titleFadeOutLeft;
  animation-name: titleFadeOutLeft;
}

@-webkit-keyframes contentFadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translateY(-40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
}

@keyframes contentFadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.contentFadeInDown {
  -webkit-animation-name: contentFadeInDown;
  animation-name: contentFadeInDown;
}

@-webkit-keyframes contentFadeInUp {
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
}

@keyframes contentFadeInUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.contentFadeInUp {
  -webkit-animation-name: contentFadeInUp;
  animation-name: contentFadeInUp;
}

@-webkit-keyframes contentFadeOutUp {
  0% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
  100% {
    opacity: 0;
    -webkit-transform: translateY(-20px);
  }
}

@keyframes contentFadeOutUp {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

.contentFadeOutUp {
  -webkit-animation-name: contentFadeOutUp;
  animation-name: contentFadeOutUp;
}

@-webkit-keyframes contentFadeOutDown {
  0% {
    opacity: 1;
    -webkit-transform: translateY(0);
  }
  100% {
    opacity: 0;
    -webkit-transform: translateY(20px);
  }
}

@keyframes contentFadeOutDown {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}

.contentFadeOutDown {
  -webkit-animation-name: contentFadeOutDown;
  animation-name: contentFadeOutDown;
}
</style>
