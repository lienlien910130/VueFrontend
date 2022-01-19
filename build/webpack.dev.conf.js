const path = require("path");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, "..", dir);
}

module.exports = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    stats: "errors-only",
    contentBase: path.resolve(__dirname, "./dist"),
    publicPath: "/",
    port: 59111,
  },
  // module: {
  //   rules: [
  //       {
  //         test: /\.s[ac]ss$/i,
  //         use: [
  //           'style-loader',
  //           {
  //             loader: 'css-loader',
  //             options: {
  //               sourceMap: true,
  //             },
  //           },
  //           {
  //             loader: 'postcss-loader',
  //             options: {
  //               sourceMap: true,
  //             },
  //           },
  //           {
  //             loader: 'sass-loader',
  //             options: {
  //               sourceMap: true,
  //             }
  //           }
  //         ]
  //       }
  //   ]
  // },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"development"',
        VUE_APP_BASE_API: '"/api"',
        VUE_APP_BASE_IP: '"/cip"',
        VUE_APP_WEBSOCKET: '"ws://localhost:8088/ws/"',
        VUE_APP_RESETPASSWORD: '"http://localhost:8088/reset"',
      },
    }),
  ],
});
