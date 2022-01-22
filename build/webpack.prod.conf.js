const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(baseWebpackConfig, {
  mode: "production",
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"',
        VUE_APP_BASE_API: '"/api"',
        VUE_APP_WEBSOCKET: '"wss://demo.mercuryfire.com.tw/ws/"',
        VUE_APP_RESETPASSWORD: '"https://demo.mercuryfire.com.tw/reset"',
      },
    }),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    // new UglifyJsPlugin({
    //   uglifyOptions: {
    //     compress: {
    //       drop_debugger: true,
    //       drop_console: true,
    //       pure_funcs: ["console.log"],
    //     },
    //   },
    //   sourceMap: false,
    //   cache: true,
    //   parallel: true,
    // }),
  ],
});
