<template>
  <div>
    HelloWorld
  </div>
</template>

<script>

export default {
  name: 'hello-word',
  mounted () {
    this.$http.get('/lib/test.css').then(res => {
      console.log(res)
    })
    console.log(this.$cache.get('test'))
  },
}
</script>

<style>

</style>
