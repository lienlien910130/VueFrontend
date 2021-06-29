<template>
  <div class="chart" style="height:350px;width:100%" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props:{
    percentage:{
      type:Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    percentage:{
      handler:async function(){
        if(this.percentage.length > 0){
          this.init()
        }
      },
      immediate:true
    },
    // seriesData:{
    //   handler:async function(val){
    //     console.log('seriesData',val)
    //     this.setOptions({series:val})
    //   },
    //   immediate:true
    // },
    // seriesData(val) {
    //   this.setOptions({series:val})
    // }
  },
  methods: {
    init(){
      this.chart = null
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption(this.percentage)
      this.chart.on('click',params => {
        this.$emit('handleChartClick', params.data.value)
      })
    },
    setOption(dataArray) {
      var array = []
      dataArray.forEach(item=>{
        array.push(item.name)
      })
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          show: true
        },
        legend: {
          left: 'center',
          bottom: '15',
          data: array,
          textStyle:{ fontSize: 24 }
        },
        series: [
          {
            name: '設備',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '42%'],
            data: dataArray,
            animationEasing: 'cubicInOut',
            label:{
                normal: {
                    show:true,
                    textStyle: {
                        fontWeight: 200,
                        fontSize: 20 
                    },
                    formatter: '{d}%',
                },
            },
            itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  },
                  normal: {
                      borderWidth: 3,
                      borderColor: '#fff'
                  }
            }
          }
        ],
        color: ['rgb(64, 158, 255)','rgb(255, 0, 0)','rgb(230, 162, 60)']
      })
    }
  }
}
</script>
