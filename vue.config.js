// vue.config.js
let webpack = require('webpack');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  configureWebpack: {
    plugins: [
      //new BundleAnalyzerPlugin(),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
      new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
    ],
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.min.js',
        'jquery': "jquery/dist/jquery.min.js"
      }
    },
    output: {
      filename: '[hash].js'
    }
  },
  outputDir: 'dist',
  //publicPath: process.env.NODE_ENV === 'production' ? '/sonopos' : './'
  publicPath: process.env.VUE_APP_BASE_ROUTE
}