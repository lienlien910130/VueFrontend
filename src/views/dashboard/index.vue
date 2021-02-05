<template>
    <div class="editor-container">
      <div v-if="account == 'mf01'">
        水星專用
      </div>
      <div v-else >
        <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            <pie-chart 
            :percentage="deviceGroup"
            v-on:handleChartClick="handleChartClick" 
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            <Tree 
            :treeData="deviceGroup"
            :currentNode="currentNode" 
            v-on:handleNodeClick="handleNodeClick"/> 
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            通知(檢修/公安)
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="12">
          <div class="chart-wrapper">
            通知(檢修/公安)
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="12">
          <div class="chart-wrapper">
            設備即時狀況
          </div>
        </el-col>
      </el-row>
        <!-- <el-row  :gutter="32">
          <div class="infinite-list-wrapper">
            <div 
            class="list"  
            v-infinite-scroll="loadMore"  
            infinite-scroll-disabled="disabled"  
            infinite-scroll-immediate="false">
              <div 
              v-for="i in count" 
              :key="i">
              <el-col :xs="24" :sm="24" :md="8" :lg="8">
                <div class="dashboard-wrapper">
                  <p>{{ viewlist[i-1].name }}</p>
                  <component 
                    v-bind:is="viewlist[i-1].type" 
                  ></component> 
                </div>
              </el-col>
              </div>
            </div>
            <p v-if="loading">加載中...</p>
          </div>
        </el-row> -->

      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import constant from '../../../src/constant';
import { removeDuplicates } from '@/utils/index'

export default {
  name: 'Dashboard',
  components: {
    PieChart: () => import('./components/PieChart'),
    Tree: () => import('./components/Tree'),
    Dialog: () => import('./components/Dialog'),
    Pump: () => import('./components/Pump'),
    Waterlevel: () =>  import('./components/Waterlevel'),
    Elevator: () =>  import('./components/Elevator')
  },
  computed: {
    ...mapGetters([
      'buildingid',
      'account'
    ]),
    noMore () {
      return this.count >= this.viewlist.length 
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  watch:{
    buildingid:{
      handler:async function(){
        await this.getBuildingDevicesManage()
      }
    },
  },
  data() {
    return {
      deviceData:[],
      deviceGroup:[],
      loading: false,
      count: 9,
      viewlist: constant.INDEX_VIEW_NINE,
      currentNode: '',
    }
  },
  async mounted() {
    if(this.buildingid !== undefined){
      await this.getBuildingDevicesManage()
    }
  },
  methods: {
    loadMore() {
      this.loading = true;
      setTimeout(() => {
        this.count += 3;
        if(this.count >= this.viewlist.length){
          this.count = this.viewlist.length
        }
        this.loading = false;
      }, 2000)
    },
    async getBuildingDevicesManage() { //取得設備
      var _temp = []
      this.deviceData = await this.$obj.Device.getBuildingDevicesManage()
      var statusArray = removeDuplicates(this.deviceData,'status')
      for(let obj of statusArray) {
        var statusObj = await this.$obj.Setting.getOption(obj.status)
        _temp.push({
          value: obj.status,
          name: statusObj[0].textName,
          data: this.deviceData.filter((item, index) => item.status == obj.status)
        })
      }
      this.deviceGroup = _temp
    },
    handleChartClick(value){
      this.currentNode = value
    },
    handleNodeClick(data){
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

  .chart-wrapper {
    background: #fff;
    padding: 5px 16px 0;
    margin-bottom: 32px;
    height: 360px;
    overflow-x:hidden;
    overflow-y:auto;
  }

  .dashboard-wrapper{
    background: #fff;
    padding: 5px 16px 0;
    margin-bottom: 32px;
    height: 450px;
    overflow-x:hidden;
    overflow-y:auto;
  }


.infinite-list-wrapper {
    height:1000px; // 1. 指定高度
	  overflow: auto; // 2. 内容超过指定高度 出现滚动条
	  width: 100%;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
