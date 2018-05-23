const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const dist = path.join(__dirname, 'dist')

module.exports = {
  entry: {
    radar: './apps/radar/index.js',
    board: './apps/options-board/index.js',
    lib: './lib/index.js'
  },
  output: {
    path: dist,
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      radar: path.join(__dirname, 'apps', 'radar'),
      board: path.join(__dirname, 'apps', 'board')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.svg$/,
        use: ['url-loader?mimetype=image/svg+xml']
      },
      {
        test: /\.component\.css$/,
        use: ['css-loader']
      },
      {
        rules: [
          {
            test: /app\.scss$/,
            use: [
              'style-loader', // creates style nodes from JS strings
              'css-loader', // translates CSS into CommonJS
              'sass-loader' // compiles Sass to CSS
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      chunks: ['lib']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'apps', 'options-board', 'index.html'),
      chunks: ['lib', 'board'],
      filename: path.join(__dirname, 'dist', 'board.html')
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'apps', 'radar', 'index.html'),
      chunks: ['lib', 'radar'],
      filename: path.join(__dirname, 'dist', 'radar.html')
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'apps', 'radar', 'radar.manifest.json'),
        to: dist
      },
      {
        from: path.join(__dirname, 'apps', 'radar', 'radar.sw.js'),
        to: dist
      },
      {
        from: path.join(__dirname, 'apps', 'radar', 'radar.icon.png'),
        to: dist
      }
    ])
  ]
}
