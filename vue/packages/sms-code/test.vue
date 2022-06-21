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
          positionID: "1536376360816218112",
          userinfoName: "营销云-演示账号",
          positionName: "营销云-演示职位",
        },
        'storeInfo': {
          storeid: '19775392',
          storename: '0607分销商6',
          stroecode: 'ZD0000000013',
          customertype: '905324680615956480'
        }
      }
    }
  },
  created () {
    this.axios.defaults.baseURL = ''
    this.axios.defaults.headers['token'] = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTU0NzQ4MjAsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNTM2NTM5MTk4ODIyMTU4MzM2IiwiYWNjb3VudENvZGUiOiIxNTM2NTM5MTk4NzgwMjE1Mjk2IiwidGVuYW50Q29kZSI6IjEwMDkwMDQiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjoxLCJ0b2tlbklkIjoiYzAyZmM5ZTUtNGQyMi00NjE4LWI4MTAtYjk0MzkyOWU0NTRlIiwib3JnQ29kZSI6IjEiLCJ1c2VySW5mb0lkIjoiMTQyMjM5NTMyOTMxNTIxNjI5MyIsInVzZXJJbmZvTmFtZSI6Imh5c-WFqOadg-mZkCIsInBvc2l0aW9uQ29kZSI6IjE1MzYzNzYzNjA4MTYyMTgxMTIiLCJwb3NpdGlvbk5hbWUiOiLlhajmnYPpmZAt5Yu_5YigIiwibWVtYmVyQ29kZSI6IjE1MzY1MzkxOTg3NjM0MzgwODAiLCJyZWZQb3NpdGlvbkNvZGUiOiIxMzAwNzI4NjE0NTM0Mzg1NjY0IiwiY2F0ZWdvcnlDb2RlIjoiIiwib3JnU3RydWN0VHlwZUlkIjoiMSIsInVzZXJOYW1lIjoiMTg4MTk0OTA5ODYiLCJ1c2VyTmFtZTEiOiIxODgxOTQ5MDk4NiIsInVzZXJOYW1lMiI6bnVsbCwidXNlck5hbWUzIjpudWxsLCJ0ZW5hbnROYW1lIjoiYmPkuIDkvZPljJbmvJTnpLrnp5_miLciLCJhcHBDb2RlIjoic2FsZXMiLCJhcHBDb2RlcyI6WyJkaXN0cmlidXRpb24iLCJwcm9tb3Rpb24iLCJzYWxlcyJdLCJzdWJQZENvZGVzIjpbInNmYSIsImRtcyIsInBtbSIsInRwbSJdLCJjb2RlcGF0aCI6IjEuIiwiaXNsZWFmb3JnIjoiZmFsc2UiLCJtZXRhbW9kZWx0eXBlIjoyLCJpc1Ntc0xvZ2luIjpmYWxzZX19.jLp7rqYauELE6cJ28V2mEnHfjwnd3VRqLstaPfLTZYk"
  }
}
</script>