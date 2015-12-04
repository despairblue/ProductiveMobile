module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    './index'
  ],
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [
        'babel?presets[]=react,presets[]=es2015,plugins[]=transform-class-properties'
      ]
    }]
  }
}
