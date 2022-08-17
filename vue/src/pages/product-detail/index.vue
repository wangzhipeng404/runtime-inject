<script>
const params = {
  id: '1557977203185160192',
  channelcode: 'JXS0000000007'
}
export default {
  name: 'product-detail',
  data () {
    return {
      arrowRight: '/h5-assets/arrow_right@2x.png',
      starDefault: '/h5-assets/icon_star_normal.png',
      starActive: '/h5-assets/icon_star_selected.png',
      cartIcon: '/h5-assets/icon_cart.png',
      imageEmpty: '/h5-assets/img_empty_large.png',
      current: 0,
      checkedPlan: [],
      query: params,
      // query: ${JSON.stringify(params)},
      authconfig: 0,
      product: {},
      costs: [],
      imgs: [],
      num: 1,
      count: 0,
      adding: false,
      collecting: false,
      show: false,
      propArray: [
        { name: '品牌', key: 'productbrand' },
        { name: '品类', key: 'productcategory' },
        { name: '产品规格', key: 'productnorm' },
        { name: '托盘装载数', key: 'traynumbertext' },
        { name: '分销单位', key: 'distributionunit' },
        { name: '单品单位', key: 'singleunit' },
        { name: '单品转化率', key: 'unitconverrate' },
        { name: '标箱系数', key: 'boxfactor' },
        { name: '体积（m³）', key: 'volume' },
        { name: '重量（KG）', key: 'weight' },
        { name: '分销条码', key: 'distributionbarcode' },
        { name: '单品条码', key: 'singlebarcode' },
      ]
    }
  },
  computed: {
    price () {
      if (this.product.price) {
        const res = this.product.price.split('.')
        return res.length > 1 ? res : [...res, '00']
      } else {
        return ['0', '00']
      }
    }
  },
  // created () {
  //   this.$OSS.setConfig(${getOSSConfig()})
  //   localStorage.setItem('token', '${context.token}')
  // },
  mounted () {
    this.getData()
    this.getCartData()
  },
  methods: {
    async addToCart (isBuy) {
      if (this.costs.length > 0 && this.checkedPlan.length === 0) {
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
      const params = {
        'ka_kq_channelcustomers': {
          'customercode': this.query.channelcode,
          'orderid': this.query.orderid
        },
        'kx_order_shoppingcart': this.costs.length > 0 ? this.checkedPlan.map(p => {
          const arr = p.split('-')
          return {
            productid: this.product.id,
            costid: arr[0],
            ruleid: arr[1],
            batchcount: '' + this.num,
            saletype: saletypeOptions['基本销售']
          }
        }) : [{
          productid: this.product.id,
          costid: '',
          ruleid: '',
          batchcount: '' + this.num,
          saletype: saletypeOptions['基本销售']
        }]
      }
      if (isBuy) {
        await this.axios({
          url: '/api/teapi/dy-biz/1557769523023712315/1559477245301624931',
          method: 'post',
          data: params
        })
        this.$xpe.emit('toDetail')
      } else {
        await this.axios({
          url: '/api/teapi/dy-biz/1491976446623748195/1494632923264061519',
          method: 'post',
          data: params
        })
        this.$toast({
          message: '添加成功',
        })
        this.getCartData()
      }
      this.adding = false
    },
    async getCartData () {
      const res = await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1495666677306757214',
        method: 'post',
        data: {
          'kx_order_shoppingcart': {
            'customercode': this.query.channelcode,
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
    async changeCollection () {
      if (this.collecting) return
      this.collecting = true
      await this.axios({
        url: '/api/teapi/dy-biz/1491976446623748195/1499361816789258334',
        method: 'post',
        data: {
          'kx_kq_product_collection': {
            'customercode': this.query.channelcode,
            'iscollectioner': this.product.iscollection === '1' ? '0' : '1',
            'productid': this.product.id
          }
        }
      })
      this.$toast({
        message: this.product.iscollection === '1' ? '取消成功' : '收藏成功',
      })
      this.collecting = false
      this.$set(this.product, 'iscollection', this.product.iscollection === '1' ? '0' : '1')
    },
    async getData () {
      const { kx_kq_product: product, tn_kx_cost_takegift_policy: plans } = await this.axios({
        url: '/api/teapi/dy-biz/1557769523023712315/1559216630561640547',
        method: 'post',
        data: {
          kx_kq_product: {
            id: this.query.id
          },
          ka_kq_channelcustomers: {
            channelcode: this.query.channelcode
          },
          pl_mall_recommend_config: {
            mall_type: '1',
          },
        }
      })
      product.traynumbertext = product.traynumber + product.distributionunit + '/托'
      this.product = product
      this.parseImgs(product.productimage)
      this.parseCosts(plans)
    },
    parseCosts (plans) {
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
      this.costs = costs.map((c) => {
        c.rules = plans.filter(p => p.costid === c.costid).map((p) => {
          const descArr = p.describution.split('\n')
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
    },
    parseImgs (images) {
      if (images) {
        const imgs = JSON.parse(images)
        Promise.all(imgs.map(img => this.$OSS.getUrl('img', img))).then(res => {
          console.log(res)
          this.imgs = res
        })
      }
    },
    onChange(index) {
      this.current = index
    }
  },
  render () {
    return (
      <div class="container">
        <van-swipe on-change={this.onChange}>
        {this.imgs.map(img => (
          <van-swipe-item key={img}>
            <div class="swiper-img" style={{ backgroundImage: 'url(' + img + ')' }}></div>
          </van-swipe-item>
        ))}
        {this.imgs.length === 0 && (
          <van-swipe-item>
            <div class="swiper-img" style={{ backgroundImage: 'url(' + this.imageEmpty + ')' }}></div>
          </van-swipe-item>
        )}
          <div class="custom-indicator" slot="indicator">{ this.current + 1 }/{this.imgs.length}</div>
        </van-swipe>
        <div class="content">
          <div class="product-info">
            <div class="top">
              <div class="price-wrap">
                <span class="price">¥<span class="price-integer">{this.price[0]}</span>.{this.price[1]}</span>
              </div>
              <div class="collection-wrap" on-click={this.changeCollection}>
                <div>
                  <van-icon name={this.product.iscollection == 1 ? this.starActive : this.starDefault} size="22px"/>
                </div>
                <div>收藏</div>
              </div>
            </div>
            <div class="title-wrap">{this.product.productname}</div>
            <div class="prop-wrap">
              <div class="prop-item prop-text">规格：{this.product.productnorm}{this.product.singleunit}</div>
              <div class="prop-item prop-text bordered text-center">起订量：{this.product.minquantity}</div>
              <div class="prop-item prop-text text-right">最大订购量：{this.product.maxquantity}</div>
            </div>
            <div class="prop-more prop-text" on-click={() => this.show = !this.show}>
              查看其他参数<van-icon name={this.arrowRight} size="16px" class="prop-icon" />
            </div>
          </div>
          <van-checkbox-group v-model={this.checkedPlan}>
            <div class="activity-list">
              {this.costs.length > 0 && (
                <div class="list-title">选择活动</div>
              )}
              {this.costs.map(cost => (
                <div class="activity-box" key={cost.costid}>
                  <div class="activity-name">{cost.costname}</div>
                  <div class="activity-rule-list">
                  {cost.rules.map(rule => (
                    <div class="rule-box">
                      <div class="left">
                        <van-checkbox 
                          class="checkbox"
                          icon-size="16px"
                          checked-color="#F99D14"
                          name={cost.costid + '-' + rule.ruleid }
                        />
                      </div>
                      <div class="right">
                        <div class="rule-name">{rule.name}</div>
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
                  ))}
                  </div>
                </div>
              ))}
            </div>
          </van-checkbox-group>
        </div>
        <div class="cart-box" on-click={() => this.$xpe.emit(this.query.mode == 'edit' ? 'goback' : 'toCart')}>
          <van-icon size="30px" name={this.cartIcon} badge={this.count} />
        </div>
        <div class="footer">
          <div class="left">
            <van-stepper 
              min={this.product.authstatus == 1 && this.product.minquantity > 0 ? this.product.minquantity : 1}
              max={this.product.authstatus && this.product.maxquantity ? this.product.maxquantity : 999999 }
              v-model={this.num}
              integer
            />
            <span class="uint">{ this.product.traystatus == '1' ? '托' : this.product.distributionunit }</span>
          </div>
          <div class="right">
            <van-button round color="#FF972A" class="btn" on-click={() => this.addToCart(false)}>加入购物车</van-button>
            <van-button round color="#F54841" class="btn margin-left-4" on-click={() => this.addToCart(true)}>立即购买</van-button>
          </div>
        </div>
        <van-popup 
          v-model={this.show}
          position="bottom"
          style={{ height: '70vh' }}
          closeable
          safe-area-inset-bottom
          round
        >
          <div class="popup-container">
            <div class="popup-title">产品参数</div>
            <div class="list-content">
            {this.propArray.map(prop => (
              <div class="row" key={prop.key}>
                <div class="label">{prop.name}</div>
                <div class="value">{this.product[prop.key]}</div>
              </div>
            ))}
            </div>
            <div class="popup-btn">
              <van-button block round type="info" on-click={() => this.show = false}>关闭</van-button>
            </div>
          </div>
        </van-popup>
      </div>
    )
  }
}
</script>

<style lang="stylus">
div
  box-sizing border-box
.van-swipe-item
  color #fff
  font-size 20px
  height 100vw
  text-align center
  background-color #f5f5f5
  .swiper-img
    width 100%
    height 100%
    background-size cover
    background-position center center
    background-repeat no-repeat
.custom-indicator
  position absolute
  right 12px
  bottom 28px
  padding 2px 8px
  font-size 12px
  border-radius 14px
  background rgba(0, 0, 0, 0.1)
  color #fff
.container
  display flex
  flex-direction column
  .content
    background #ffffff
    border-radius 20px 20px 0 0
    padding 20px 16px
    position relative
    top -20px
    flex 1
    z-index 99
    padding-bottom 100px
    .product-info
      padding-bottom 20px
      border-bottom 1px solid #F4F6F8
      .top
        display flex
        justify-content space-between
        align-items center
        margin-bottom 4px
        .price-wrap
          font-weight bold
          color #F95A14
          .price
            font-size 18px
          .price-integer
            font-size 26px
        .collection-wrap
          text-align center
          color #F99D14
          font-size 8px
      .title-wrap
        font-size 18px
        font-weight bold
        color #333
        line-height 27px
      .prop-wrap
        display flex
        justify-content space-between
        padding 8px 0
        .prop-item
          flex-basis 33.33%
        .text-center
          text-align center
        .text-right
          text-align right
        .bordered
          border-left 1px solid #EEEEEE
          border-right 1px solid #EEEEEE
      .prop-text
        color #909399
        font-size 12px
      .prop-icon
        top 4px
  .activity-list
    padding-top 20px
    .list-title
      font-size 14px
      color #333333
      margin-bottom 8px
    .activity-box
      padding 12px
      border-radius 8px
      background #FFF9EE
      margin-bottom 12px
      .activity-name
        font-size 14px
        color #F99D14
      .rule-box
        margin-top 8px
        background #fff
        display flex
        padding 12px
        border-radius 8px
        .checkbox
          position relative
          top 1px
        .right
          flex 1
          padding-left 12px
          .rule-name
            font-size 14px
            color #333
          .rule-row
            display flex
            align-items flex-start
            margin-bottom 4px
            margin-top 6px
            font-size 12px
            color #606266
            .lable
              flex-shrink 0
  .cart-box
    box-sizing border-box
    position fixed
    right 24px
    bottom calc(74px + constant(safe-area-inset-bottom))
    bottom calc(74px + env(safe-area-inset-bottom))
    z-index 1999
    width 44px
    height 44px
    padding 7px
    border-radius 44px
    background #ffffff
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.1000)
  .footer
    display flex
    justify-content space-between
    align-items center
    position fixed
    left 0
    bottom calc(constant(safe-area-inset-bottom))
    bottom calc(env(safe-area-inset-bottom))
    width 100%
    padding 8px 16px
    z-index 99
    background #ffffff
    .left
      display flex
      align-items flex-end
      .uint
        margin-left 8px
        font-size 12px
    .margin-left-4
      margin-left 4px
    .btn
      width 104px
      height 36px
  .popup-container
    height 100%
    display flex
    flex-direction column
  .popup-title
    text-align center
    padding 14px 0
    font-size 16px
    color #333333
  .popup-btn
    position absolute
    bottom 0
    left 0
    padding 5px 16px
    width 100%
    background #ffffff
  .list-content
    padding 16px
    position relative
    padding-bottom 60px
    overflow auto
    flex 1
    .row
      display flex
      justify-content space-between
      line-height 48px
      font-size 14px
      color #333333
      border-bottom 1px solid #f5f5f5
</style>
