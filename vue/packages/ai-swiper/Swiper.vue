<template>
  <div class="ph-detail-wrap">
    <van-swipe
      class="my-swiper"
      @change="changeTab"
      v-if="mode !== 'preview'"
    >
      <van-swipe-item
        v-for="(image, index) in images"
        :key="index"
      >
        <img
          :src="image.src"
          class="swiper-img"
          @click="previewImg(index)"
        />
        <div class="canvas-box" :style="{right:(paddingleft - 30)+'px'}" v-show="image.result">{{image.result}}</div>
      </van-swipe-item>
      <template #indicator>
        <div class="custom-indicator">
          <div class="custom-box">
            {{ activeIndex + 1 }}/{{images.length}}
          </div>
        </div>
      </template>
    </van-swipe>
    <canvas
      ref="canvas"
      style="display:none;"
    ></canvas>
    <van-image-preview
      v-model="showImg"
      :images="previewImgs"
      @close="onClose"
    >
      <template v-slot:index>
        <van-button @click="saveImg">保存到相册</van-button>
      </template>
    </van-image-preview>
  </div>
</template>

<script>
function warpText(canvas,text, x, y, maxWidth, lineHeight, color, font) {
  if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
    return;
  }
  if (typeof maxWidth == 'undefined') {
    maxWidth = (canvas && canvas.width) || 300;
  }
  if (typeof lineHeight == 'undefined') {
    lineHeight = (canvas && parseInt(window.getComputedStyle(canvas).lineHeight)) || parseInt(window.getComputedStyle(document.body).lineHeight);
  }
  const context = canvas.getContext('2d');
  context.fillStyle = color || '#000000';
  context.font = font;
  // 字符分隔为数组
  var arrText = text.split('');
  var line = '';
  
  for (var n = 0; n < arrText.length; n++) {
      var testLine = line + arrText[n];
      var metrics = context.measureText(testLine);
      var testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
          context.fillText(line, x, y);
          line = arrText[n];
          y += lineHeight;
      } else {
          line = testLine;
      }
  }
  context.fillText(line, x, y);
}

function drawText(canvas,text,height, maxWidth, lineHeight, font, color, start){
  let list = text.split('\n');
  const x = start || 10;
  let y = list.length*lineHeight;
  for(let i=0;i<list.length;i++){
    y = height-(list.length-i)*lineHeight-10;
    warpText(canvas,list[i],x,y,maxWidth,lineHeight, color, font);
  }
}

export default {
  props: {
    mode: {
      type: String,
      default: 'swiper'
    }
  },
  data() {
    return {
      canvasWidth: 200,
      canvasHeight: 300,
      paddingleft: 87,
      times: 1,
      images: [],
      activeIndex: 0,
      canvasUrl: '',
      showImg: false,
      userClose: false,
      isAndroid: true,
    }
  },
  computed: {
    previewImgs() { 
      return this.canvasUrl ? [this.canvasUrl] : []
    },
  },
  created() {
    const u = navigator.userAgent;
    this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    this.$xpe.on('setData', (data) => {
      if(typeof data === 'string') {
        try {
          data = JSON.parse(data)
        } catch (e) {
          console.log(e)
        }
      }
      this.userClose = false
      this.showImg = false
      this.canvasUrl = ''
      this.images = data.map(d => d.imageUrl)
      this.getImageUrls(data)
    })
    this.$xpe.on('setCurrentData', (data) => {
      console.log(data)
      this.draw(data).then(url => {
        console.log(url)
        this.images.splice(this.activeIndex, 1, { 
          src: url,
          result: data.result,
        })
      })
    })
    this.$xpe.on('setIndex', (index) => {
      this.activeIndex = index
    })
  },
  mounted() {
    this.init()
    // this.mode = 'preview'
    // this.$xpe.run('setData', [{
    //   skus: [{"skuCode":"SKU00000059","skuName":"0003303","actualName":"小茗同学溜溜哒茶PET480(15入)","layerDetail":"1","layerCountDetail":[{"layer":1,"count":4}],"series":"","unit":"","type":2,"locations":[{"xmin":"0.226","ymin":"0.049","xmax":"0.288","ymax":"0.228","layer":1},{"xmin":"0.287","ymin":"0.039","xmax":"0.362","ymax":"0.229","layer":1},{"xmin":"0.364","ymin":"0.04","xmax":"0.44","ymax":"0.229","layer":1},{"xmin":"0.441","ymin":"0.04","xmax":"0.516","ymax":"0.23","layer":1}],"lineColor":"#BA62FF4C","skuCount":4,"skuType":0,"layerOutCount":null,"skuGoldLocationDetection":false,"brand":"统一","subBrand":null}],
    //   imageUrl: 'http://xtionai-storage-test.oss-cn-shenzhen.aliyuncs.com/51f/img/20210526/1008863/51fdb5c2-a8aa-46b7-85ce-a0117fd9d34d.jpg',
    //   waterMark: 'dasdad\n发发发打发士大夫十分士大夫十分分散是否梵蒂冈豆腐干大锅饭大概的非手术方法是否收费的方式\n而为人温柔',
    //   waterMarkColor: 'red',
    //   cornerMark: true,
    // }])
  },
  methods: {
    init () {
      // let height = document.body.clientHeight - 320;
      let imWidth = 600;
      let imHeight = 809;
      let canvasWidth = imWidth
      let canvasHeight = imHeight;
      const ratio = canvasWidth / 200;
      canvasWidth = 200;
      canvasHeight = Math.trunc(imHeight / ratio);
      this.paddingleft = Math.trunc((document.body.clientWidth - 200) / 2);
      this.canvasWidth = Math.trunc(canvasWidth);
      this.canvasHeight = Math.trunc(canvasHeight);
      this.$xpe.emit('init')
    },
    async getImageUrls(data) {
      for (let i = 0; i < data.length; i++) {
        const url = await this.draw(data[i])
        this.images.splice(i, 1, {
          src: url,
          result: data[i].result,
        })
      }
      if (this.mode === 'preview') {
        const imgUrl = this.images[this.activeIndex].src
        this.canvasUrl = imgUrl
        this.userClose = true
        this.showImg = true
      }
    },
    onClose () {
      if (this.userClose) {
        this.showImg = true
      }
    },
    previewImg() {
      const imageUrl = this.images[this.activeIndex].src
      // this.canvasUrl = imgUrl
      // this.showImg = true
      this.$xpe.emit('onPreview', { imageUrl })
    },
    changeTab(tab) {
      this.activeIndex = tab
      this.$xpe.emit('onChange', { index: tab })
    },
    saveImg() {
      console.log('saveImage')
      let reg = /data.+?;base64,/;
      this.$xpe.bridge('saveImage', this.isAndroid ? this.canvasUrl : this.canvasUrl.replace(reg,''))
    },
    draw(imgData) {
      return new Promise((resovle) => {
        const skulist = imgData.skus
        if (!skulist && !imgData.waterMark) {
          resovle(imgData.imageUrl)
          return
        }
        let self = this
        let canvas = this.$refs.canvas
        let ctx = canvas.getContext('2d')
        let img = new Image()
        img.crossOrigin = ''
        img.src = imgData.imageUrl + '?t=' + new Date().getTime()
        img.onload = function () {
          let canvasWidth = img.width
          let canvasHeight = img.height
          canvas.width = canvasWidth
          canvas.height = canvasHeight
          console.log(canvasWidth, canvasHeight)
          ctx.drawImage(img, 0, 0, canvasWidth * self.times, canvasHeight * self.times)
          if (imgData.waterMark) {
            console.log(imgData.waterMark)
            const fontSize = imgData.fontSize || self.isAndroid ? 28 : 18
            const lineHeight = imgData.waterMarkLineHeight || self.isAndroid ? 36 : 26
            drawText(
              canvas, 
              imgData.waterMark, 
              canvasHeight, 
              canvasWidth - 20,
               lineHeight, 
               `${fontSize}px serif`, 
               imgData.waterMarkColor
            )
          }
          if (skulist) {
            for (let i in skulist) {
              for (let j in skulist[i].locations) {
                let x = parseInt(skulist[i].locations[j].xmin * canvasWidth * self.times)
                let y = parseInt(skulist[i].locations[j].ymin * canvasHeight * self.times)
                let xmin = parseFloat(skulist[i].locations[j].xmin)
                let xmax = parseFloat(skulist[i].locations[j].xmax)
                let ymin = parseFloat(skulist[i].locations[j].ymin)
                let ymax = parseFloat(skulist[i].locations[j].ymax)
                let width = parseInt((xmax - xmin) * canvasWidth * self.times)
                let height = parseInt((ymax - ymin) * canvasHeight * self.times)
                // let middle_x = parseInt(((xmax + xmin) * canvasWidth) / 2)
                // let middle_y = parseInt(((ymax + ymin) * canvasHeight) / 2)
                const cornerMarkKey = imgData.cornerMarkKey || 'skuName'
                let text =  skulist[i][cornerMarkKey]
                let color = skulist[i].lineColor
                var maxwidth = width
                if (imgData.cornerMark && imgData.cornerMark !== 'false') {
                  ctx.fillStyle = '#fff'
                  ctx.fillRect(x, y - 18, maxwidth, 18)
                  ctx.fillStyle = '#000'
                  ctx.font = '800 14px serif'
                  ctx.fillText(text, x + 2, y - 4, maxwidth)
                  // util.drawText(canvas, text, y + 18, maxwidth, 14, '800 14px serif', '#000', x + 4)
                }
                if (color) {
                  ctx.strokeStyle = color.slice(0, 7)
                  ctx.lineWidth = 2
                  ctx.strokeRect(x, y, width, height)
                }
              }
            }
          }
          const url = canvas.toDataURL('image/jpeg')
          resovle(url)
        }
      })
    },
  },
}
</script>
<style lang="less">
.ph-detail-wrap {
  height: 100%;
}
.my-swiper {
  height: 100%;
}
.my-swiper .van-swipe-item {
  color: #fff;
  font-size: 20px;
  max-height: 100%;
  text-align: center;
}
.swiper-img {
  width: auto;
  max-width: 100%;
  height: 100%;
}
.canvas-box{
    position: absolute;
    top: 20px;
    font-size: 14px;
    background-color: #EE0A24;
    color: white;
    padding: 3px 20px;
    border-radius: 4px;
    transform: rotate(40deg);
    right: 40px;
  }
</style>
<style lang="less" scoped>
.ph-detail .van-grid-item__content {
  padding: 10px 8px;
}
.line-box {
  height: 10px;
  background-color: #f8f8f8;
}
.name {
  font-size: 12px;
  padding-top: 5px;
  color: #999999;
}
.c-blue {
  color: #1677ff !important;
}
.c-orange {
  color: #fb5a00 !important;
}
.c-green {
  color: #5ad10c !important;
}
.value {
  font-weight: 600;
  color: #222;
  font-size: 16px;
}
.table-t {
  text-align: center;
  padding: 3px 10px;
  color: #666;
  background-color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  line-height: 16px;
  height: 32px;
}
.table-l {
  display: flex;
  line-height: 20px;
  padding: 8px 10px;
  text-align: center;
  align-items: center;
  font-size: 12px;
  color: #222222;
}
.odd {
  background-color: #f9f9f9;
}
.title {
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
  color: #1677ff;
  font-size: 12px;
  background-color: #e6f1ff;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
}
.text-i {
  border: 1px solid #2c3e50;
  border-radius: 20px;
  width: 17px;
  height: 17px;
  display: inline-block;
  margin-right: 2px;
}
.c-red {
  color: red;
}
.custom-indicator {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
}
.custom-box {
  width: 60px;
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: white;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12.5px;
}
.relative {
  position: relative;
}
.item-icon {
  position: absolute;
  top: 2px;
  left: 18%;
  z-index: 99;
}
.middle {
  vertical-align: middle;
}
</style>
<style >
.van-image-preview__index {
  top: auto !important;
  bottom: 16px !important;
}
</style>