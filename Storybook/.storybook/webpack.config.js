const path = require('path')

// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  if (!storybookBaseConfig.resolve.alias) {
    storybookBaseConfig.resolve.alias = {}
  }
  storybookBaseConfig.resolve.extensions = ['.web.js', '.jsx', '.js', '.ios.js', '.json']
  storybookBaseConfig.resolve.alias['react-native'] = path.resolve(__dirname, '../../lib')
  storybookBaseConfig.resolve.alias['@storybook/react-native'] = '@storybook/react'

  storybookBaseConfig.module.rules[0].include = [
    path.resolve(__dirname, '../../lib'),
    path.resolve(__dirname, '../stories'),
    path.resolve(__dirname, '../*.js')
  ]

  storybookBaseConfig.module.rules[0].test = /\.(js|jsx)$/
  delete storybookBaseConfig.module.rules[0].exclude

  storybookBaseConfig.module.rules.push({
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  })

  storybookBaseConfig.module.rules.push({
    test: /\.css$/,
    loaders: ['style-loader', 'css-loader']
  })

  storybookBaseConfig.module.rules.push({
    exclude: [
      /\.html$/,
      /\.(js|jsx)$/,
      /\.css$/,
      /\.json$/,
      /\.bmp$/,
      /\.gif$/,
      /\.jpe?g$/,
      /\.png$/,
    ],
    loader: 'file-loader'
  })

  // Return the altered config
  return storybookBaseConfig
}
