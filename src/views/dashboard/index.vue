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
            設備即時訊息
          </div>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            <ListDiv
            :list-query-params.sync="maintainlistQueryParams"
            v-bind="maintainAttrs"
            v-on="maintainEvent"
            ></ListDiv>
          </div>
        </el-col> -->
      </el-row>
      <PanelGroup></PanelGroup>
      <el-row :gutter="32">

        <!-- <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            <ListDiv
            :list-query-params.sync="inspectionlistQueryParams"
            v-bind="inspectionAttrs"
            v-on="inspectionEvent"
            ></ListDiv>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8">
          <div class="chart-wrapper">
            <ListDiv
            :list-query-params.sync="publicSafelistQueryParams"
            v-bind="publicSafeAttrs"
            v-on="publicSafeEvent"
            ></ListDiv>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="8">
          <div class="chart-wrapper">
            設備即時狀況
          </div>
        </el-col> -->
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
import Inspection from '@/object/inspection'
import PublicSafe from '@/object/publicSafe'
import moment from 'moment'

export default {
  name: 'Dashboard',
  components: {
    PieChart: () => import('./components/PieChart'),
    Tree: () => import('./components/Tree'),
    Dialog: () => import('./components/Dialog'),
    Pump: () => import('./components/Pump'),
    Waterlevel: () =>  import('./components/Waterlevel'),
    Elevator: () =>  import('./components/Elevator'),
    ListDiv: () => import('./components/ListDiv'),
    PanelGroup: () => import('./components/PanelGroup')
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
    maintainAttrs(){
      return {
        title:'maintain',
        list:this.maintainlist
      }
    },
    maintainEvent(){
      return {
        clickPagination:this.getMaintain,
        handleList:this.handleList
      }
    },
    inspectionAttrs(){
      return {
        title:'inspection',
        list:this.inspectionlist
      }
    },
    inspectionEvent(){
      return {
        clickPagination:this.getInspection,
        handleList:this.handleList
      }
    },
    publicSafeAttrs(){
      return {
        title:'publicSafe',
        list:this.publicSafelist
      }
    },
    publicSafeEvent(){
      return {
        clickPagination:this.getPublicSafe,
        handleList:this.handleList
      }
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
    buildingoptions:{
      handler:async function(){
        if(this.buildingoptions.length !== 0){
          await this.getBuildingDevicesManage()
        }
      },
      immediate:true
    }
  },
  data() {
    return {
      deviceData:[],
      deviceGroup:[],
      loading: false,
      count: 9,
      viewlist: constant.INDEX_VIEW_NINE,
      currentNode: '',
      maintainlist:[],
      maintainlistQueryParams:{ //故障日期不是null 叫修日期null
        dateOfFailure:'{IsNotNull}',
        dateOfCallRepair:'{IsNull}',
        pageIndex: 1,
        pageSize: 10,
        total:0
      },
      inspectionlist:[],
      inspectionlistQueryParams:{ //下次檢查日期&未改善
        nextInspectionDate:'{IsNotNull}',
        isImproved:false,
        pageIndex: 1,
        pageSize: 10,
        total:0
      },
      publicSafelist:[],
      publicSafelistQueryParams:{ //下次檢查日期&未改善
        nextInspectionDate:'{IsNotNull}',
        isImproved:false,
        pageIndex: 1,
        pageSize: 10,
        total:0
      }
    }
  },
  methods: {
    async init(){   
      // await this.getMaintain()
      // await this.getInspection()
      // await this.getPublicSafe()
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
      this.maintainlist = []
      var data = await MaintainManagement.getAllSearchPage(this.maintainlistQueryParams)
      this.maintainlist = data.result
      this.maintainlistQueryParams.total = data.totalPageCount
    },
    async getInspection(){ //取得檢修申報 下次檢查日期
      this.inspectionlist = []
      var data = await Inspection.getSearchPage(this.inspectionlistQueryParams)
      this.inspectionlist = data.result.sort(function(x,y){
        var _data1 = new Date(x.nextInspectionDate)
        var _data2 = new Date(y.nextInspectionDate)
        return  _data2 - _data1
      })
      this.inspectionlistQueryParams.total = data.totalPageCount
    },
    async getPublicSafe(){ //取得公安申報 下次檢查日期
      this.publicSafelist = []
      var data = await PublicSafe.getSearchPage(this.publicSafelistQueryParams)
      this.publicSafelist = data.result.sort(function(x,y){
        var _data1 = new Date(x.nextInspectionDate)
        var _data2 = new Date(y.nextInspectionDate)
        return  _data2 - _data1
      })
      this.publicSafelistQueryParams.total = data.totalPageCount
    },
    async handleList(title,item){
      var config = title == 'maintain' ? MaintainManagement.getTableConfig() :
          title == 'inspection' ? Inspection.getTableConfig() : 
          PublicSafe.getTableConfig()
      var titlename =  title == 'maintain' ? '維護保養' : 
          title == 'inspection' ? '檢修申報': '公安申報'
      var keys = Object.keys(item)
      var array = []
      var newDatas = []
      const h = this.$createElement
      const bigData = []
      keys.forEach(key=>{
        var i = config.filter((obj)=>{ return obj.prop == key })
        if(i.length !== 0){
          var value = item[key]
          if(i[0].format == 'YYYY-MM-DD' || i[0].format == 'YYYY'){
            value = moment(item[key]).format(i[0].format)
          }else if(i[0].format == 'deviceSelect'){
            value = item.getDevicesName()
          }else if(i[0].format == 'inspectionSelect'){
            value = item.getInspectionLackName()
          }else if(i[0].format == 'contactunitSelect'){
            value = item.getContactUnitsName()  
          }else if(i[0].format == 'MaintainProcessOptions' || 
          i[0].format == 'MaintainContentOptions'){
            let _array = this.buildingoptions.filter((item, index) => 
              item.id == item[key] 
            )
            value = _array.length !== 0 ? _array[0].textName : ''
          }else if(i[0].format =='improvedBoolean'){
            value = item[key] == true ? '已改善' : '未改善'
          }else if(i[0].format == 'openreportlack' ){
            if(value !== null && value.length){
              var doneobj = this.buildingoptions.filter(item=>
              item.classType == 'LackStatusOptions' 
              && item.textName == '已改善' && item.value == 'system')
              var doneid = doneobj.length !== 0 ? doneobj[0].id : 0
              var done = value.filter(item => item.getStatus() == doneid)
              value =  done.length.toString()+'/'+(value.length - done.length).toString()
            }else{
              value = "0/0"
            }
          }else if(i[0].format == 'openmaintain'){
            if(value !== null && value.length){
              var doneobj = this.buildingoptions.filter(item=>
              item.classType == 'MaintainProcessOptions' 
              && item.textName == '已保養' && item.value == 'system')
              var doneid = doneobj.length !== 0 ? doneobj[0].id : 0
              var done = value.filter(item => item.getProcessStatus() == doneid)
              value =  done.length.toString()+'/'+(value.length - done.length).toString()
            }else{
              value = "0/0"
            }
          }
          array.push({
            label:i[0].label,
            value:value
          })
        }
      })
      array.forEach(obj=>{
        newDatas.push(
          h('p',{ style: 'width:100%' },[
          h('span',{ style: 'width:40%;display:inline-block;vertical-align:top' },obj.label),
          h('span',{ style: 'width:60%;display:inline-block;vertical-align:top' },obj.value)
        ]))
      })
      bigData.push( h('div', {style:'border:1px solid;padding:10px;margin-bottom:5px'},newDatas))
      this.$msgbox({
        title: titlename,
        message:  h('div', {style:'max-height:500px;overflow-x:hidden;overflow-y:auto;'}, bigData) ,
        showCancelButton: true,
        distinguishCancelAndClose: true,
        confirmButtonText: '編輯',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            done()
            switch(title){
              case 'maintain':
                this.$router.push({ name: 'maintainManagement', params: { target: item }})
                break;
              case 'inspection':
                this.$router.push({ name: 'ReportInspection', params: { type:'open', target: item }})
                break;
              case 'publicSafe':
                this.$router.push({ name: 'ReportPublicSafe', params: { target: item }})
                break;
            }
          } else {
            done()
          }
        }}).then(action => {
          done()
        }).catch(()=>{})
    },
    //圓餅圖
    handleChartClick(value){
      this.currentNode = value
    },
    //樹
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


.infinite-list-wrapper {
    height:1000px; // 1. 指定高度
	  overflow: auto; // 2. 内容超过指定高度 出现滚动条
	  width: 100%;
}

.list {
    width: 100%;
    height: 300px;
    padding-top: 10px;
    overflow-x:hidden;
    overflow-y:auto;
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
