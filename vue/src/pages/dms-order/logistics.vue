<script>
export default {
  name: 'order-logistics',
  data () {
    return {
      arrowIcon: '/h5-assets/arrow_right@2x.png',
      upIcon: '/h5-assets/triangle_up_blue.png',
      downIcon: '/h5-assets/triangle_down_blue.png',
      orderInfo: {},
      query: {
        orderid: '1519950192051359744'
      },
      list: [],
      statusMap: [
        {
          'key': '10',
          'text': '暂存',
          color: '#FF972A'
        },
        {
          'key': '30',
          'text': '待审核',
          color: '#FF972A'
        },
        {
          'key': '100',
          'text': '审核不通过',
          color: '#F54841'
        },
        {
          'key': '90',
          'text': '已完成',
          color: '#3DC787'
        },
        {
          'key': '150',
          'text': '部分完成',
          color: '#3DC787'
        },
        {
          'key': '110',
          'text': '已作废',
          color: '#CCCCCC'
        },
        {
          'key': '60',
          'text': '待发货',
          color: '#FF972A'
        },
        {
          'key': '40',
          'text': '已取消',
          color: '#CCCCCC'
        },
        {
          'key': '70',
          'text': '部发待收',
          color: '#1678FF'
        },
        {
          'key': '80',
          'text': '部发部收',
          color: '#1678FF'
        },
        {
          'key': '50',
          'text': '全发待收',
          color: '#1678FF'
        },
        {
          'key': '20',
          'text': '部发全收',
          color: '#1678FF'
        },
        {
          'key': '120',
          'text': '全发部收',
          color: '#1678FF'
        }
      ],
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
    this.getOrderDetail()
    this.getData()
  },
  methods: {
    async getOrderDetail () {
      const { kx_order } = await this.axios({
        url: '/1491976446623748195/1499324260009775191',
        method: 'post',
        data: {
          'kx_order': {
            id: this.query.orderid
          }
        }
      }).then(res => {
        return res
      })
      this.orderInfo = {
        code: kx_order.code,
        finalamount: kx_order.finalamount,
        createtime: this.$dayjs(+kx_order.createtime).format('YYYY-MM-DD HH:mm'),
        statusText: this.statusMap.filter(s => kx_order.status === s.key)[0].text,
        status: kx_order.status
      }
    },
    async getData () {
      const res = await this.axios({
        url: '/1491976446623748195/1501031585854656595',
        method: 'post',
        data: {
          kx_order: {
            id: this.query.orderid
          }
        }
      }).then(res => {
        return res.kx_deliver_order_detail
      })
      const outsMap = {}
      const list = []
      res.forEach(o => {
        if (!outsMap[o.outboundcode]) {
          outsMap[o.outboundcode] = true
          const products = res.filter(r => r.outboundcode === o.outboundcode)
          list.push({
            deliverytime: this.$dayjs(+o.deliverytime).format('YYYY-MM-DD'),
            logisticscode: o.logisticscode,
            outboundcode: o.outboundcode,
            signman: o.signman,
            allsign: products.filter(p => p.signaturestatus !== '1').length === 0,
            expand: products.filter(p => p.signaturestatus !== '1').length > 0,
            products: products
          })
        }
      })
      this.list = list
      console.log(list)
    },
    toStep (code) {
      this.$emit('toStep', { code })
    },
    toggleExpand (index) {
      console.log(index)
      this.list[index].expand = !this.list[index].expand
    },
    onSignmanChange (index, e) {
      console.log(e.detail.value)
      this.list[index].signman = e.detail.value
    },
    async onSign (index) {
      const photo = this.$refs.photoRefList[index].getValue()
      console.log(photo)
      if (!photo) {
        this.$dialog.alert({
          title: '提示信息',
          message: '请上传签收单'
        })
        return
      }
      await this.$dialog.confirm({
        title: '确认信息',
        message: '确认签收本单？',
        showCancelButton: true
      })
      const list = this.list[index].products.map(p => {
        return {
          id: p.id,
          outboundcode: p.outboundcode,
          signaturenumber: p.expectednumber,
          remark: p.remark,
          signature: photo
        }
      })
      await this.axios({
        url: '/1491976446623748195/1503648112286240823',
        method: 'post',
        data: {
            kx_deliver_order_detail: list,
            kx_order: {
              id: this.query.orderid,
              payamount: ''
            }
          }
      }).then(res => {
        return res.kx_deliver_order_detail
      })
      this.getOrderDetail()
      this.getData()
    },
    productChange (ci, pi, e) {
      console.log(ci, pi, e)
      this.list[ci].products[pi].remark = e.detail.value
    }
  },
  render () {
    return (
      <div>
        <div class="header">
          <div class="row">
            <div class="left">
              <span class="label">创建时间：</span>
              <span class="value">{this.orderInfo.createtime}</span>
            </div>
            <div class="right">
              <span class="text-blue">{this.orderInfo.statusText}</span>
            </div>
          </div>
          <div class="row">
            <div class="left">
              <span class="label">订单编码：</span>
              <span class="value">{this.orderInfo.code}</span>
            </div>
          </div>
          <div class="row">
            <div class="left">
              <span class="label">订单金额：</span>
              <span class="value">{this.orderInfo.finalamount}</span>
            </div>
          </div>
        </div>
        <div class="post-list">
        {this.list.map((post, ci) => (
          <div class="panel" key={post.outboundcode}>
            <div class="panel-header">
              <div class="row">
                <div clas="left">
                  <span>{post.deliverytime}</span>
                </div>
                <div class="right" on-click={() => this.toStep(post.logisticscode)}>
                  <span class="text-blue">查看物流信息</span>
                  <van-icon name={this.arrowIcon} size="12px" class="arrow-icon" />
                </div>
              </div>
              <div class="row">
                <div class="left">
                  <span class="label">出库单：</span>
                  <span class="value">{post.outboundcode}</span>
                </div>
              </div>
              <div class="row">
                <div class="left">
                  <span class="label">物流单：</span>
                  <span class="value">{post.logisticscode}</span>
                </div>
              </div>
            </div>
            <div class="panel-body">
            {post.expand ? (
              <div class="item-list">
                {post.products.map((item) => (
                  <div class="item-wrap" key={item.id}>
                    <div class="item-box">
                      <div class="item-header">
                        <div class="title">
                          <span>{item.productname}</span>
                          {item.producttype != '本品' && (
                            <span class="tag">{item.producttype}</span>
                          )}
                        </div>
                      </div>
                      <div class="item-body">
                        <div class="left">
                          <van-image
                            width="80"
                            height="80"
                            src={item.imageUrl}
                          />
                        </div>
                        <div class="right">
                          <div class="row">
                            <span>订单数量：</span>
                            <span>{item.actualnumber}{item.batchunit}</span>
                          </div>
                          <div class="row">
                            <span>本次发货：</span>
                            <span>{item.expectednumber}{item.batchunit}</span>
                          </div>
                          <div class="row">
                            <span>本次签收：</span>
                            <div class={['input-wrap', item.signaturestatus == '1' ? 'disabled' : '']}>
                            {item.signaturestatus !== '1' ? (
                              <van-stepper
                                value={item.expectednumber}
                                disabled
                              />
                            ) : (
                              <span>{item.signaturenumber}</span>
                            )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="item-footer">
                        <span class="label">备注：</span>
                        {item.signaturestatus != '1' ? (
                          <input bind:blur="onBlur" class="remark-input"/>
                        ) : (
                          <span class="value">{item.remark}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div class="img-list">
              {post.products.map(item => (
                  <van-image
                    width="60"
                    height="60"
                    src={item.imageUrl}
                    key={item.productcode}
                  />
              ))}
              </div>
            )}
              <div class="expand-wrap">
                  <span class="text-blue" on-click={() => this.toggleExpand(ci)}>
                    {post.expand ? '收起详情' : '展开详情'}
                  </span>
                  <van-icon name={post.expand ? this.upIcon : this.downIcon} size="22" class="expand-icon" />
              </div>
            </div>
            <div class="panel-footer">
              <div class="footer-wrap">
                <div class="left">
                  <div class="label">签收人：</div>
                  {post.needinput ? (
                    <input 
                      type="text"
                      class="sign-input"
                      v-model={post.signman}
                      bind:blur="onSignmanChange(ci, $event)"
                    />
                  ) : (
                    <div>{post.signman}</div>
                  )}
                </div>
                <div class="right">
                  <div class="lable require">签收单：</div>
                  <van-uploader
                    ref="photoRefList"
                  />
                </div>
              </div>
              {!post.allsign && (
                <div class="btn-wrap">
                  <van-button block type="info" round on-click={() => this.onSign(ci)}>收货确认</van-button>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    )
  }
}
</script>

<style lang="stylus">
html
  background-color #f5f5f5
.row
  display flex
  justify-content space-between
  align-items center
  font-size 14px
  color #333333
  margin-bottom 4px
  .left, .right
    flex-shrink 0
  .label
    color #999999
  .text-blue
    color #1678FF
  .arrow-icon
    position relative
    top 1px
.header
  padding 12px 20px
  background-color #ffffff
.post-list
  padding 12px
.panel
  padding 12px
  background-color #ffffff
  border-radius 10px
  margin-bottom 12px
  .panel-header
    padding-bottom 12px
    border-bottom 1px solid #eeeeee
  .panel-body
    .item-wrap
      border-bottom 1px solid #eeeeee
      &:last-child
        border-bottom-color #ffffff
    .expand-wrap
      font-size 14px
      text-align center
      color #1678FF
      padding-bottom 14px
      border-bottom 1px solid #eeeeee
      .expand-icon
        position relative
        top 6px
  .panel-footer
    padding 12px 0
    .footer-wrap
      display flex
      algin-item center
      justify-content space-between
      font-size 16px
      color #333
      line-height 80px
      .require
        &:before
          content '*'
          color #F54841
          position relative
          top 2px
          right 1px
      .left
        display flex
        justify-content center
        align-items center
        height 80px
        line-height 80px
        .label
          flex-shrink 0
        .sign-input
          width 100px
          height 26px
          border 1px solid #eee
          padding 0 8px
      .right
        display flex
        height 80px
        line-height 80px
    .btn-wrap
      padding-top 16px
.img-list
  display flex
  padding 12px

.item-box
  padding 12px 0
  background-color #fff
  .item-header
    margin-bottom 8px
    .title
      font-size 16px
      color #333
      .tag
        display inline-block
        padding 1px 4px
        margin-left 4px
        font-size 11px
        color #FF972A
        border 1px solid #FF972A
        word-break keep-all
  .item-body
    display flex
  .right
    flex 1
    display flex
    flex-direction column
    justify-content space-between
    padding-left 16px
    height 80px
    .row
      font-size 14px
      display flex
      align-items center
    .disabled
      background-color #f5f5f5
    .input-wrap
      width 58px
      height 26px
      line-height 26px
      border 1px solid #cccccc
      text-align center
  .item-footer
    display flex
    align-items center
    margin-top 14px
    font-size 14px
    .label
      color #999
    .value
      color #333
    .remark-input
      flex 1
      border 1px solid #eee
      height 26px
      padding 0 8px
</style>