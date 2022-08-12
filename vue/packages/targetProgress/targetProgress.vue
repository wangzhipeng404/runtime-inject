<template>
  <div class="progressContainer">
    <div class="top">
      <span class="title">{{ info.title }}</span>
      <img src="../../src/assets/arrow_right.png"  @click="link(info.url)" v-if="info.url"/>
    </div>
    <div class="progress" v-for="(item, index) in progress" :key="index">
      <div class="top">
        <div class="subtitle">{{ item.title }}</div>
        <div class="number">{{ item.complete }}/{{ item.target }}</div>
      </div>
      <div class="bottom">
        <van-progress
          :percentage="item.percentage"
          stroke-width="6"
          :show-pivot="false"
          :color="item.color"
        />
      </div>
    </div>
    <div v-if="progress.length === 0" style="width:100%;display:flex;justify-content:center;align-item:center">
      <img src="../../src/assets/none.png" alt="" style="width:150px;">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: [],
      url: "",
      progresscolor:'',
      queryurl:'',
      info:{}
    };
  },
  props: {
    protocol:{},
  },
  watch:{
    protocol(){
      this.init()
    }
  },
  created(){
  },
  methods: {
    link(url) {
      this.$xpe.run("jump", url );
    },
    init() {
      console.log('progressinit')
      if(this.protocol.bind && this.protocol.bind.logiccode){
        this.queryurl = this.protocol.bind.logiccode
        console.log(this.queryurl)
      } else if (this.protocol.queryurl){
        this.queryurl = this.protocol.queryurl
        console.log(this.queryurl)
      }
      this.info = {...this.protocol}
      this.getData()
    },
    getData() {
      this.axios.post(this.queryurl,{ clienttypecode: '2' }).then((res) => {
        let data = res.data.resp_data.kx_template;
        data.forEach((i) => {
          i.percentage = (i.complete / i.target) * 100 > 100 ? '100' : (i.complete / i.target) * 100;
          if(i.percentage<=20){
            i.color = '#F95A14'
          }else if(i.percentage>20 && i.percentage<=80){
            i.color = '#F99D14'
          }else if(i.percentage>80 && i.percentage<=100){
            i.color = '#1A85FF'
          }
          if((i.complete / i.target) * 100 >100){
            i.color = '#3ac892'
          }
        });
        this.progress = data;
      });
    },
  },
  mounted() {
    this.init();
  },
  computed: {},
};
</script>

<style lang="less">
.progressContainer {
  box-sizing: border-box;
  width: 100%;
  // height: 210px;
  padding: 12px;
  background-color: #fff;
  margin-bottom: 12px;
  border-radius: 10px;
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    .title {
      font-size: 16px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #333333;
    }
    img{
      width: 22px;
      height: 22px;
    }
  }
  // .title {
  //   font-size: 16px;
  //   font-family: PingFang SC-Bold, PingFang SC;
  //   font-weight: bold;
  //   color: #333333;
  //   margin-bottom: 16px;
  // }
  .progress {
    margin-bottom: 16px;
    .top {
      width: 100%;
      display: flex;
      margin-bottom: 8px;
      justify-content: space-between;
      .subtitle {
        font-size: 15px;
        color: #444444;
      }
      .number {
        font-size: 14px;
        color: #606266;
      }
    }
  }
}
</style>