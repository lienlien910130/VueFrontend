const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const vueSrc = "./src"
const webpack = require('webpack')

function resolve(dir) {
  return path.join(__dirname, dir)
}

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
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['syntax-dynamic-import']
          }
        }
      },
      {
        test: /\.css$/,
        loader: [
          'style-loader','css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        exclude: [resolve('src/icons')],
        loader: 'file-loader',
        options: {
          name: 'img/[name].[ext]',
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2)(\?\S*)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options:{
              publicPath: '../',
              esModule: false

            } 
          },'css-loader','sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { 
          from:path.resolve(__dirname, './static'),
          to: path.resolve(__dirname, './dist/static')
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        VUE_APP_BASE_API: '"http://192.168.88.65:59119"'
      }
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      title: '智慧消防管理平台',
      minify: process.env.NODE_ENV == 'development' ? false : true,
    })
  ],
  resolve: { 
    alias: { 
        'vue$': 'vue/dist/vue.esm.js',
        "@": path.join(__dirname, vueSrc)
    },
    extensions: ['*', '.js', '.vue','.json'],
    modules: [
      'node_modules'
    ]
  }
}
if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        VUE_APP_BASE_API: '"http://192.168.88.65:59119"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}