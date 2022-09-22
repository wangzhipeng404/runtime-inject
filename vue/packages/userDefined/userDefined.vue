<template>
  <div class="userDefined">
    <div class="top">
      <span class="title">{{ info.title }}</span>
      <img src="../../src/assets/arrow_right.png" @click="link(info.url)" v-if="info.url"/>
    </div>
    <div class="list">
      <table
        :style="{ width: `${widthTable}px` }"
        style="border-collapse: separate; border-spacing: 0px 8px"
      >
        <tr class="list-item">
          <td
            v-for="(item, i) in col"
            :key="i"
            :style="{
              width: `${item.colwidth}px`,
              display:
                Object.keys(item).indexOf('isshow') === -1 || item.isshow === true
                  ? 'table-cell'
                  : 'none',
            }"
          >
            <span class="item subtitle">{{ item.title }}</span>
          </td>
        </tr>
        <template v-for="(content, index) in content">
          <tr class="list-item" :key="index">
            <template v-for="(item, i) in col">
              <td
                class="item content"
                :key="i"
                v-if="content[`column${i + 1}`] !== 'notShow'"
              >
                {{ content[`column${i + 1}`] }}
              </td>
            </template>
          </tr>
        </template>
      </table>
      <div v-if="content.length === 0" style="width:100%;display:flex;justify-content:center;align-item:center">
        <img src="../../src/assets/none.png" alt="" style="width:150px;">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: () => [],
      widthTable: null,
      totalwidth: null,
      screenX: null,
      notShowIndex: [],
      queryurl: "",
      info: {},
      col: [],
    };
  },
  props: {
    protocol: {
      type: Object,
      default: () => {},
    },
    // col: {
    //   type: Array,
    //   default: () => [],
    // },
    // queryurl: {
    //   type: String,
    //   default: "",
    // },
    // title: {
    //   type: String,
    //   default: "",
    // },
    // url: {
    //   type: String,
    //   default: "",
    // },
    // jumptype: {
    //   type: String,
    //   default: "",
    // },
    // type: {
    //   type: String,
    //   default: "",
    // },
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.info = { ...this.protocol };
      this.info.col.forEach((i, index) => {
        if (Object.keys(item).indexOf("isshow") === -1 || i.isshow === true) {
          console.log("show");
        } else {
          this.notShowIndex.push(index);
        }
      });
      this.col = this.info.col;
      // console.log("this.notShowIndex", this.notShowIndex);
      this.url = this.info.url;
      if (this.protocol.bind && this.protocol.bind.logiccode) {
        this.queryurl = this.protocol.bind.logiccode;
      } else if (this.protocol.queryurl) {
        this.queryurl = this.protocol.queryurl;
      }
      this.getData();
      this.modifyScreen();
    },
    modifyScreen() {
      this.totalwidth = 0
      this.col.map((item) => {
        if (
          item.colwidth &&
          (!Object.keys(item).indexOf('isshow') || item.isshow === true)
        ) {
          // if (item.colwidth) {
          this.totalwidth += +item.colwidth;
          this.screenX = document.body.clientWidth;
        }
        this.$nextTick(() => {
          if (this.totalwidth < this.screenX) {
            this.widthTable = this.screenX - 48;
            // console.log(this.col);
            // console.log(this.screenX);
            // console.log(this.widthTable);
            // console.log(this.totalwidth);
            // console.log(this.widthTable / this.totalwidth);
            this.col.map(
              (i) => (i.colwidth *= this.widthTable / this.totalwidth)
            );
            console.log("缩放列宽");
            console.log(this.col);
          } else {
            this.widthTable = this.totalwidth;
          }
        });
      });
    },
    getData() {
      this.axios.post(this.queryurl,{ clienttypecode: '2' }).then((res) => {
        let content = res.data.resp_data.kx_template;
        content.forEach((item) => {
          for (let i = 0; i < this.notShowIndex.length; i++) {
            item[`column${this.notShowIndex[i] + 1}`] = "notShow";
          }
        });
        this.content = content;
        // console.log('content',content)
      });
    },
    link(url) {
      console.log("通用展示列跳转");
      this.$xpe.run("jump", url )
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
    margin-bottom: 8px;
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
    .list-item {
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