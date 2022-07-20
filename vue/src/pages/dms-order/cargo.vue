<script>
export default {
  name: 'order-cargo',
  data () {
    return {
      channelcode: 'QD0000000593',
      query: {},
      list: []
    }
  },
  created () {
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
  mounted () {
    this.getData()
  },
  methods: {
    async getData () {
      const list = await this.axios({
        url: '/1491976446623748195/1502482353363226715',
        method: 'post',
        data: {
          'ka_kq_channelcustomers': {
            channelcode: this.channelcode,
            orderid: this.query.orderid
          }
        }
      }).then(res => {
        return res.tn_kx_cost_cust_book
      })
      let map = {}
      let arr = []
      list.forEach(tn => {
        if (!map[tn.tn_id]) {
          map[tn.tn_id] = true
          arr.push({
            tn_beuse: list.filter(l => l.tn_id === tn.tn_id).reduce((acc, cur) => {
              return Number(acc) + Number(cur.tn_beuse)
            }, 0).toFixed(2),
            tn_id: tn.tn_id,
            tn_balance: tn.tn_balance,
            tn_total: tn.tn_total,
            name: tn.name,
            products: list.filter(l => l.tn_id === tn.tn_id)
          })
        }
      })
      this.list = arr
    },
    async submit () {
      var flag = false
      var arr = []
      this.list.forEach(l => {
        if (Number(l.tn_beuse) > Number(l.tn_balance)) {
          flag = true
        }
        l.products.forEach(p => {
          arr.push({
            name: p.name,
            tn_id: p.tn_id,
            productcode: p.productcode,
            batchcount: String(p.tn_productcount || 0),
            price: p.price,
            tn_beuse: (Number(p.tn_productcount || 0) * Number(p.price)).toFixed(2)
          })
        })
      })
      if (flag) {
        this.$toast({
          message: '本单使用金额超过可使用金额',
        })
        return
      }
      await this.axios({
        url: '/1491976446623748195/1495976712549306447',
        method: 'post',
        data: {
            tn_kx_cost_cust_book: arr,
            ka_kq_channelcustomers: {
              channelcode: this.channelcode,
              orderid: this.query.orderid,
              amount: '' + this.query.amount,
              accounttype: ''
            }
          }
      })
      this.$emit('goback')
      // mpx.navigateBack()
    },
    onStepperChange (ti, pi, val) {
      if (val < 0 || val === '-') return
      const temp = this.list[ti].products[pi].tn_productcount || 0
      const price = this.list[ti].products[pi].price
      const oldAmount = Number(temp) * Number(price)
      const newAmount = Number(val) * Number(price)
      const amount = Number(this.list[ti].tn_beuse || 0) - oldAmount + newAmount
      this.list[ti].products[pi].tn_productcount = val
      this.list[ti].tn_beuse = amount.toFixed(2)
    }
  },
  render () {
    return (
      <div class="cargo-table-wrap">
        <div style="over-flow-x: auto">
          <div class="cargo-table">
            <div class="t-header">
              <div class="th">
                <div class="td">账户名称</div>
                <div class="td">可使用费用</div>
                <div class="td">产品编码</div>
                <div class="td">产品名称</div>
                <div class="td">单价</div>
                <div class="td">本单使用数量</div>
                <div class="td">本单使用费用</div>
              </div>
            </div>
            <div style="over-flow-y: auto;height: calc(100vh - 120px)">
              <div class="t-body">
              {this.list.map((tn, ti) => (
                <div class="tr" key={tn.tn_id}>
                    <div class="td">{tn.name}</div>
                    <div class="td">{tn.tn_balance}</div>
                    <div>
                      {tn.products.map((product, pi) => (
                        <div class="tr tr-in" key={product.id}>
                          <div class="td">{product.productcode}</div>
                          <div class="td">{product.productname}</div>
                          <div class="td">{product.price}</div>
                          <div class="td">
                            <van-stepper
                              value={ product.tn_productcount }
                              integer
                              class="input-class"
                              min={0}
                              async-change={false}
                              show-plus={false}
                              show-minus={false}
                              allow-empty={true}
                              on-change={(val) => this.onStepperChange(ti, pi, val)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div class="td">{tn.tn_beuse}</div>
                </div>
              ))}
              </div>
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