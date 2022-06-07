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
  beforeCreate() {
    this.$cache.set("tenantcode", "1000060");
    this.$cache.set("ossConfig", {
      provider: "aliyun",
      storagebucket: "xtionai-storage-test",
      storageendpoint: "oss-cn-shenzhen.aliyuncs.com",
      storageurl: "xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com",
    });
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
    this.$xpe.on("jump", (data) => {
      let linkdata = data.url.split("&");
      let type = linkdata[0].split("=")[1];
      let code = linkdata[1].split("=")[1];
      if (type === "1") {
        console.log("--------------");
        this.$xpe.emit("jump", { url: code });
      } else if (type === "2") {
        console.log({ type: code, data: "" });
        this.$xpe.bridge(
          "linkNativePage",
          JSON.stringify({ type: code, data: "" })
        );
      }
    });
  },
  mounted() {
    console.log(this.$cache.get("tenantcode"));
    this.axios.defaults.headers.common["token"] =
      "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTMyOTc5MzQsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNDc4NTUyMzUwNzM3MTc0NTI4IiwiYWNjb3VudENvZGUiOiIxNDc4NTUyMzUwNzIwMzk3MzEyIiwidGVuYW50Q29kZSI6IjEwMDAwNjAiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjoxLCJ0b2tlbklkIjpudWxsLCJvcmdDb2RlIjpudWxsLCJ1c2VySW5mb0lkIjpudWxsLCJ1c2VySW5mb05hbWUiOm51bGwsInBvc2l0aW9uQ29kZSI6bnVsbCwicG9zaXRpb25OYW1lIjpudWxsLCJtZW1iZXJDb2RlIjpudWxsLCJyZWZQb3NpdGlvbkNvZGUiOm51bGwsImNhdGVnb3J5Q29kZSI6bnVsbCwib3JnU3RydWN0VHlwZUlkIjpudWxsLCJ1c2VyTmFtZSI6IjEwMDAwNjAiLCJ1c2VyTmFtZTEiOiIxMDAwMDYwIiwidXNlck5hbWUyIjoiMjYwNjU1MDc5QHFxLmNvbSIsInVzZXJOYW1lMyI6bnVsbCwidGVuYW50TmFtZSI6bnVsbCwiYXBwQ29kZSI6bnVsbCwiYXBwQ29kZXMiOm51bGwsInN1YlBkQ29kZXMiOm51bGwsImNvZGVwYXRoIjpudWxsLCJpc2xlYWZvcmciOm51bGwsIm1ldGFtb2RlbHR5cGUiOjEsImlzU21zTG9naW4iOmZhbHNlfX0.f0koMZwOqwHGxzT_KKt2Ih38NrsdBVeyOLBuS5eQKwk";
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
            return <XNavigationIcon value={p.value} title={p.title} />;
          } else if (p.type === "progress") {
            return <XTargetProgress queryurl={p.queryurl} title={p.title} />;
          } else if (p.type === "message") {
            return <XMessageNotice queryurl={p.queryurl} title={p.title} />;
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
.home {
  box-sizing: border-box;
  padding: 12px;
  background-color: #f1f5f8;
}
</style>