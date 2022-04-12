<template>
  <div class="icon-area">
    <div class="item" v-for="(value, index) in info" :key="index">
      <div class="icon" @click="link(value.url)">
        <van-image width="44px" height="44px" fit="cover" :src="value.imgurl" />
      </div>
      <div class="title">{{ value.title }}</div>
    </div>
  </div>
</template>

<script>
// import { getImageUrl } from "./utils";

export default {
  data() {
    return {
      //从协议中获取
      info: [],
      tenantcode: "",
    };
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  beforeCreate() {},
  created() {
    this.tenantcode = this.$cache.get("tenantcode");
    this.init();
  },
  watch: {
    value(newvalue) {
      this.images = newvalue;
      this.init();
    },
  },
  methods: {
    // init () {
    //   this.images = this.value.map(img => {
    //     const imageArr = img.img ? JSON.parse(img.img) : []
    //     if (imageArr.length > 0) {
    //       img.img = getImageUrl(imageArr[0])
    //     } else {
    //       img.img = ''
    //     }
    //     return img
    //   })
    // }
    init() {
      console.log("000000");
      console.log(this.tenantcode);
      this.info = this.value.map((i) => {
        return {
          ...i,
          imgurl:
            "http://xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com/" +
            JSON.parse(i.icon)[0].source.substring(0, 3) +
            "/img/" +
            this.$dayjs(+JSON.parse(i.icon)[0].datetime).format("YYYYMMDD") +
            "/" +
            this.tenantcode +
            "/" +
            JSON.parse(i.icon)[0].source,
        };
      });
    },
    link(url) {
      this.$xpe.run("jump", { url: url });
    },
  },
};
</script>

<style lang="less">
.icon-area {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .item {
    width: 20%;
    padding: 4px auto;
    .icon {
      width: 44px;
      height: 44px;
      margin: 2px auto;
      overflow: hidden;
    }
    .title {
      font-size: 12px;
      margin: 6px auto 0;
      text-align: center;
      color: #606266;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
    }
  }
}
</style>