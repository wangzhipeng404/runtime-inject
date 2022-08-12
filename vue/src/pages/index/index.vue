<script>
export default {
  data() {
    return {
      loaded: false,
      content: [],
      imgs: [],
      userdefinedProto: [],
      refreshKey: 0,
      notices: [
        {
          title: '<span>有<span class="color">0</span>条工作待办未处理</span>',
          url: 'jumptype=2&type=10001'
        },
        {
          title: '<span>有<span class="color">0</span>条资讯通知未读</span>',
          url: 'jumptype=2&type=10002'
        }
      ],
    };
  },
  beforeCreate () {
    this.axios.interceptors.response.use((data) => {
      return { 
        data: {
          resp_data: data
        }
      }
    })
    window.excel_getBaseUrl = this.baseUrlCallback
    // 安卓注册获取nativeData回调
    window.excel_getNativeData = (success, errMsg, data) => {
      this.getNoticeSuccess(data)
    }
  },
  created() {
    this.$cache.set('oss', this.$OSS)
    this.$require([
      "/h5-components/xswiper/xswiper.v2.0.0.css",
      "/h5-components/xswiper/xswiper.v2.0.0.umd.min.js",
      "/h5-components/xnavigationIcon/xnavigationIcon.v1.0.0.css",
      "/h5-components/xnavigationIcon/xnavigationIcon.v1.0.0.umd.min.js",
      "/h5-components/xtargetProgress/xtargetProgress.v1.0.0.css",
      "/h5-components/xtargetProgress/xtargetProgress.v1.0.0.umd.min.js",
      "/h5-components/xmessageNotice/xmessageNotice.v1.0.0.css",
      "/h5-components/xmessageNotice/xmessageNotice.v1.0.0.umd.min.js",
      "/h5-components/xuserDefined/xuserDefined.v1.0.0.css",
      "/h5-components/xuserDefined/xuserDefined.v1.0.0.umd.min.js",
    ]).then(() => {
      this.init()
    });
    this.$xpe.on('flyrefresh', (data) => {
      console.log('refresh')
      console.log(data)
      this.axios.defaults.headers.common["token"] = data.token
      this.refreshKey += 1
      this.getNotices()
    })
    this.$xpe.on('jump', data => {
      console.log(data)
      let linkdata = data.url.split('&')
      let type = linkdata[0].split('=')[1]
      let code = linkdata[1].split('=')[1]
      console.log(type)
      if(type === '1'){
        this.$xpe.emit('jump',{url:code})
      }else{
        this.$xpe.bridge('linkNativePage', JSON.stringify({ type: code , data:'' }))
      }
    })
  },
  mounted() {
    this.getNotices()
  },
  methods: {
    init() {
      this.loadProtocl()
    },
    baseUrlCallback (success, errMsg, baseUrl) {
      console.log(baseUrl)
      window.__baseUrl = baseUrl
      this.axios.defaults.baseURL = baseUrl + '/api/teapi/dy-biz'
      this.init()
    },
    getNotices() {
      console.log('getNativeData begin')
      this.$xpe.bridge('getNativeData', JSON.stringify({ type: '10000' }), (success, errMsg, data) => {
        this.getNoticeSuccess(data)
      })
    },
    getNoticeSuccess (data) {
      console.log('getNativeData success')
      const res = JSON.parse(data)
      if (res.code == '200') {
        console.log(res.data)
        const messageTypes = {
          '10001': '工作待办未处理',
          '10002': '资讯通知未读',
        }
        this.notices = res.data.map(d => {
          return {
            title: '<span>有<span class="color">' + d.count +'</span>条' + messageTypes[d.type] +'</span>',
            url: 'jumptype=2&type=' + d.type
          }
        })
        console.log(this.notices)
      }
    },
    loadProtocl () {
      console.log(this.$cache.get('tenantcode'));
      this.axios
        .post("/904911040171610190/1506561074869178457", {
          kx_template: {
            pagetype: "apphomepage",
          },
        })
        .then((res) => {
          console.log(1111)
          this.content = JSON.parse(
            res.data.resp_data.kx_template.protocol
          ).view.body.content;
        })
        .then(() => {
          console.log(window);
          // this.$forceUpdate();
          this.loaded = true;
        });
    },
  },
  render() {
    if (!this.loaded) return <div />;
    const XSwiper = window["xswiper.v2.0.0"];
    const XNavigationIcon = window["xnavigationIcon.v1.0.0"];
    const XTargetProgress = window["xtargetProgress.v1.0.0"];
    const XMessageNotice = window["xmessageNotice.v1.0.0"];
    const XUserDefined = window["xuserDefined.v1.0.0"];
    // const XTabBar = window["xtabBar.v1.0.0"];
    console.log(XSwiper)
    return (
      <div>
        <div class="home" key={this.refreshKey}>
          {this.content.map((p) => {
            if (p.type === "swiper") {
              return <XSwiper queryurl={p.queryurl} />;
            } else if (p.type === "menu") {
              return <XNavigationIcon value={p.value} />;
            } else if (p.type === "progress") {
              return <XTargetProgress queryurl={p.queryurl} title={p.title}/>;
            } else if (p.type === "message") {
              return <XMessageNotice queryurl={p.queryurl} title={p.title} notices={this.notices} native={false} />
            } else if (p.type === "table") {
              return (
                <XUserDefined
                  col={p.col}
                  queryurl={p.queryurl}
                  title={p.title}
                  url={p.url}
                />
              );
            } else {
              return <div>该组件未注册</div>;
            }
          })}
        </div>
      </div>
    );
  }
}
</script>

<style lang="stylus">
.home
  box-sizing border-box
  padding 12px
  background-color #f1f5f8
</style>