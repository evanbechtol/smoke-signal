import { mapState } from "vuex";

/* eslint-disable */
const apiKey =
  "eyJhY2NvdW50SWQiOiJweXB0aGFudjFrIiwiYXBwbGljYXRpb25JZCI6ImhhcTFtNW5kNHciLCJrZXkiOiJhOGNlM2ZmMC03ZTBlLTQwMWUtOWRkNy03ODM5NmE1OGU5NzAifQ==";
const authHeader = `Basic base64(${apiKey}:)`;
const baseUrl = "https://api.useast1.badgeup.io/v1/";

export const badgeMixin = {
  computed: {
    ...mapState(["badgeCard"])
  },
  methods: {}
};
