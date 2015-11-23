var webpack = require('webpack');
var ProvidePlugin = webpack.ProvidePlugin;

module.exports = {
  entry: {
    app: ['webpack/hot/dev-server', './src/js/entry.js']
  },

  target: 'atom',
  externals: ['electron'],

  output: {
    path: './runtime/browser/bundle',
    filename: 'main.js',
    publicPath: 'http://localhost:8080/'
  },

  devServer: {
    contentBase: './runtime/browser/',
    publicPath: 'http://localhost:8080/'
  },

  module: {
    loaders: [
      //{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.hbs$/, loader: 'handlebars?helperDirs[]=' + __dirname + '/src/js/templates/helpers' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
      { test: /\.scss$/, loader: 'style!css!sass' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff'
      },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file' },
      { test: /\.(jpg|jpeg)$/, loader: 'file' },
      { test: /\.png$/, loader: 'url?mimetype=image/png' },
      { test: /favicon.ico$/, loader: 'file?name=favicon.ico' }
    ]
  },

  plugins: [
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
}
