const path = require('path');
const process = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// https://webpack.js.org/guides/typescript/
module.exports = {
  entry: './src/app.ts',
  // context: path.resolve(__dirname, './src'),
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      // css,scss読み込み ref:https://ics.media/entry/17376#procon-css
      { test: /\.css$/, use: ['style-loader', {loader: 'css-loader', options: {url: false}}] },
      { test: /\.scss$/, use: [
        {loader: 'style-loader'},
        {loader: 'css-loader', options: {url: false, sourceMap: true, importLoaders: 2}},
        {loader: 'sass-loader', options: {sourceMap: true}}
      ] }
      // { test: /\.html$/, use: { loader: 'html-loader', options: { miniimze: true } } }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    // output to './dist/bundle.js'
    filename: 'bundle.js',
    path: path.resolve(__dirname, './docs/js')
  },
  mode: process.env.WEBPACK_ENV === 'prod' ? 'production' : 'development',
  // webpack-dev-server
  devServer: {
    contentBase: path.join(__dirname, 'docs'), // ./dist/ が localhost:8000/ としてserveされる
    publicPath: '/js/',  // compiledなjsは /js/ 以下にserveされる(fileに書き出されず、メモリ内に展開されるだけ)
    compress: true,
    watchContentBase: true,
    // index: 'src/index.html'
  },
  plugins: [
  ]
};
