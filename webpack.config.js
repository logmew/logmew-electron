var webpack = require('webpack');
var ProvidePlugin = webpack.ProvidePlugin;
var path = require('path');

module.exports = {
  entry: {
    selectHost: ['./src/js/boot/boot-select-host.js'],
    editHosts: ['./src/js/boot/boot-edit-hosts.js'],
    logInflux: ['./src/js/boot/boot-log-influx.js'],
  },

  target: 'atom',

  externals: ['electron'],

  output: {
    path: './runtime/browser/bundle',
    filename: '[name].entry.js',
    publicPath: 'bundle/'
    //publicPath: 'http://localhost:8080/'
  },

  devServer: {
    contentBase: './runtime/browser/',
    //publicPath: 'http://localhost:8080/'
  },

  module: {
    loaders: [
      //{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.hbs$/,
        loader: 'handlebars?' +
          'helperDirs[]=' + __dirname + '/src/js/templates/helpers&' +
          'helperDirs[]=' + __dirname + '/src/js/service/influx/logview/templates/helpers'
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      { test: /jquery.min.js$/, loader: 'expose?jQuery!expose?$!expose?window.jQuery' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
      { test: /\.(jpg|jpeg)$/, loader: 'file' },
      { test: /\.png$/, loader: 'url?mimetype=image/png' },
      { test: /favicon.ico$/, loader: 'file?name=favicon.ico' }
    ]
  },

  resolve: {
    root: [
      path.join(__dirname + '/src/components'),
      path.join(__dirname + '/src')
    ]
  }
}
