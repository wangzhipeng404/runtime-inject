<template>
  <div class="message">
    <div class="title">
      <span>{{info.title}}</span>
      <img src="../../src/assets/arrow_right.png" v-if="info.url" @click="link(info.url)"/>
    </div>
    <div class="item" v-for="(item, index) in message" :key="index">
      <div @click="link(item.url)" class="item-wrap"  v-if="!oldprotocol">
        <div>
          <span class="item-title">{{item.title}}</span>
          <span class="item-subtitle">{{item.subtitle}}</span>
        </div>
        <img src="../../src/assets/arrow_right.png"  v-if="item.url"/>
      </div>
      <div class="oldprotocol" @click="link(item.url)" v-if="oldprotocol">
        <span v-html="item.title"></span>
        <img src="../../src/assets/arrow_right.png"  v-if="item.url"/>
      </div>
      <div class="line"></div>
    </div>
    <div v-if="message.length === 0" style="width:100%;display:flex;justify-content:center;align-item:center">
      <img src="../../src/assets/none.png" alt="" style="width:150px;">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: [],
      work: 1,
      oldprotocol: false,
      notice: 3,
      info:{},
      queryurl:''
    };
  },
  props: {
    protocol: {
      type: Object,
      default: () => {},
    },
    native: {
      type: Boolean,
      default: false
    },
    notices: {
      type: Array,
      default: () => [],
    },
    nativeCount: {
      type: Object,
      default: () => {},
    }
  },
  watch: {
    notices (val) {
      if (this.native) {
        this.message = val
      }
    }
  },
  mounted() {
    this.init()
    console.log(this.info)
    // 判断是不是旧协议
    this.axios.post(this.queryurl,{ clienttypecode: '2' }).then((res) => {
      let messageList = res.data.resp_data.kx_template;
      if(messageList.count !== undefined){
        this.oldprotocol = false
        // 新协议：本地取subtitle
        messageList.list.forEach((i)=>{
          if(i.subtitle.includes('native')){
            let countName = i.subtitle.split(':')[1].trim()
            i.subtitle = this.nativeCount[countName]
          }
        })
        this.message = messageList.list
      } else {
        // 兼容旧协议：v-html
        this.oldprotocol = true
        // 兼容旧协议：本地取整条message
        if (this.native && this.oldprotocol) {
          this.message = this.notices
        } else {
          this.message = res.data.resp_data.kx_template
        }
      }
    });
  },
  methods: {
    link(url) {
      this.$xpe.run("jump", url);
    },
    init() {
      this.info = {...this.protocol}
      // this.queryurl = this.info.queryurl
      if(this.protocol.bind && this.protocol.bind.logiccode){
        this.queryurl = this.protocol.bind.logiccode
      } else if (this.protocol.queryurl){
        this.queryurl = this.protocol.queryurl
      }
    }
  },
};
</script>

<style lang="less">
.message {
  background-color: #fff;
  border-radius: 10px;
  margin-bottom: 12px;
  padding: 12px;
  .title {
    font-size: 16px;
    font-family: PingFang SC-Bold, PingFang SC;
    font-weight: bold;
    color: #333333;
    display: flex;
    justify-content: space-between;
    img{
      width: 22px;
      height: 22px;
    }
  }
  .item {
    .item-wrap {
      display: flex;
      justify-content: space-between;
      height: 49px;
      align-items: center;
      vertical-align: center;
      span {
        margin: 0;
        font-size: 15px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .item-subtitle {
        color: #F99D14;
        margin: 0 4px;
        padding: 0 8px;
        background-color: #FFF5E7; 
        font-size: 14px;
        border-radius: 11px;
      }
      img {
        width: 22px;
        height: 22px;
      }
    }
    .oldprotocol {
      display: flex;
      justify-content: space-between;
      height: 49px;
      align-items: center;
      vertical-align: center;
      span {
        margin: 0;
        font-size: 15px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        .color {
          color: #f99d14;
          margin: 0 4px;
        }
      }
      img {
        width: 22px;
        height: 22px;
      }
    }
    .line {
      width: 327px;
      height: 1px;
      background-color: #eeeeee;
      transform: scaleY(0.5);
    }
  }
}
.item:last-child .line {
  width: 0px;
  height: 0px;
  background-color: #eeeeee;
}
</style>