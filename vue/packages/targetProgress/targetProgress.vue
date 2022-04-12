<template>
  <div class="progressContainer">
    <div class="title">{{title}}</div>
    <div class="progress" v-for="(item, index) in progress" :key="index">
      <div class="top">
        <div class="subtitle">{{ item.tltle }}</div>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: [],
      url: "",
      progresscolor:''
    };
  },
  props: {
    queryurl: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  created(){
    console.log(this.queryurl);
  },
  methods: {
    getData() {
      this.axios.post(this.queryurl).then((res) => {
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
    this.getData();
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
  .title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
  }
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