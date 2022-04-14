<template>
    <img :src="imgUrl" class="icon"/>
</template>
<script>
import bpImg from './assets/ph/bp.png';
import xpImg from './assets/ph/xp.png';
import qtImg from './assets/ph/qt.png';
import bebImg from './assets/ph/ben.png';
import jpImg from './assets/ph/jp.png';

export default {
  name:'ph-icon',
  props:{
    type:{
      type:String,
      default:'bp'
    }
  },
  data(){
    return {
      imgUrl:''
    }
  },
  created(){
    if(this.type=='bp'){
      this.imgUrl = bpImg;
    }else if(this.type=='xp'){
      this.imgUrl = xpImg;
    }else if(this.type=='qt'){
      this.imgUrl = qtImg;
    }else if(this.type=='ben'){
      this.imgUrl = bebImg;
    }else if(this.type=='jp'){
      this.imgUrl = jpImg;
    }
  }
}
</script>
<style lang="less">
.icon{
  width:15px;
  height:20px;
  vertical-align: middle;
  margin-right:3px;
}
</style>