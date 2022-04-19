<script>
export default {
  data() {
    return {
      loaded: false,
      content: [],
      imgs: [],
      userdefinedProto: [],
    };
  },
  beforeCreate () {
    this.$cache.set('tenantcode', '1000060')
  },
  created() {
    this.$require([
      "../h5-components/xswiper/xswiper.v1.0.0.css",
      "../h5-components/xswiper/xswiper.v1.0.0.umd.min.js",
      "../h5-components/xnavigationIcon/xnavigationIcon.v1.0.0.css",
      "../h5-components/xnavigationIcon/xnavigationIcon.v1.0.0.umd.min.js",
      "../h5-components/xtargetProgress/xtargetProgress.v1.0.0.css",
      "../h5-components/xtargetProgress/xtargetProgress.v1.0.0.umd.min.js",
      "../h5-components/xmessageNotice/xmessageNotice.v1.0.0.css",
      "../h5-components/xmessageNotice/xmessageNotice.v1.0.0.umd.min.js",
      "../h5-components/xuserDefined/xuserDefined.v1.0.0.css",
      "../h5-components/xuserDefined/xuserDefined.v1.0.0.umd.min.js",
    ]);
    this.$xpe.on('jump', data => {
      let linkdata = data.url.split('&')
      let type = linkdata[0].split('=')[1]
      let code = linkdata[1].split('=')[1]
      if(type === '1'){
        console.log('--------------')
        this.$xpe.emit('jump',{url:code})
      }else if(type === '2'){
        console.log({ type: code , data:'' })
        this.$xpe.bridge('linkNativePage', JSON.stringify({ type: code , data:'' }))
      }
    })
  },
  mounted() {
    console.log(this.$cache.get('tenantcode'))
    this.axios.defaults.headers.common["token"] =
      "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAzNTc5OTYsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNDc4NTUyMzUwNzM3MTc0NTI4IiwiYWNjb3VudENvZGUiOiIxNDc4NTUyMzUwNzIwMzk3MzEyIiwidGVuYW50Q29kZSI6IjEwMDAwNjAiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjoxLCJ0b2tlbklkIjoiOGQ3YjIzYzEtNjliZC00NTI3LWEwOTEtYjAxNWU3NzZhMDgyIiwib3JnQ29kZSI6IjEiLCJ1c2VySW5mb0lkIjoiMTQ3ODU1MjM1MDkwMDc1MjM4NCIsInVzZXJJbmZvTmFtZSI6IumZiOeVhSIsInBvc2l0aW9uQ29kZSI6IjE0Nzg5ODk4MDQ2NDQ0NzA3ODQiLCJwb3NpdGlvbk5hbWUiOiLlhajmnYPpmZAt5Yu_5YigIiwibWVtYmVyQ29kZSI6IjE0Nzg5OTA0MDIxMjcyNjk4ODgiLCJyZWZQb3NpdGlvbkNvZGUiOiIxMzAwNzI4NjE0NTM0Mzg1NjY0IiwiY2F0ZWdvcnlDb2RlIjoiIiwib3JnU3RydWN0VHlwZUlkIjoiMSIsInVzZXJOYW1lIjoiMTAwMDA2MCIsInVzZXJOYW1lMSI6IjEwMDAwNjAiLCJ1c2VyTmFtZTIiOiIyNjA2NTUwNzlAcXEuY29tIiwidXNlck5hbWUzIjpudWxsLCJ0ZW5hbnROYW1lIjoi5pm65oWnMTAwVjYuMC1iYXNl5Lqn5ZOB56ef5oi3IiwiYXBwQ29kZSI6InNhbGVzIiwiYXBwQ29kZXMiOlsic2FsZXMiLCJwcm9tb3Rpb24iLCJkaXN0cmlidXRpb24iXSwic3ViUGRDb2RlcyI6WyJzZmEiLCJkbXMiLCJwbW0iLCJ0cG0iXSwiY29kZXBhdGgiOiIxLiIsImlzbGVhZm9yZyI6ImZhbHNlIiwibWV0YW1vZGVsdHlwZSI6MSwiaXNTbXNMb2dpbiI6ZmFsc2V9fQ.xZpdAT9AlEPTiUT6v0Sne86tPUZ8Lh_s-azdmY-DZ3Q";
    this.axios.defaults.baseURL =
      "http://101.200.205.231:7000/api/teapi/dy-biz";
    this.axios
      .post("/904911040171610190/1506561074869178457", {
        kx_template: {
          pagetype: "apphomepage",
        },
      })
      .then((res) => {
        debugger;
        this.content = JSON.parse(
          res.data.resp_data.kx_template.protocol
        ).view.body.content;
      })
      .then(() => {
        console.log(window);
        this.loaded = true;
      });
  },
  render(h) {
    if (!this.loaded) return <div />;
    const XSwiper = window["xswiper.v1.0.0"];
    const XNavigationIcon = window["xnavigationIcon.v1.0.0"];
    const XTargetProgress = window["xtargetProgress.v1.0.0"];
    const XMessageNotice = window["xmessageNotice.v1.0.0"];
    const XUserDefined = window["xuserDefined.v1.0.0"];
    const XTabBar = window["xtabBar.v1.0.0"];
    return (
      <div class="home">
        {this.content.map((p) => {
          if (p.type === "swiper") {
            return <XSwiper queryurl={p.queryurl} />;
          } else if (p.type === "menu") {
            return <XNavigationIcon value={p.value} title={p.title}/>;
          } else if (p.type === "progress") {
            return <XTargetProgress queryurl={p.queryurl} title={p.title}/>;
          } else if (p.type === "message") {
            return <XMessageNotice queryurl={p.queryurl} title={p.title}/>;
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
    );
  },
};
</script>
<style lang="stylus">
.home
  box-sizing border-box
  padding 12px
  background-color #f1f5f8
</style>