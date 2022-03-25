<script>
export default {
  data () {
    return {
      show: true
    }
  },
  beforeCreate () {
    this.$cache.set('test', { test :'test cache'})
  },
  created () {
    this.$require(['/lib/test.css', '../hello/hello.umd.js']).then(() => {
      console.log(hello)
      this.$forceUpdate()
    })
  },
  mounted () {
    this.axios.defaults.headers.common['token'] = '1234567'
  },
  render (h) {
    const HelloWorld = window.hello
    return (
      <div>
        <div class="color-blue">2342452</div>
        <HelloWorld />
      </div>
    )
  }
}
</script>
<style lang="stylus">
.title
  color blue
</style>