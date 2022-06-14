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
          positionID: "1478989804644470784",
          userinfoName: "陈畅",
          positionName: "全权限-勿删",
        },
        'storeInfo': {
          storeid: '19775392',
          storename: '0607分销商6',
        }
      }
    }
  },
  created () {
    this.axios.defaults.baseURL = 'http://101.200.205.231:7000/'
    this.axios.defaults.headers['token'] = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTUxODMyNjUsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNDc4NTUyMzUwNzM3MTc0NTI4IiwiYWNjb3VudENvZGUiOiIxNDc4NTUyMzUwNzIwMzk3MzEyIiwidGVuYW50Q29kZSI6IjEwMDAwNjAiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjozLCJ0b2tlbklkIjoiMGU1NjZkY2UtNDQ5MS00MzQ5LThhZGEtNzFmNDRmYjY5NjQ1Iiwib3JnQ29kZSI6IjEiLCJ1c2VySW5mb0lkIjoiMTQ3ODU1MjM1MDkwMDc1MjM4NCIsInVzZXJJbmZvTmFtZSI6IumZiOeVhSIsInBvc2l0aW9uQ29kZSI6IjE0Nzg5ODk4MDQ2NDQ0NzA3ODQiLCJwb3NpdGlvbk5hbWUiOiLlhajmnYPpmZAt5Yu_5YigIiwibWVtYmVyQ29kZSI6IjE0Nzg5OTA0MDIxMjcyNjk4ODgiLCJyZWZQb3NpdGlvbkNvZGUiOiIxMzAwNzI4NjE0NTM0Mzg1NjY0IiwiY2F0ZWdvcnlDb2RlIjoiIiwib3JnU3RydWN0VHlwZUlkIjoiMSIsInVzZXJOYW1lIjoiMTAwMDA2MCIsInVzZXJOYW1lMSI6IjEwMDAwNjAiLCJ1c2VyTmFtZTIiOiIyNjA2NTUwNzlAcXEuY29tIiwidXNlck5hbWUzIjpudWxsLCJ0ZW5hbnROYW1lIjoi5pm65oWnMTAwVjYuMC1iYXNl5Lqn5ZOB56ef5oi3IiwiYXBwQ29kZSI6InNhbGVzIiwiYXBwQ29kZXMiOlsiZGlzdHJpYnV0aW9uIiwicHJvbW90aW9uIiwic2FsZXMiXSwic3ViUGRDb2RlcyI6WyJzZmEiLCJkbXMiLCJwbW0iLCJ0cG0iXSwiY29kZXBhdGgiOiIxLiIsImlzbGVhZm9yZyI6ImZhbHNlIiwibWV0YW1vZGVsdHlwZSI6MSwiaXNTbXNMb2dpbiI6ZmFsc2V9fQ.EIdkTJz-OyzHJnPcKM0dOFq_Q6WAjNI4YOfXBCqDBP4"
  }
}
</script>