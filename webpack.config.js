const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const workboxPlugin = require('workbox-webpack-plugin');
const DotEnv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
DotEnv.config({ path: '.env.development'});

module.exports = (env) => {
  const CSSExtract = new ExtractTextPlugin('app.css');
  const isProduction = env === 'production';
  
  return {
    entry: ['@babel/polyfill', './src/client/index.js'],
    output: {
      path: path.join(__dirname, 'public'),
      filename: 'app.bundle.js'
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }, {
        test: /\.s?css$/,
        use: CSSExtract.extract({
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }]
        })
      }]
    },
    plugins: [
      CSSExtract,
      new workboxPlugin.GenerateSW({
        cacheId: 'react-weather-app',
        swDest: 'sw.js',
        navigateFallback: '/index.html',
        clientsClaim: true,
        skipWaiting: true
      }),
      new webpack.DefinePlugin({
        'process.env.OWM_KEY':JSON.stringify(process.env.OWM_KEY),
        'process.env.TIMEZONE_DB_API_KEY':JSON.stringify(process.env.TIMEZONE_DB_API_KEY),
        'process.env.IPDATA_API_KEY':JSON.stringify(process.env.IPDATA_API_KEY)
    })
    ],
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, 'public'),
      publicPath: '/',
      historyApiFallback: true
    }
  }
};