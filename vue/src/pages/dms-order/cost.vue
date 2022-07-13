<script>
export default {
  name: 'order-cost',
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
    // this.query = option
    // const user = mpx.getStorageSync('distributionData')
    this.getData()
  },
  methods: {
    async getData () {
      const list = await this.axios({
        url: `/1491976446623748195/1495954154743533647`,
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
      this.list = list
    },
    async submit () {
      await this.axios({
        url: `/1491976446623748195/1502482353363226709`,
        method: 'post',
        data: {
            tn_kx_cost_cust_book: this.list,
            ka_kq_channelcustomers: {
              channelcode: this.channelcode,
              orderid: this.query.orderid,
              amount: `${this.query.amount}`,
              accounttype: ''
            }
          }
      })
      this.$emit('goback')
      // mpx.navigateBack()
    }
  },
  render () {
    return (
      <div class="cost-table-wrap">
        <div class="cost-table">
          <div class="t-header">
            <van-row class="th">
              <van-col span="8" class="td">账户名称</van-col>
              <van-col span="8" class="td">可使用费用</van-col>
              <van-col span="8" class="td">本单使用费用</van-col>
            </van-row>
          </div>
          <div style="overr-flow-y:auto; height: calc(100vh - 120px)">
            <div class="t-body">
            {this.list.map((item) => (
              <div class="tr" key={item.tn_id}>
                <van-row>
                  <van-col span="8" class="td">{item.name}</van-col>
                  <van-col span="8" class="td">{item.tn_total}</van-col>
                  <van-col span="8" class="td">
                    <van-stepper
                      v-model={ item.tn_beuse }
                      decimal-length={2}
                      class="input-class"
                      async-change={false}
                      min={0}
                      max={item.tn_balance}
                      show-plus={false}
                      show-minus={false}
                      allow-empty={true}
                    />
                  </van-col>
                </van-row>
              </div>
            ))}
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
.cost-table-wrap
  padding 12px
  .cost-table
    .t-header
      font-size 14px
      color #666666
      background-color #E7F1FF
      text-align center
      border 1px solid #eee
      .td
        padding 12px
    .t-body
      font-size 14px
      color #333333
      border-left 1px solid #eeeeee
      border-right 1px solid #eeeeee
      .tr
        border-bottom 1px solid #eeeeee
        &:nth-child(even)
          background-color: rgba(231, 241, 255, 0.39);
        .td
          height 44px
          display flex
          flex-direction column
          justify-content center
          text-align center
          padding 0 5px
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
.footer
  box-sizing border-box
  position fixed
  bottom constant(safe-area-inset-bottom)
  bottom env(safe-area-inset-bottom)
  left 0
  padding 8px 12px
  width 100%
</style>