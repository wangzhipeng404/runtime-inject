<template>
  <div class="data-area">
    <div class="top">
      <div class="moduleTitle section">
        <span class="bigTitle">{{info.title}}</span>
        <i class="iconfont eye icon-yanjing" v-if="info.isopentoggle && isopen" @click="toggleOpen()"></i>
        <i class="iconfont eye icon-biyan" v-if="info.isopentoggle && !isopen" @click="toggleOpen()"></i>
      </div>
      <div class="arrow section" v-if="info.url" @click="link(info.url)" style="text-align:right">
        <i class="iconfont icon-xiangyoujiantou"></i>
      </div>
      <div class="subtitle section"  :style="{textAlign:info.url?'left':'right'}" v-if="info.subtitle">
        <span>{{info.subtitle}}</span>
      </div>
    </div>
    <div class="item-wrap">
      <div class="item" v-for="(item, index) in displayData" :key="item.count" :style="{width: (100/info.colunnumber)+'%'}" :class="{after:(index+1)%info.colunnumber !== 0}">
        <div class="data" @click="link(item.url)" :style="{color: info.datacolor, fontSize:'20px'}">
        {{ isopen ?  item.count  : '******' }}
        </div>
        <div class="title" :style="{color: info.textcolor, fontSize:'12px'}">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import '../../src/assets/iconfont/iconfont.css'
export default {
  data() {
    return {
      //从协议中获取
      info: {},
      displayData: [],
      isopen: true,
    };
  },
  props: {
    protocol: {
      type: Object,
      default: () => {},
    },
  },
  beforeCreate() {},
  created() {
    this.init();
    console.log(123)
  },
  watch: {
    protocol() {
      this.init();
    },
  },
  methods: {
    init() {
      this.info = {...this.protocol}
      if (this.info.bind && this.info.bind.logiccode) {
        this.queryurl = this.info.bind.logiccode
      } else {
        this.queryurl = this.info.queryurl
      }
      if(this.info.isopentoggle){
        this.isopen = false
      }
      this.info.colunnumber = this.info.colunnumber ? this.info.colunnumber : '4'
      this.info.datacolor = this.info.datacolor ? this.info.datacolor : '#1a85ff'
      this.info.isopentoggle = this.info.isopentoggle ? this.info.isopentoggle : false
      this.getData()
    },
    getData() {
      this.axios.post(this.queryurl).then((res) => {
        this.displayData = res.data.resp_data.kx_template;
      })
    },
    toggleOpen() {
      this.isopen = !this.isopen
    },
    link(url) {
      this.$xpe.run("jump",  url );
    },
  },
};
</script>

<style lang="less">
.data-area {
  width: 100%;
  box-sizing: border-box;
  font-family: PingFang SC-Bold, PingFang SC;
  margin-bottom: 20px;
  box-sizing: border-box;
  padding: 12px;
  background-color: #fff;
  margin-bottom: 12px;
  border-radius: 10px;
  .item-wrap{
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 12px;
    box-sizing: border-box;
  }
  .top{
      display: flex;
      flex-wrap: wrap;
      // width: 100%;
      .moduleTitle{
        padding-bottom: 6px;
        width: 80%;
        .bigTitle{
          padding-right: 8px;
          color:#303133;
          font-weight: bold;
          font-size: 16px
        }
      }
      .section{
        // width: 50%;
        .eye{
          color: #C0C4CC;
        }
        .icon-xiangyoujiantou{
          color: #D0D5DD;
        }
      }
      .subtitle{
        padding-top: 3px;
        color:#C0C4CC;
        font-size: 12px;
        width: 20%;
      }
      .arrow{
        text-align:right;
        width: 20%;
      }
    }
  .item::-webkit-scrollbar {
    display: none;
  }
  .item {
    padding: 12px 4px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    position: relative;
    .icon {
      width: 44px;
      height: 44px;
      margin: 2px auto;
      overflow: hidden;
    }
    .title {
      font-size: 12px;
      margin: 6px auto 0;
      color: #606266;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
  .after::after{
    content: '';
    height: 21px;
    width: 1px;
    background-color: #E0E6EE;
    position: absolute;
    top: 50%;
    right: 0;
  }
}
</style>
