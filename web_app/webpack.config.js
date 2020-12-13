module.exports = {
  mode: "development",
  entry: "./src/index.ts",
  output: {filename: "bundle.js"},
  resolve: {extensions: [".ts", ".js", ".css", ".tsx"]},
  module: {
    rules: [
      {test: /\.ts/, use: "ts-loader", exclude: [/node_modules/, /server\.js/]},
      {test: /\.css$/, use: ["style-loader", "css-loader"]},
    ]
  },
  devServer: {
    contentBase: "./assets",
    port: 4500
  }
};