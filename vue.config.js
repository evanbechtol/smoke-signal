module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/smoke-signal/" : "/",
  pwa: {
    name: "AnA Hero",
    themeColor: "#0084F0",
    msTileColor: "#0084F0",
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/service-worker.js"
    }
  }
};
