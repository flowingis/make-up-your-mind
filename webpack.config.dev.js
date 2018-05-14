const commonConfiguration = require('./webpack.config.common')

module.exports = {
  ...commonConfiguration,
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    host: '0.0.0.0'
  }
}
