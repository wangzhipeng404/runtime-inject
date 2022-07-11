<script>
export default {
  name: 'dms-cart',
  data () {
    return {
      cartEmpty: '/h5-assets/shoppingcar_image_empty.png',
      loaded: false,
      show: false,
      channelcode: 'QD0000000593',
      query: {},
      list: [],
      products: [],
      checkedProducts: [],
      costid: '',
      checkedList: [],
      productIds: [],
      count: 0,
      authconfig: 0,
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
    empty () {
      return this.loaded && this.list.length === 0
    },
    checkedAll: {
      get () {
        return this.productIds.length > 0 && this.checkedList.length === this.productIds.length
      },
      set (val) {
        if (!val) {
          this.changeCheckedProudcts([], [...this.checkedList])
          this.checkedList = []
        } else {
          const addList = this.productIds.filter(l => this.checkedList.indexOf(l) === -1)
          this.checkedList = this.productIds
          this.changeCheckedProudcts(addList, [])
        }
      }
    },
    amount () {
      let count = 0
      this.list.forEach(c => {
        c.productarr.forEach(p => {
          if (p.type === '1' && p.ischecked === '1') {
            count += Number(p.shopamount)
          }
        })
      })
      return count.toFixed(2).split('.')
    }
  },
  watch: {
    checkedList (val, old) {
      console.log(val)
      const addList = val.filter(l => old.indexOf(l) === -1)
      const subList = old.filter(l => val.indexOf(l) === -1)
      this.changeCheckedProudcts(addList, subList)
    },
    refreshPage () {
      this.getData()
    }
  },
  created () {
    this.axios.defaults.headers.common["token"] = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTc1MjY3NjAsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNTA5MDgyNDk1MjE0MjkyOTkyIiwiYWNjb3VudENvZGUiOiIxNTA5MDgyNDk0NzM2MTQyMzM2IiwidGVuYW50Q29kZSI6IjEwMDAwNjAiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjo2LCJ0b2tlbklkIjoiNGM0ZTBiMmYtMjMyOC00OWExLWE3YjItMGQyNzViZGJjMzY1Iiwib3JnQ29kZSI6IjkyODAxNDg5MzUiLCJ1c2VySW5mb0lkIjoiMTUwOTA4MjQ4OTcxMTM2NjE0NCIsInVzZXJJbmZvTmFtZSI6IuaWh-S7tiIsInBvc2l0aW9uQ29kZSI6IjE1MDkxMzQ4NDAxOTUzMjE4NTYiLCJwb3NpdGlvbk5hbWUiOiJETVPlhajmnYPpmZAt5rWL6K-VIiwibWVtYmVyQ29kZSI6IjE1MTAwODUzNTE0OTI5NDc5NjgiLCJyZWZQb3NpdGlvbkNvZGUiOiIxNDk2MzE2OTk4MzQ5NjIzMjk2IiwiY2F0ZWdvcnlDb2RlIjoiIiwib3JnU3RydWN0VHlwZUlkIjoiMiIsInVzZXJOYW1lIjoiMTM2NTA4MTkzMzQiLCJ1c2VyTmFtZTEiOiIxMzY1MDgxOTMzNCIsInVzZXJOYW1lMiI6bnVsbCwidXNlck5hbWUzIjpudWxsLCJ0ZW5hbnROYW1lIjoi5pm65oWnMTAwVjYuMC1iYXNl5Lqn5ZOB56ef5oi3IiwiYXBwQ29kZSI6ImRpc3RyaWJ1dGlvbiIsImFwcENvZGVzIjpbImRpc3RyaWJ1dGlvbiIsInByb21vdGlvbiIsInNhbGVzIl0sInN1YlBkQ29kZXMiOlsic2ZhIiwiZG1zIiwicG1tIiwidHBtIl0sImNvZGVwYXRoIjoiMi45MjgwMTQ4OTM1LiIsImlzbGVhZm9yZyI6InRydWUiLCJtZXRhbW9kZWx0eXBlIjoxLCJpc1Ntc0xvZ2luIjpmYWxzZX19.xoijqvXx2Is3XtUdKCuHjv_OI0KxZmEHBTS9BkU6Qi4';
    this.axios.defaults.baseURL = "/api/teapi/dy-biz";
    // const user = localStorage.getItem('distributionData')
    this.channelcode = 'QD0000000593'
  },
  mounted () {
    // const user = mpx.getStorageSync('distributionData')
    // this.channelcode = user.customercode
    // const pages = getCurrentPages()
    // const { options } = pages.pop()
    // this.query = options
    this.getData()
  },
  methods: {
    onPullDownRefresh () {
      this.getData()
    },
    pullDownRefresh () {
      this.getData()
    },
    onShow () {
      if (!this.loaded) return
      this.getData()
    },
    async getData () {
      this.loaded = false
      // this.checkedList = []
      // this.productIds = []
      const res = await this.axios({
        url: `/1491976446623748195/1495666677306757214`,
        method: 'post',
        data: {
          'kx_order_shoppingcart': {
            'customercode': this.channelcode,
            'orderid': this.query.orderid
          }
        }
      }).then(res => {
        return res.data.resp_data
      })
      const productIds = []
      const checkedIds = []
      let count = 0
      this.authconfig = res.authconfig.authconfig
      let list = res.kx_order_shoppingcart.map((c, ci) => {
        c.productarr = c.productarr.map((p, pi) => {
          if (p.saletype != '954254203071631360') {
            productIds.push(`${ci}-${pi}`)
          }
          if (p.ischecked === '1') {
            checkedIds.push(`${ci}-${pi}`)
            console.log(count, p.batchcount)
            count += Number(p.batchcount)
          }
          const image = p.image ? JSON.parse(p.image) : []
         if (image.length > 0) {
          const objectkey = `${image[0].source.slice(0, 3)}/img/${this.$dayjs(+image[0].datetime).format('YYYYMMDD')}/${this.tenantcode}/${image[0].source}`
          p.imageUrl = `https://${this.ossConfig.storageurl}/${objectkey}`
        }
          return p
        })
        c.costproducts = c.costproducts ? c.costproducts.filter(cp => !c.productarr.find(p => cp.productid === p.id)) : []
        return c
      })
      this.count = count
      this.productIds = productIds
      this.checkedList = checkedIds
      this.list = list
      this.loaded = true
    },
    async updateCart (products) {
      await this.axios({
        url: `/1491976446623748195/1494632923264061519`,
        method: 'post',
        data: {
          'ka_kq_channelcustomers': {
            'customercode': this.channelcode,
            'orderid': this.query.orderid
          },
          'kx_order_shoppingcart': products
        }
      }).then(res => {
        const data = res.data.resp_data
        return data
      })
      this.getData()
    },
    async changeCheckedProudcts (add, sub) {
      const adds = add.map(i => {
        const [ci, pi] = i.split('-')
        const product = this.list[ci].productarr[pi]
        return {
          productid: product.id,
          costid: this.list[ci].costid,
          ruleid: product.ruleid,
          ischecked: '1',
          saletype: product.saletype
        }
      }) 
      const subs = sub.map(i => {
        const [ci, pi] = i.split('-')
        const product = this.list[ci].productarr[pi]
        return {
          productid: product.id,
          costid: this.list[ci].costid,
          ruleid: product.ruleid,
          ischecked: '0',
          saletype: product.saletype
        }
      })
      const changed = [...adds, ...subs]
      if (changed.length == 0) return;
      await this.axios({
        url: `/1491976446623748195/1512628814021267555`,
        method: 'post',
        data: {
          'ka_kq_channelcustomers': {
            'channelcode': this.channelcode,
            'orderid': this.query.orderid || ''
          },
          'kx_order_shoppingcart': changed
        }
      }).then(res => {
        const data = res.data.resp_data
        return data
      })
      this.getData()
    },
    activityDetail (cost) {
      console.log(cost)
      this.$dialog.alert({
        title: '活动内容',
        message: cost.ruledescribution,
        confirmButtonText: '我知道了'
      })
    },
    toggleShow (index) {
      if (!this.show) {
        this.costid = this.list[index].costid
        this.products = this.list[index].costproducts
        this.checkedProducts = []
      }
      this.show = !this.show
    },
    addProduct () {
      if (this.checkedProducts.length > 0) {
        const list = this.checkedProducts.map(i => {
          const product = this.products[i]
          return {
            productid: product.productid,
            costid: this.costid,
            ruleid: product.ruleid,
            batchcount: '1',
            saletype: product.saletype
          }
        })
        this.updateCart(list)
      }
      this.show = false
    },
    onStepperChange (costid, product, val) {
      if (this.timer && this.lastupdateid === product.id) {
        clearTimeout(this.timer)
      }
      this.lastupdateid = product.id
      this.timer = setTimeout(() => {
        this.updateCart([{
          productid: product.id,
          costid: costid,
          ruleid: product.ruleid,
          batchcount: `${val > 0 ? val : 1}`,
          saletype: product.saletype
        }])
      }, 1000)
    },
    onSelectProduct (e) {
      this.checkedProducts = e.detail
    },
    onDeleteProducts () {
      this.$dialog.confirm({
        title: '确认信息',
        message: '确定移除勾选的产品吗',
        confirmButtonText: '确认',
        showCancelButton: true
      }).then(() => {
        const products = this.checkedList.map(i => {
          const [ci, pi] = i.split('-')
          console.log(ci, pi)
          const product = this.list[ci].productarr[pi]
          console.log(product)
          return {
            productid: product.id,
            costid: this.list[ci].costid,
            ruleid: product.ruleid,
            batchcount: '0',
            saletype: product.saletype
          }
        })
        this.checkedList = []
        this.updateCart(products)
      })
    },
    async onSubmit () {
      if (this.checkedList.length === 0) {
        this.$toast({
          message: '请先选择产品',
        })
        return
      }
      let hasExpire = false
      const products = this.checkedList.map(i => {
        const [ci, pi] = i.split('-')
        const product = this.list[ci].productarr[pi]
        if (product.expire === '1') {
          hasExpire = true
        }
        return {
          productid: product.id,
          batchcount: '' + product.batchcount,
          saletype: product.saletype,
          price: product.price,
          shopamount: product.shopamount
        }
      })
      if (hasExpire) {
        this.$toast({
          message: '购物车存在已过期产品，请修改'
        })
        return
      }
      await this.axios({
        url: `/1491976446623748195/1512027390421897310`,
        method: 'post',
        data: {
          'kx_order': {
            'customercode': this.channelcode,
            'id': this.query.orderid || ''
          },
          'kx_order_shoppingcart': products
        }
      }).then(res => {
        const data = res.data.resp_data
        return data
      })
      if (this.query.mode === 'edit') {
        // mpx.navigateBack()
      } else {
        // mpx.navigateTo({
        //   url: `/packageDMS/pages/order/detail/detail?orderid=${this.query.orderid || ''}`
        // })
      }
    },
    toMall () {
      // mpx.navigateTo({
      //   url: `/packageDMS/pages/mall/mall?mode=${this.query.mode || 'edit'}&orderid=${this.query.orderid || ''}`
      // })
    },
    toMallBar () {
      if (this.query.mode === 'edit') {
        this.toMall()
        return
      }
    }
  },
  render () {
    return (
      <div class="cart-wrap">
      {this.empty && (
        <div class="empty-wrap">
          <div class="img-wrap">
            <img src={this.cartEmpty} class="empty-img" />
            <div class="empty-text">购物车还是空的</div>
          </div>
          <div class="btn-wrap">
            <div class="empty-btn" on-click="toMallBar">去逛逛</div>
          </div>
        </div>
      )}
        <van-checkbox-group v-model={this.checkedList}>
        {this.list.map((cost, costIndex) => (
          <div
            class="cart-panel"
            key={cost.costid}
          >
            <div class="panel-header">
              <div class="title-wrap" >
                <div class="left" on-click={() => this.activityDetail(cost)}>
                  <div class={['title', cost.costid === '' ? 'black' : ''] }>
                    {cost.costname}
                  </div>
                  {cost.costid != '' && (
                    <div class="desc">
                      <van-icon name="question-o" size="16" />
                    </div>
                  )}
                </div>
                {cost.costproducts.length > 0 && cost.expire != '1' && (
                  <div 
                    class="right"
                    on-click={() => this.toggleShow(costIndex)}
                  >
                    选择活动商品
                    <van-icon name="arrow" size="16" />
                  </div>
                )}
              </div>
            </div>
            <div class="panel-body">
            {cost.productarr.map((product, productIndex) => (
              <div class="item-wrap"  key={product.id}>
                <div class="check-wrap">
                  {product.saletype != '954254203071631360' && (
                    <van-checkbox
                      class="radio"
                      name={costIndex + '-' + productIndex}
                    />
                  )}
                </div>
                <div class="item-box">
                  <div class="item-left">
                    <van-image
                      width="80"
                      height="80"
                      src={product.imageUrl}
                    />
                  </div>
                  <div class="item-right">
                    <div class="item-right-top">
                      <div class={ ['item-title-wrap', product.expire == '1' ? 'expire' : ''] }>
                        <div class="title-left">
                          {product.expire == '1' && (
                            <van-tag style="margin-right: 8px">已过期</van-tag>
                          )}
                          <span class="item-title">{product.productname}</span>
                        </div>
                        {cost.costtype != 2 && (
                          <div class="title-right">
                            <van-tag 
                              plain
                              color={ product.type == '1' ? (product.expire == '0' ? '#1678FF' : '#999999') : '#FF972A' }
                            >
                              {product.typename}
                            </van-tag>
                          </div>
                        )}
                      </div>
                      {this.authconfig == 1 && (
                        <div class="item-limit">
                          <div class="limit-row">起订量：{product.minquantity || '无'}</div>
                          <div class="limit-row">最大订购量：{product.maxquantity || '无'}</div>
                        </div>
                      )}
                    </div>
                    <div class="item-right-bottom">
                      <div class="price-wrap">
                        <div class="item-price">￥{product.price}</div>
                        {product.type == '1' && product.originalprice && (
                          <div class="origin-price">
                            ￥{product.originalprice}
                          </div>
                        )}
                      </div>
                      <div class="num-wrap">
                        <div class="stepper-wrap">
                          <van-stepper
                            min={this.authconfig == 1 && product.minquantity > 0 ? product.minquantity : 1}
                            max={this.authconfig == 1 && product.maxquantity ? product.maxquantity : 999999 }
                            value={ product.batchcount }
                            on-change={(e) => this.onStepperChange(cost.costid, product, e)}
                            disabled={ !(product.type == '1' && product.expire != '1') }
                            integer
                          />
                          <span class="uint">{ product.traystatus === '1' ? '托' : product.batchunit }</span>
                        </div>
                        {product.traystatus === '1' && (
                          <div class="uint-rate">一托{product.traynumber}{ product.batchunit }</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        ))}
        </van-checkbox-group>
        <div
          class={['footer', this.query.mode === 'edit' ? 'footer-edit' : 'footer-tabbar']}
        >
          {this.query.mode === 'edit' && (
            <div class="footer-top">
              <span>合计：</span>
              <span class="submit-bar__price">
                <span class="submit-bar__currency">￥</span>
                <span class="submit-bar__price-integer">{this.amount[0]}</span>
                <span>.{this.amount[1]}</span>
              </span>
            </div>
          )}
          <div class="submit-bar">
            <div class="submit-bar-left">
              <van-checkbox v-model={ this.checkedAll }>全选</van-checkbox>
              {this.checkedList.length > 0 && (
                <div class="del-btn" on-click={this.onDeleteProducts}>删除选中</div>
              )}
            </div>
            <div class="submit-bar-right">
              <span class="submit-bar__price" wx:if="{{query.mode !== 'edit'}}">
                <span class="submit-bar__currency">￥</span>
                <span class="submit-bar__price-integer">{ this.amount[0] }</span>
                <span>.{this.amount[1]}</span>
              </span>
              <div class="btn-wrap">
              {this.query.mode === 'edit' && (
                <van-button
                  type="warning"
                  custom-class="submit-btn"
                  on-click={this.toMall}
                >
                  添加商品
                </van-button>
              )}
                <van-button 
                  type="info"
                  custom-class="submit-btn"
                  on-click={this.onSubmit}
                  disabled={this.count < 1}
                >确认({this.count})</van-button>
              </div>
            </div>
          </div>
        </div>
        <van-action-sheet 
          show={ this.show }
          title="选择活动商品"
          bind:close="toggleShow"
        >
          <div 
            class="chose-product-content-wrap"
            style={ 'padding-bottom: ' + this.query.mode != 'edit' ? '60px' : '24px' }
          >
            <van-checkbox-group value={this.checkedProducts} on-change={this.onSelectProduct}>
              <scroll-view class="product-list" scroll-y="{{true}}">
                <div class="list-content">
                {this.products.map((item, index) => (
                  <div class="item-row" key={item.productid}>
                    <div class="name">{item.productname}</div>
                    <div>
                      <van-checkbox name={index} />
                    </div>
                  </div>
                ))}
                </div>
              </scroll-view>
            </van-checkbox-group>
            <div class="btn-wrap">
              <van-button 
                block
                type="info"
                custom-class="btn"
                on-click={this.addProduct}
              >
                完成
              </van-button>
            </div>
          </div>
        </van-action-sheet>
        <van-dialog 
          id="van-dialog"
          confirm-button-color="#1678FF"
          cancel-button-color="#333333"
        />
      </div>
    )
  }
}
</script>

<style lang="stylus">
.cart-wrap
  background #f5f5f5
  box-sizing border-box
  padding-bottom calc(50px + constant(safe-area-inset-bottom))
  padding-bottom calc(50px + env(safe-area-inset-bottom))
  width 100vw
  height 100vh
  overflow auto
  .empty-wrap
    display flex
    flex-direction column
    text-align center
    padding 50px
    .img-wrap
      .empty-img
        width 112px
        height 112px
      .empty-text
        margin-top 10px
        font-size 16px
        color #999
    .btn-wrap
      display flex
      justify-content center
      margin-top 20px
      .empty-btn
        display inline-block
        width 80px
        padding 6px 16px
        font-size 16px
        color #1678FF
        border 1px solid #1678FF
        border-radius 18px
  .cart-panel
    margin-bottom 8px
    padding 12px 0 0 12px
    background-color #fff
    .panel-header
      padding-bottom 8px
      padding-right 12px
      .title-wrap
        display flex
        justify-content space-between
        align-items bottom 
        line-height 20px
        font-size 14px
        color #FF972A 
        .left
          display flex
        .black
          color #333
    .panel-body
      .item-wrap
        display flex
        border-bottom 1px solid #e5e5e5
        padding 16px 12px 19px 0
        &:last-child
          border-bottom none
        .check-wrap
          display flex
          flex-direction column
          justify-content center
          align-items center
          text-align center
          width 30px
          .radio
            position relative
            top -15px
        .item-box
          flex 1
          display flex
          .item-left
            padding 0 8px
          .item-right
            flex 1
          .item-right-top
            min-height 80px
            display flex
            flex-direction column
            justify-content space-between
            .item-title-wrap
              display flex
              justify-content space-between
              .title-left
                flex 1
              .title-right
                width 32px
              .item-title
                font-size 14px
                color #333
                word-break break-all
            .expire
              filter grayscale(100%)
              .item-title
                color #999
            .item-limit
              font-size 12px
              color #999
              .limit-row
                margin-bottom 4px
          .item-right-bottom
            display flex
            justify-content space-between
            align-items bottom
            .price-wrap
              position relative
              top 4px
              display flex
              line-height 25px
            .item-price
              color #F54841
              font-size 18px
              font-weight bold
            .origin-price
              margin-left 4px
              font-size 12px
              color #999
              text-decoration line-through
            .num-wrap
              position relative
              .stepper-wrap
                display flex
                align-items center
                .uint
                  font-size 12px
                  color #999
                  margin-left 7px
              .uint-rate
                position absolute
                bottom -18px
                left 26px
                font-size 12px
                color #999
.chose-product-content-wrap
  box-sizing border-box
  padding 24px 0
  .product-list
    height 50vh
    .list-content
      padding 0 24px 24px 24px
    .item-row
      display flex
      padding 16px 0
      border-bottom 1px solid #e5e5e5
      .name
        flex 1
        font-size 16px
        color #333
  .btn-wrap
    padding 0 24px
    .btn
      font-size 16px
      border-radius 5px
.footer-edit
  bottom 0
.footer-tabbar
  bottom 0
.footer
  position fixed
  left 0
  z-index 9
  width 100%
  background-color #fff
  padding-bottom calc(constant(safe-area-inset-bottom))
  padding-bottom calc(env(safe-area-inset-bottom))
  .footer-top
    display flex
    justify-content flex-end
    align-items center
    padding 12px
    box-shadow 0px -1px 0px #EEEEEE
    font-size 14px
  .submit-bar__price
    color: #F54841
    font-size: 12px
    .submit-bar__price-integer
      font-size: 16px
  .submit-bar__currency
    font-size 12px
    font-weight bold
  .submit-bar
    display flex
    justify-content space-between
    align-items center
    border-top 1px solid #eee
    border-bottom 1px solid #eee
    .submit-bar-left
      display flex
      align-items center
      padding-left 12px
      .del-btn
        height 22px
        line-height 22px
        margin-left 8px
        color #F54841
    .submit-bar-right
      display flex
      align-items center
      .btn-wrap
        margin-left 8px
      .submit-btn
        border-radius 0
        height 50px
</style>