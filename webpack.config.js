const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const vueSrc = "./src"
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
          'style-loader', 'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
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
              name: '[name].[ext]'
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
                    esModule: false
                } 
            }, 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new BundleAnalyzerPlugin(),
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new CopyPlugin({
      patterns: [
        { 
          from:path.resolve(__dirname, './static'),
          to: path.resolve(__dirname, './dist/static')
        },
        {
          from: 'public/firebase-messaging-sw.js',
          to: 'firebase-messaging-sw.js'
        },
        {
          from: 'web.config',
          to: 'web.config'
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        VUE_APP_BASE_API: '"http://192.168.88.65:49119"'
      }
    }),
    // new HtmlWebpackPlugin({
    //   inject: false,
    //   hash: true,
    //   template: './src/index.html',
    //   favicon: './public/favicon.ico',
    //   filename: 'index.html',
    //   title: '智慧消防管理平台',
    //   minify: process.env.NODE_ENV == 'development' ? false : true,
    // })
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      title: '智慧消防管理平台',
      cdn: {                  
         css:[
            'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/codemirror.min.css'
        ],
         js: [               
            // 'https://cdn.jsdelivr.net/npm/vue@2.6.14',           
            'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.6/vue-router.min.js',             
            // 'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.0/vuex.min.js',
            // 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.1/axios.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/locale/zh-TW.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/4.1.0/fabric.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.6/xlsx.full.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.6/shim.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/echarts/4.8.0/echarts.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/codemirror.min.js',
            'https://cdn.jsdelivr.net/npm/vue-codemirror@4.0.6/dist/vue-codemirror.min.js'
         ]                
      } 
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
// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = false
//   // http://vue-loader.vuejs.org/en/workflow/production.html
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     // new webpack.DefinePlugin({
//     //   'process.env': {
//     //     NODE_ENV: '"production"',
//     //     VUE_APP_BASE_API: '"http://192.168.88.65:49119"'
//     //   }
//     // }),
//     new webpack.optimize.UglifyJsPlugin({
//       sourceMap: true,
//       compress: {
//         warnings: false
//       }
//     }),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ])
// }