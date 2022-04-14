<script>
export default {
  data () {
    return {
      show: true,
      query: {
        appid: "wx81ede3953d348969",
        storeInfo: {
          storeid: "1496306543371620462",
          storename: "智慧"
        },
        user: {
          positionID: "1478328891004293120",
          userinfoName: "颜1",
          positionName: "业务员",
        }
      }
    }
  },
  beforeCreate () {
    this.$cache.set('test', () => { console.log (1111) })
    this.axios.defaults.baseURL = 'http://101.200.205.231:7000'
    this.axios.defaults.headers['token'] = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDk3NzAxNTgsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNTEwMDkxODQxNzk2NzA2MzA0IiwiYWNjb3VudENvZGUiOiIxNTEwMDkxODQxNDc3OTM5MjAwIiwidGVuYW50Q29kZSI6IjEwMDAwNjAiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjozLCJ0b2tlbklkIjoiMmQwMWY5OTgtODA4Yy00ZWU1LWIwODgtNjMxNzUyMWYwNTc5Iiwib3JnQ29kZSI6IjE0NzgzMjg3OTUyMTg5NzI2NzIiLCJ1c2VySW5mb0lkIjoiMTUwNTgxMzk0MjY1MDQxMTk1OSIsInVzZXJJbmZvTmFtZSI6IuminDEiLCJwb3NpdGlvbkNvZGUiOiIxNDc4MzI4ODkxMDA0MjkzMTIwIiwicG9zaXRpb25OYW1lIjoi5Lia5Yqh5ZGYIiwibWVtYmVyQ29kZSI6IjE1MTAwOTE4NDA0OTIyNzc3NjAiLCJyZWZQb3NpdGlvbkNvZGUiOiI4ODgwMDAwMDAwMDAwMDAwMDIiLCJjYXRlZ29yeUNvZGUiOiJzZmEtc2FsZXNtYW4iLCJvcmdTdHJ1Y3RUeXBlSWQiOiIxIiwidXNlck5hbWUiOiIxMTIyMzMiLCJ1c2VyTmFtZTEiOiIxMzAwMDAwMDEyMyIsInVzZXJOYW1lMiI6bnVsbCwidXNlck5hbWUzIjoiMTEyMjMzIiwidGVuYW50TmFtZSI6IuaZuuaFpzEwMFY2LjAtYmFzZeS6p-WTgeenn-aItyIsImFwcENvZGUiOiJzYWxlcyIsImFwcENvZGVzIjpbImRpc3RyaWJ1dGlvbiIsInByb21vdGlvbiIsInNhbGVzIl0sInN1YlBkQ29kZXMiOlsic2ZhIiwiZG1zIiwicG1tIiwidHBtIl0sImNvZGVwYXRoIjoiMS4xNDc4MzI4Nzk1MjE4OTcyNjcyLiIsImlzbGVhZm9yZyI6ImZhbHNlIiwibWV0YW1vZGVsdHlwZSI6MSwiaXNTbXNMb2dpbiI6ZmFsc2V9fQ.DWrY-dO6YjdlrWkzh2OEy0Fgj60FwTs3eOm0pHkOjwE"
  },
  created () {
    this.$require([
      '../h5-components/sms-code/SmsCode.css',
      '../h5-components/sms-code/SmsCode.umd.min.js',
    ]).then(() => {
      console.log(SmsCode)
      this.$forceUpdate()
    })
  },
  mounted () {
  },
  render (h) {
    const SmsCode = window.SmsCode
    return (
      <SmsCode query={this.query} />
    )
  }
}
</script>
<style lang="stylus">
.title
  color blue
</style>