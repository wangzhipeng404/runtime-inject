module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    externals: {
      stylus: 'stylus'
    }
  },
  devServer: {
    contentBase: ['public', 'dist'],
    proxy: {
      '/api': {
        target: 'http://120.24.27.225:7000/',
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