<script>
export default {
  data () {
    return {
      show: true,
      query: {}
    }
  },
  beforeCreate () {
    this.$cache.set('test', () => { console.log (1111) })
    this.axios.defaults.baseURL = 'http://101.200.205.231:7000'
    this.axios.defaults.headers['token'] = ""
  },
  created () {
    this.$require([
      '../h5-components/ai-appeal/AIAppeal.css',
      '../h5-components/ai-appeal/AIAppeal.umd.min.js',
    ]).then(() => {
      console.log(DisplayReport)
      this.$forceUpdate()
    })
  },
  mounted () {
  },
  render (h) {
    const AIAppeal = window.AIAppeal
    return (
      <AIAppeal query={this.query} />
    )
  }
}
</script>
<style lang="stylus">
.title
  color blue
</style>