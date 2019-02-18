const COLORS = ["error", "orangeWarning", "warning", "success", "info"];

const ICONS = [
  "sentiment_very_dissatisfied",
  "sentiment_dissatisfied",
  "sentiment_neutral",
  "sentiment_satisfied_alt",
  "sentiment_very_satisfied"
];

export const susMixin = {
  computed: {
    app: {
      get: function() {
        return this.$store.getters.app;
      },
      set: function() {
        this.$store.commit("app");
      }
    },
    questionnaireAnswers: {
      get: function() {
        return this.$store.getters.questionnaireAnswers;
      },
      set: function() {
        this.$store.commit("questionnaireAnswers");
      }
    },
    surveyAnswers: {
      get: function() {
        return this.$store.getters.surveyAnswers;
      },
      set: function() {
        this.$store.commit("surveyAnswers");
      }
    },
    questions() {
      return [
        `I think that I would like to use ${
          this.app
        } frequently to do my daily work.`,
        `I found ${this.app} unnecessarily complex or difficult to understand.`,
        `I thought ${this.app} was easy to use.`,
        `I think that I would need the support of a technical person to be able to use ${
          this.app
        }.`,
        `I found the various functions in ${this.app} were well integrated.`,
        `I thought there was too much inconsistency in ${this.app}`,
        `I would imagine that most people would learn to use ${
          this.app
        } very quickly.`,
        `I found ${this.app} very cumbersome to use.`,
        `I felt very confident using ${this.app}`,
        `I needed to learn a lot of things before I could get going with ${
          this.app
        }.`
      ];
    }
  },
  data: () => ({
    ticksLabels: [
      "Strongly Disagree",
      "Disagree",
      "Neither agree, nor disagree",
      "Agree",
      "Strongly Agree"
    ],
    dropdownItems: [
      {
        value: 0,
        text: "Strongly Disagree"
      },
      {
        value: 1,
        text: "Disagree"
      },
      {
        value: 2,
        text: "Neither agree, nor disagree"
      },
      {
        value: 3,
        text: "Agree"
      },
      {
        value: 4,
        text: "Strongly Agree"
      }
    ]
  }),
  methods: {
    genColor(answer) {
      return `${COLORS[answer]} ${this.darken}`;
    },
    genIcon(answer) {
      return ICONS[answer];
    }
  }
};
