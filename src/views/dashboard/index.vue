<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <!-- <div class="dashboard-text">name: {{ name }} </div>
      <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div> -->
      <Select style="margin-bottom: 20px;" v-on:setselect="setselect"/>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            <pie-chart v-on:setcurrentnode="setcurrentnode" v-on:setloadtree="setloadtree" :selectbuild="selectbuild"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <div class="chart-wrapper">
            <Tree :currentnode="currentnode" :loadtree="loadtree" v-on:setvisible="setvisible"/> 
          </div>
        </el-col>
      </el-row>
        <Dialog :dialogTableVisible="dialogTableVisible" :dialogData="dialogData" v-on:setvisible="setvisible"/>

 <!-- <div v-for="item in viewlist" :key="item.id">
            <el-col :xs="24" :sm="24" :md="8" :lg="8">
              <div class="chart-wrapper">
                <p>{{ item.name }}</p>
              </div>
            </el-col>
          </div> -->
        
        <el-row  :gutter="32">
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
        </el-row>
        <!-- <el-col 
        :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper" @click="expand()">
            <p>+</p>
          </div>
        </el-col> -->
        
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import constant from '../../../src/constant';

export default {
  name: 'Dashboard',
  components: {
    Select: () => import('@/components/Select/index.vue'),
    PieChart: () => import('./components/PieChart'),
    Tree: () => import('./components/Tree'),
    Dialog: () => import('./components/Dialog'),
    Pump: () => import('./components/Pump'),
    Waterlevel: () =>  import('./components/Waterlevel'),
    Elevator: () =>  import('./components/Elevator'),
  },
  computed: {
    ...mapGetters([
      'account',
      'roles'
    ]),
    noMore () {
      return this.count >= this.viewlist.length 
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  data() {
    return {
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
  mounted() {
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
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 125px);
  
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
