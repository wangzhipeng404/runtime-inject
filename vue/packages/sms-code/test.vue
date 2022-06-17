<template>
  <smscode :query="query" />
</template>
<script>
import smscode from './index.vue'

export default {
  name: 'test-smscode',
  components: {
    smscode,
  },
  data () {
    return {
      query: {
        "appid": 'wx81ede3953d348969',
        "user": {
          positionID: "1536622815460069376",
          userinfoName: "营销云-演示账号",
          positionName: "营销云-演示职位",
        },
        'storeInfo': {
          storeid: '19775392',
          storename: '0607分销商6',
        }
      }
    }
  },
  created () {
    this.axios.defaults.baseURL = ''
    this.axios.defaults.headers['token'] = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTUyNjY2NTUsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNTM2NTYxOTg2MTkwNTc3NjY0IiwiYWNjb3VudENvZGUiOiIxNTM2NTYxOTg1ODUwODM5MDQwIiwidGVuYW50Q29kZSI6IjEwMDkwMDQiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjoxLCJ0b2tlbklkIjpudWxsLCJvcmdDb2RlIjpudWxsLCJ1c2VySW5mb0lkIjpudWxsLCJ1c2VySW5mb05hbWUiOm51bGwsInBvc2l0aW9uQ29kZSI6bnVsbCwicG9zaXRpb25OYW1lIjpudWxsLCJtZW1iZXJDb2RlIjpudWxsLCJyZWZQb3NpdGlvbkNvZGUiOm51bGwsImNhdGVnb3J5Q29kZSI6bnVsbCwib3JnU3RydWN0VHlwZUlkIjpudWxsLCJ1c2VyTmFtZSI6IjE3NzEiLCJ1c2VyTmFtZTEiOiIxMzUxMjc3MTc3MSIsInVzZXJOYW1lMiI6bnVsbCwidXNlck5hbWUzIjoiMTc3MSIsInRlbmFudE5hbWUiOm51bGwsImFwcENvZGUiOm51bGwsImFwcENvZGVzIjpudWxsLCJzdWJQZENvZGVzIjpudWxsLCJjb2RlcGF0aCI6bnVsbCwiaXNsZWFmb3JnIjpudWxsLCJtZXRhbW9kZWx0eXBlIjoyLCJpc1Ntc0xvZ2luIjpmYWxzZX19.F2QcwlZLLWAv0XiJV3Dteo7h_IYvK81YAqQvER-av8s"
  }
}
</script>