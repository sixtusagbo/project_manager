const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: './',
  },
  devServer: {
    static: './',
    compress: true,
    host: '0.0.0.0',
    port: 8080,
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      publicPath: './',
      serverSideRender: true,
      writeToDisk: true,
    },
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
