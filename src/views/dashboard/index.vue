<template>
    <div class="editor-container">
      <div v-if="buildingid == undefined">
        請選擇建築物
      </div>
      <div v-else>
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
             <el-row>
                <div v-if="total > 0" class="pagination-container">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :current-page="page"
                        :page-sizes="pageSizeList"
                        :page-size="limit"
                        :total="total"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                    ></el-pagination>
                </div>
            </el-row>
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
import Device from '@/object/device'
import { MaintainManagement }  from '@/object/maintainManagement'

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
      'buildingoptions',
      'account'
    ]),
    noMore () {
      return this.count >= this.viewlist.length 
    },
    disabled () {
      return this.loading || this.noMore
    },
    page: function() {
      return this.maintainlistQueryParams.pageIndex || 1
    },
    limit: function() {
     return this.maintainlistQueryParams.pageSize || 12
    },
    total: function() {
      return this.maintainlistQueryParams.total || 0
    }
  },
  watch:{
    buildingid:{
      handler:async function(){
        if(this.buildingid !== undefined){
          await this.init()
        }
      },
      immediate:true
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
      maintainlistQueryParams:{
        
        pageIndex: 1,
        pageSize: 50,
        total:0
      },
      pageSizeList:[50, 150, 300, 500]
    }
  },
  methods: {
    async init(){   
      await this.getBuildingDevicesManage()
      await this.getMaintain()
    },
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
      this.deviceData = await Device.get()
      var statusArray = removeDuplicates(this.deviceData,'status')
      for(let obj of statusArray) {
        var statusObj = this.buildingoptions.filter((item,index)=>item.id == obj.status)[0]
        if(statusObj !== undefined){
          _temp.push({
          value: obj.status,
          name: statusObj.textName,
          data: this.deviceData.filter((item, index) => item.status == obj.status).map(v => {
                  this.$set(v, 'name', v.getOnlyName()) 
                  this.$set(v, 'type', v.linkDeviceTypes.length !== 0 ? v.linkDeviceTypes[0].getID() : '')
                  return v
              })
          })
        }
      }
      this.deviceGroup = _temp
    },
    async getMaintain(){ //取得維保細項 故障日期!=null 叫修日期null
        var data = await MaintainManagement.getAllSearchPage(this.maintainlistQueryParams)
        console.log(data)
        this.maintainlistQueryParams.total = data.totalPageCount

    },
    //圓餅圖
    handleChartClick(value){
      this.currentNode = value
    },
    //樹
    handleNodeClick(data){
      console.log(data)
    },
    // 改變翻頁組件中每頁數據總數
    async handleSizeChange(val) {
      this.maintainlistQueryParams.pageSize = val
      this.maintainlistQueryParams.pageIndex = 1 // 改變翻頁數目，將頁面=1
      await this.getMaintain()
    },
    // 跳到當前是第幾頁
    async handleCurrentChange(val) {
      this.maintainlistQueryParams.pageIndex = val
      await this.getMaintain()
    },
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
