const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, './src/renderer.js'),
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            exclude: /node_modules/,
            presets: ['@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      }
    ],
  },
  optimization: {
    splitChunks: { chunks: "all" }
  },
  resolve: {
    extensions: ['*', '.js', 'jsx']
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash].bundle.js',
  },
  devServer: {
    static: path.resolve(__dirname, './src'),
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, './src/index.html')
  }),
  new FaviconsWebpackPlugin("./src/resources/measure.png")],
};
