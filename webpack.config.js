const path = require('path')
// const WorkboxPlugin = require('workbox-webpack-plugin')
const OfflinePlugin = require('offline-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const vueSrc = "./src"
const webpack = require('webpack')
const ASSET_PATH = process.env.ASSET_PATH || '../';

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
          name: 'image/[name].[ext]'
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
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options:{
              publicPath: ASSET_PATH,
              esModule: false

            } 
          },
          'css-loader',
          'sass-loader'
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
    new OfflinePlugin({
      // 要求触发ServiceWorker事件回调
      ServiceWorker: {
        events: true,
        // push事件逻辑写在另外一个文件里面
        entry: './public/sw-push.js'
      },
      // 更更新策略选择全部更新
      updateStrategy: 'all',
      // 除去一些不需要缓存的文件
      excludes: ['**/*.map', '**/*.svg', '**/*.png', '**/*.jpg', '**/sw-push.js', '**/sw-my.js', '**/*.json'],

      // 添加index.html的更新
      rewrites (asset) {
        if (asset.indexOf('index.html') > -1) {
          return './index.html'
        }

        return asset
      }
    }),
    // new WorkboxPlugin.GenerateSW({
		// 	clientsClaim: true,
		// 	skipWaiting: true
		// }),
    new CopyPlugin({
      patterns: [
        { 
          from:path.resolve(__dirname, './static'),
          to: path.resolve(__dirname, './dist/static')
        },
        {
          from: 'public/manifest.json',
          to: 'manifest.json'
        },
        {
          from: 'web.config',
          to: 'web.config'
        },
        {
          from:path.resolve(__dirname, './public/manifestimg'),
          to: path.resolve(__dirname, './dist/manifestimg')
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