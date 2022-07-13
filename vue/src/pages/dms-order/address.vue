<script>

export default {
  name: 'address-list',
  data () {
    return {
      addrIcon: '/h5-assets/default_address.png',
      channelcode: 'QD0000000119',
      list: [],
      defaultList: []
    }
  },
  created () {
    this.axios.defaults.headers.common["token"] = localStorage.getItem('token');
    this.axios.defaults.baseURL = "/api/teapi/dy-biz";
    this.axios.interceptors.response.use((response) => {
      return response;
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
      let list = await this.axios({
        url: `/1108546657601065058/1128622639842201699`,
        method: 'post',
        data: {
          ka_kq_channelcustomers: {
            customercode: this.customercode
          }
        }
      }).then(res => {
        const data = res.data.resp_data.kx_order
        return data
      })
      console.log(list)
      list = list.map(l => {
        return {
          ...l,
          address: l.receiveraddr ? JSON.parse(l.receiveraddr).address : ''
        }
      })
      this.defaultList = list.filter(l => l.isdefault === '1')
      this.list = list.filter(l => l.isdefault !== '1')
    },
    onSelect (item) {
      console.log(item)
      this.$emit('onSelect', item)
      // const pages = getCurrentPages()
      // const detailPage = pages[pages.length - 2]
      // detailPage.orderInfo.receiver = item.receiver
      // detailPage.orderInfo.receivertel = item.receivertel
      // detailPage.orderInfo.receiveraddr = item.receiveraddr
      // detailPage.orderInfo.address = item.address
      // // this.triggerEvent('change', item)
      // mpx.navigateBack()
    }
  },
  render () {
    console.log(this.list)
    const Item = ({ props: { item } }) => (
      <div on-click={() => this.onSelect(item)} key={item.address}>
        <div class="address-wrap">
          <div class="left">
            <div class="icon-wrap">
            {item.isDefault ? (
              <van-icon name={this.addrIcon} size="16" color="#1678FF" />
            ) : (
              <span>{item.receiver[0]}</span>
            )}
            </div>
          </div>
          <div class="right">
            <div class="userinfo">
              <span class="name">{item.receiver || ' '}</span>
              <span class="phone">{item.receivertel || ' '}</span>
              {item.isDefault && (
                <van-tag plain color="#FF972A">默认地址</van-tag>
              )}
            </div>
            <div class="address">
              {item.address}
            </div>
          </div>
        </div>
      </div>
    )
    return (
      <div class="address-list">
        {this.defaultList.length > 0 && (
          <div class="default-list">
          {this.defaultList.map(item => (
            <Item item={item} />
          ))}
          </div>
        )}
        {this.list.map(item => (
          <Item item={item} />
        ))}
      </div>
    )
  }
}
</script>

<style lang="stylus">
html
  background-color #f5f5f5
.default-list
  margin-bottom 8px
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