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
  props:['selectbuild'],
  computed: {
    ...mapGetters([
      'account',
      'roles',
      'id'
    ])
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
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
    selectbuild: function() {
        this.getEquipment(this.selectbuild)
    },
  },
  methods: {
    getEquipment(buildingid) {
      equipment(buildingid).then( respone => {
        this.$nextTick(() => {
          this.chart = null
          this.chart = echarts.init(this.$el, 'macarons')
          this.setOption(respone.data.count)
          this.$emit('setloadtree', buildingid)
          this.chart.on('click',params => {
            this.$emit('setcurrentnode', params.data.type)
          })
        })

      }).catch( error => {
          console.log('error=>' + error)
      })
    },
    setOption(count) {
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          show: true

        },
        legend: {
          left: 'center',
          bottom: '15',
          data: ['妥善', '損壞', '叫修'],
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
              { value: count[0], name: '妥善',type:'good' },
              { value: count[1], name: '損壞',type:'damage' },
              { value: count[2], name: '叫修',type:'repair' }
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
                  },
            },
          }
        ]
      })
    }
  }
}
</script>
