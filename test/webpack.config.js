var path = require('path')

module.exports = {
  entry: './test/entry',
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  target: 'node',
  module: {
    loaders: [{
      test: /\.svg$/,
      loader: 'file?name=result.svg!svg-css-modules'
    }]
  },
  resolveLoader: {
    root: path.resolve(__dirname, '../'),
    modulesDirectories: ['node_modules', 'src']
  }
}
