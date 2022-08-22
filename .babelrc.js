module.exports = {
  presets: [
    ["@babel/preset-env", {
      modules: false,
      targets: {
        browsers: "ie >= 11"
      }
    }],
    "@babel/preset-react"
  ],
  env: {
    test: {
      presets: [["@babel/preset-env"]]
    }
  },
  plugins: [
    ["@babel/plugin-proposal-decorators", {"legacy": true}],
    ["@babel/plugin-proposal-class-properties", {"loose": false}],
    "@babel/plugin-transform-runtime"
  ]
}
