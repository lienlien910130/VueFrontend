const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../dist')
  },
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
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   exclude: [resolve('src/icons')],
      //   loader: 'file-loader',
      //   options: {
      //     name: 'image/[name].[ext]',
      //     esModule: false,

      //   }
      // },
      {
        test: /\.(png|jpg|gif)$/,
        exclude: [resolve('src/icons')],
        use:[
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              esModule: false,
              fallback:{
                loader: require.resolve('file-loader'),
                options:{
                  name: '/image/[name].[ext]'
                }
              }
            }
          }
        ]
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
            }
          , 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['./dist']
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
    new CopyPlugin({
      patterns: [
        { 
          from:path.resolve(__dirname, '../static'),
          to: path.resolve(__dirname, '../dist/static')
        },
        {
          from: 'public/firebase-messaging-sw.js',
          to: 'firebase-messaging-sw.js'
        }
      ]
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      favicon: './static/mf.ico',
      filename: 'index.html',
      title: '智慧消防管理平台',
      cdn: {                  
         css:[
            //'https://unpkg.com/element-ui/lib/theme-chalk/index.css',
            'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.63.1/codemirror.min.css'
        ],
         js: [               
            'https://cdn.jsdelivr.net/npm/vue@2.6.14',
            'https://cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.6/vue-router.min.js',             
            'https://cdnjs.cloudflare.com/ajax/libs/vuex/3.1.0/vuex.min.js',
            //'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/index.min.js',
            //'https://cdnjs.cloudflare.com/ajax/libs/element-ui/2.15.6/locale/zh-TW.min.js',
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
    }),
    new BundleAnalyzerPlugin()
  ],
  resolve: { 
    alias: { 
        'vue$': 'vue/dist/vue.esm.js',
        "@": resolve('src'),
        '@assets': resolve('src/assets')
    },
    extensions: ['*', '.js', '.vue','.json'],
    modules: [
      'node_modules'
    ]
  },
  externals: {
    'vue':'Vue',
    'vuex':'Vuex',
    'vue-router': 'VueRouter',
    'fabric': 'fabric',
    'xlsx': 'XLSX',
    'echarts':'echarts',
    'moment':'moment',
    lodash:{
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_'
    },
    'vue-codemirror':'VueCodemirror'
  }
}