const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "client-dist"),
    filename: "bundle.js",
    library: {
      type: "umd",
    },
  },
};
