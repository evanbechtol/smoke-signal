export const assetMixin = {
  computed: {},
  methods: {
    getImagePath(img) {
      return img ? require(`../assets/img/${img}`) : "";
    },
    getVideoPath(file) {
      return file ? require(`../assets/${file}`) : "";
    }
  }
};
