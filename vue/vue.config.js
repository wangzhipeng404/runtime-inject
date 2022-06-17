module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    externals: {
      stylus: 'stylus'
    }
  },
  devServer: {
    proxy: {
      '/miniapi': {
        target: 'http://172.16.72.78:8021',
        ws: true,
        changeOrigin: true
      },
      '/api/teapi': {
        target: 'http://120.24.27.225:7000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 20000 }))
  },
  publicPath: './',
  indexPath: 'page.html',
  outputDir: 'dist/vue',
  productionSourceMap: false,
}