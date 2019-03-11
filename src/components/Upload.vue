<template>
  <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
    <v-card tile flat>
      <v-card-text
        class="pl-2 pt-2"
        style="max-height: 240px;"
        :style="
          isDark ? 'background-color: #434343' : 'background-color: #e0e0e0'
        "
      >
        <input
          ref="uploader"
          style="z-index:99;"
          type="file"
          :name="uploadFieldName"
          :disabled="isSaving"
          @change="
            filesChange($event.target.name, $event.target.files);
            fileCount = $event.target.files.length;
          "
          accept="*"
          class="input-file"
        />
        <v-img
          height="200"
          contain
          v-if="url"
          ref="filePreview"
          :src="url"
          style="z-index:100; position: relative; bottom: 210px;"
        ></v-img>
        <div
          v-if="isInitial"
          class="text-xs-center"
          style="position: relative; bottom: 180px;"
        >
          <v-icon size="100">image</v-icon>
          <p>
            Drag your file here to upload<br />
            or click to select a file
          </p>
        </div>
      </v-card-text>
    </v-card>
  </form>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin";
import { cordMixin } from "../mixins/cordMixin";

const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

export default {
  name: "UploadFile",
  mixins: [themeMixin, cordMixin],
  data() {
    return {
      file: null,
      uploadedFiles: [],
      uploadError: null,
      url: null,
      currentStatus: null,
      uploadFieldName: "cordFile"
    };
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL;
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING;
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS;
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED;
    }
  },
  methods: {
    previewFile() {
      let reader = new FileReader();
      let preview = this.$refs.filePreview;
      const file = this.$refs.uploader.files[0];

      reader.onloadend = function() {
        preview.src = reader.result;
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
      }
    },
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      this.currentStatus = STATUS_SAVING;
      // this.previewFile();
      this.$emit("fileAttached", formData);
    },
    filesChange(fieldName, fileList) {
      const formData = new FormData();

      if (!fileList.length) return;

      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });
      const file = event.target.files[0];
      this.url = URL.createObjectURL(file);
      this.save(formData);
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style scoped>
.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 223px;
  position: relative;
  cursor: pointer;
}
</style>
