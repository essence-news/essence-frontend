module.exports = {
  globDirectory: "dist/",
  globPatterns: ["**/*.{js,html,png,jpg,svg,xml,ico,json,txt,jpeg}"],
  swDest: "dist/service-worker.js",
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
};
