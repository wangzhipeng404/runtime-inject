<script>
export default {
  data () {
    return {
      show: true
    }
  },
  created () {
    this.$require(['/lib/test.css', '/lib/hello.umd.js']).then(() => {
      console.log(hello)
      this.$forceUpdate()
    })
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