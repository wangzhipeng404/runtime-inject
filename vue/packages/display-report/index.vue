<template>
  <div class="ph-detail">
    <div class="statistics-container">
      <div class="statistics-content">
        <div class="top">
          <template v-if="isPrefect && hasPlan">
            <!--div class="score-wrap">
              <img src="@/assets/imgs/icon/jf.png" class="score-icon" />
              <span class="add">+</span>
              <span class="score-num">{{score}}</span>
              <span class="feng">分</span>
            </div-->
            <div class="prefect">
              <div class="prefect-yes">合格</div>
            </div>
          </template>
          <template v-if="!isPrefect && hasPlan">
            <!--div class="score-wrap">
              <img src="@/assets/imgs/icon/jf.png" class="score-icon" />
              <span class="add">+</span>
              <span class="score-num">{{score}}</span>
              <span class="feng">分</span>
            </div-->
            <div class="prefect">
              <div class="prefect-no">不合格</div>
            </div>
          </template>
          <template v-if="!hasPlan">
            <div class="prefect">此门店无铺货计划</div>
          </template>
        </div>
        <div class="statistics-wrap van-hairline--bottom van-hairline--top">
          <van-row>
            <van-col :span="8">
              <div class="value">{{result.skuNums}}</div>
              <div class="name">本品品项数</div>
            </van-col>
            <van-col :span="8" class="van-hairline--left van-hairline--right">
              <div class="value">{{result.ownSku}}</div>
              <div class="name">本品排面数</div>
            </van-col>
            <van-col :span="8">
              <div class="value value-color">{{result.skuCent}}</div>
              <div class="name">排面占比</div>
            </van-col>
          </van-row>
        </div>
        <template>
          <div class="process">
            <div class="process-header">
              <div class="process-t">
                <span>必铺完成度</span>
                <span v-if="hasPlan">({{`${result.mustDb}/${displayRule.mustnumbers}`}})</span>
                <span v-else>(0/0)</span>
              </div>
              <!--div class="process-r" v-if="result.mustCent==100 && hasPlan">
                <span class="add">+</span>
                <span class="score-num">{{displayRule.mustscore}}</span>
                <span class="feng">分</span>
              </div-->
            </div>
            <div class="process-c" v-if="result.mustCent==100">
              <van-progress 
                :percentage="result.mustCent"
                :show-pivot="false"
                stroke-width="10"
                color="linear-gradient(to right, #6DE071, #31B06A)"
              />
              <img 
                src="./assets/icon/db.png"
                class="process-icon"
                :style="{ left:  '90%' }"
                v-if="hasPlan"
              />
            </div>
            <div class="process-c" v-else>
              <van-progress 
                :percentage="result.mustCent"
                :show-pivot="false"
                stroke-width="10"
                color="linear-gradient(to right, #FF7334, #FDAC14)"
              />
              <img 
                src="./assets/icon/wdb.png"
                class="process-icon"
                :style="hasStyle"
                v-if="hasPlan"
              />
            </div>
          </div>
          <div class="process">
            <div class="process-header">
              <div class="process-t">
                <span>选铺完成度</span>
                <span v-if="hasPlan">({{`${result.notMustDb}/${displayRule.notmustnumbers}`}})</span>
                <span v-else>(0/0)</span>
              </div>
              <!--div class="process-r" v-if="result.notMustCent==100 && hasPlan">
                <span class="add">+</span>
                <span class="score-num">{{displayRule.score}}</span>
                <span class="feng">分</span>
              </div-->
            </div>
            <div class="process-c" v-if="result.notMustCent==100">
              <van-progress 
                :percentage="result.notMustCent" 
                :show-pivot="false"
                stroke-width="10"
                color="linear-gradient(to right, #6DE071, #31B06A)"
              />
              <img src="./assets/icon/db.png" class="process-icon" :style="{ left:  '90%' }"/>
            </div>
            <div class="process-c" v-else>
              <van-progress
                :percentage="result.notMustCent"
                :show-pivot="false"
                stroke-width="10"
                color="linear-gradient(to right, #FF7334, #FDAC14)"
              />
              <img 
                src="./assets/icon/wdb.png"
                class="process-icon"
                :style="notStyle"
                v-if="hasPlan"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-for="(item,index) in images" :key="index">
      <canvas :ref="`canvas${index}`" style="display:none"></canvas>
    </div>
    <van-row class="table-t">
      <van-col span="12">产品名称</van-col>
      <van-col span="4">品牌</van-col>
      <van-col span="4">要求排面数</van-col>
      <van-col span="4">实际排面数</van-col>
    </van-row>
   <div class="title">
      <div>有铺货计划的品项({{hasList.length}})</div>
      <div class="" @click="isShowHas=!isShowHas">
        查看详情
        <van-icon name="arrow-up" color="#1677FF" v-show="isShowHas" class="middle"/>
        <van-icon name="arrow-down" color="#1677FF" v-show="!isShowHas"  class="middle" />
      </div>
    </div>
    <div v-show="isShowHas">
      <van-row class="table-l" v-for="(item, index) in hasList" :key="item.skuCode" @click="showImg(item)" :class="{odd:index%2==1}">
        <!-- <van-col span="3">{{index+1}}</van-col> -->
        <van-col span="12" class="align-left">
          <ph-icon v-show="item.type" :type="item.type"></ph-icon>
          {{item.actualName}}
        </van-col>
        <van-col span="4">{{brandMap[item.skuCode] || '-'}}</van-col>
        <van-col span="4">{{item.dbNumbers}}</van-col>
        <van-col span="3">{{item.skuCount}}</van-col>
        <van-col span="1">
          <img v-if="item.isDb" src="./assets/icon/hg.png" class="quality-icon" />
          <img v-else src="./assets/icon/bjg.png" class="quality-icon" />
        </van-col>
      </van-row>
    </div>  
    <div class="title">
      <div>无铺货计划的品项({{noList.length}})</div>
      <div class="" @click="isShowNot=!isShowNot">
        查看详情
        <van-icon name="arrow-up" color="#1677FF" v-show="isShowNot" class="middle"/>
        <van-icon name="arrow-down" color="#1677FF" v-show="!isShowNot"  class="middle" />
      </div>
    </div>
    <div v-show="isShowNot">
      <van-row class="table-l" v-for="(item,index) in noList" :key="item.skuCode" @click="showImg(item)" :class="{odd:index%2==1}">
        <!-- <van-col span="3">{{index+hasList.length+1}}</van-col> -->
        <van-col span="12" class="align-left"> <ph-icon v-show="item.type" :type="item.type"></ph-icon>{{item.actualName}}</van-col>
        <van-col span="4">{{brandMap[item.skuCode] || '-'}}</van-col>
        <van-col span="4">-</van-col>
        <van-col span="4">{{item.skuCount}}</van-col>
      </van-row>
    </div>
    <canvas ref="canvas" style="display:none;"></canvas> 
  </div>
</template>

<script>
import Icon from './Icon'

export default {
  components: {
    [Icon.name]: Icon,
  },
  props: ['query'],
  data() {
    return {
      images: [],
      index: 0,
      result: {
        skuNums: 0, // 本品品项
        ownSku: 0, // 本品排面
        skuCent: 0,// 本品占比
        mustNums: 0,// 必铺品项
        notMustNums: 0,// 选铺品项
        otherNums: 0,// 其他品项
        allSku:0, // 总排面
        allSkuNums:0, // 总排面数量
        mustDb:0, // 必铺达标数量
        notMustDb:0, // 选铺达标数量
        mustCent:0, // 必铺达标百分比
        notMustCent:0, // 选铺达标百分比
      },
      score:0,// 奖励分数
      list:[],
      originList:[],
      hasList:[],
      noList:[],
      displayRule:{},
      isPrefect:false,
      hasPlan:false,
      isShowHas:true,
      isShowNot:true,
      brandMap: {},
    };
  },
  computed:{
    notStyle(){
      const w = document.body.clientWidth-70;
      let left = ((this.result.notMustCent/100)*w-20)
      if(left<0){
        left=0;
      }
      return {
        left:left+'px'
      }
    },
    hasStyle(){
      const w = document.body.clientWidth-70;
      let left = ((this.result.mustCent/100)*w-20)
      if(left<0){
        left=0;
      }
      return {
        left:left+'px'
      }
    },
  },
  mounted(){
    let aiResult = this.query.appData;
    console.log(aiResult)
    this.$http.post('/api/teapi/dy-biz/1295535475620188258/1305311137037946979', {
      "ai_visit_result_compute":{
        identityids:aiResult[0].identityids ||"[]"
      }
    }).then(res => res.data.resp_data).then(res=>{
      this.init(res.ai_t_visit_appeal_photo);
    })
  },
  methods: {
    changeTab(tab){
      console.log(tab)
    },
    init(appealResult){
      let keys = ['shelf','endshelf','display','freezer','cold','waterheap'];
      let aiResult = this.query.appData;
      const unionInfo = this.query.kx_kq_visit_and_plan_union
      if(this.query.displayRule.length>0){
        this.displayRule = this.query.displayRule[0];
        let startTime = this.displayRule.mainstarttime;
        let endTime = this.displayRule.mainendtime;
        let submittime = new Date((aiResult[0].submittime+' 00:00:00').replace(/-/g, '/')).getTime();
        // 如果铺货计划不在计划内
        if (unionInfo) {
          if (unionInfo.planid) {
            this.hasPlan = true
          } else {
            this.hasPlan = false
          }
        } else {
          if(submittime>+endTime || submittime<+startTime){
            this.hasPlan = false;
          }else{
            this.hasPlan = true;
          }
        }
      }else{
        this.hasPlan = false;
      }
      let list = [];
      keys.map(item=>{
        if(aiResult.length>0){
          let one = aiResult[0][item];
          if(typeof one == 'string'){
            one = JSON.parse(one);
          }
          if(one && one.length>0){
            // list = list.concat(one.flat());
            for(var i=0;i<one.length;i++){
              for(var j=0;j<one[i].length;j++){
                list.push(one[i][j]);
              }
            }
          }
        }
      })
      console.log('list',list);
      if (appealResult) {
        list = list.map(item=>{
          for(let i=0;i<appealResult.length;i++){
            const one = JSON.parse(appealResult[i].resultjson);
            if(item.taskId==one.taskId){
              return one;
            }
          }
          return item;
        })
      }
      console.log('originList',list);
      const productCodes = []
      const productCodeMap = {}
      list.forEach(r => {
        r.skuInfo.forEach(s => {
          const code = s.skuCode
          if (!productCodeMap[code]) {
            productCodes.push(code)
            productCodeMap[code] = true
          }
        })
      })
      this.$http.post('/api/teapi/dy-biz/1166609760242503779/1440524996609970262', {
        kx_kq_product: {
          productcode: productCodes.join(',')
        }
      }).then(res => res.data.resp_data).then(res => {
        const data = res.kx_kq_product
        const brands = {}
        data.forEach(d => {
          brands[d.productcode] = d.productbrand
        })
        this.brandMap = brands
      })
      this.originList = list;
      let result = {
        ownSkuInfos:{},
        competeSkuInfos:{},
      };
      let resultObj = {
        ownSkuInfos:[],
        competeSkuInfos:[],
      };
      list.forEach(one=>{
        result = this.mergeResult(one,result);
      })
      Object.keys(result.ownSkuInfos).forEach(item=>{
        resultObj.ownSkuInfos.push(result.ownSkuInfos[item]);
      })
      Object.keys(result.competeSkuInfos).forEach(item=>{
        resultObj.competeSkuInfos.push(result.competeSkuInfos[item]);
      })

      this.setData(resultObj);
    },
    setData(resultObj){
      const {product} = this.query;
      const skuList = resultObj.ownSkuInfos;
      const comList = resultObj.competeSkuInfos;
      const pList = {};
      product.forEach(item=>{
        pList[item.productcode] = item;
      });
      console.log('pList',pList);
      let hasList = [];
      let noList = [];
      let result = {
        skuNums: 0, // 本品品项
        ownSku: 0, // 本品排面
        skuCent: 0,// 本品占比
        mustNums: 0,// 必铺品项
        notMustNums: 0,// 选铺品项
        otherNums: 0,// 其他品项
        allSku:0, // 总排面
        allSkuNums:0,
        mustDb:0, // 必铺达标数量
        notMustDb:0, // 选铺达标数量
        mustCent:0, // 必铺达标百分比
        notMustCent:0, // 选铺达标百分比
      }
      skuList.forEach(item=>{
        if(item.skuCount>0){
          result.skuNums ++;
          result.allSku ++;
        }
        console.log(item.skuCount,item.skuCode)
        result.ownSku += +item.skuCount;
        result.allSkuNums += +item.skuCount;
        if(pList[item.skuCode]){
          if(pList[item.skuCode].ismust==1){
            if(pList[item.skuCode].productnum <=item.skuCount){
              result.mustDb++;
              item.isDb = true;
            }else{
              item.isDb = false;
            }
            item.type='bp';
            item.typeSort = 1;
            item.dbNumbers = +pList[item.skuCode].productnum;
            if(item.skuCount>0){
              result.mustNums ++;
            }
          }else{
            if(pList[item.skuCode].productnum<=item.skuCount){
              result.notMustDb++;
              item.isDb = true;
            }else{
              item.isDb = false;
            }
            if(item.skuCount>0){
              result.notMustNums ++;
            }
            item.dbNumbers = +pList[item.skuCode].productnum;
            item.typeSort = 2;
            item.type ='xp';
          }
          hasList.push(item);
        }else{
          result.otherNums++;
          item.type ='ben';
          noList.push(item);
        }
      })
      comList.forEach(item=>{
        result.allSku ++;
        result.otherNums++;
        result.allSkuNums += +item.skuCount;
        item.type ='jp';
        noList.push(item);
      })
      result.skuCent =result.allSkuNums==0?'0%':(result.ownSku*100/result.allSkuNums).toFixed(0)+'%';
      if(this.hasPlan){
        result.mustCent = this.displayRule.mustnumbers==0?100:(result.mustDb*100/this.displayRule.mustnumbers).toFixed(0);
        result.notMustCent = this.displayRule.notmustnumbers==0?100:(result.notMustDb*100/this.displayRule.notmustnumbers).toFixed(0);
        if(result.notMustCent>100){
          result.notMustCent = 100;
        }
        // 必铺和选铺都达标
        if(this.displayRule.perfecttype==2 && (result.mustCent==100 ||result.mustnumbers==0)&& result.notMustCent==100){
          this.isPrefect = true;
        }
        if(this.displayRule.perfecttype==1 && result.mustCent==100){
          this.isPrefect = true;
        }
        if(result.mustCent==100){
          this.score += +this.displayRule.mustscore;
        }
        if(result.notMustCent==100){
          this.score += +this.displayRule.score;
        }
      }
      hasList.sort((a,b)=>a.typeSort-b.typeSort);
      this.hasList = hasList;
      this.noList = noList;
      this.result = result;
    },
    showImg(item){
      let imgs = [];
      this.originList.forEach(one=>{
        one.ownSkuInfos.forEach(j=>{
          if(j.skuCode==item.skuCode){
            imgs.push(one.imageUrl);
          }
        })
        one.competeSkuInfos.forEach(j=>{
          if(j.skuCode==item.skuCode){
            imgs.push(one.imageUrl);
          }
        })
      })
      console.log(imgs);
      this.$xpe.emit('showimg',{imgs:imgs});
      // ImagePreview(imgs)
    },
    mergeResult(obj,result){
      if(typeof obj =='string'){
        obj = JSON.parse(obj);
      }
      const {ownSkuInfos,competeSkuInfos} = obj;
      ownSkuInfos.map(item=>{
        if(result.ownSkuInfos[item.skuCode]){
          result.ownSkuInfos[item.skuCode].skuCount += (+item.skuCount||0);
        }else{
          item.skuCount = +item.skuCount;
          result.ownSkuInfos[item.skuCode] = JSON.parse(JSON.stringify(item));
        }
      })
      competeSkuInfos.map(item=>{
        if(result.competeSkuInfos[item.skuName]){
          result.competeSkuInfos[item.skuName].skuCount += (+item.skuCount||0);
        }else{
          item.skuCount = +item.skuCount;
          result.competeSkuInfos[item.skuName] = JSON.parse(JSON.stringify(item));
        }
      })
      return result;
    },

  }
};
</script>
<style lang="less">
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  max-height: 240px;
  text-align: center;
}
.img {
  max-width:100%;
  height: 240px;
}
.van-progress__portion{
  transition:width 2s; 
}
</style>
<style lang="less" scoped>
.ph-detail {
  .statistics-container {
    padding: 14px 15px;
    background-color: #EEEEEE;
    .statistics-content {
      background-color: #FFF;
      border-radius: 8px;
      padding: 30px 20px;
      .top{
        margin-bottom: 18px;
        .score-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FF5000;
          font-family: PingFangSC-Regular;
          margin-bottom: 10px;
          line-height: 30px;
          .score-icon {
            width: 30px;
            height: 30px;
            margin-right: 7px;
          }
          .add {
            font-size: 20px;
          }
          .score-num {
            font-size: 28px;
            margin: 0 2px;
          }
          .feng {
            font-size: 16px;
          }
        }
        .prefect{
          display: flex;
          justify-content: center;
          line-height: 22px;
          text-align: center;
          color: #222222;
          .prefect-yes {
            width: 100px;
            padding: 6px 0;
            color:  rgb(49, 176, 106);
            border-radius: 20px;
            border: 1px solid  rgb(49, 176, 106);
            background-color: rgba(49, 176, 106, 0.1);
          }
          .prefect-no {
            width: 100px;
            padding: 6px 0;
            color: #FF8322;
            border-radius: 20px;
            border: 1px solid rgb(255, 131, 34);
            background-color: rgba(255, 131, 34, 0.1);
          }
        }
      }
      .statistics-wrap {
        text-align: center;
        padding: 10px 0;
        .value {
          font-size: 16px;
          color: #222222;
          line-height: 22px;
        }
        .name {
          font-size: 12px;
          color: #999999;
          line-height: 22px;
        }
        .value-color {
          color: #1677FF;
        }
      }
    }
    .process {
      .process-header {
        display: flex;
        justify-content: space-between;
        padding: 11px 0;
        .process-t {
          font-size: 14px;
          color: #222222;
        }
        .process-r {
          font-size: 14px;
          color: #FF5000;
        }
      }
      .process-c {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 40px;
        position: relative;
        .process-icon {
          position: absolute;
          z-index: 9;
          top: 0;
          width: 40px;
          height: 40px;
        }
      }
    }
  }
}
.ph-detail .van-grid-item__content{
  padding:10px 8px;
}
.name{
  font-size: 15px;
}
.value{
  padding-top:5px;
  font-weight: 600;
  color:#30C08C;
  font-size:18px;
}
.table-t{
  text-align: center;
  padding: 3px 10px;
  color: #666;
  background-color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  line-height: 16px;
  height:32px;
}
.table-l{
  display: flex;
  line-height: 20px;
  padding: 8px 10px;
  text-align: center;
  align-items: center;
  font-size: 12px;
  color: #222222;
}
.title{
  height: 32px;
  line-height: 32px;
  padding:0 10px;
  color:#1677FF;
  font-size: 12px;
  background-color: #E6F1FF;
  margin-bottom:5px;
  display: flex;
  justify-content: space-between;
}
.bdb{
  border-bottom:1px solid #dedede;
}
.bg-orange{
  background-color: #FF8322 !important;
}
.c-green{
  color:#30C08C !important;
}

.text-i{
  border:1px solid #2c3e50;
  border-radius: 20px;
  width:13px;
  height:13px;
  display: inline-block;
  margin-right:2px;
  font-size:12px;
  line-height: 12px;
}
.table-icon{
  vertical-align: middle;
  margin-left: 2px;
}

.c-blue{
  color:#1677FF !important;
}
.odd{
  background-color: #F9F9F9;
}
.quality-icon {
  position: relative;
  width: 14px;
  height: 14px;
  top: 1px;
}
.align-left {
  text-align: left;
}
</style>