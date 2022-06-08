module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    externals: {
      // stylus: 'stylus'
    }
  },
  publicPath: './',
  indexPath: 'page.html',
  outputDir: 'dist/vue',
  productionSourceMap: false,
}