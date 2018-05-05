const commonConfiguration = require('./webpack.config.common')

module.exports = {
  ...commonConfiguration,
  mode: 'production',
  devtool: 'none'
}
