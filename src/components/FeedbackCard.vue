<template>
  <div>
    <v-card :dark="isDark" :color="`accent ${darken}`">

      <v-card-title primary-title class="hildaLight">
        <span style="font-size: 1.15em;">Additional Feedback</span>
      </v-card-title>

      <v-card-text class="px-4">

        <!-- FORM -->
        <v-form ref="surveyForm" v-model="surveyFormValid">

          <!-- RATING -->
          <v-layout column justify-start>
            <v-flex xs12>
              <p class="hildaLight">Rate your experience with {{ app }} today</p>
            </v-flex>
            <v-flex xs12 :class="breakpoint === 'xs' ? 'align-self-center' : ''" class="pb-4">
              <v-rating v-model="survey.rating"
                        :background-color="SLIDERCOLORS[survey.rating - 1]"
                        :color="SLIDERCOLORS[survey.rating - 1]"
                        large>
              </v-rating>
            </v-flex>
          </v-layout>

          <!-- PRODUCT REVIEW -->
          <p class="hildaLight">Product Review</p>
          <v-textarea box
                      :color="`info ${this.darken}`"
                      :rules="reviewRules"
                      counter
                      name="review"
                      required
                      label="Write your review here"
                      v-model="survey.productReview">
          </v-textarea>

          <!-- SUGGESTIONS -->
          <p class="hildaLight">Suggestions</p>
          <v-textarea box
                      :color="`info ${this.darken}`"
                      name="suggestions"
                      label="Suggestions for improvement"
                      v-model="survey.suggestions">
          </v-textarea>

          <!-- ABOUT YOU -->
          <p class="hildaLight">Tell us about you</p>
          <v-text-field :color="`info ${ darken }`"
                        label="Your name"
                        :rules="nameRules"
                        name="name"
                        v-model="survey.aboutYou.name">
          </v-text-field>
          <v-text-field :color="`info ${ darken }`"
                        label="Your role at Ericsson"
                        name="role"
                        :rules="roleRules"
                        v-model="survey.aboutYou.role">
          </v-text-field>

          <!-- ACTIONS -->
          <v-btn depressed
                 :color="`primary ${ darken }`"
                 name="back"
                 :dark="isDark"
                 required
                 validate-on-blur
                 @click="goToQuestionnaire()">
            <v-icon dark>navigate_before</v-icon>
            Back
          </v-btn>

          <v-btn :color="`success ${ darken }`"
                 depressed
                 :disabled="!surveyFormValid"
                 :dark="isDark"
                 required
                 validate-on-blur
                 name="next"
                 @click="submitSurvey()">
            Submit
            <v-icon dark class="pl-2">input</v-icon>
          </v-btn>

        </v-form>

      </v-card-text>

    </v-card>

    <v-dialog max-width="400"
              v-model="dialog">

      <v-card :dark="isDark" :color="`accent ${darken}`">

        <v-card-text>
          <div class="pa-3 text-xs-center">
            <v-icon size="120px" class="mb-3">sentiment_satisfied_alt</v-icon>
            <h3 class="title font-weight-light mb-2">SUS submission successful!</h3>
            <span class="caption">Thanks for taking time out of your day to help us make {{ this.app }} better for users!</span>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn @click="reloadWindow()"
                 color="info darken-1"
                 depressed
                 name="next">
            Close
            <v-icon dark>close</v-icon>
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

  </div>

</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import axios from "axios";

export default {
  name: "FeedbackCard",
  mixins: [themeMixin],
  components: {},
  computed: {},
  data: () => ({
    dialog: false,
    SLIDERCOLORS: ["error", "orangeWarning", "warning", "success", "info"],
    surveyFormValid: false,
    survey: {
      aboutYou: {
        name: "",
        role: ""
      },
      productReview: "",
      rating: 3,
      suggestions: ""
    },
    nameRules: [
      v => !!v || "Name is required",
      v => (v && v.length >= 4) || "Name must at least 4 characters"
    ],
    reviewRules: [
      v => !!v || "A product review is required",
      v => (v && v.length >= 12) || "Review must be at least 12 characters"
    ],
    roleRules: [v => !!v || "Role is required"]
  }),
  props: {
    app: {
      type: String,
      default: ""
    }
  },
  beforeCreate() {},
  created() {
    this.breakpoint = this.$vuetify.breakpoint.name;
  },
  beforeDestroy() {},
  destroyed() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  methods: {
    goToQuestionnaire: function() {
      this.$emit("returnToQuestionnaire");
    },
    reloadWindow: function() {
      window.location.reload();
    },
    submitSurvey: function() {
      if (this.$refs.surveyForm.validate()) {
        const obj = {
          aboutYou: this.aboutYou,
          suggestions: this.suggestions,
          productReview: this.productReview,
          rating: this.rating
        };

        this.$store.commit("surveyAnswers", obj);

        const body = {
          application: this.app,
          name: this.survey.aboutYou.name,
          role: this.survey.aboutYou.role,
          questionnaireAnswers: this.$store.getters.questionnaireAnswers,
          survey: {
            rating: this.survey.rating,
            remarks: this.survey.productReview,
            suggestion: this.survey.suggestions
          }
        };

        axios
          .post(`https://sus-service.herokuapp.com/assess/${this.app}`, body)
          .then(response => {
            if (response.data.success === true) {
              this.dialog = true;
            }
          })
          .catch(err => {
            this.$store.commit("alert", true);
            this.$store.commit("alertColor", "#DC2D37");
            this.$store.commit(
              "alertMessage",
              `Submission unsuccessful, status code ${err.response.status}`
            );
          });
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
