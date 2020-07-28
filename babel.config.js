// https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/babel-preset-app/index.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // debug: true,
        // useBuiltIns: "usage",
        useBuiltIns: "entry",
        corejs: {
          version: 3,
          proposals: true,
        },
        targets: {
          ie: 9,
        },
        include: [
          "es.array.iterator",
          "es.promise",
          "es.object.assign",
          "es.promise.finally",
          "es.symbol",
        ],
      },
    ],
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    [
      "@babel/plugin-transform-runtime",
      {
        // polyfills are injected by preset-env & polyfillsPlugin, so no need to add them again
        corejs: false,
      },
    ],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};
