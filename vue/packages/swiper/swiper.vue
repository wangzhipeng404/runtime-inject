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
      queryurl: '',
      info: {}
    };
  },
  props: {
    protocol: {
      type: Object,
      default: () => {},
    }
  },
  watch: {
    protocol() {
      this.init();
    },
  },
  mounted() {
    this.tenantcode = this.$cache.get("tenantcode");
    this.ossConfig = this.$cache.get("ossConfig");
    // this.tenantcode = '1008972';
    // this.ossConfig = {
    //   provider: "aliyun",
    //   storagebucket: "xtionai-storage-test",
    //   storageendpoint: "oss-cn-shenzhen.aliyuncs.com",
    //   storageurl: "xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com"
    // };
    this.init();
  },
  methods: {
    init() {
      console.log('swiperinit')
      if(this.protocol.bind && this.protocol.bind.logiccode){
        this.queryurl = this.protocol.bind.logiccode
        console.log(this.queryurl)
      } else if (this.protocol.queryurl){
        this.queryurl = this.protocol.queryurl
        console.log(this.queryurl)
      }
      this.info = {...this.protocol}
      this.getData()
    },
    getData() {
      let that = this;
      this.axios.post(this.queryurl,{ clienttypecode: '2' }).then((res) => {
        if (res.data.resp_data.kx_template.length) {
          this.imagesinfo = res.data.resp_data.kx_template.map((i) => {
            return {
              url: i.url,
              img: this.createImgUrl(i.image)
            };
          });
        } else {
          this.imagesinfo = [
            {
              url: "",
              img: that.emptyUrl,
            },
          ];
        }
      });
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
    link(url) {
      console.log(url);
      this.$xpe.run("jump", url );
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
