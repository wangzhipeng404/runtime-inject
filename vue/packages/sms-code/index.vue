<template>
  <div class="poster-container">
    <div class="poster-content">
      <img :src="poster" class="poster" />
    </div>
    <div class="btn-wrap" v-show="showBtn">
      <div class="btn" @click="onShare">
        <img :src="iconWexin" />
        <div>发送到微信</div>
      </div>
      <div class="btn" @click="saveImg">
        <img :src="iconSave" />
        <div>保存到相册</div>
      </div>
    </div>
    <vue-canvas-poster
      v-if="loaded"
      :widthPixels="1000"
      :painting="painting"
      @success="success"
      @fail="fail"
    >
    </vue-canvas-poster>
  </div>
</template>

<script>
import { VueCanvasPoster } from 'vue-canvas-poster'
import avatar from './assets/image_photo@2x.png'
import bg from './assets/code_bg.png'
import iconSave from './assets/code_icon_save@2x.png'
import iconWexin from './assets/code_icon_weixin@2x.png'

export default {
  name: 'sms-code',
  components: {
    'vue-canvas-poster': VueCanvasPoster
  },
  props: ['query'],
  data () {
    return {
      iconSave,
      iconWexin,
      user: {},
      poster: bg,
      wxcode: '',
      avartUrl: '',
      loaded: true,
      canSave: false,
      showBtn: true,
    }
  },
  computed: {
    painting () {
      return {
        width: `${375 * 10}px`,
        height: `${530 * 10}px`,
        backgroundColor: '#fffff',
        views: [
          {
            type: 'image',
            url: require('./assets/code_bg.png'),
            css: {
              width: `${375 * 10}px`,
              height: `${530 * 10}px`,
              left: 0,
              top: 0,
              zIndex: 2,
            }
          },
          {
            type: 'text',
            text: this.query && this.query.user && this.query.user.userinfoName || '',
            css: {
              left: `${114 * 10}px`,
              top: `${40 * 10}px`,
              textAlign: 'center',
              fontSize: `${16 * 10}px`,
              color: '#000',
              zIndex: 9,
            }
          },
          {
            type: 'text',
            text: this.query && this.query.user && this.query.user.positionName || '',
            css: {
              left: `${122 * 10}px`,
              top: `${68 * 10}px`,
              lineHeight: `${14 * 10}px`,
              textAlign: 'center',
              fontSize: `${10 * 10}px`,
              color: '#fff',
              background: 'linear-gradient(90deg, #FE9748 100%, #FF411C 0%)',
              padding: `${4 * 10}px ${10 * 10}px`,
              borderRadius: `${10 * 10}px`,
              zIndex: 9,
            }
          },
          {
            type: 'text',
            text: this.query && this.query.storeInfo && this.query.storeInfo.storename,
            css: {
              left: '0px',
              top: `${132 * 10}px`,
              width: `${375 * 10}px`,
              height: `${28 * 10}px`,
              textAlign: 'center',
              fontSize: `${20 * 10}px`,
              color: '#121933',
              zIndex: 9,
            }
          },
          {
            type: 'text',
            text: '扫一扫下面的小程序码，注册RMS门店',
            css: {
              left: '0px',
              top: `${180 * 10}px`,
              width: `${375 * 10}px`,
              height: `${20 * 10}px`,
              baseLine: 'top',
              textAlign: 'center',
              fontSize: `${14 * 10}px`,
              color: '#999',
              zIndex: 9,
            }
          },
          /* {
            type: 'image',
            url: salesIcon,
            css: {
              width: `${48 * 10}px`,
              height: `${20 * 10}px`,
              left: `${112 * 10}px`,
              top: `${64 * 10}px`,
              zIndex: 3,
            }
          }, */
          {
            type: 'image',
            url: this.avartUrl,
            css: {
              width: `${60 * 10}px`,
              height: `${60 * 10}px`,
              left: `${40 * 10}px`,
              top: `${30 * 10}px`,
              borderRadius: `${60 * 10}px`,
              zIndex: 3,
            }
          },
          {
            type: 'image',
            url: this.wxcode,
            css: {
              width: `${260 * 10}px`,
              height: `${260 * 10}px`,
              left: `${58 * 10}px`,
              top: `${208 * 10}px`,
              zIndex: 3,
            }
          },
        ],
      }
    }
  },
  mounted() {
    console.log(this.query.appid)
    this.$xpe.on('shared', () => {
      this.showBtn = true
    })
    this.$toast.loading({
      message: '加载中...',
      forbidClick: true,
    })
    this.$http.post('/miniapi/sms/getrmsqrcode',{
      appid: this.query && this.query.appid,
      path: '/pages/login/login',
      storeId: this.query && this.query.storeInfo && this.query.storeInfo.storeid,
      storeName: this.query && this.query.storeInfo && this.query.storeInfo.storename,
      storeCode: this.query && this.query.storeInfo && this.query.storeInfo.storecode,
      customerType: this.query && this.query.storeInfo && this.query.storeInfo.customertype,
      codeType: '1',
      // openId: this.user.openId,
      line_color: { r: 0, g: 0, b: 0 }
    }).then(res => res.data.resp_data).then(res => {
      this.$http.post('/api/teapi/rolepermission/account/getaccountinfo',{
        "positionid": this.query.user.positionID,
        "deviceinfo":"Chrome",
        "sysversion":"",
        "clientversion":"V9.5.1"
      }).then(res => res.data.resp_data).then(userinfo => {
        if (userinfo.photo) {
          const photo = JSON.parse(userinfo.photo)[0]
          var arr = res.qrCodeUrl.split('/')
          arr[3] = photo.source.substring(0, 3)
          arr[5] = this.$dayjs(+photo.datetime).format('YYYYMMDD')
          arr[7] = photo.source
          this.avartUrl = arr.join('/')
        } else {
          this.avartUrl = avatar
        }
        this.wxcode = res.qrCodeUrl
        this.$nextTick().then(() => {
          this.loaded = true
        })
      }).catch (e => {
        console.log(e)
      })
    })
  },
  methods: {
    success(src) {
      this.poster = src.replace('png', 'jpeg')
      this.$toast.clear()
      this.canSave = true
      this.$xpe.emit('posterChange', this.poster)
    },
    fail(err) {
      console.log('fail', err)
    },
    saveImg() {
      if (!this.canSave) return;
      const u = navigator.userAgent;
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      let reg = /data.+?;base64,/;
      this.$xpe.bridge('saveImage', isAndroid ? this.poster : this.poster.replace(reg,''))
    },
    onShare () {
      this.showBtn = false
      this.$nextTick().then(() => {
        setTimeout(() => {
          this.$xpe.emit('share')
        }, 500)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .poster-container {
    background: #f5f5f5;
    height: 100vh;
    overflow: hidden;
  }
  .poster-content {
    display: flex;
    justify-content: center;
  }
  .poster {
    width: auto;
    max-height: 71vh;
  }
  .btn-wrap {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 16px 0;
    height: 30vh;
    .btn {
      display: block;
      padding: 0;
      margin: 0 28px;
      text-align: center;
      width: 100px;
      font-size: font-md;
      color: #999999;
      img {
        width: 45px;
        height: 45px;
      }
    }
  }
</style>