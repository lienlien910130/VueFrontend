<template>
  <div class="chart" style="height:350px;width:100%" />
</template>

<script>
import { mapGetters } from 'vuex'
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { equipment  } from '@/api/index'

export default {
  mixins: [resize],
  props:{
    percentage:{
      type:Array
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    //this.init()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    seriesData(val) {
      this.setOptions({series:val})
    },
    percentage:{
      handler:function(){
        if(this.percentage.length > 0){
           this.init()
        }
      },
      immediate:true
    }
  },
  methods: {
    init(){
      this.chart = null
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOption(this.percentage[0].length,this.percentage[1].length,this.percentage[2].length)
      this.$emit('handleChartClick', '損壞')
      this.chart.on('click',params => {
        this.$emit('handleChartClick', params.data.type)
      })
      // this.$nextTick(() => {
      //   this.chart = null
      //   this.chart = echarts.init(this.$el, 'macarons')
      //   this.setOption(this.percentage[0].length,this.percentage[1].length,this.percentage[2].length)
      //   this.$emit('setloadtree', buildingid)
      //   this.chart.on('click',params => {
      //     this.$emit('setcurrentnode', params.data.type)
      //   })
      // })
    },
    setOption(one,two,three) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          show: true
        },
        legend: {
          left: 'center',
          bottom: '15',
          data: ['良好', '損壞', '叫修中'],
          textStyle:{ fontSize: 24 }
        },
        series: [
          {
            name: '設備',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '42%'],
            data: [
              { value: one, name: '良好',type:'良好' },
              { value: two, name: '損壞',type:'損壞' },
              { value: three, name: '叫修中',type:'叫修中' }
            ],
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
        ]
      })
    }
  }
}
</script>
