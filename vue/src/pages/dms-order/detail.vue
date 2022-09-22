<script>
export default {
  name: 'order-detail',
  data () {
    return {
      arrowIcon: '/h5-assets/arrow_right@2x.png',
      addrIcon: '/h5-assets/default_address.png',
      loaded: false,
      channelcode: 'JXS0000000008',
      salesmanid: '1510085351492947968',
      query: {
        orderid: '1570324570509021184'
      },
      cashAccount: {},
      feeconfig: {
        cancelconfig: '0',
        giftconfig: '0',
        goodconfig: '0'
      },
      orderInfo: {
        expectedtime: '',
        billtype: '',
        deliveryway: '',
        transportway: '',
        cartype: '',
        spellorderid: '',
        receiveraddr: '',
        receiver: '',
        receivertel: '',
        remark: ''
      },
      orderDetail: [],
      showDatetime: false,
      isChooseAddres: false,
      showAddressList: false,
      currentDate: '',
      minDate: new Date(),
      deliveryWay: [],
      postWay: [
        { key: '0', 'text': '整车' },
        { key: '1', 'text': '拼车' }
      ],
      billType: [
        { key: '0', 'text': '普票' },
        { key: '1', 'text': '专票' },
        { key: '2', 'text': '不开票' }
      ],
      carType: [],
      tenantcode: '1000060',
      ossConfig: {
        provider: "aliyun",
        storagebucket: "xtionai-storage-test",
        storageendpoint: "oss-cn-shenzhen.aliyuncs.com",
        storageurl: "xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com"
      }
    }
  },
  computed: {
    deliverWayText () {
      if (!this.orderInfo.deliveryway || this.deliveryWay.length === 0) {
        return ''
      }
      return this.deliveryWay.filter(item => item.key === this.orderInfo.deliveryway)[0].text
    },
    dateTime () {
      return this.orderInfo.expectedtime ? this.$dayjs(+this.orderInfo.expectedtime).format('YYYY-MM-DD') : ''
    },
    showFee () {
      return this.feeconfig.goodconfig === '1' || this.feeconfig.cancelconfig === '1'
    },
    editable () {
      return !this.query.orderid || ['10', '100'].includes(this.orderInfo.status)
    },
    disabled () {
      return !this.editable
    }
  },
  watch: {
    'orderInfo.cartype' (val) {
      console.log('carttype', val)
    },
    'orderInfo.deliveryway' () {
      if (!this.loaded) return
      if (this.deliverWayText == '自提') {
        this.orderInfo.transportway = '0'
        this.orderInfo.cartype = ''
      }
      this.bindCarType()
    },
    'orderInfo.transportway' (val) {
      if (!this.loaded) return
      if (val == '1') {
        this.orderInfo.cartype = ''
      }
    },
    editable () {
      if (this.editable) {
        // mpx.setNavigationBarTitle({ title: '确认订单' })
      }
    }
  },
  created () {
    // localStorage.setItem('token', '${context.token}')
  },
  mounted () {
    this.init()
    this.$xpe.on('refresh', () => {
      this.init()
    })
    this.$xpe.on('setAddress', (data) => {
      if (!data) return
      const item = JSON.parse(data)
      this.orderInfo.receiver = item.receiver
      this.orderInfo.receivertel = item.receivertel
      this.orderInfo.receiveraddr = item.receiveraddr
      this.orderInfo.address = item.address
    })
  },
  onShow () {
    if (!this.loaded) return
    if (!this.isChooseAddres) {
      this.init()
    } else {
      this.isChooseAddres = false
    }
  },
  methods: {
    isEmpty (val) {
      return val === '' || val === null || val === undefined
    },
    async init () {
      this.$toast.loading({
        message: '加载中...',
        duration: 0
      })
        this.bindDeliverWay()
        this.getCashaccount()
        this.getDMSConfig()
      if (this.query.orderid) {
        await this.getData()
      } else {
        await this.getCacheData()
      }
      this.$toast.clear()
      this.loaded = true
    },
    async getDMSConfig () {
      const { feeconfig } = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1511693060906553432',
        method: 'post',
        data: {
          ka_kq_channelcustomers: {
            channelcode: this.channelcode
          }
        }
      })
      this.feeconfig = feeconfig
    },
    async getAddressList () {
      let list = await this.axios({
        url: '/api/teapi/dy-biz/1108546657601065058/1128622639842201699',
        method: 'post',
        data: {
          ka_kq_channelcustomers: {
            customercode: this.channelcode
          }
        }
      }).then(res => {
        const data = res.kx_order
        return data
      })
      list = list.map(l => {
        return {
          ...l,
          address: l.receiveraddr ? JSON.parse(l.receiveraddr).address : ''
        }
      })
      const defaultList = list.filter(l => l.isdefault === '1')
      if (defaultList.length > 0) {
        this.onSelectAddress({ detail: defaultList[0] })
      }
    },
    async getCacheData () {
      let { kx_order, kx_dms_order_detail } = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1486248650932883555',
        method: 'post',
        data: {
          'ka_kq_channelcustomers': {
            orderid: this.query.orderid,
            channelcode: this.channelcode
          }
        }
      })
      this.orderInfo = {
        ...this.orderInfo,
        ...kx_order
        // address: kx_order.receiveraddr ? JSON.parse(kx_order.receiveraddr).address : ''
      }
      if (this.loaded) {
        this.carTypeText = ''
        this.orderInfo.cartype = ''
      }
      console.log(kx_dms_order_detail[0])
      kx_dms_order_detail = kx_dms_order_detail[0] ? kx_dms_order_detail : [];
      this.orderDetail = kx_dms_order_detail.map((p, i) => {
          const image = p.productimage ? JSON.parse(p.productimage) : []
          if (image.length > 0) {
            this.$OSS.getUrl('img', image[0]).then(url => {
              p.imageUrl = url
              this.orderDetail.splice(i, 1, p)
            })
          }
          return p
      })
      console.log('od', this.orderDetail)
      if (!this.orderInfo.receiveraddr) {
        this.getAddressList()
      }
      this.loaded = true
    },
    async getData () {
      let { kx_order, kx_dms_order_detail } = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1499324260009775191',
        method: 'post',
        data: {
          'kx_order': {
            id: this.query.orderid
          }
        }
      })
      console.log(this.loaded, kx_order)
      if (!this.loaded) {
        this.orderInfo = {
          ...this.orderInfo,
          ...kx_order,
          address: kx_order.receiveraddr ? JSON.parse(kx_order.receiveraddr).address : ''
        }
        await this.bindCarType()
        this.orderInfo.cartype = kx_order.cartype
        console.log(this.orderInfo)
      }
      // console.log(kx_dms_order_detail)
      if (!['10', '100'].includes(kx_order.status)) {
        kx_dms_order_detail = kx_dms_order_detail[0] ? kx_dms_order_detail : [];
        this.orderDetail = kx_dms_order_detail.map((p, i) => {
            const image = p.productimage ? JSON.parse(p.productimage) : []
            if (image.length > 0) {
              this.$OSS.getUrl('img', image[0]).then(url => {
                p.imageUrl = url
                this.orderDetail.splice(i, 1, p)
              })
            }
            return p
        })
        this.carTypeText = this.orderInfo.carname
      } else {
        await this.getCacheData()
      }
    },
    async onSubmit (status) {
      console.log(this.orderInfo)
      if (this.orderDetail.length === 0) {
        this.$dialog.alert({
          title: '提示信息',
          message: '请先添加产品'
        })
        return
      }
      if (this.isEmpty(this.orderInfo.receiveraddr)) {
        this.$dialog.alert({
          title: '提示信息',
          message: '请选择收货地址'
        })
        return
      }
      if (this.isEmpty(this.orderInfo.billtype)) {
        this.$dialog.alert({
          title: '提示信息',
          message: '请选择开票类型'
        })
        return
      }
      if (this.isEmpty(this.orderInfo.deliveryway)) {
        this.$dialog.alert({
          title: '提示信息',
          message: '请选择送货方式'
        })
        return
      }
      if (this.isEmpty(this.orderInfo.transportway)) {
        this.$dialog.alert({
          title: '提示信息',
          message: '请选择运输方式'
        })
        return
      }
      if (this.deliverWayText !== '自提' && this.postWayText !== '1') {
        if (this.isEmpty(this.orderInfo.cartype)) {
          this.$dialog.alert({
            title: '提示信息',
            message: '请选择适用车型'
          })
          return
        }
      }
      if (this.postWayText === '拼车') {
        if (this.isEmpty(this.orderInfo.spellorderid)) {
          this.$dialog.alert({
            title: '提示信息',
            message: '请输入拼单号'
          })
          return
        }
      }
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
      console.log('rtetetet')
      await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1493824241152430174',
        method: 'post',
        data: {
          kx_order: {
            ...this.orderInfo,
            status,
            create_object: '1',
            ordersourceid: '3',
            expectedtime: this.orderInfo.expectedtime ? '' + this.dayjs(+this.orderInfo.expectedtime).valueOf() : '',
            customercode: this.channelcode,
            salesmanid: this.salesmanid
          },
          kx_dms_order_detail: this.orderDetail
        }
      })
      this.$toast.clear()
      this.$xpe.emit('submited')
    },
    async getCashaccount () {
      const obj = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1501496324988735583',
        method: 'post',
        data: {
          'ka_kq_channelcustomers': {
            channelcode: this.channelcode
          }
        }
      }).then(res => {
        const data = res.kx_cashaccount
        return data
      })
      this.cashAccount = obj
    },
    async bindDeliverWay () {
      const list = await this.axios({
        url: '/api/teapi/dy-biz/100000000000000001/100000000001100001',
        method: 'post',
        data: {
          pl_dictionary: {
            code: '',
            dictionarycode: '1499298111724589143',
            level: '',
            objectmark: 'deliveryway',
            parentdickey: '',
            status: '1',
          }
        }
      }).then(res => {
        const data = res.pl_dictionary
        return data.map(d => ({ ...d, text: d.dicvalue, key: d.dickey }))
      })
      this.deliveryWay = list
    },
    async bindCarType () {
      const list = await this.axios({
        url: '/api/teapi/dy-biz/1501475108701737027/1501475108701737026',
        method: 'post',
        data: {
          'kx_car_model': {
            send_type: '' + this.orderInfo.deliveryway,
            car_load: '' + this.orderInfo.weight,
            volume: '' + this.orderInfo.volume,
            channelcode: this.channelcode
          }
        }
      }).then(res => {
        const data = res.kx_car_model
        return data.map(cm => ({ ...cm, key: cm.car_serial_number, text: cm.car_serial_name }))
      })
      console.log(list)
      this.carType = list
    },
    chooseDate (val) {
      this.orderInfo.expectedtime = val
      this.toggleShowDateTime()
    },
    chooseCarType (e) {
      if (e.detail.value) {
        this.orderInfo.cartype = e.detail.value.key
        this.carTypeText = e.detail.value.text
      }
    },
    toggleShowDateTime () {
      if (this.disabled) return
      this.showDatetime = !this.showDatetime
    },
    toCost () {
      this.$xpe.emit('toCost', { amount: this.orderInfo.finalamount })
    },
    toCargo () {
      this.$xpe.emit('toCargo', { amount: this.orderInfo.finalamount })
    },
    toogleAddressList () {
      if (this.disabled) return
      // this.isChooseAddres = true
      this.$xpe.emit('chooseAddress')
    },
    toEdit () {
      this.$xpe.emit('toEditCart')
    },
    onSelectAddress (e) {
      this.orderInfo.receiver = e.detail.receiver
      this.orderInfo.receivertel = e.detail.receivertel
      this.orderInfo.receiveraddr = e.detail.receiveraddr
      this.orderInfo.address = e.detail.address
      this.showAddressList = false
    }
  },
  render () {
    return (
      <div class={ ['order-detail', this.editable ? 'padding-bottom editable' : '' ]}>
        <div class="order-content">
          <div class="adress-content" on-click={this.toogleAddressList}>
            <div class="address-wrap">
              <div class="left">
                <div class="icon-wrap">
                  <van-icon name={this.addrIcon} size="16" color="#1678FF" />
                </div>
              </div>
              <div class="right">
                <div class="userinfo">
                  <span class="name">{this.orderInfo.receiver || ''}</span>
                  <span class="phone">{this.orderInfo.receivertel || ''}</span>
                </div>
                <div class="address">
                  {this.orderInfo.address}
                </div>
              </div>
            </div>
          </div>
          <div class="section-wrap">
          {this.orderDetail.map((item) => (
            <div class="item-wrap border-bottom" key={item.id}>
              <div class="item-box">
                <div class="left">
                  <van-image
                    width="68"
                    height="68"
                    src={item.imageUrl}
                  />
                </div>
                <div class="right">
                  <div class="top">
                    <div class="title">
                      <span>{item.productname}</span>
                      {item.producttype != '本品' && (
                        <span class="tag">{item.producttype}</span>
                      )}
                    </div>
                    <div class="price-wrap">
                      <span class="real-price">￥{item.currentprice}</span>
                      {item.originalprice != item.currentprice && (
                        <span class="origin-price">￥{item.originalprice}</span>
                      )}
                    </div>
                  </div>
                  <div class="bottom">
                    <div class="num">{item.number}{item.batchunit}</div>
                    <div class="amount-wrap">
                      <span class="label">合计：</span>
                      <span class="amount">￥{item.currentallprice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
          <div class="section-wrap">
            <div class="field-cell">
              <div class="lable">
                期望交货日期
              </div>
              <div class="value" on-click={this.toggleShowDateTime}>
               { (this.orderInfo.expectedtime || this.disabled) && (
                <div class="val">{this.dateTime}</div>
               )}
               {this.editable && !this.dateTime && (
                 <div class="placehold">请选择</div>
               )}
               {this.editable && (
                 <van-icon name={this.arrowIcon} size="16" color="#CCC" class="arrow" />
               )}
              </div>
            </div>
            <div class="field-cell">
              <label class="lable require">开票类型</label>
              <div class="value">
                <select
                  required
                  dir="rtl"
                  class="cell-input"
                  placeholder={this.editable ? '请选择' : '' }
                  v-model={this.orderInfo.billtype}
                  disabled={this.disabled}
                > 
                  {this.editable && (
                    <option value="" disabled selected style="color: #cccccc">请选择</option>
                  )}
                  {this.billType.map(item => (
                    <option value={item.key} key={item.key}>{item.text}</option>
                  ))}
                </select>
                {this.editable && (
                  <van-icon 
                    name={this.arrowIcon}
                    size="16"
                    color="#CCC"
                    class="arrow"
                    style="visibility: hidden"
                  />
                )}
              </div>
            </div>
            <div class="field-cell">
              <label class="label require">送货方式</label>
              <div class="value">
                <select
                  required
                  dir="rtl"
                  class="cell-input"
                  v-model={this.orderInfo.deliveryway}
                  placeholder={this.editable ? '请选择' : '' }
                  bind:change="chooseDeliver"
                  disabled={this.disabled}
                >
                  {this.editable && (
                    <option value="" disabled selected style="color: #cccccc">请选择</option>
                  )}
                  {this.deliveryWay.map(item => (
                    <option value={item.key} key={item.key}>{item.text}</option>
                  ))}
                </select>
                {this.editable && (
                  <van-icon 
                    name={this.arrowIcon}
                    size="16"
                    color="#CCC"
                    class="arrow"
                    style="visibility: hidden"
                  />
                )}
              </div>
            </div>
            <div class="field-cell">
              <label class="label require">运输方式</label>
              <div class="value">
                <select
                  required
                  dir="rtl"
                  class="cell-input"
                  bind:change="choosePostWay"
                  placeholder={this.editable ? '请选择' : '' }
                  v-model={this.orderInfo.transportway}
                  disabled={this.disabled || this.deliverWayText == '自提'}
                >
                  {this.editable && (
                    <option value="" disabled selected style="color: #cccccc">请选择</option>
                  )} 
                  {this.postWay.map(item => (
                    <option value={item.key} key={item.key}>{item.text}</option>
                  ))}
                </select>
                {this.editable && (
                  <van-icon 
                    name={this.arrowIcon}
                    size="16"
                    color="#CCC"
                    class="arrow"
                    style="visibility: hidden"
                  />
                )}
              </div>
            </div>
            <div class="field-cell">
              <div class={['lable', this.orderInfo.transportway === '1' ? 'require' : '' ]}>
                拼单号
              </div>
              <div class="value">
                <input
                  v-model={this.orderInfo.spellorderid}
                  class="cell-input"
                  disabled={this.disabled || this.orderInfo.transportway === '0'}
                  placeholder={this.editable && this.orderInfo.transportway !== '0'  ? "请输入" : ''}
                />
                {/*this.editable && (
                  <van-icon 
                    name={this.arrowIcon}
                    size="16"
                    color="#CCC"
                    class="arrow"
                    style="visibility: hidden"
                  />
                )*/}
              </div>
            </div>
            <div class="field-cell">
              <label class={['label', this.orderInfo.transportway === '1' || this.deliverWayText == '自提' ? '' : 'require']}>
                适用车型
              </label>
              <div class="value">
                <select
                  required
                  dir="rtl"
                  class="cell-input"
                  v-model={this.orderInfo.cartype}
                  bind:change="chooseCarType"
                  place
                  disabled={this.disabled || this.orderInfo.transportway === '1' || this.deliverWayText == '自提' }
                >
                  {this.editable && (
                    <option value="" disabled selected style="color: #cccccc">请选择</option>
                  )}
                  {this.carType.map(item => (
                    <option value={item.key} key={item.key}>{item.text}</option>
                  ))}
                </select>
                {this.editable && (
                  <van-icon 
                    name={this.arrowIcon}
                    size="16"
                    color="#CCC"
                    class="arrow"
                    style="visibility: hidden"
                  />
                )}
              </div>
            </div>
            <div class="field-cell">
              <div class="lable">
                备注
              </div>
              <div class="value">
                <input class="cell-input"
                  v-model={this.orderInfo.remark}
                  placeholder-class="placehold"
                  disabled={this.disabled}
                  placeholder={this.editable ? "请输入" : ''}
                />
                {/*this.editable && (
                  <van-icon 
                    name={this.arrowIcon}
                    size="16"
                    color="#CCC"
                    class="arrow"
                    style="visibility: hidden"
                  />
                )*/}
              </div>
            </div>
          </div>
          <div class="section-wrap">
            <div class="row">
              <div class="col">
                <span class="label">现金余额：</span>
                <span class="value">￥{this.cashAccount.amount}</span>
              </div>
              <div class="col">
                <span class="label">费用余额：</span>
                <span class="value">￥{this.cashAccount.costamount}</span>
              </div>
              <div class="col">
                <span class="label">货补余额：</span>
                <span class="value">￥{this.cashAccount.goodamount}</span>
              </div>
              <div class="col">
                <span class="label">授信余额：</span>
                <span class="value">￥{this.cashAccount.credit}</span>
              </div>
              <div class="col">
                <span class="label" space="nbsp">保  证  金：</span>
                <span class="value">￥{this.cashAccount.margin}</span>
              </div>
            </div>
          </div>
          <div class="section-wrap">
            <div class="row">
              <div class="col">
                <span class="label">整单重量(t)：</span>
                <span class="value">{this.orderInfo.weight}</span>
              </div>
              <div class="col">
                <span class="label">整单总体积(m<span class="sup">3</span>)：</span>
                <span class="value">{this.orderInfo.volume}</span>
              </div>
            </div>
          </div>
          <div class="section-wrap">
          {this.editable && this.showFee && (
            <div class="btn-wrap">
              <van-row gutter="12">
                {this.feeconfig.goodconfig == '1' && (
                  <van-col span={24 - this.feeconfig.cancelconfig * 12}>
                    <van-button plain type="info" block on-click={this.toCargo}>货补抵扣</van-button>
                  </van-col>
                )}
                {this.feeconfig.cancelconfig == '1' && (
                  <van-col span={24 - this.feeconfig.goodconfig * 12}>
                    <van-button plain type="info" block on-click={this.toCost}>费用抵扣</van-button>
                  </van-col>
                )}
              </van-row>
            </div>
          )}
            <div class="cell">
              <span class="label">原价金额合计</span>
              <span class="value">￥{this.orderInfo.amount}</span>
            </div>
            <div class="cell">
              <span class="label">折扣合计</span>
              <span class="value sub-color">-￥{this.orderInfo.discountamount3}</span>
            </div>
            <div class="cell">
              <span class="label">现价金额合计</span>
              <span class="value">￥{this.orderInfo.discountpriceamout}</span>
            </div>
            <div class="cell">
              <span class="label">赠品合计</span>
              <span class="value sub-color">-￥{this.orderInfo.discountamount5}</span>
            </div>
            <div class="cell">
              <span class="label">货补合计</span>
              <span class="value sub-color">-￥{this.orderInfo.discountamount4}</span>
            </div>
            <div class="cell">
              <span class="label">费用合计</span>
              <span class="value sub-color">-￥{this.orderInfo.costamount}</span>
            </div>
          </div>
          <div class="amount-cell">
            <span class="label">实付金额</span>
            <span class="value">￥{this.orderInfo.finalamount}</span>
          </div>
          {this.editable && (
            <div class="footer">
              <div class="footer-btn btn-defualt" on-click={this.toEdit}>编辑商品</div>
              <div class="footer-btn btn-defualt" on-click={() => this.onSubmit('10')}>暂存</div>
              <div class="footer-btn btn-blue" on-click={() => this.onSubmit('30')}>提交订单</div>
            </div>
          )}
          <van-popup
            v-model={ this.showDatetime }
            position="bottom"
          >
            <van-datetime-picker
              type="date"
              v-model={ this.orderInfo.expectedtime }
              on-confirm={this.chooseDate}
              on-cancel={this.toggleShowDateTime}
              min-date={ this.minDate }
            />
          </van-popup>
        </div>
      </div>
    )
  }
}
</script>

<style lang="stylus">
.order-content
  background #F4F6F8 
.padding-bottom
  padding-bottom calc(50px + constant(safe-area-inset-bottom))
  padding-bottom calc(50px + env(safe-area-inset-bottom))
.border-bottom
  border-bottom 1px solid rgba(0, 0, 0, 0.04);
.adress-content
  padding-bottom 4px
  background-color #ffffff
  background-position bottom
  background-size 100% 4px
  background-image url('/h5-assets/address-border.png')
.section-wrap
  margin-top 8px
  padding 0 16px
  background-color #fff
  .field-cell
    display flex
    justify-content space-between
    align-items center
    height 48px
    line-height 48px
    border-bottom 1px solid #eee
    font-size 14px
    &-disable
      opacity 0.5
    .require
      &::after
        position relative
        top 2px
        left 2px
        content '*'
        color #F54841
    .value
      flex 1
      text-align right
      display flex
      justify-content flex-end
      align-items center
      padding-left 16px
      .cell-input
        flex 1
        height 32px
        line-height 32px
        text-align right
        border none
        outline none
        background none
        box-shadow none
        appearance none
    .placehold
      color #cccccc
      flex 1
    .arrow
      color #cccccc
  .row
    display flex
    flex-wrap wrap
    padding 8px 0
    width 100%
    font-size 14px
    color #333
    .col
      padding 4px 0
      width 50%
      .label
        display inline-block
        text-align right 
        white-space pre-wrap
  .cell
    display flex
    justify-content space-between
    font-size 14px
    padding 4px 0
    .sub-color
      color #FF972A
  .btn-wrap
    padding 12px 0
.amount-cell
  background-color #fff
  border-top 1px solid #eee
  display flex
  justify-content space-between
  padding 14px 16px 16px 12px
  .label
    font-size 16px
    color #333
  .value
    font-size 18px
    color #F54841
    font-weight bold
.footer
  position fixed
  left 0
  bottom 0
  box-sizing border-box
  display flex
  justify-content flex-end
  width 100%
  padding 7px 16px
  padding-bottom calc(16px + constant(safe-area-inset-bottom))
  padding-bottom calc(16px + env(safe-area-inset-bottom))
  background #ffffff
  box-shadow: 0px -3px 6px rgba(0, 48, 130, 0.05);
  z-index 99
  .footer-btn
    padding 6px 16px
    font-size 16px
    margin-left 12px
    border-radius 18px
  .btn-defualt
    color #333333
    background-color #eee
  .btn-blue
    color #ffffff
    background-color #1678FF
.adress-list-content
  height 100vh
  background-color #F4F6F8

.item-box
  padding 12px 0
  display flex
  background-color #fff
  .right
    flex 1
    .top
      display flex
      flex-direction column
      justify-content space-between
      padding-left 8px
      height 68px
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
      .price-wrap
        font-size 14px
        color #999
        .origin-price
          margin-left 4px
          text-decoration line-through
    .bottom
      display flex
      justify-content space-between
      padding-top 4px
      align-items center
      .num
        margin-left 8px
        font-size 14px
        color #999
      .label
        color #333
        font-size 14px
      .amount
        font-size 14px
        color #F54841

.address-wrap
  display flex
  padding 12px 16px
  background #fff
  .left
    padding-right 16px
    display flex
    flex-direction column
    justify-content center
    .icon-wrap
      width 32px
      height 32px
      border-radius 50%
      background rgba(231, 241, 255, 0.39)
      font-size 14px
      color #1678FF
      font-weight bold
      display flex
      flex-direction column
      justify-content center
      text-align center
  .right
    flex 1
    border-bottom  1px solid #eeeeee
    &:last-child
      border-bottom none
    .userinfo
      font-size 16px
      color #333
      font-weight bold
    .phone
      margin 0 8px
    .address
      margin-top 4px
      font-weight normal
      font-size 14px color #333
</style>