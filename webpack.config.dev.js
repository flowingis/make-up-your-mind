const commonConfiguration = require('./webpack.config.common')

module.exports = {
  ...commonConfiguration,
  mode: 'development',
  devtool: 'eval-source-map'
}
