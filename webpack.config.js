const path = require('path');
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin');

module.exports = {
  // webpackでバンドルするjsのファイルを指定する
  entry: {
    desktop: './src/js/desktop.js',
    config: './src/js/config.js',
  },
  // webpackでバンドルしたファイルが出力する先を指定する
  output: {
    path: path.resolve(__dirname, 'plugin', 'js'),
    filename: '[name].js',
    publicPath: '/js/'  // これにより相対パスが正しく設定されます
  },
  // プラグインのパッケージングに必要なファイルのパスを設定する
  plugins: [
    new KintonePlugin({
      manifestJSONPath: './plugin/manifest.json',
      privateKeyPath: './private.ppk',
      pluginZipPath: './dist/plugin.zip',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: 'eval-source-map',
  performance: {
    maxAssetSize: 1024 * 1024 * 5, // 5MB
    maxEntrypointSize: 1024 * 1024 * 5 // 5MB
  }
};
