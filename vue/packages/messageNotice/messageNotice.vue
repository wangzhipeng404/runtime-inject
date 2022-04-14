<template>
  <div class="message">
    <div class="title">{{title}}</div>
    <div class="item" v-for="(item, index) in message" :key="index">
      <div @click="link(item.url)">
        <span v-html="item.title"></span>
        <img src="../../src/assets/arrow_right.png" />
      </div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: [],
      work: 1,
      notice: 3,
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
  mounted() {
    this.axios.post(this.queryurl).then((res) => {
      this.message = res.data.resp_data.kx_template;
    });
  },
  methods: {
    link(url) {
      this.$xpe.run("jump", { url: url });
    },
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
  }
  .item {
    div {
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