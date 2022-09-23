<template>
  <van-image :src="src" :width="width" :height="height" />
</template>

<script>
export default {
  props: ['value', 'width', 'height'],
  data () {
    return {
      src: ''
    }
  },
  watch: {
    value () {
      this.setValue()
    }
  },
  created () {
    this.setValue()
  },
  methods: {
    setValue () {
      if (!this.value) return
      let val = this.value
      if (typeof this.value === 'string') {
        val = JSON.parse(this.value)
      }
      if (Array.isArray(val)) {
        val = val[0]
      }
      if (!val) return
      console.log(val)
      this.$OSS.getUrl('img', val, { width: this.width, height: this.height }).then(url => {
        this.src = url
      })
    },
  }
}
</script>
