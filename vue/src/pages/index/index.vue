<script>
export default {
  data() {
    return {
      loaded: false,
      content: [],
      imgs: [],
      userdefinedProto: [],
      nativeCount:{
        unread: '10',
        todocount: '20'
      }
    };
  },
  beforeCreate() {
    this.$cache.set("tenantcode", "1008972");
    this.$cache.set("ossConfig", {
      provider: "aliyun",
      storagebucket: "xtionai-storage-test",
      storageendpoint: "oss-cn-shenzhen.aliyuncs.com",
      storageurl: "xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com",
    });
  },
  created() {
    this.$require([
      "../h5-components/xswiper/xswiper.v2.0.0.css",
      "../h5-components/xswiper/xswiper.v2.0.0.umd.min.js",
      "../h5-components/xnavigationIcon/xnavigationIcon.v1.0.0.css",
      "../h5-components/xnavigationIcon/xnavigationIcon.v1.0.0.umd.min.js",
      "../h5-components/xtargetProgress/xtargetProgress.v1.0.0.css",
      "../h5-components/xtargetProgress/xtargetProgress.v1.0.0.umd.min.js",
      "../h5-components/xmessageNotice/xmessageNotice.v1.0.0.css",
      "../h5-components/xmessageNotice/xmessageNotice.v1.0.0.umd.min.js",
      "../h5-components/xuserDefined/xuserDefined.v1.0.0.css",
      "../h5-components/xuserDefined/xuserDefined.v1.0.0.umd.min.js",
      "../h5-components/xdataDisplay/xdataDisplay.v1.0.0.css",
      "../h5-components/xdataDisplay/xdataDisplay.v1.0.0.umd.min.js",
    ]);
    this.$xpe.on("jump", (data) => {
      // let linkdata = data.url.split("&");
      // let type = linkdata[0].split("=")[1];
      // let code = linkdata[1].split("=")[1];
      // if (type === "1") {
      //   console.log("--------------");
      //   this.$xpe.emit("jump", { url: code });
      // } else if (type === "2") {
      //   console.log({ type: code, data: "" });
      //   this.$xpe.bridge(
      //     "linkNativePage",
      //     JSON.stringify({ type: code, data: "" })
      //   );
      // }
      let totalParams = {}
      let temp = data.split('&')
      temp.forEach(i => {
        totalParams[i.split('=')[0]] = i.split('=')[1]
      })
      let jumpParams = {}
      for (let i in totalParams) {
        if (i !== 'jumptype' && i !== 'pagecode' && i !== 'mode') {
          jumpParams[i] = totalParams[i]
        }
      }
      if (totalParams.jumptype === '1') {
        this.$xpe.emit("jump", { url: totalParams.pagecode, jumpParams: jumpParams});
      } else {
        this.$xpe.bridge(
          "linkNativePage",
          JSON.stringify({ type: totalParams.type, data: "" })
        );
      }
    });
  },
  mounted() {
    console.log(this.$cache.get("tenantcode"));
    this.axios.defaults.headers.common["token"] =
      "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjM4NDEwMTksIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNTU0MDgwNTU4NDQxNjk3MjgwIiwiYWNjb3VudENvZGUiOiIxNTU0MDgwNTU4Mzc4NzgyNzIwIiwidGVuYW50Q29kZSI6IjEwMDAwNjEiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MSIsImNsaWVudFR5cGVDb2RlIjoxLCJ0b2tlbklkIjoiZDI5OWJhZDMtZWZhMS00NzliLTllODAtNzdhOTA0MjM3YjVjIiwib3JnQ29kZSI6IjEiLCJ1c2VySW5mb0lkIjoiMTU1NDA4MDU1OTA3NTAzNzE4NCIsInVzZXJJbmZvTmFtZSI6IumZiOeVhSIsInBvc2l0aW9uQ29kZSI6IjE1NTQ3ODA5NzgxMjYzOTMzNDQiLCJwb3NpdGlvbk5hbWUiOiLlhajmnYPpmZAt5Yu_5YigIiwibWVtYmVyQ29kZSI6IjE1NTQ3ODE4ODg0NTgxMzM1MDQiLCJyZWZQb3NpdGlvbkNvZGUiOiIxMzAwNzI4NjE0NTM0Mzg1NjY0IiwiY2F0ZWdvcnlDb2RlIjoiIiwib3JnU3RydWN0VHlwZUlkIjoiMSIsInVzZXJOYW1lIjoiMTAwMDA2MSIsInVzZXJOYW1lMSI6IjEwMDAwNjEiLCJ1c2VyTmFtZTIiOiI2NTQ3ODkxMjM0NSIsInVzZXJOYW1lMyI6bnVsbCwidGVuYW50TmFtZSI6IuaZuuaFpzEwMFY2LjEtYmFzZeS6p-WTgeenn-aItyIsImFwcENvZGUiOiJzYWxlcyIsImFwcENvZGVzIjpbImRpc3RyaWJ1dGlvbiIsInNhbGVzIiwicHJvbW90aW9uIl0sInN1YlBkQ29kZXMiOlsic2ZhIiwiZG1zIiwicG1tIiwidHBtIl0sImNvZGVwYXRoIjoiMS4iLCJpc2xlYWZvcmciOiJmYWxzZSIsIm1ldGFtb2RlbHR5cGUiOjEsImlzU21zTG9naW4iOmZhbHNlfX0.E_AhPEcsiuYLGV5n8KQSPFuxbHHVFkeTiIKomhbFlSQ";
    this.axios.defaults.baseURL =
      "http://101.200.205.231:7000/api/teapi/dy-biz";
    this.axios.interceptors.response.use((data) => {
      return { 
        data: {
          resp_data: data
        }
      }
    })
    this.axios
      .post("/1555440697476255841/1555440697476255840", {
        protocol: {
          clienttypecode: '2'
        }
      })
      .then((res) => {
        console.log(res)
        this.content = JSON.parse(res.data.resp_data.sys_platfrom_config.protocol.protocol).view.body.content
        console.log(this.content)
        // this.content = [
        //   {
        //     "type": "datashow",
        //     "title": "数据展示",
        //     "subtitle": "单位：个",
        //     "remark": "",
        //     "url": '#javascript',
        //     "isopentoggle": false, // 是否开启数值显隐功能
        //     "textcolor": "#303133", // 文本颜色
        //     "datacolor": "#1A85FF", // 数值颜色
        //     "colunnumber": "", // 列数 一行几列
        //     "bind": {
        //       "logiccode": "1298202688718245911/1555008846324437077",
        //       "setter": []
        //     },
        //   },
        //   {
        //     "type": "swiper",
        //     "id": "123456", // 模块实例id
        //     "title": "轮播图", // 模块实例标题
        //     "remark": "", // 备注
        //     // 第一版配置方式 前期兼容 后期需要废弃
        //     "queryurl": "904911040171610190/1555784740987080784",
        //     // 绑定关系 初始化没绑定时默认为
        //     // "bind": {
        //     //   "logiccode": "",
        //     //   "setter": []
        //     // }
        //     "bind": {
        //       "logiccode": "904911040171610190/1555784740987080784", // 绑定flycode接口
        //       "setter": []
        //     }
        //   },
        //   {
        //     "type": "progress",
        //     "title": "条形进度",
        //     "remark": "",
        //     "queryurl": "",
        //     "url": "",
        //     "bind": {
        //       "logiccode": "1549673071353401443/1549673071353401442"
        //     }
        //   },
        //   {
        //     "type": "menu",
        //     "title": "菜单",
        //     "remark": "",
        //     "value": [
        //       {
        //         "icon": "attend", // 默认图标资源
        //         "title": "考勤签到",
        //         "url": "jumptype=1&pagecode=893726062754795618" // 点击跳转的路径
        //       },
        //       {
        //         "icon": "attend",
        //         "title": "考勤签到",
        //         "url": "jumptype=1&pagecode=893726062754795618"
        //       }
        //     ]
        //   },
        //   {
        //     "type": "table",
        //     "title": "表格",
        //     "remark": "",
        //     "queryurl": "904911040171610190/1554040053376880722",
        //     "url": "",
        //     "col": [
        //       {
        //         "title": "名次",
        //         "colwidth": "60",
        //         "isshow": true,
        //         "pro": 'colunm1'
        //       },
        //       {
        //         "title": "人员名称",
        //         "colwidth": "180",
        //         "isshow": true
        //       },
        //       {
        //         "title": "积分值",
        //         "colwidth": "60",
        //         "isshow": true
        //       }
        //     ],
        //     "bind": {
        //       "logiccode": "904911040171610190/1554040053376880722",
        //       "setter": []
        //     }
        //   },
        //   {
        //     "type": "message",
        //     "title": "消息提醒",
        //     "remark": "",
        //     "queryurl": "904911040171610190/1552238680800890979",
        //     "url": "",
        //     "bind": {
        //       "logiccode": "904911040171610190/1552238680800890979"
        //     }
        //   }
        // ]
      })
      .then(() => {
        console.log(window);
        this.loaded = true;
      });
  },
  render() {
    if (!this.loaded) return <div />;
    const XSwiper = window["xswiper.v2.0.0"];
    const XNavigationIcon = window["xnavigationIcon.v1.0.0"];
    const XTargetProgress = window["xtargetProgress.v1.0.0"];
    const XMessageNotice = window["xmessageNotice.v1.0.0"];
    const XUserDefined = window["xuserDefined.v1.0.0"];
    const XDataDisplay = window["xdataDisplay.v1.0.0"];
    return (
      <div class="home">
        {this.content.map((p) => {
          if (p.type === "swiper") {
            console.log('swiper')
            return <XSwiper protocol={p} />;
          } else if (p.type === "menu") {
            return <XNavigationIcon protocol={p} />;
          } else if (p.type === "progress") {
            return <XTargetProgress protocol={p} />;
          } else if (p.type === "message") {
            return <XMessageNotice protocol={p}  notices={this.notices} native={false} nativeCount={this.nativeCount}/>;
          }  else if (p.type === "datashow") {
            console.log(p)
            return <XDataDisplay protocol={p}/>;
          }else if (p.type === "table") {
            return (
              <XUserDefined
                protocol={p}
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