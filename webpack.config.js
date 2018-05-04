const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
  	filename: "bundle.js",
  	path: path.resolve(__dirname, 'dist')
  },
  devServer: {
  	contentBase: path.join(__dirname, 'dist'),
  	port: 5000
  },
  module: {
    rules: [
      { test: /\.js$/, use: "strict-loader" }
    ]
  }
};