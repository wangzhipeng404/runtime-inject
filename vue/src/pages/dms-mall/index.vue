<script>
export default {
  data () {
    return {
      mallEmpty: '/h5-assets/mall_empty.png',
      searchIcon: '/h5-assets/icon_search.png',
      addIconDefault: '/h5-assets/shopping_icon_add_default.png',
      addIconActive: '/h5-assets/shopping_icon_add_active.png',
      addIconSelected: '/h5-assets/icon_shoping_selected.png',
      starDefault: '/h5-assets/icon_star_normal.png',
      starActive: '/h5-assets/icon_star_selected.png',
      cartIcon: '/h5-assets/icon_cart.png',
      arrowDownIcon: '/h5-assets/icon_arrow_down.png',
      imageEmpty: '/h5-assets/img_empty.png',
      loading: true,
      showCostPlan: false,
      showPlanDetail: false,
      activeKey: 0,
      selectedRecomend: '',
      productName: '',
      list: [],
      dimNames: {},
      selectedDim1: '',
      showDimPopup: false,
      dim1: [],
      dim2: [],
      recommends: [],
      costPlans: [],
      channelcode: 'JXS0000000007',
      currentProduct: null,
      query: {
        orderid: '',
        mode: ''
      },
      checkedPlan: [],
      authconfig: 0,
      costText: '',
      beforePlanDialogClose () {},
      tenantcode: '1000060',
      count: 0
    }
  },
  watch: {
    selectedDim1 () {
      this.getData()
    },
    selectedRecomend () {
      this.getData()
    }
  },
  computed: {
  },
  beforeCreate () {
  },
  created () {
    this.beforePlanDialogClose = (action, done) => {
      if (action === 'confirm' && this.checkedPlan.length === 0) {
        this.$toast({
          message: '请选择活动规则'
        })
        done(false)
      }
      done(true)
    }
  },
  mounted () {
    this.init()
    this.$xpe.on('refresh', () => {
      this.init()
    })
    this.$xpe.on('setFilter', (data) => {
      this.productName = data.code || data.productname
      this.activeKey = -1
      this.getData()
    })
  },
  methods: {
    init () {
      this.fetchDim()
      this.getData()
      this.fetchRerecommend()
    },
    onPullDownRefresh () {
      this.fetchDim()
      this.getData()
      this.fetchRerecommend()
    },
    pullDownRefresh () {
      this.fetchDim()
      this.getData()
      this.fetchRerecommend()
    },
    async getCartData () {
      const res = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1495666677306757214',
        method: 'post',
        data: {
          'kx_order_shoppingcart': {
            'customercode': this.channelcode,
            'orderid': this.query.orderid || ''
          }
        }
      })
      let count = 0
      res.kx_order_shoppingcart.map((c) => {
        c.productarr = c.productarr.map(() => {
          count++
        })
      })
      this.count = count
    },
    async fetchRerecommend () {
      const { pl_mall_recommend_config: recommends } = await this.axios({
        url: '/api/teapi/dy-biz/1557769523023712315/1558755299463139427',
        method: 'post',
        data: { pl_mall_recommend_config: { mall_type: '1' }}
      })
      this.recommends = recommends
    },
    async fetchDim () {
      const { dimonsionname, dimone, dimtwo } = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1494632923264061530',
        method: 'post',
        data: {}
      })
      this.dimNames = dimonsionname
      this.dim1 = dimone
      this.dim2 = dimtwo
    },
    async getData () {
      this.loading = true
      this.getCartData()
      console.log(this.activeKey)
      const { kx_kq_product, authconfig } = await this.axios({
        url: '/api/teapi/dy-biz/1557769523023712315/1557769523023712314',
        method: 'post',
        data: {
          kx_kq_product: {
            'orderid': this.query.orderid,
            'productname': this.productName,
            'dimone': this.selectedDim1 ? JSON.stringify([this.selectedDim1] ): '',
            'dimtwo': +this.activeKey > 0 ? this.dim2[this.activeKey - 1].dickey : ''
          },
          ka_kq_channelcustomers: {
            'channelcode': this.channelcode,
            'iscollection': +this.activeKey === 0 ? '1' : ''
          },
          pl_mall_recommend_config: {
            mall_type: '1',
            dimension: this.selectedRecomend
          },
          __paging: { __pageindex: '0', __pagesize: '9999' }
        }
      })
      this.authconfig = authconfig.authconfig
      this.list = kx_kq_product.map((p, i) => {
        const np = {
          ...p,
          costlabel: p.costlabel ? JSON.parse(p.costlabel) : []
        }
        const image = p.productimage ? JSON.parse(p.productimage) : []
        if (image.length > 0) {
          this.$OSS.getUrl('img', image[0], { width: 90, height: 90 }).then(url => {
            np.imageUrl = url
            this.list.splice(i, 1, np)
          })
        } else {
          np.imageUrl = this.imageEmpty
        }
        return np
      })
      this.loading = false
    },
    async changeCollection (p) {
      if (this.collecting) return
      this.collecting = true
      await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1499361816789258334',
        method: 'post',
        data: {
          'kx_kq_product_collection': {
            'customercode': this.channelcode,
            'iscollectioner': p.iscollection === '1' ? '0' : '1',
            'productid': p.id
          }
        }
      })
      this.$toast({
        message: p.iscollection === '1' ? '取消成功' : '收藏成功',
      })
      this.collecting = false
      this.getData()
    },
    async getCostPlan (p, key) {
      const plans = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1500012770928758837',
        method: 'post',
        data: {
          kx_kq_product: {
            id: p.id,
            channelcode: this.channelcode,
            orderid: this.query.orderid
          }
        }
      }).then(res => {
        const data = res.tn_kx_cost_takegift_policy
        return data
      })
      const costsMap = {}
      const costs = []
      plans.forEach(p => {
        if (!costsMap[p.costid]) {
          costsMap[p.costid] = true
          costs.push({
            costid: p.costid,
            costname: p.costname
          })
        }
      })
      this.costPlans = costs.map((c) => {
        c.rules = plans.filter(p => p.costid === c.costid).map((p) => {
          const descArr = p.describution.split('\\n')
          const arr = descArr.map(d => {
            var l = d.split(':')
            return {
              name: l[0],
              value: l[1] ? l[1].split(';').filter(v => v) : []
            }
          })
          p.desc = arr
          return p
        })
        return c
      })
      if (key) {
        this.costPlans = this.costPlans.filter(c => c.costid === key)
        this.showPlanDetail = true
      } else {
        this.showCostPlan = true
      }
    },
    async addToCart (hasPlan) {
      if (hasPlan && this.checkedPlan.length === 0) {
        this.$toast({
          message: '请选择活动规则'
        })
        return false
      }
      if (this.adding) return
      this.adding = true
      let saletypeOptions = {
        '基本销售': '954254124545871872',
        '货补': '1496368609621053440',
        '手工搭赠': '954254252933517312',
        '自动搭赠': '954254203071631360'
      }
      await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1494632923264061519',
        method: 'post',
        data: {
          'ka_kq_channelcustomers': {
            'customercode': this.channelcode,
            'orderid': this.query.orderid
          },
          'kx_order_shoppingcart': hasPlan ? this.checkedPlan.map(p => {
            const arr = p.split('-')
            const batchcount = this.authconfig == '1' && this.currentProduct.minquantity > 0 ? this.currentProduct.minquantity : '1'
            return {
              productid: this.currentProduct.id,
              costid: arr[0],
              ruleid: arr[1],
              batchcount,
              saletype: saletypeOptions['基本销售']
            }
          }) : [{
            productid: this.currentProduct.id,
            costid: '',
            ruleid: '',
            batchcount: this.authconfig == '1' && this.currentProduct.minquantity > 0 ? this.currentProduct.minquantity : '1',
            saletype: saletypeOptions['基本销售']
          }]
        }
      })
      this.$toast({
        message: '添加成功',
      })
      this.showCostPlan = false
      await this.getData()
      this.adding = false
    },
    choosePlan (p) {
      this.checkedPlan = []
      if (p.ischoice === '1') return
      this.currentProduct = p
      console.log(p.costlabel)
      const costlabels = p.costlabel.filter(c => c.costtext.indexOf('返利活动') == -1)
      if (costlabels.length > 0) {
        this.getCostPlan(p)
      } else {
        this.addToCart(false)
      }
    },
    onBlur (e) {
      this.productName = e.detail.value
      this.activeKey = '9999'
      this.getData()
    },
    onSearch (e) {
      this.productName = e.detail
      this.activeKey = '9999'
      this.getData()
    },
    clearSearch () {
      this.productName = ''
      this.activeKey === '9999' ? '1' : this.activeKey
      this.getData()
    },
    dim1Change (e) {
      this.selectedDim1 = e.detail
      this.getData()
    },
    dim2Change (e) {
      console.log(e)
      this.activeKey = e
      this.getData()
    },
    onPlanChange (e) {
      console.log(e)
      this.checkedPlan = e.detail
    },
    onPlanDialogClose () {
      this.showCostPlan = false
    },
    addComplete () {
      // utils.back(1, true)
    },
    togglePlanDetail () {
      this.showPlanDetail = !this.showPlanDetail
    },
    showCostDetail (cost) {
      console.log(cost)
      const texts = cost.costtext.replace(/<br\/>/g, '<br />').split('<br />').filter(t => !!t.trim())
      console.log(texts)
      const contentArr = texts[0] == '返利活动' ? texts.slice(1) : texts.slice(2)
      const arr = contentArr.map(d => {
        var l = d.split(':')
        return {
          name: l[0],
          value: texts[0] == '返利活动' ? [] : (l[1] ? l[1].split(';').filter(v => v) : [])
        }
      })
      console.log(arr)
      this.costPlans = [
        {
          costid: cost.key,
          costname: cost.text,
          rules: [
            {
              name: texts[0] == '返利活动' ? '' : texts[1],
              ruleid: cost.key,
              desc: arr
            }
          ]
        }
      ]
      this.showPlanDetail = true
    }
  },
  render () {
    const cartIconMap = {
      1: this.addIconDefault,
      0: this.addIconActive,
      2: this.addIconSelected
    }
    return (
      <div class='mall-container'>
        <div class="filter-wrap">
          <div style="overflow-x: auto;">
            <div class="brand-wrap">
              <van-tag 
                size="large"
                class="recommend-tag"
                plain={this.selectedRecomend != ''}
                text-color={this.selectedRecomend == '' ? '#ffffff' : '#333'}
                color={this.selectedRecomend == '' ? '#1989fa' : '#ffffff'}
                on-click={() => this.selectedRecomend = ''}
              >全部</van-tag>
              {this.recommends.map(re => (
                <van-tag
                  size="large"
                  key={re.id}
                  round={false}
                  class="recommend-tag"
                  plain={this.selectedRecomend != re.id}
                  text-color={this.selectedRecomend == re.id ? '#ffffff' : '#333'}
                  color={this.selectedRecomend == re.id ? '#1989fa' : '#ffffff'}
                  on-click={() => this.selectedRecomend = re.id}
                >
                  {re.dim_name}
                </van-tag>
              ))}
            </div>
          </div>
        </div>
        <div class={['content', this.query.mode === 'edit' ? 'edit' : 'tab-bar']}>
          <div class="left">
            <van-sidebar active-key={this.activeKey} on-change={this.dim2Change}>
              <van-sidebar-item custom-class="siderbar-item">
                <div slot="title" class="siderbar-title-wrap">
                  <div>已收藏</div>
                  <van-icon
                    name="star"
                    class="icon"
                    size="10"
                    color="#FF972A"
                  />
                </div>
              </van-sidebar-item>
              {this.dim2.map(item => (
                <van-sidebar-item
                  key={item.dickey}
                  title={item.dicvalue}
                  custom-class="siderbar-item"
                />
              ))}
            </van-sidebar>
          </div>
          <div class="right">
            <div class="brand-wrap" id="dim-wrap">
              <van-tag
                class="dim-tag"
                size="middle"
                round
                text-color={this.selectedDim1 == '' ? '#1A85FF' : '#606266'}
                color={this.selectedDim1 == '' ? '#E7F3FF' : '#F2F3F5'}
                on-click={() => this.selectedDim1 = ''}
              >
                全部
              </van-tag>
              {this.dim1.map((item) => (
                <van-tag
                  round
                  size="middle"
                  key={item.dickey}
                  class="dim-tag"
                  text-color={this.selectedDim1 == item.dickey ? '#1A85FF' : '#606266'}
                  color={this.selectedDim1 == item.dickey ? '#E7F3FF' : '#F2F3F5'}
                  on-click={() => this.selectedDim1 = item.dickey}
                >
                  {item.dicvalue}
                </van-tag>
              ))}
              <div class="dim-arrow-wrap" on-click={() => this.showDimPopup = !this.showDimPopup}>
                <van-icon name={this.arrowDownIcon} size="14px"/>
              </div>
            </div>
          {!this.loading && this.list.length === 0 && (
            <div class="empty-wrap" >
              <div class="empty-content">
                <van-image src={this.mallEmpty} width="112" height="112" />
                <div class="empty-text">暂无商品</div>
              </div>
            </div>
          )}
            {this.list.map(item => (
              <div class="item-box" key={item.id}>
                <div class="item-body">
                  <div class="item-left">
                    {item.image_url && (
                      <van-icon name={item.image_url} size="32px" class="image-icon" />
                    )}
                    <van-image
                      width="90"
                      height="90"
                      src={item.imageUrl}
                    />
                  </div>
                  <div class="item-right">
                    <div class="item-right-top">
                      <div class="item-title">{item.productname}</div>
                      <div class="icon" on-click={() => this.changeCollection(item)}>
                      <van-icon
                        name={ item.iscollection == '1' ? this.starActive : this.starDefault }
                        size="22"
                        color="#FF411C"
                      />
                      </div>
                    </div>
                    {this.authconfig == 1 && (
                      <div class="item-limit">
                        <div class="limit-row">起订量：{item.minquantity || '无'}</div>
                        <div class="limit-row">最大订购量：{item.maxquantity || '无'}</div>
                      </div>
                    )}
                  </div>
                </div>
                <div class="item-footer">
                  <div class="price-wrap">
                    <span class="item-price">{item.adviceprice}</span>
                    <span class="item-uint"> / {item.distributionunitname}</span>
                  </div>
                  <div class="item-activities">
                  {item.costlabel.map(cost => (
                    <van-tag
                      key={cost.key}
                      class="ac-tag"
                      color="rgba(255, 244, 233, 0.39)"
                      text-color="#FFC589"
                      size="medium"
                      on-click={() => this.showCostDetail(cost)}
                    >
                      {cost.text}
                    </van-tag>
                  ))}
                  </div>
                  <div class="cart-btn" on-click={() => this.choosePlan(item)}>
                    <van-icon
                      name={cartIconMap[item.ischoice]}
                      size="22"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="cart-box" on-click={() => this.$xpe.emit(this.query.mode == 'edit' ? 'goback' : 'toCart')}>
          <van-icon size="30px" name={this.cartIcon} badge={this.count} />
        </div>
        <van-popup 
          v-model={this.showDimPopup}
          position="right"
          class="dim-popup"
          overlay-style={{ zIndex: 996 }}
        >
          <van-grid column-num={3} square={false} border={false}>
          {this.dim1.map((item) => (
            <van-grid-item key={item.dickey} class="dim-griditem">
              <van-tag
                class="dim-btn"
                text-color={this.selectedDim1 == item.dickey ? '#1A85FF' : '#606266'}
                color={this.selectedDim1 == item.dickey ? '#E7F3FF' : '#F2F3F5'}
                on-click={() => this.selectedDim1 = item.dickey}
              >
                {item.dicvalue}
              </van-tag>
            </van-grid-item>
          ))}
          </van-grid>
        </van-popup>
        <van-dialog
          use-slot
          use-title-slot
          v-model={ this.showCostPlan }
          show-cancel-button
          confirm-button-text="加入购物车"
          confirm-button-color="#1678FF"
          before-close={this.beforePlanDialogClose}
          on-close={this.onPlanDialogClose}
          on-confirm={() => this.addToCart(true)}
        >
          <div slot="title" class="activity-dialog-title">
            选择活动
          </div>
          <div class="activity-content">
            <van-checkbox-group v-model={this.checkedPlan}>
            {this.costPlans.map(cost => (
              <div class="activity-wrap" key={cost.costid}>
                <div class="activity-title">{cost.costname}</div>
                {cost.rules.map(rule => (
                  <div class="rule-wrap" key={rule.ruleid}>
                    <div class="left">
                      <van-checkbox 
                        class="checkbox"
                        shape="square"
                        icon-size="16px"
                        name={cost.costid + '-' + rule.ruleid }
                        disabled={rule.ischoice == 1}
                      />
                    </div>
                    <div class="right">
                      <div>
                        <div class="rule-title">{rule.name}</div>
                        {rule.desc.map(desc => (
                          <div class="rule-row" key={desc.name}>
                            <div class="lable">{desc.name}：</div>
                            <div class="detail">
                              {desc.value.map(item => (
                                <div key={item}>{item};</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            </van-checkbox-group>
          </div>
        </van-dialog>
        <van-dialog
          use-slot
          use-title-slot
          v-model={ this.showPlanDetail }
          confirm-button-text="确认"
          confirm-button-color="#1678FF"
          on-confirm={() => this.togglePlanDetail(true)}
        >
          <div slot="title" class="activity-dialog-title">
            活动详情
          </div>
          <div class="activity-content">
          {this.costPlans.map(cost => (
            <div class="activity-wrap" key={cost.costid}>
              <div class="activity-title">{cost.costname}</div>
              {cost.rules.map(rule => (
                <div class="rule-wrap" key={rule.ruleid}>
                  <div class="right">
                    <div>
                      <div class="rule-title">{rule.name}</div>
                      {rule.desc.map(desc => (
                        <div class="rule-row" key={desc.name}>
                          <div class="lable">
                            {desc.name}{ desc.value.length > 0 && <span>：</span>}
                          </div>
                          <div class="detail">
                          {desc.value.map(text => (
                            <div key={text}>{text};</div>
                          ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          </div>
        </van-dialog>
      </div>
    )
  }
}
</script>

<style lang='stylus'>
div
  box-sizing border-box
.van-sidebar-item--select::before
  background-color #1A85FF
  height 30px
  width 4px
  border-radius 2px
.mall-container
  .filter-wrap
    position fixed
    top 0
    left 0
    width 100%
    z-index 999
    background-color #fff
    .search-feild
      padding 4px 0
    .brand-wrap
      box-sizing border-box
      white-space nowrap
      display flex
      flex-wrap nowrap
      align-items center
      overflow-x auto
      font-size 14px
      padding 15px 12px 15px 4px
      border-top 1px solid #f5f5f5
      border-bottom 1px solid #f5f5f5
      flex-shrink 0
      .recommend-tag
        margin-left 8px
      .checkbox-wrap
        flex 1
        display flex
        flex-wrap nowrap
        .brand-checkbox
          flex-shrink 0
        .checkbox-text
          margin-right 16px
  .tab-bar
    height 100vh
  .edit
    height 100vh
    padding-bottom calc(0px + constant(safe-area-inset-bottom))
    padding-bottom calc(0px + env(safe-area-inset-bottom))
  .content
    box-sizing border-box
    display flex
    padding-top 55px
    .left
      z-index 998
      height 100%
      padding-bottom 120px
      background-color #f7f8fa
      overflow scroll
      .siderbar-item
        border-left-wdith 2px
      .siderbar-title-wrap
        position relative
        font-size 14px
        .icon
          position absolute
          top 4px
          right -20px
    .right
      flex 1
      height 100%
      padding-top 50px
      overflow auto
      background-color #fff
      .brand-wrap
        z-index 997
        white-space nowrap
        top 56px
        position fixed
        width calc(100vw - 80px)
        overflow hidden
        padding 12px
        background #fff
        .dim-tag
          margin-right 8px
          padding 3px 12px
        .dim-arrow-wrap
          position absolute
          top 0
          right 0
          padding 16px 10px
          background #fff
      .empty-wrap
        display flex
        justify-content center
        text-align center
        margin-top 160px
        .empty-text
          color #999999
          font-size 16px
      .item-box
        padding 12px
        border-bottom 1px solid #f5f5f5
        .item-body
          display flex
          padding-bottom 12px
          .item-left
            position relative
            padding-right 8px
            .image-icon
              position absolute
              top 0
              left 0
              z-index 9
          .item-right
            flex 1
            display flex
            flex-direction column
            justify-content space-between
          .item-right-top
            position relative
            .item-title
              padding-right 22px
              font-size 16px
              color #333
              word-break break-all
            .icon
              position absolute
              top -2px
              right -4px
              padding 0 4px
          .item-limit
            font-size 12px
            color #999
            .limit-row
              margin-bottom 6px
        .item-footer
            display flex
            align-items center
            .item-activities
              flex 1
              margin-top 2px
              .ac-tag
                margin-left 8px
                margin-top 2px
                font-size 11px
                background rgba(255, 244, 233, 0.39)
                border 1px solid #FFC589
                border-radius 2px
            .item-price-wrap
              display flex
              align-items center
            .item-price
              font-size 18px
              color #F54841
              &:before
                content '￥'
                font-size 18px
            .item-uint
              font-size 14px
              color #999
          .cart-btn
            position relative
            top 3px
.dim-popup
  z-index 996
  top 97px
  width calc(100vw - 80px)
  -webkit-transform none
  transform none
  .van-grid
    padding 16px 8px
  .dim-griditem
    width 33.33%
    .van-grid-item__content
      padding 4px 8px
  .dim-btn
    width 100%
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    padding 4px
    justify-content center
.cart-box
  box-sizing border-box
  position fixed
  left 18px
  bottom 46px
  z-index 1999
  width 44px
  height 44px
  padding 7px
  border-radius 44px
  background #ffffff
.activity-dialog-title
  font-size 16px
  text-align center
  border-bottom 1px solid #EEE
  padding-bottom 14px
.activity-content
  padding 20px
  max-height 50vh
  overflow-y auto
  .active-wrap
    margin-bottom 20px
  .activity-title
    font-size 16px
    color #1678FF
    margin-bottom 10px
  .rule-wrap
    display flex
    margin-bottom 14px
    .left
      .checkbox
        position relative
        top 2px
    .right
      flex 1
      padding-left 12px
      font-size 14px
      color #333
      .rule-title
        margin-bottom 4px
      .rule-row
        display flex
        margin-bottom 4px
        .lable
          flex-shrink 0
.footer
  box-sizing border-box
  position fixed
  bottom calc(constant(safe-area-inset-bottom))
  bottom calc(env(safe-area-inset-bottom))
  left 0px
  padding 8px 12px
  width 100%
  background-color #fff
  .footer-btn
    border-radius 5px
.van-sidebar-item--selected
  border-color rgba(22, 120, 255, 0.39)
</style>
<style>
</style>