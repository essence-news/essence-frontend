module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{js,html,png,jpg,svg,xml,ico,json,txt,jpeg}"],
  swDest: "build/service-worker.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
