<template>
  <div style="height: 100vh;" class="notFound page">
    <video autoplay muted loop id="myVideo">
      <source :src="getVideoPath('Code - 14214.mp4')" type="video/mp4" />
    </video>

    <v-layout row wrap fill-height justify-end align-center>
      <v-flex xs12 text-xs-right>
        <div class="content">
          <h1 class="hildaLight display-3">404: Page Not Found</h1>
          <p>
            This page doesn't exist, or you just found a glitch in the matrix
          </p>
          <v-btn
            class="animated slow headShake"
            id="myBtn"
            color="#0c0c0c"
            dark
            :to="{ path: '/' }"
            large
            >Take me home!</v-btn
          >
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
// @ is an alias to /src
import { themeMixin } from "../mixins/themeMixin.js";
import { assetMixin } from "../mixins/assetMixin";

export default {
  name: "NotFound",
  mixins: [themeMixin, assetMixin],
  components: {},
  computed: {},
  data: () => ({}),
  beforeDestroy() {},
  created() {},
  mounted() {},
  methods: {
    toggleVideo: function() {
      const video = document.getElementById("myVideo");
      const btn = document.getElementById("myBtn");

      if (video.paused) {
        video.play();
        btn.innerHTML = "Pause";
      } else {
        video.pause();
        btn.innerHTML = "Play";
      }
    }
  },
  watch: {}
};
</script>

<style scoped>
/* Style the video: 100% width and height to cover the entire window */
#myVideo {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
}

/* Add some content at the bottom of the video/page */
.content {
  position: fixed;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  color: #f1f1f1;
  width: 100%;
  padding: 20px;
}

#myBtn {
  animation-delay: 2s;
  animation-iteration-count: infinite;
}

#myBtn:hover {
  background-color: var(--e-light-brand-blue) !important;
}
</style>
