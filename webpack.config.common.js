const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const dist = path.join(__dirname, 'dist')

module.exports = {
  entry: ['@webcomponents/custom-elements', './src/index.js'],
  output: {
    path: dist,
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      src: path.join(__dirname, 'src')
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
        test: /app\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'src', 'manifest.json'),
        to: dist
      },
      {
        from: path.join(__dirname, 'src', 'sw.js'),
        to: dist
      }
    ])
  ]
}
