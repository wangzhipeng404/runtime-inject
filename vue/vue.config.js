module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    externals: {
      stylus: 'stylus'
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://101.200.205.231:7000',
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