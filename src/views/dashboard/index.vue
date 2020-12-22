<template>
    <div class="editor-container">
      <!-- <div class="dashboard-text">name: {{ name }} </div>
      <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div> -->
      <!-- <Select style="margin-bottom: 20px;" v-on:setselect="setselect"/> -->

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            <pie-chart 
            :percentage="deviceGroup"
            v-on:handleChartClick="handleChartClick" 
            v-on:setloadtree="setloadtree" 
            />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <div class="chart-wrapper">
            <Tree 
            :treeData="deviceGroup"
            :currentnode="currentnode" 
            :loadtree="loadtree" 
            v-on:setvisible="setvisible"/> 
          </div>
        </el-col>
      </el-row>
        <Dialog :dialogTableVisible="dialogTableVisible" :dialogData="dialogData" v-on:setvisible="setvisible"/>

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
</template>

<script>
import { mapGetters } from 'vuex'
import constant from '../../../src/constant';

export default {
  name: 'Dashboard',
  components: {
    PieChart: () => import('./components/PieChart'),
    Tree: () => import('./components/Tree'),
    Dialog: () => import('./components/Dialog'),
    Pump: () => import('./components/Pump'),
    Waterlevel: () =>  import('./components/Waterlevel'),
    Elevator: () =>  import('./components/Elevator'),
  },
  computed: {
    noMore () {
      return this.count >= this.viewlist.length 
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  data() {
    return {
      deviceData:[],
      deviceGroup:[],

      typelist: '',
      currentnode: '',
      selectbuild:'',
      loadtree:'',
      dialogTableVisible:false,
      dialogData:'',
      viewlist: constant.INDEX_VIEW_NINE,
      loading: false,
      count: 9
    }
  },
  async mounted() {
    await this.getBuildingDevicesManage()
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
      this.deviceData = []
      var _temp = []
      await this.$api.device.apiGetBuildingDevicesManagement().then(response => {
        this.deviceData = response.result.sort((x,y) => x.id - y.id)
        _temp.push(this.deviceData.filter((item, index) => 
                        item.status == '良好'),this.deviceData.filter((item, index) => 
                        item.status == '損壞'),this.deviceData.filter((item, index) => 
                        item.status == '叫修中'))
        this.deviceGroup = _temp
      })
    },
    handleChartClick(type){

    },
    settypelist(val) {
      this.typelist = val
    },
    setcurrentnode(val) {
      this.currentnode = val
    },
    setselect(val) {
      this.selectbuild = val
    },
    setloadtree(val) {
      this.loadtree = val
    },
    setvisible(val) {
      if(val.id !== undefined){
        this.dialogData = val
        this.dialogTableVisible = true
      }else {
        this.dialogData = ''
        this.dialogTableVisible = false
      }
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
