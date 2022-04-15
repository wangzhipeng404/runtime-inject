<template>
  <div v-show="show" class="page">
    <div class="top">
      <div class="flex-top">
        <!-- <div class="top-t">添加申诉产品</div> -->
        <van-button @click="show=false" size="small" type="info">返回 </van-button>
      </div>
      <van-search
        v-model="name"
        show-action
        clearable=""
        placeholder="产品名称"
      >
       <!-- <template #action>
        <div @click="search">搜索</div>
      </template> -->
      </van-search>
    </div>
    <div class="list">
      <div v-for="item in list" :key="item.productcode" @click="selectProduct(item)" class="item">
        {{item.productname}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:'product-list',
  props:{
    productList:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){
    return {
      name:'',
      show:false,
    }
  },
  computed:{
    list(){
      return this.productList.filter(item=>{
        return item.productname.indexOf(this.name)!='-1';
      })
    }
  },
  methods:{
    search(){
      
    },
    open(){
      this.show = true;
    },
    selectProduct(item){
      this.show = false;
      this.$emit('selectProduct', item);
    }
  }
}
</script>

<style lang="less" scoped>
.page{
  position: fixed;
  top:0;
  bottom:0;
  left:0;
  right:0;
  background-color: #fafafa;
  overflow: auto;
  padding-top:94px;
  z-index: 99;
}
.top{
  position: fixed;
  top:0;
  left:0;
  right:0;
  z-index: 999;
  background-color: #fafafa;
}
.flex-top{
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding:5px 10px;
  box-sizing: border-box;
}
.item{
  display: flex;
  border-bottom:1px solid #dedede;
  height:40px;
  line-height: 40px;
  padding:0 10px;
  font-size: 14px;
}
.product-img{
  width:36px;
  height:36px;
  margin-right:10px;
  margin-top:1px;
}
</style>