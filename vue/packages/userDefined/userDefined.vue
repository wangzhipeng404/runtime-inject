<template>
  <div class="userDefined">
    <div class="top">
      <span class="title">{{ title }}</span>
      <img src="../../src/assets/arrow_right.png" @click="link" />
    </div>
    <div class="list">
      <div class="subtitle">
        <div v-for="(item, i) in col" :key="i">
          {{ item.title }}
        </div>
      </div>
      <div class="content">
        <div v-for="(content, index) in content" :key="index">
          <div>{{ content.column1 }}</div>
          <div>{{ content.column2 }}</div>
          <div>{{ content.column3 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: () => [],
    };
  },
  props: {
    col: {
      type: Array,
      default: () => [],
    },
    queryurl: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    jumptype: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  created() {},
  mounted() {
    this.axios.post(this.queryurl).then((res) => {
      this.content = res.data.resp_data.kx_template;
    });
  },
  methods: {
    link() {
      console.log("通用展示列跳转");
      this.$xpe.run("jump", { url: this.url });
    },
  },
};
</script>

<style lang="less">
.userDefined {
  background-color: #fff;
  border-radius: 10px;
  // margin-bottom: 52px;
  padding: 12px;
  .top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    .title {
      font-size: 16px;
      font-family: PingFang SC-Bold, PingFang SC;
      font-weight: bold;
      color: #333333;
    }
  }
  .list {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    .subtitle {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      // display: -webkit-box;
      // overflow-x: auto;
      // -webkit-overflow-scrolling: touch;
      & > div {
        display: inline-block;
        flex: 0 0 33.333%;
        text-align: center;
      }
    }
    .content {
      // display: -webkit-box;
      // overflow-x: auto;
      // -webkit-overflow-scrolling: touch;
      & > div {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #303133;
        margin-bottom: 8px;
        & > div {
          flex: 0 0 33.333%;
          // width: 120px;
          // display: inline-block;
          text-align: center;
          // white-space:nowrap
        }
      }
    }
  }
  .list::-webkit-scrollbar {
    display: none;
  }
}
</style>