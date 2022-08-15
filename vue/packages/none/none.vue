<template>
<div class="wrap">
  <div class="content">
    <img src="./img/img_empty@2x.png" alt="" >
    <div class="text">请在【产品配置中心】-【门户引擎】中配置登录职位的工作台</div>
  </div>
    
</div>
</template>

<script>
export default {
  created() {
    console.log('init none')
  }
}
</script>

<style scoped>
.wrap {
  width: 100%;
  height: 100vh;
  position: absolute;
}
.content{
  width: 64%;
  top:20%;
  position: relative;
  /* display: block; */
  margin: 0 auto;
}
img{
  width: 100%;
}
.text {
  margin-top: 30px;
  color: #606266;
  font-size: 14px;
  width: 100%;
  text-align: center;
}
</style>