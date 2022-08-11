<script>
export default {
  name: 'order-step',
  data () {
    return {
      query: {
        code: 'WLD20220429001362'
      },
      steps: []
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
      const statusMap = {
        1: '已发货',
        2: '运送中',
        3: '已签收'
      }
      const res = await this.axios({
        url: '/1491976446623748195/1501031585854656592',
        method: 'post',
        data: {
          kx_logistics: {
            logisticscode: this.query.code
          }
        }
      }).then(res => {
        return res.kx_logistics
      })
      this.steps = res.map(s => {
        return {
          ...s,
          statusText: statusMap[s.status]
        }
      })
    }
  },
  render () {
    return (
      <div class="step-container">
      {this.steps[0] && this.steps[0].status != '3' && (
        <div class="step-wrap">
          <div class="left">
            <div class="status-text unvisible">运送中</div>
          </div>
          <div class="right">
            <div class="time"><span class="unvisible">2021</span></div>
            <div class="desc"><span class="unvisible">已发货</span></div>
          </div>
        </div>
      )}
      {this.steps.map((item, index) => (
        <div class={['step-wrap', index == 0 ? 'active' : '']} key={item.id}>
          <div class="left">
            <div class="status-text">{item.status}</div>
          </div>
          <div class="right">
            <div class={['dot-wrap', item.status == '2' ? 'dot-empty' : 'dot-text', index == 0 ? 'active' : '']}>
            {item.status == '1' && (
              <div>发</div>
            )}
            {item.status == '3' && (
              <div>收</div>
            )}
            </div>
            <div class={['time', item.status == '1' ? 'border-white' : '']}>
              {item.recordtime}
            </div>
            <div class={['desc', item.status == '1' ? 'border-white' : '']}>
              {item.mark}
            </div>
          </div>
        </div>
      ))}
      </div>
    )
  }
}
</script>

<style lang="stylus">
.step-container
  padding 32px 0

.step-wrap
  display flex
  font-size 14px
  line-height 20px
  color #999999
  .unvisible
    visibility hidden
  .left
    padding 0 16px
  .right
    position relative
    .dot-wrap
      position absolute
      top 0
      left 0
      z-index 9
      color #ffffff
      font-size 12px
      border-radius 100%
      background-color #999999
    .dot-active
      background-color #1678FF
    .dot-empty
      padding 5px
      transform translate(-50%, 50%)
    .dot-text
      padding 6px
      transform translate(-50%, 30%)
    .time
      padding 0 16px
      border-left 1px dashed #999
    .desc
      border-left 1px dashed #999
      padding 0 16px 16px 16px
    .border-white
      border-color white
.active
  color #1678FF
</style>