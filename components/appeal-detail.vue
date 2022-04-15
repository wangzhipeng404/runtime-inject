<script>
export default {
  data () {
    return {
      detail:{},
      id: '1514804699038093312',
      list:[],
      imgUrl:'',
      hasAppeal:false,
      isVerify: '0',
      auditremark:'', // 审批意见
      refreshkey: 0,
    }
  },
  created () {
    this.$xpe.on('refresh', () => {
      this.refreshkey++
    })
    this.axios.defaults.baseURL = 'http://101.200.205.231:7000'
    this.axios.defaults.headers['token'] = "eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NTAwMDI2NzIsIkxvZ2luVXNlciI6eyJhY2NvdW50SW5mb0NvZGUiOiIxNTEzMzk4MDE4NjM0ODEzNDQwIiwiYWNjb3VudENvZGUiOiIxNTEzMzk4MDE4NTYzNTEwMjcyIiwidGVuYW50Q29kZSI6IjEwMDAwNjAiLCJwcm9kdWN0Q29kZSI6IjEwMDAwMDAwMDAwMDAwMDAwMCIsInByb2R1Y3RWZXJzaW9uQ29kZSI6IjEwMDAwMDAwMDAwMDAwMDA2MCIsImNsaWVudFR5cGVDb2RlIjozLCJ0b2tlbklkIjoiNGU2MGQ4MGItY2ZhOS00NGM2LTgxZmQtZjk1YjFjMmMxNzllIiwib3JnQ29kZSI6IjE1MTIzMzU2NDg5NDg4ODM0NTYiLCJ1c2VySW5mb0lkIjoiMTUxMzMzMzAxMDk5OTY3Njk1MSIsInVzZXJJbmZvTmFtZSI6IuiDoeS4muWKoeWRmDYwMDgiLCJwb3NpdGlvbkNvZGUiOiIxNTEzMzk3ODYxNjkyMzQ2MzY4IiwicG9zaXRpb25OYW1lIjoi5Lia5Yqh5ZGYIiwibWVtYmVyQ29kZSI6IjE1MTMzOTgwMTg1MjE1NjcyMzIiLCJyZWZQb3NpdGlvbkNvZGUiOiI4ODgwMDAwMDAwMDAwMDAwMDIiLCJjYXRlZ29yeUNvZGUiOiJzZmEtc2FsZXNtYW4iLCJvcmdTdHJ1Y3RUeXBlSWQiOiIxIiwidXNlck5hbWUiOiI2MDA4IiwidXNlck5hbWUxIjoiMTU2MDMwMDYwMDgiLCJ1c2VyTmFtZTIiOm51bGwsInVzZXJOYW1lMyI6IjYwMDgiLCJ0ZW5hbnROYW1lIjoi5pm65oWnMTAwVjYuMC1iYXNl5Lqn5ZOB56ef5oi3IiwiYXBwQ29kZSI6InNhbGVzIiwiYXBwQ29kZXMiOlsic2FsZXMiLCJwcm9tb3Rpb24iLCJkaXN0cmlidXRpb24iXSwic3ViUGRDb2RlcyI6WyJzZmEiLCJkbXMiLCJwbW0iLCJ0cG0iXSwiY29kZXBhdGgiOiIxLjE0OTA2MDA0MjczNzEyMzczNzYuMTUxMjMzNTY0ODk0ODg4MzQ1Ni4iLCJpc2xlYWZvcmciOiJ0cnVlIiwibWV0YW1vZGVsdHlwZSI6MSwiaXNTbXNMb2dpbiI6ZmFsc2V9fQ._uaegTTW_sL-KBaBzMaw34TIcZ_vSQXdD9il3i1sTOU"
    this.getData();
  },methods:{
    formatTime(time){
      return this.$dayjs(+time).format('YYYY-MM-DD HH:mm:ss');
    },
    formatType(type){
      const list = ['','货架','冰柜','地堆','其他'];
      if(type){
        return list[type];
      }else{
        return '';
      }
    },
    showImg(data){
      console.log(window)
      let url = this.imgUrl;
      this.$imagePreview([url]);
    },
    getData(){
      this.$http.post('/api/teapi/dy-biz/1295535475620188258/1295679164501856349', {
        ai_t_visit_appeal_photo:{
          visitappealphotoid: this.id
        }
      }).then(res => res.data.resp_data).then(res=>{
        const detail = res.ai_t_visit_appeal_photo;
        this.detail = detail;
        this.imgUrl = this.detail.visitphotourl;
        if(detail.auditstatus == '201' && this.isVerify=='1'){
          this.hasAppeal = false;
          this.list = this.formatData(JSON.parse(this.detail.appealjson));
        }else{
          this.hasAppeal = true;
          this.list = JSON.parse(this.detail.appealjson);
        }
      })
    },
    formatData(list){
      const rs = list.map(item=>{
        item.auditLayer = item.appealLayer;
        item.auditCount = item.appealCount;
        return item;
      })
      return rs;
    },
    submit(type){
      if(!this.auditremark){
        return this.$toast('请输入审批说明');
      }
      this.$api.appealAudit({
        ai_t_visit_appeal_photo:{
          visitappealphotoid:this.id,
          appealjson:JSON.stringify(this.list),
          auditremark:this.auditremark,
          auditstatus:type?'202':'203',
        }
      }).then(res=>{
        this.$toast('审批成功');
      },err=>{
        this.$toast('审批失败');
      })
    }
  },
  render (h) {
    return (
      <div class="appealDetail">
        <div class="img-box" on-click={this.showImg}>
          <img src={this.imgUrl} class="img"/>
        </div>
        <div class="item">
          <div class="line">终端：{this.detail.storename}</div>
          <div class="line">申诉时间：{this.formatTime(this.detail.appealtime)}</div>
          {this.hasAppeal && (<div class="line">提交人：{this.detail.userinfoname}</div>)}
          <div class="line">场景：{this.formatType(this.detail.type)}</div>
          <div class="line">申诉来源：{this.detail.source=='1'?'费用执行':'铺货执行'}</div>
        </div>
        <div class="">
          <div class="line bold pdl table-title">申诉明细:</div>
          <div class="table">
            <van-row class="table-t">
              <van-col span="10">产品名称</van-col>
              <van-col span="3">所在层</van-col>
              <van-col span="4">申诉层</van-col>
              <van-col span="3">排面</van-col>
              <van-col span="4">申诉排面</van-col>
            </van-row>
            {this.list.map(item => (
              <van-row key={item.skuName} class="table-l">
                <van-col span="10" >{item.actualName}</van-col>
                <van-col span="3">{item.layer||'-'}</van-col>
                {!this.hasAppeal && (
                  <van-col span="4" class="text-c">
                    <van-cell-group>
                      <van-field 
                        v-model={item.auditLayer}
                        placeholder=""
                        type="digit"
                        disabled={this.hasAppeal}
                      />
                    </van-cell-group>
                  </van-col>
                )}
                <van-col span="4" v-if="hasAppeal">{item.auditLayer||'-'}</van-col>
                <van-col span="3">{item.skuCount}</van-col>
                <van-col span="4" v-if="hasAppeal">{item.auditCount}</van-col>
                {!this.hasAppeal && (
                  <van-col span="4" class="text-c">
                    <van-cell-group>
                      <van-field 
                        v-model={item.auditCount}
                        placeholder=""
                        type="digit"
                        disabled={this.hasAppeal}
                      />
                    </van-cell-group>
                  </van-col>
                )}
              </van-row>
            ))}
          </div>
          <div class="desc item">备注：{this.detail.remark}</div>
        </div>
        {this.hasAppeal && (
          <div class="item">
            <div class="bold">审核详情：</div>
            <div class="content">
              <div class="line">处理人：{this.detail.auditstatus == '201'? '' : this.detail.auditor}</div>
              <div class="line">处理时间：{this.detail.auditstatus=='201' ? '' : this.formatTime(this.detail.approvetime)}</div>
              <div class="line">处理结果：{this.detail.auditstatus=='201'?'':(this.detail.auditstatus=='202'?'不通过':'通过')}</div>
              <div class="line">处理原因：{this.detail.auditstatus=='201'?'':this.detail.auditremark}</div>
            </div>
          </div>
        )}
        {!this.hasAppeal && false && (
          <div class="footer" v-if="!hasAppeal&&false">
            <van-field
              v-model={this.auditremark}
              required
              clearable
              label-width="70"
              label="审批说明"
              rows="3"
              type="textarea"
              label-align="left"
              placeholder="请输入审批说明"
              autosize={{ maxHeight: 60 }}
              border={false}
              class="textarea"
            />
            <div class="btns" >
              <van-button type="default" plain  block class="flex1" on-click={() => this.submit(true)}>不通过</van-button>
              <van-button color="#FF9933" block class="flex1" on-click={() => this.submit(false)}>通过</van-button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
</script>
<style lang="stylus">
.appealDetail{
  .van-cell{
    padding:0px!important;
    text-align:left;
  }
  .table-l .van-cell{
    border:1px solid #dedede !important;
  }
  .textarea.van-cell{
    padding:10px 12px 10px 15px !important;
    .van-field__body{
      padding:0 5px;
      border:1px solid #dedede;
    }
  }
}
.appealDetail{
  background-color: #f8f8f8;
  text-align:left;
  font-size:14px;
  .item{
    padding:12px;
    margin-bottom:10px;
    background-color:white;
  }
  .bold{
    font-weight:600;
  }
  .line{
    line-height:26px;
    background-color: white;
  }
  .pdl{
    padding-left:12px;
  }
  .table-l{
    display:flex;
    justify-content: space-between;
    height:30px;
    line-height: 30px;
  }
  .table-title{
    padding:5px 12px;
  }
  .table-r{
    text-align:center;
    width:80px;
  }
  .content{
    border:1px solid #dedede;
    margin-top:10px;
    padding:0 12px;
  }
  .img-box{
    display: flex;
    justify-content: center;
    background-color: white;
  }
  .img {
    max-width:100%;
    height: 200px;
  }
  .table-t{
    text-align: center;
    padding: 0px 10px;
    color: white;
    background-color: #385BFF;
    font-size: 14px;
    display: flex;
    align-items: center;
    line-height: 16px;
    height:32px;
  }
  .table-l{
    display: flex;
    line-height: 20px;
    padding: 5px 10px;
    text-align: center;
    align-items: center;
    font-size: 13px;
    background-color: white;
  }
}
.btns{
  display: flex;
  background-color: white;
  padding:20px 0 10px 0;
  justify-content: space-around;
  .flex1{
    width:40%;
  }
}
</style>