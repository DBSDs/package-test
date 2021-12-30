const {
  resolve,
} = require('path');

const {
  VueLoaderPlugin
} = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
  entry: () => {
    const res = [resolve(__dirname, 'src/main.js')]

    // const isDevMode = process.env === 'development';

    // if (isDevMode) {
    //   res.unshift('vue-loader')
    // }

    return res
  },

  output: {
    // 输出目录
    path: resolve(__dirname, 'dist-webpack'),
    // 文件名称
    filename: 'index.js',
    publicPath: '/',
  },

  module: {
    rules: [{
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/, // 屏蔽不需要处理的文件（文件夹）（可选）
        use: ['babel-loader'],
      },
      {
        test: /\.vue$/,
        include: resolve(__dirname, 'src'),
        use: [{
          loader: 'vue-loader',
        }],
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|bmp|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, // 10k
            name: `[name].[hash:base64:8].[ext]`,
            publicPath: '/assets/imgs/',
            outputPath: '/assets/imgs/',
            esModule: false
          },
        }, ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, // 10k
            name: `[name].[ext]`,
            publicPath: '/assets/font/',
            outputPath: '/assets/font/',
          },
        }, ],
      },
    ]
  },

  plugins: (() => {
    const vuePlugin = new VueLoaderPlugin()
    const htmlPlugin = new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body',
    })
    const copyPlugin = new CopyWebpackPlugin({
      patterns: [{
        from: resolve(resolve(__dirname, 'src'), 'assets'),
        to: 'assets'
      }]
    })
    const res = [vuePlugin, htmlPlugin, copyPlugin]
    if (process.env !== 'development') {
      const cleanPlugin = new CleanWebpackPlugin({
        root: resolve(__dirname),
        verbose: true,
        dry: false,
      })

      res.unshift(cleanPlugin)
    }
    return res
  })(),

  devServer: {
    hot: false,
    host: '0.0.0.0',
    client: {
      progress: false,
    },
    liveReload: true,
    compress: true,
    port: 9000
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minSize: 30000,
          minChunks: 1,
          priority: 1, // 该配置项是设置处理的优先级，数值越大越优先处理
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        // https://webpack.js.org/plugins/uglifyjs-webpack-plugin/#options
        terserOptions: {
          output: {
            beautify: false, // 最紧凑的输出
            comments: false, // 删除所有的注释
          },
          // https://github.com/mishoo/UglifyJS2/tree/harmony#compress-options
          compress: {
            warnings: false,
            conditionals: true, // 优化 if-s 与条件表达式
            unused: true, // 丢弃未使用的变量与函数
            comparisons: true,
            sequences: true,
            dead_code: true,
            evaluate: true,
            if_return: true,
            join_vars: true,
          },
        },
      }),
    ],
  },
}