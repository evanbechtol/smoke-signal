<template>
  <!--UPLOAD-->
  <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
    <v-card tile :dark="isDark" :color="`accent ${darken}`">
      <v-card-title class="hildaLight space-small dark mx-0 mb-0">
        Upload Files
      </v-card-title>
      <v-card-text
        class="px-2 pt-2"
        style="background-color: var(--e-paleblue-40)"
      >
        <input
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
        <p v-if="isInitial" class="text-xs-center">
          Drag your file(s) here to begin<br />
          or click to browse
        </p>
        <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
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
      uploadedFiles: [],
      uploadError: null,
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
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL;
      this.uploadedFiles = [];
      this.uploadError = null;
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING;

      /*this.uploadFileByCordId(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x);
          this.currentStatus = STATUS_SUCCESS;
        })
        .catch(err => {
          this.uploadError = err.response;
          this.currentStatus = STATUS_FAILED;
        });*/
      this.$emit("fileAttached", formData);
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();

      if (!fileList.length) return;

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        formData.append(fieldName, fileList[x], fileList[x].name);
      });
      // formData.append("cordFile", fileList[0], fileList[0].name);
      // save it
      this.save(formData);
    }
  },
  mounted() {
    this.reset();
  }
};
</script>

<style scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0.6; /* invisible but it's there! */
  width: 100%;
  height: 130px;
  border: 4px var(--e-paleblue) dashed;
  position: relative;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
