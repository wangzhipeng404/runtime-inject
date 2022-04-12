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
      url: "",
    };
  },
  props: {
    queryurl: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.getDate();
  },
  methods: {
    getDate() {
      this.axios.post(this.queryurl).then((res) => {
        console.log(res);
        this.imagesinfo = res.data.resp_data.kx_template.map((i) => {
          return {
            url: i.url,
            img:
              "http://xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com/" +
              JSON.parse(i.image)[0].source.substring(0, 3) +
              "/img/" +
              this.$dayjs(+JSON.parse(i.image)[0].datetime).format("YYYYMMDD") +
              "/1000060/" +
              JSON.parse(i.image)[0].source,
          };
        });
      });
      console.log("?????????????????");
      console.log(this.imagesinfo);
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
      console.log(url)
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