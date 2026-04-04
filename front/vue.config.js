const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  parallel: false,
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ]
  },
  devServer: {
    proxy: {
      '^/api': {
        target: 'https://personalbarber.vip',
        changeOrigin: true
      },
      '^/.netlify/functions': {
        target: 'https://personalbarber.vip',
        changeOrigin: true
      }
    }
  }
})
