const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const vueSrc = "./src";

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  stats: { children: false },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        // loader: 'babel-loader',
        // options: {
        //     presets: ['env']
        // },
        // query: { compact: false }
        use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread'],
              compact: false
            }
          }
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        loader: 'vue-style-loader!css-loader',
        
        // use: [ 'style-loader', 'css-loader' ]
        // use: ExtractTextPlugin.extract(
        //   {
        //     fallback: 'style-loader',
        //     use: [ 'vue-style-loader', 'css-loader' ]
        //   })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
    }),
    new ExtractTextPlugin({filename: 'style.css'}),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        // 移除空白
        collapseWhitespace: true,
        // 移除註釋
        removeComments: true,
        // 移除屬性中的雙引號
        removeAttributeQuotes: true
      }
    })
  ],
  resolve: { 
    alias: { 
        'vue$': 'vue/dist/vue.esm.js',
        "@": path.join(__dirname, vueSrc)
    },
    extensions: ['*', '.js', '.vue','.json']
  }
}