module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    externals: {
      stylus: 'stylus'
    }
  },
  css: { 
    extract: false 
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 20000 }))
  },
  devServer: {
    contentBase: ['public', 'dist'],
    proxy: {
      '/api': {
        target: 'http://101.200.205.231:7000/',
        ws: true,
        changeOrigin: true
      },
    },
  },
  publicPath: './',
  indexPath: 'page.html',
  outputDir: 'dist/vue',
  productionSourceMap: false,
}