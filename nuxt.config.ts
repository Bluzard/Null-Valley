import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    ,
    "nuxt-mongoose",
    "@pinia/nuxt",
  ],
  mongoose: {
    uri: "mongodb+srv://admin:admin@clusterjoaco.0liwp.mongodb.net/NullValley?retryWrites=true&w=majority&appName=ClusterJoaco",
    options: {},
    modelsDir: "models",
    devtools: true,
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  compatibilityDate: "2024-11-15",
});
