const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const DotEnv = require('dotenv');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
DotEnv.config({ path: '.env.development'});

const resolve = (dir) => {
  return path.join(__dirname, '..', dir);
};

module.exports = {
  entry: [
    '@babel/polyfill', resolve('src/client/index.js')
  ],
  output: {
    path: resolve('dist'),
    filename: 'js/[name].bundle.js',
    publicPath: '/'
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
      use: [{
        loader: MiniCssExtractPlugin.loader
      }, {
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
    }, {
      test: /\.(png|svg|jpg|jpeg|gif)$/,
      use: [{
        loader: 'file-loader',
        options: {
          limit: 10000,
          outputPath: 'images',
          name: '[name].[hash].[ext]'
        }
      }]
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      loader: 'file-loader',
      options: {
        limit: 10000,
        name: '[name].[hash].[ext]',
        outputPath: 'media'
      }
    }, {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          limit: 10000,
          name: '[name].[hash].[ext]',
          outputPath: 'fonts'
        }
      }]
    }]
  }, 
  resolve: {
    modules: [
      resolve('src'),
      'node_modules'
    ],
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].[contenthash]_[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env.OWM_KEY':JSON.stringify(process.env.OWM_KEY),
      'process.env.TIMEZONE_DB_API_KEY':JSON.stringify(process.env.TIMEZONE_DB_API_KEY),
      'process.env.IPDATA_API_KEY':JSON.stringify(process.env.IPDATA_API_KEY),
      'process.env.ACCU_KEY':JSON.stringify(process.env.ACCU_KEY),
      'process.env.WEATHERBIT_KEY':JSON.stringify(process.env.WEATHERBIT_KEY)
    })
  ]
};
