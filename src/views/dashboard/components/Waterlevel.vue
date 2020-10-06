<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '380px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['室內消防栓', '自動撒水', '泡沫', '水霧', '室外消防栓', '連結送水管'],
          axisTick: {
            alignWithLabel: true
          },
           axisLabel: {
            interval: 0,
            rotate: -20
           }
        }],
        yAxis: [{
          type: 'value',
          
        }],
        series: [{
          name: '實際水位',
          type: 'bar',
          data: [79, 52, 200, 334, 390, 330, 220],
          
        }, {
          name: '需求水位',
          type: 'bar',
          data: [80, 52, 200, 334, 390, 330, 220],
          
        }
        ]
      })
    }
  }
}
</script>
