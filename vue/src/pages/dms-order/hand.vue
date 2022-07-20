<script>
export default {
  name: 'order-cargo',
  data() {
    return {
      checkedAll: false,
      checkedList: [],
      channelcode: 'QD0000000593',
      query: {
        orderid: ''
      },
      list: [],
      ossConfig: {
        provider: "aliyun",
        storagebucket: "xtionai-storage-test",
        storageendpoint: "oss-cn-shenzhen.aliyuncs.com",
        storageurl: "xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com"
      }
    }
  },
  created() {
    this.axios.defaults.headers.common["token"] = localStorage.getItem('token');
    this.axios.defaults.baseURL = "/api/teapi/dy-biz";
    this.axios.interceptors.response.use((response) => {
      return response.data.resp_data;
    }, (error) => {
      const data = error.response.data
      this.$dialog.alert({
        title: '提示信息',
        message: data.error_code
      })
      return Promise.reject(error);
    });
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const list = await this.axios({
        url: '1491976446623748195/1501171932471627851',
        method: 'post',
        data: {
          "kx_kq_product": {
            "filtercode": "",
            "filtername": "",
            "productcategory": "",
            "filtertype": "",
            "giftcategory": ""
          },
          "ka_kq_channelcustomers": {
            "channelcode": this.channelcode,
            "orderid": this.query.orderid
          },
          "__paging": {
            "__pageindex": "0",
            "__pagesize": "9999"
          }
        }
      }).then(res => {
        return res.kx_kq_product
      })
      this.list = list
    },
    async submit() {
      if (this.checkedList.length == 0) {
        this.$toast({
          message: '请选择需要搭赠的产品',
        })
        return
      }
      const arr = this.list.filter(p => this.checkedList.includes(p.id)).map(p => {
        return {
          batchcount: "1",
          costid: "",
          productid: p.id,
          ruleid: "",
          saletype: "954254252933517312",
        }
      })
      await this.axios({
        url: '1491976446623748195/1494632923264061519',
        method: 'post',
        data: {
          kx_order_shoppingcart: arr,
          ka_kq_channelcustomers: {
            customercode: this.channelcode,
            orderid: this.query.orderid,
          }
        }
      })
      this.$emit('goback')
      // mpx.navigateBack()
    },
  },
  render() {
    return (
      <div class="cargo-table-wrap">
        <div style="over-flow-x: auto">
          <div class="cargo-table">
            <div class="t-header">
              <div class="th">
                <div class="td">
                  <van-checkbox shape="square"  v-mode={this.checkedAll} />
                </div>
                <div class="td">产品/赠品编码</div>
                <div class="td">产品赠品名称</div>
                <div class="td">图片</div>
                <div class="td">品类</div>
                <div class="td">单价</div>
                <div class="td">分销单位</div>
                <div class="td">体积（m<sup>3</sup>）</div>
                <div class="td">重量（kg）</div>
              </div>
            </div>
            <div style="over-flow-y: auto;height: calc(100vh - 120px)">
              <van-checkbox-group v-model={this.checkedList}>
                <div class="t-body">
                  {this.list.map((p) => (
                    <div class="tr" key={p.id}>
                      <div class="td">
                        <van-checkbox shape="square" name={p.id} />
                      </div>
                      <div class="td">{p.productcode}</div>
                      <div class="td">{p.productname}</div>
                      <div class="td"><van-iamge src={p.productimage} size="50" /></div>
                      <div class="td">{p.productcategory__dicvalue}</div>
                      <div class="td">{p.retailprice}</div>
                      <div class="td">{p.distributionunitname}</div>
                      <div class="td">{p.volume}</div>
                      <div class="td">{p.weight}</div>
                    </div>
                  ))}
                </div>
              </van-checkbox-group>
            </div>
          </div>
        </div>
        <div class="footer">
          <van-button block type="info" on-click={this.submit}>确定</van-button>
        </div>
      </div>
    )
  }
}
</script>

<style lang="stylus">
.cargo-table-wrap
  padding 12px
  .cargo-table
    width 210vw
    .t-header
      font-size 14px
      color #666666
      background-color #E7F1FF
      text-align center
      border 1px solid #eee
      .th
        display flex
      .td
        box-sizing border-box
        width 30vw
        padding 12px 0
        border-right 1px solid #eee
        &:last-child
          border-right none
    .t-body
      width 100%
      font-size 14px
      color #333333
      border-left 1px solid #eeeeee
      border-right 1px solid #eeeeee
      .bg-white
        background-color #ffffff
      .tr
        display flex
        flex-wrap nowrap
        border-bottom 1px solid #eeeeee
        .td
          box-sizing border-box
          width 30vw
          min-height 44px
          padding 0 5px
          display flex
          flex-direction column
          justify-content center
          text-align center
          border-right 1px solid #eee
          .input-class
            width 100%
            height 30px
            border 1px solid #DDDDDD
            border-radius 2px
            background: rgba(255, 255, 255, 0.39)
            color #333
            .van-stepper__input
              width 100%
              background transparent
      .tr-in
        &:nth-child(even)
          background-color: rgba(231, 241, 255, 0.39);
        &:last-child
          border-bottom none
.footer
  box-sizing border-box
  position fixed
  bottom constant(safe-area-inset-bottom)
  bottom env(safe-area-inset-bottom)
  left 0
  padding 8px 12px
  width 100%
</style>