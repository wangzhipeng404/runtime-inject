<script>
export default {
  data () {
    return {
      show: true
    }
  },
  created () {
    this.$require(['/lib/hello.umd.js']).then(() => {
      console.log(hello)
    })
  },
  render (h) {
    const HelloWorld = window.hello
    return (
      <HelloWorld />
    )
  }
}
</script>
<style lang="stylus">
.title
  color blue
</style>