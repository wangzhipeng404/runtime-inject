<script>
window.__baseUrl = ''
const context = {
  token: localStorage.getItem('token')
}
export default {
  name: 'order-list',
  data () {
    return {
      loading: false,
      finished: false,
      filters: {
        status: '0',
        date: [this.$dayjs(this.$dayjs().subtract(3, 'month')).valueOf(), this.$dayjs().valueOf()],
      },
      triggered: false,
      showDestory: false,
      bottomLoadData: [],
      scrollH: '',
      pageIndex: 0,
      pageSize: 10
    }
  },
  created () {
    window.excel_getBaseUrl = this.baseUrlCallback
    if (window.__baseUrl) {
      this.axios.defaults.baseURL = window.__baseUrl + '/api/teapi/dy-biz'
    } else {
      try {
        this.$xpe.bridge('getBaseUrl', this.baseUrlCallback)
      } catch (e) {
        console.log(e)
        window.SmartCommonWebViewExtension.page_xpe_getBaseUrl()
      }
    }
    this.axios.defaults.headers.common["token"] = context.token;
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
    this.$xpe.on('changeFilter', data => {
      this.pageIndex = 0
      this.loading = false
      this.finished = false
      this.filters = data
    })
  },
  methods: {
    baseUrlCallback (success, errMsg, baseUrl) {
      window.__baseUrl = baseUrl
      this.axios.defaults.baseURL = baseUrl + '/api/teapi/dy-biz'
      this.getData()
    },
    onStatusChange (e) {
      console.log(e)
      this.status = e.detail.name
      this.onRefresh()
    },
    onDateChange (e) {
      this.date = e.detail
      this.onRefresh()
    },
    toDetail (id) {
      this.$emit('toDetail', { id })
    },
    onAction (action, id) {
      if (action.text === '作废') {
        this.onDestory(id)
        return
      }
      if (action.text === '提交订单') {
        this.$emit('toDetail', { id })
      }
      if (action.text === '查看发货记录' || action.text === '收货确认') {
        this.$emit('toLogistics', { id })
      }
    },
    async onDestory (id) {
      await this.$dialog.confirm({
        title: '订单作废',
        message: '确认作废该订单?',
        showCancelButton: true
      })
      await this.axios({
        url: '/1491976446623748195/1500664228380545063',
        data: {
          'kx_order': [{ id }]
        }
      })
      this.getData()
      this.$toast({
        message: '操作成功'
      })
    },
    async getData () {
      this.loading = true
      this.pageIndex += 1
      const {kx_order: list, __paging: pageInfo }= await this.axios.post('/952801901190189155/1497087954429022307', {
        kx_order: {
          ministatus: this.filter.status !== '0' ? this.filter.status : '',
          ordergroup: '2',
          beginenddate: this.filter.date.length > 0 ? JSON.stringify({
            start: '' + this.filter.date[0],
            end: '' + this.filter.date[1]
          }) : ''
        },
         __paging: {
            __pageindex: this.pageIndex + '',
            __pagesize: this.pageSize + ''
          },
      }).then(res => {
        return res
      })
      this.loading = false
      const statusMap = [
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
          'key': '130',
          'text': '待拼单',
          color: '#FF972A'
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
      ]
      this.bottomLoadData = this.bottomLoadData.concat(list.map(o => {
        const status = statusMap.filter(s => s.key === o.status)[0] || {}
        let actions = []
        if (['10', '100'].includes(o.status)) {
          actions = [{ text: '作废', class: '' }, { text: '提交订单', class: 'blue' }]
        }
        if (['20', '90'].includes(o.status)) {
          actions.push({ text: '查看发货记录', class: '' })
        }
        if (['70', '80', '50', '120'].includes(o.status)) {
          actions.push({ text: '收货确认', class: 'blue' })
        }
        return {
          ...o,
          createTime: this.$dayjs(+o.createtime).format('YYYY-MM-DD HH:mm'),
          statusText: status.text,
          statusColor: status.color,
          actions
        }
      }))
      if (this.bottomLoadData.length >= +pageInfo.__itemcount || list.length < this.pageSize) {
        console.log('finished')
        this.finished = true
      }
    },
  },
  render () {
    return (
      <div class="dms-order-wrap">
        <van-list v-model={this.loading} finished={this.finished} on-load={this.getData}>
          <div class="order-list">
          {this.bottomLoadData.map(item => (
            <div class="order-item" key={item.code} on-click={() => this.toDetail(item.id)}>
              <div class="item-top">
                <div class="item-header">
                  <div class="item-row">
                    <div class="row-left">
                      <span class="label">{item.createTime}</span>
                    </div>
                    <div class="row-right">
                      <span class="status" style={'color:' + item.statusColor}>{item.statusText}</span>
                    </div>
                </div>
                </div>
                <div class="item-body">
                  <div class="item-row">
                    <div class="row-left">
                      <span class="label">订单编码：</span>
                      <span>{item.code}</span>
                    </div>
                    <div class="row-right"></div>
                  </div>
                  <div class="item-row">
                    <div class="row-left">
                      <span class="label">订单金额：</span>
                      <span>{item.finalamount}</span>
                    </div>
                    <div class="row-right"></div>
                  </div>
                </div>
              </div>
              {item.actions.length > 0 && (
                <div class="item-footer">
                {item.actions.map(action => (
                  <div 
                    class={['btn', action.class == 'blue' ? 'btn-blue' : '']}
                    key={action.text}
                    on-click={(e) => { e.stopPropagation();this. onAction(action, item.id)}}
                  >
                    {action.text}
                  </div>
                ))}
                </div>
              )}
            </div>
          ))}
          </div>
        </van-list>
      </div>
    )
  }
}
</script>

<style lang="stylus">
html
  background-color #F4F6F8
.dms-order-wrap
  .filter-wrap
    padding dis-m
    background-color #fff
  .order-list
    padding 12px
    .order-item
      padding 12px 0 9px 0
      background #fff
      margin-bottom 12px
      border-radius 10px
      .item-top
        padding 0 12px
      .item-row
        display flex
        justify-content space-between
        margin-bottom 4px
        font-size 14px
        color #333
        .label
          color #999999
      .item-header
        border-bottom 1px solid #eee
        padding-bottom 4px
        .status
          color #FF972A
      .item-body
        display flex
        flex-direction column
        padding-top 8px
      .item-footer
        display flex
        justify-content flex-end
        padding 9px 12px 0 12px
        margin-top 4px
        border-top 1rpx solid #eee
        .btn
          padding 6px 22px
          font-size 14px
          border 1px solid #CCCCCC
          border-radius 16px
          color #333
          margin-left 12px
        .btn-blue
          color #1678FF
          border-color #1678FF
</style>