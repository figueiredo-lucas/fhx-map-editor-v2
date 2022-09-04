module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      path: require.resolve("path-browserify")
    }
  },
  module: {
    rules: require('./rules.webpack'),
  },
}