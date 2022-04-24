<template>
  <div class="userDefined">
    <div class="top">
      <span class="title">{{ title }}</span>
      <img src="../../src/assets/arrow_right.png" @click="link" />
    </div>
    <div class="list">
      <table :style="{ width: `${widthTable}px` }"  style="border-collapse:separate; border-spacing:0px 8px;">
        <tr class="list-item">
          <td
            class="item subtitle"
            v-for="(item, i) in col"
            :key="i"
            :style="{ width: `${item.colwidth}px` }"
          >
            {{ item.title }}
          </td>
        </tr>
        <template v-for="(content, index) in content">
          <tr class="list-item" :key="index">
            <template v-for="(item, i) in col">
              <td class="item content" :key="i">
                {{ content[`column${i + 1}`] }}
              </td>
            </template>
          </tr>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: () => [],
      widthTable: null,
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
    this.col.map((item) => {
      console.log(item);
      if (item.colwidth) {
        var totalwidth = 0;
        totalwidth += +item.colwidth;
        var screenX = document.body.clientWidth;
        console.log(screenX);
        if (totalwidth < screenX) {
          this.widthTable = screenX - 48;
          this.col.map((i) => (i.colwidth *= this.widthTable / totalwidth));
        }
      }
    });
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
  padding: 12px;
  margin-bottom: 12px;
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
    text-align: center;
    .subtitle {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #909399;
      margin-bottom: 8px;
    }
    .list-item{
      margin-bottom: 8px;
    }
    .content {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #303133;
    }
  }
  .list::-webkit-scrollbar {
    display: none;
  }
}
</style>