<script>
export default {
  data () {
    return {
      loaded: false
    }
  },
  created () {
      this.$require([
      '../h5-components/ai-swiper/AISwiper.css',
      '../h5-components/ai-swiper/AISwiper.umd.min.js',
    ]).then(() => {
      this.loaded = true
    })
  },
  render () {
    if (!this.loaded) {
        return <div />
    }
    const AISwiper = window.AISwiper
    return (
      <div class="wrap">
        <AISwiper mode="preview" />
      </div>
    )
  },
}
</script>
<style lang="stylus">
.wrap
  width 100vw
  height 100vh
</style>