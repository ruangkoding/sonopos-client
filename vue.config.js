// vue.config.js
let webpack = require('webpack');
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    output: {
      filename: '[name].[hash].js'
    }
  }
}