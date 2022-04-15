<script>
export default {
  data () {
    return {
      loading:false,
      finished:true,
      list:[],
      show:false,
      now:new Date(),
      selectDate:'',
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      refreshing:false,
      page:1,
      rows:50,
      status:'',
      menuList: [
        { text: '申诉状态', value: '' },
        { text: '待处理', value: '201' },
        { text: '已通过', value: '203' },
        { text: '不通过', value: '202' },
      ],
      timeList:[
        { text: '申诉日期', value: '1' },
        { text: '指定日期', value: '2' },
      ],
      sourceList:[
        { text: '申诉来源', value: '' },
        { text: '费用执行', value: '1' },
        { text: '铺货执行', value: '2' },
      ],
      source:'',
      time:'1',
      name:'',
      isVerify: '0',
    }
  },
  beforeCreate () {
    this.$cache.set('test', () => { console.log (1111) })
    this.axios.defaults.baseURL = 'http://101.200.205.231:7000'
    this.axios.defaults.headers['token'] = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAwMDI2NzIsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNTEzMzk4MDE4NjM0ODEzNDQwIiwiYWNjb3VudENvZGUiOiIxNTEzMzk4MDE4NTYzNTEwMjcyIiwidGVuYW50Q29kZSI6IjEwMDAwNjAiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjozLCJ0b2tlbklkIjoiNGU2MGQ4MGItY2ZhOS00NGM2LTgxZmQtZjk1YjFjMmMxNzllIiwib3JnQ29kZSI6IjE1MTIzMzU2NDg5NDg4ODM0NTYiLCJ1c2VySW5mb0lkIjoiMTUxMzMzMzAxMDk5OTY3Njk1MSIsInVzZXJJbmZvTmFtZSI6IuiDoeS4muWKoeWRmDYwMDgiLCJwb3NpdGlvbkNvZGUiOiIxNTEzMzk3ODYxNjkyMzQ2MzY4IiwicG9zaXRpb25OYW1lIjoi5Lia5Yqh5ZGYIiwibWVtYmVyQ29kZSI6IjE1MTMzOTgwMTg1MjE1NjcyMzIiLCJyZWZQb3NpdGlvbkNvZGUiOiI4ODgwMDAwMDAwMDAwMDAwMDIiLCJjYXRlZ29yeUNvZGUiOiJzZmEtc2FsZXNtYW4iLCJvcmdTdHJ1Y3RUeXBlSWQiOiIxIiwidXNlck5hbWUiOiI2MDA4IiwidXNlck5hbWUxIjoiMTU2MDMwMDYwMDgiLCJ1c2VyTmFtZTIiOm51bGwsInVzZXJOYW1lMyI6IjYwMDgiLCJ0ZW5hbnROYW1lIjoi5pm65oWnMTAwVjYuMC1iYXNl5Lqn5ZOB56ef5oi3IiwiYXBwQ29kZSI6InNhbGVzIiwiYXBwQ29kZXMiOlsic2FsZXMiLCJwcm9tb3Rpb24iLCJkaXN0cmlidXRpb24iXSwic3ViUGRDb2RlcyI6WyJzZmEiLCJkbXMiLCJwbW0iLCJ0cG0iXSwiY29kZXBhdGgiOiIxLjE0OTA2MDA0MjczNzEyMzczNzYuMTUxMjMzNTY0ODk0ODg4MzQ1Ni4iLCJpc2xlYWZvcmciOiJ0cnVlIiwibWV0YW1vZGVsdHlwZSI6MSwiaXNTbXNMb2dpbiI6ZmFsc2V9fQ._uaegTTW_sL-KBaBzMaw34TIcZ_vSQXdD9il3i1sTOU"
  },
  created () {
    
  },
  mounted(){
    this.getData();
    window.showAppealCalender = this.showAppealCalender;
  },
  methods:{
    formatTime(time){
      return this.$dayjs(+time).format('YYYY-MM-DD HH:mm:ss');
    },
    setTime(val){
      if(this.time==1){
        this.selectDate='';
        this.page = 1;
        this.getData();
      }else if(this.time==2){
        this.showAppealCalender();
      }
    },
    getData(type){
      let __paging = {
        __pageindex:''+(this.page-1),
        __pagesize:this.rows+'',
      }
      let data = {};
      if(this.selectDate){
        data.appealtime = new Date(this.selectDate.replace(/-/g,'/')).getTime()+'';
      }
      data.auditstatus = this.status;
      data.source = this.source;
      data.name = this.name;
      data.isverify = this.isVerify;
      this.$http.post('/api/teapi/dy-biz/1295535475620188258/1295660749296898147', {
        ai_t_visit_appeal_photo: data,
        __paging,
      }).then(res => res.data.resp_data).then(res=>{
        console.log(res)
        if(type){
          this.refreshing = false;
        }
        if(this.page == 1){
          this.list = res.ai_t_visit_appeal_photo;
        }else{
          this.list = this.list.concat(res.ai_t_visit_appeal_photo);
        }
        if(res.resultCount<= this.page * this.rows){
          this.finished = true;
        }
        this.page++;
        console.log('dsdfsdfsfdsf')
      })
    },
    jupmToDetail(data){
      this.$xpe.emit('jumpToDetail', { id: data.visitappealphotoid });
    },
    formatDate(date) {
      return this.$dayjs(date).format('YYYY-MM-DD');
    },
    showAppealCalender(){
      this.show = true;
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.$refs.calendar.scrollIntoView();
        },300)
        
      })
    },
    onConfirm(date) {
      this.show = false;
      this.time='2';
      this.selectDate = this.formatDate(date);
      this.onRefresh();
    },
    onRefresh(){
      this.list = [];
      this.page = 1;
      this.getData(true);
    }
  },
  render (h) {
    return (
      <div class="appealList">
        <van-pull-refresh v-model={this.refreshing} on-refresh={this.onRefresh}>
          <div class="top">
            <div class="d-menu">
              <van-search
                class="flex1"
                v-model={this.name}
                show-action
                clearable
                placeholder="终端名称/提交人"
              >
                <div on-click={this.onRefresh} slot="action">搜索</div>
              </van-search>
              <van-dropdown-menu class="d-menu1">
                <van-dropdown-item v-model={this.source} options={this.sourceList} on-change={this.onRefresh}/>
                <van-dropdown-item v-model={this.status} options={this.menuList} on-change={this.onRefresh}/>
                <van-dropdown-item v-model={this.time} options={this.timeList} on-close={this.setTime}/>
              </van-dropdown-menu>
            </div>
          </div>
          <van-list
            v-model={this.loading}
            finished={this.finished}
            finished-text="没有更多了"
            on-load={this.getData}
            class="appeal-list-c"
          >
          {this.list.map((item, index) => (
            <div
              class="item van-hairline--bottom"
              key={index}
              on-click={() => this.jupmToDetail(item)}
            >
              <div class="item-t ">
                <div>终端：{item.storename}</div>
                <div 
                  class={'type ' + (item.auditstatus=='203' ? 'active' : '')}
                >
                  { item.auditstatus=='203' ? '已通过' : item.auditstatus== '202' ? '不通过' : '待处理' }
                </div>
              </div>
              <div class="item-b">
                申诉时间:{this.formatTime(item.appealtime)}
              </div>
              {this.isVerify== '1' && (
                <div class="item-b">
                  <span>提交人：</span>{item.userinfoname}
                </div>
              )}
              <div class="item-b">
                <span>申诉来源：</span>{ item.source=='1' ? '费用执行' : '铺货执行' }
              </div>
            </div>
          ))}
          </van-list>
        </van-pull-refresh>
        {this.show && (
          <div>
            <van-calendar 
              v-model={this.show}
              type="single"
              on-confirm={this.onConfirm}
              color="#029687"
              min-date={this.minDate}
              max-date={this.maxDate}
              default-date={this.now}
              ref="calendar"
              lazy-render={false}
            />
          </div>
        )}
      </div>
    )
  }
}
</script>
<style lang="stylus">
.flex1{
  flex:1;
}
.appealList{
  background-color: #f8f8f8;
  min-height: 100vh;
}
.item-t{
  display: flex;
  justify-content: space-between;
  height: 36px;
  line-height: 36px;
  padding-left:12px;
  position: relative;
}
.item-b{
  height: 30px;
  line-height:30px;
  padding-left:12px;
}
.item{
  margin-bottom:10px;
  background-color: white;
  font-size: 14px;
  text-align: left;
}
.bold{
  font-weight:600;
}
.icon{
  vertical-align:middle;
  margin-right:3px;
}
.type{
  height:30px;
  line-height:30px;
  color:white;
  width:80px;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  text-align: center;
  background-color: #6190EA;
  margin-top:3px;
  .active{
    background-color: #1CC917;
  }
}
.top{
  position: fixed;
  top:0;
  left:0;
  width:100%;
  z-index: 999;
}
.d-menu{
  width: 100%;
  // display: flex;
}
.d-menu1{
  width: 100%;
  // top:45px;
}
.appeal-list-c{
  padding-top:100px;
}
.appealList .van-dropdown-menu__bar{
  box-shadow:none !important;
}
.van-calendar__popup.van-popup--bottom, .van-calendar__popup.van-popup--top{
  height: 90% !important;
}
</style>