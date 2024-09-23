const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./dist/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  module: {
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
  },
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve("path-browserify"),
    },
  },
  plugins: [
    new HtmlPlugin({
      template: "./dist/index.html",
      filename: "index.html",
      inject: true,
    }),
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 8080,
  },
  devtool: "inline-source-map",
};
