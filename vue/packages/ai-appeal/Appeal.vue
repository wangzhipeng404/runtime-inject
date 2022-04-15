<template>
  <div class="skuDetail">
    <div class="img-box" @click="showImg">
      <img :src="imgUrl" class="img"/>
    </div>
    <div class="table">
      <div class="add" @click="addProduct"  v-if="!hasAppeal">
        <van-button type="info" size="small">添加</van-button>
      </div>
      <van-row class="table-t">
        <van-col :span="10">产品名称</van-col>
        <van-col :span="3">所在层</van-col>
        <van-col :span="4">申诉层</van-col>
        <van-col :span="3">排面</van-col>
        <van-col :span="4">申诉排面</van-col>
      </van-row>
      <div class="table-c">
        <van-row v-for="item in productList" :key="item.id" class="table-l">
          <van-col :span="10" >{{item.actualName}}</van-col>
          <van-col :span="3">{{item.layer}}</van-col>
          <van-col :span="4" class="text-c" >
            <van-cell-group>
              <van-field v-model="item.appealLayer" placeholder="" type="digit" :disabled="hasAppeal"/>
            </van-cell-group>
          </van-col>
          <van-col :span="3">{{item.skuCount}}</van-col>
          <van-col :span="4" class="text-c" >
            <van-cell-group>
              <van-field v-model="item.appealCount" placeholder="" type="digit" :disabled="hasAppeal"/>
            </van-cell-group>
          </van-col>
        </van-row>
        <div class="message">
          <van-field
            v-model="message"
            label-width="60"
            label="备注"
            rows="3"
            type="textarea"
            label-align="left"
            placeholder="请输入备注"
            :autosize="{maxHeight:60}"
            :border="false"
            class="textarea"
            :disabled="hasAppeal"
          />
        </div>
      </div>
      <div class="footer">
        <div class="ss-btn" @click="submit" v-if="!hasAppeal">提交申诉</div>
        <div class="tips"  v-if="hasAppeal">该图片已申诉过</div>
      </div>
    </div>
    <product-list ref="product" :productList="reallyProduct" @selectProduct="selectProduct" ></product-list>
  </div>
</template>

<script>

  import Product from './Product.vue'
  import { mergeResult, formatProduct } from './mergeResult.js'

  export default {
    name: 'home',
    components: {
      [Product.name]: Product,
    },
    props: ['query'],
    data() {
      return {
        message:'',
        showPicker:false,
        isLoading:false,
        appealProduct:{},
        list: [],
        imgUrl:'',
        originUrl:'',
        productList:[],
        reallyProduct:[],
        appealType:'2',
        hasAppeal:false,
      }
    },
    created(){
      
    },
    mounted() {
      let { appData } = this.query;
      if(appData){
        if(typeof appData=='string'){
          appData = JSON.parse(appData);
        }
      }
      if(appData.originUrl){
        let _url = appData.originUrl.split('?')[0];
        let imgList = _url.split('/');
        let imgId = imgList[imgList.length-1].split('.')[0];
        this.$http.post('/api/teapi/dy-biz/1295535475620188258/1305344709014720599', {
          ai_t_visit_appeal_photo:{
            visitphotoid:imgId
          }
        }).then(res => res.data.resp_data).then(res=>{
          if(res.ai_t_visit_appeal_photo){
            this.hasAppeal = true;
            this.imgUrl = appData.imageUrl;
            this.originUrl = appData.originUrl;
            this.message =res.ai_t_visit_appeal_photo.remark; 
            this.productList = JSON.parse(res.ai_t_visit_appeal_photo.appealjson);
          }else{
            this.init();
          }
        },() =>{
          this.init();
        })
      }else{
        this.init();
      }
    },
    methods: {
      init(){
        let {appData, product} = this.query;
        if(appData){
          if(typeof product=='string'){
            product = JSON.parse(product);
          }
          if(typeof appData=='string'){
            appData = JSON.parse(appData);
          }
          console.log(appData,product)
          let list = product.map(item=>{
            return item.productcode;
          })
          let productList = [];
          let pList = [];
          appData.ownSkuInfos.forEach(item=>{
            if(list.indexOf(item.skuCode)!=-1){
              productList.push(item);
              pList.push(item.skuCode);
            }
          })
          this.type = this.formatType(appData.bizType);
          this.imgUrl = appData.imageUrl;
          this.originUrl = appData.originUrl;
          productList = formatProduct(productList);
          this.productList = this.getAppeaList(productList);
          this.reallyProduct = product;
        } 
      },
      formatType(type){
        if(type=='3'){
          return '1';
        }else if(type=='4'){
          return '2';
        }else if(type=='5'){
          return '3';
        }else{
          return '4';
        }
      },
      getAppeaList(list){
        let rsList = [];
        list.map(item=>{
          rsList.push({
            actualName:item.actualName,
            skuCode:item.skuCode,
            subBrand:item.subBrand||item.brand,
            brand:item.subBrand||item.brand,
            layer:item.layer,
            appealLayer:item.appealLayer||'',
            auditLayer:'',
            skuCount:item.skuCount,
            appealCount:item.appealCount||'',// 申诉的排面
            auditCount:'',
          })
        })
        return rsList;
      },
      selectProduct(item){
        this.productList.push({
          actualName:item.productname,
          subBrand:item.brand,
          brand:item.brand,
          skuCode:item.productcode,
          layer:'-',
          appealLayer:'',
          auditLayer:'',
          skuCount:0,
          appealCount:'',// 申诉的排面
          auditCount:'',
        })
      },
      submit(){
        let list = [];
        let obj = {};
        list = list.concat(this.getAppeaList(this.productList));
        list = list.filter(item=>{
          return item.appealLayer!==''||item.appealCount!=='';
        })
        if(list.length==0){
          return this.$toast('请先填写要申诉的产品')
        }
        for(let i=0;i<list.length;i++){
          const item = list[i];
          if(item.layer=='-' && (item.appealLayer==''||item.appealCount=='')){
            return this.$toast('添加的产品申诉需要填写申诉层数及排面数');
          }
        }
        for(let i=0;i<list.length;i++){
          const item = list[i];
          if(obj[item.skuCode+item.appealLayer]&&item.appealLayer){
            return this.$toast('同一个产品不能申诉同一层');
          }else{
            obj[item.skuCode+item.appealLayer] = true;
          }
        }
        this.$dialog.confirm({
          title: '提示',
          message: '每张图片只能申诉一次，确认申诉吗？'
        }).then(() => {
          if(this.isLoading) return;
          this.isLoading = true;
          let _url = this.originUrl.split('?')[0];
          let imgList = _url.split('/');
          let imgId = imgList[imgList.length-1].split('.')[0];
          const result = mergeResult(
            JSON.parse(this.query.appData),
            JSON.parse(JSON.stringify(list)),
            'layer'
          )
          console.log(list);
          console.log(JSON.stringify({
              "visitphotoid": imgId,
              "originurl":this.originUrl,
              "visitphotourl": this.imgUrl,
              "appealjson": JSON.stringify(list),
              "resultjson": JSON.stringify(result),
              "remark": this.message,
              "source": "1",
              "type": this.type,
              "storeid":this.query.storeId,
            }))
            // return;
          this.$http.post('/api/teapi/dy-biz/1295535475620188258/1295535475620188257',{
            "ai_t_visit_appeal_photo": {
              "visitphotoid": imgId,
              "originurl":this.originUrl,
              "visitphotourl": this.imgUrl,
              "appealjson": JSON.stringify(list),
              "resultjson": JSON.stringify(result),
              "remark": this.message,
              "source": "1",
              "type": this.type,
              "storeid":this.query.storeId,
            }
          }).then(res => res.data.resp_data).then(()=>{
            this.isLoading = false;
            this.$toast('申诉成功');
            setTimeout(()=>{
              this.$xpe.emit('back');
            },1500)
          },err=>{
            this.isLoading = false;
            this.$toast(err.error_code ||'申诉失败');
          })
        }).catch(() => {
        });
      },
      showImg(){
        let url = this.imgUrl;
        this.$imagePreview([url]);
      },
      addProduct(){
        this.$refs.product.open();
      }
    },
  }
</script>
<style lang="less" scoped>
.img-box{
  display: flex;
  justify-content: center;
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
}
.ss-btn{
  width:200px;
  height:36px;
  line-height: 36px;
  text-align: center;
  margin:5px auto;
  color:white;
  background-color: #1989fa;
  border-radius: 5px;
}
.footer{
  position: fixed;
  bottom:0px;
  left:0;
  right:0;
  background-color: white;
  z-index: 9;
  box-sizing: border-box;
}
.message{
  padding:10px 10px 0 10px;
}
.add{
  margin:5px 10px;
}
.tips{
  text-align: center;
  color: white;
  background: #EE0A24;
  height: 30px;
  line-height: 30px;
  position: absolute;
  bottom: 0;
  left: -5px;
  right: -5px;
}
</style>

<style lang="less">
.skuDetail{
  padding-bottom:60px;
  .van-cell{
    padding:0px!important;
    text-align:left;
  }
  .table-l .van-cell{
    border:1px solid #dedede !important;
  }
}
.textarea{
  .van-field__body{
    padding:0 5px;
    border:1px solid #dedede;
  }
}
</style>