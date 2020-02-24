module.exports = {
  lintOnSave: false,
  publicPath: './',
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    before: app => { },
    proxy: {
      '/baseUrl': {
        target: 'http://192.168.7.13:40081',//
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/baseUrl': ''   //需要rewrite的,
        }
      },
    }

  },
}
