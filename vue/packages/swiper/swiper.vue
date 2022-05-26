<template>
  <div>
    <van-swipe :autoplay="3000">
      <van-swipe-item
        v-for="(item, index) in imagesinfo"
        :key="index"
        @click="link(item.url)"
      >
        <img :src="item.img" />
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imagesinfo: [],
      tenantcode: "",
      url: "",
      ossConfig: {},
      emptyUrl: require("../../src/assets/empty.png"),
    };
  },
  props: {
    queryurl: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.tenantcode = this.$cache.get("tenantcode");
    this.ossConfig = this.$cache.get("ossConfig");
    this.getDate();
  },
  methods: {
    getDate() {
      let that = this;
      this.axios.post(this.queryurl).then((res) => {
        // console.log(res);
        // res.data.resp_data.kx_template = []
        if (res.data.resp_data.kx_template.length) {
          this.imagesinfo = res.data.resp_data.kx_template.map((i) => {
            return {
              url: i.url,
              img: this.createImgUrl(i.image)
            };
          });
        } else {
          // console.log("111111");
          // console.log(that.emptyUrl);
          this.imagesinfo = [
            {
              url: "",
              img: that.emptyUrl,
            },
          ];
        }
      });
      // console.log(this.imagesinfo);
    },
    // 兼容链接形式
    createImgUrl (photoValue) {
      let img = JSON.parse(photoValue)
      // img = []
      let imgUrl = this.emptyUrl
      if (img && img.length) {
        img = img[0]
        if (typeof img === 'object') {
          let date = this.$dayjs(+img.datetime).format('YYYYMMDD')
          imgUrl = `http://${this.ossConfig.storageurl}/${img.source.substring(0,3)}/img/${date}/${this.tenantcode}/${img.source}`
        } else if (typeof img === 'string') {
          imgUrl = img
        }
      }
      return imgUrl
    },
    // getDate() {
    //   this.axios.post(this.queryurl).then((res) => {
    //     this.images = res.data.resp_data.kx_template
    //       .map((i) => JSON.parse(i.image)[0])
    //       .map(
    //         (u) =>
    //           "http://xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com/" +
    //           u.source.substring(0, 3) +
    //           "/img/" +
    //           this.$dayjs(+u.datetime).format("YYYYMMDD") +
    //           "/1000060/" +
    //           u.source
    //       );
    //   });
    // },
    link(url) {
      console.log(url);
      this.$xpe.run("jump", { url: url });
    },
  },
};
</script>

<style lang="less">
.van-swipe {
  z-index: 1;
  width: 100%;
  height: 49.92vw;
  margin: 12px auto;
  border-radius: 10px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
