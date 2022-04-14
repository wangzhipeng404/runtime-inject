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
      '../h5-components/display-report/DisplayReport.css',
      '../h5-components/display-report/DisplayReport.umd.min.js',
    ]).then(() => {
      console.log(DisplayReport)
      this.$forceUpdate()
    })
  },
  mounted () {
  },
  render (h) {
    const DisplayReport = window.DisplayReport
    return (
      <DisplayReport query={this.query} />
    )
  }
}
</script>
<style lang="stylus">
.title
  color blue
</style>