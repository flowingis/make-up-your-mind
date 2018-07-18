const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

let key

try {
  fs.readFileSync('.key', 'utf8')
} catch (e) {
  key = process.env.FIREBASE_APP_KEY
}

const dist = path.join(__dirname, 'dist')

module.exports = {
  entry: {
    radar: './apps/radar/index.js',
    board: './apps/options-board/index.js',
    levers: './apps/levers-game/index.js',
    capacity: './apps/capacity-canvas/index.js',
    lib: './lib/index.js'
  },
  output: {
    path: dist,
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      radar: path.join(__dirname, 'apps', 'radar'),
      board: path.join(__dirname, 'apps', 'options-board'),
      levers: path.join(__dirname, 'apps', 'levers-game'),
      capacity: path.join(__dirname, 'apps', 'capacity-canvas'),
      lib: path.join(__dirname, 'lib')
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
            test: /\.scss$/,
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
    new webpack.DefinePlugin({
      FIREBASE_APP_KEY: JSON.stringify(key)
    }),
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
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'apps', 'levers-game', 'index.html'),
      chunks: ['lib', 'levers'],
      filename: path.join(__dirname, 'dist', 'levers.html')
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'apps', 'capacity-canvas', 'index.html'),
      chunks: ['lib', 'capacity'],
      filename: path.join(__dirname, 'dist', 'capacity-canvas.html')
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'manifest.json'),
        to: dist
      },
      {
        from: path.join(__dirname, 'sw.js'),
        to: dist
      },
      {
        from: path.join(__dirname, 'icon.png'),
        to: dist
      }
    ])
  ]
}
