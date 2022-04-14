<template>
  <div class="display-statistics-container">
    <van-row>
      <van-col :span="8" v-for="d in reportData" :key="d.title">
        <div class="chart-wrap">
          <div>
            <van-circle v-model="d.value" :rate="d.value" :speed="100" :text="text(d.value)" layer-color="#ebedf0" />
          </div>
          <div>{{d.title}}</div>
        </div>
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'display-statistics',
  data() {
    return {
      reportData: []
    }
  },
  created () {
    this.$xpe.on('loadReportData', data => {
      this.reportData = data.map(d => {
        return {
          ...d,
          value: +d.value,
        }
      })
    })
  },
  mounted() {
    this.$xpe.emit('loadStaitisticsData')
  },
  methods: {
    text(val) {
      return val + '%';
    },
  }
}
</script>

<style lang="less" scoped>
.display-statistics-container {
  padding: 10px 0;
  .chart-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
}
</style>