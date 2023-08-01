const path = require('path');

module.exports = {
  mode: 'production',  
  entry: './src/main.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};