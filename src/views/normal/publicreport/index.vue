<template>
        <div class="editor-container">
          <el-row :gutter="32">
            <el-form  class="report-form" :inline="inline" :model="form" label-width="auto" label-position="left">
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="chart-wrapper">
                      <el-form-item label="場所名稱">
                        <span>{{ form.name }}</span>
                      </el-form-item>
                      <el-form-item label="下次檢修時間">
                        <span class="report">{{ form.repair }}</span>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div :class="chartwrapper">
                        <el-form-item label="管理權人">
                            <div
                            v-for="(item,index) in form.owner"
                            :key="index">
                             姓名 ： {{ item.name }} ， 電話 ： {{ item.cellPhoneNumber }}
                              </div>
                        </el-form-item>
                        <el-form-item label="防火管理人">
                            <div
                            v-for="(item,index) in form.firemanager"
                            :key="index">
                             姓名 ： {{ item.name }} ， 電話 ： {{ item.cellPhoneNumber }}
                              </div>
                        </el-form-item>
                    </div>
                </el-col>
              </el-form>
          </el-row>
          <el-row :gutter="32">
              <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="wrapper">
                  <div class="block-wrapper">
                      <Block 
                      :list-query-params.sync="listQueryParams"
                      :selectSetting.sync="selectSetting"
                      v-bind="blockAttrs" 
                      v-on="blockEvent"></Block>
                  </div>
                </div>
              </el-col>
          </el-row>
          <Dialog 
            v-if="innerVisible === true"
            v-bind="dialogAttrs" 
            v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { setSelectSetting } from '@/utils/index'

export default {
    name:'',
    components:{ 
      Block: () => import('@/components/Block/index.vue'),
      Dialog:() => import('@/components/Dialog/index.vue')
    },
    data(){
        return{
            tableConfig: [
              {
                label: '申報年度',
                prop: 'declareYear',
                format:'YYYY',
                mandatory:true, message:'請選擇年度',isSelect:true,options:[],
                selectType:'dateOfYear',select:'',isSort:true
              },
              {
                label: '申報期限',
                prop: 'declareDeadline',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇期限',isSelect:true,options:[],
                selectType:'dateOfDate',select:'',isSort:true
              },
              {
                label: '申報日期',
                prop: 'declareDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇日期',isSelect:true,options:[],
                selectType:'dateOfDate',select:'',isSort:true
              },
              {
                label: '檢測日期',
                prop: 'rangeDate',
                format:'range',isSelect:false,isSort:false
                // mandatory:true, message:'請選擇日期'
              },
              {
                label: '專技人員',
                prop: 'professName',isSelect:true,options:[],
                        selectType:'',select:'',isSort:true
              },
              {
                label: '證號',
                prop: 'certificateNumber',isSelect:false,isSort:true
              },
              {
                label: '改善期限',
                prop: 'declarationImproveDate',
                format:'YYYY-MM-DD',mandatory:true, message:'請選擇日期',isSelect:true,options:[],
                        selectType:'dateOfDate',select:'',isSort:true
              },
              {
                label: '改善狀況',
                prop: 'isImproved',
                format:'tag',
                type:'boolean',
                mandatory:false, isPattern:false,trigger:'change',isSelect:true,options:[],
                selectType:'reportBool',select:'',isSort:true
              },
              {
                label: '備註',
                prop: 'note',
                format:'textarea',
                mandatory:false, isPattern:false,isSelect:false,isSort:false
              },
              {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles',isSelect:false,isSort:false
              },
              {
                label: '缺失內容',
                prop: 'missingContent',
                format:'openlacks',isSelect:false,isSort:false
              }
            ],
            lackconfig:[
              {
                label: '缺失項目',
                prop: 'lackItem',
              },
              {
                label: '缺失內容',
                prop: 'lackContent',
              },
              {
                label: '無法合格理由',
                prop: 'notPassReason'
              },
              {
                label: '法令依據',
                prop: 'accordLaws'
              },
              {
                label: '改善計劃',
                prop: 'improvePlan'
              },
              {
                label: '改善狀態',
                prop: 'status',
              }
            ],
            blockData: [],
            buttonsName:[
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'}], 
            form:{},
            files:[],
            publicSafeId:'', //公安申報id
            dialogButtonsName:[],
            dialogConfig:[],
            dialogData:[],
            dialogStatus:'',
            innerVisible:false,
            options:[],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            selectSetting:[],
            sortArray:[]
        }
    },
    watch: {
    },
    async mounted() {
      await this.getBuildingInfo()
      await this.getOptions() 
      await this.getBuildingPublicSafeReport() //公安申報
      await this.setSelectSetting()
    },
    computed: {
      ...mapGetters([
        'id',
        'buildingid'
      ]),
      inline() {
            if (this.$store.state.app.device === 'mobile') {
                return false
            } else {
                return true
            }
        },
      chartwrapper(){
        if (this.$store.state.app.device === 'mobile') {
            return 'chart-mwrapper'
        } else {
            return 'chart-wrapper'
        }
      },
      blockAttrs() {
          return {
            blockData: this.blockData,
            buttonsName:this.buttonsName,
            config: this.tableConfig,
            title:'reportPublicSafe',
            sortArray:this.sortArray
          }
      },
      blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingPublicSafeReport
            }
      },
      dialogAttrs(){
        return{
            title:'reportPublicSafe',
            visible: this.innerVisible,
            dialogData: this.dialogData,
            dialogStatus: this.dialogStatus,
            buttonsName: this.dialogButtonsName,
            dialogOptions:this.options,
            config: this.dialogConfig,
            files:this.files
        }
      }
  },
  methods: {
    async getBuildingInfo() {
      await this.$api.building.apiGetBuildingInfo().then(response => {
        let array = {
              name:response.result[0].buildingName,
              repair:'2020/10/10',
              owner:response.result[0].linkOwners,
              firemanager:response.result[0].linkFireManagers
          }
          this.form = array
      })
    },
    async getBuildingPublicSafeReport(sort = null) { 
      this.blockData = []
      var data = []
      await this.$api.report.apiGetBuildingPublicSafe().then(response => {
        this.listQueryParams.total = response.result.length
        this.origin = JSON.stringify(response.result)  
        data = response.result
        this.selectSetting.forEach(element=>{
            if(element.select !== ''){
              data = data.filter((item, index) => item[element.prop] == element.select )
            }
        })
        data = data.filter((item, index) => 
        index < this.listQueryParams.limit * this.listQueryParams.page && 
        index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
        if(sort !== '' && sort !== null){
          if(sort == 'declareDeadline' || sort == 'declareDate' || sort == 'declarationImproveDate'){
            data = data.sort(function(x,y){
              var date1 = x[sort].split(' ')
              var date2 = y[sort].split(' ')
              var _data1 = new Date(date1[0])
              var _data2 = new Date(date2[0])
              return  _data2 - _data1
            })
          }else if(sort == 'declareYear'){
            data = data.sort(function(x,y){
                var date1 = x[sort].split(' ')
                var date2 = y[sort].split(' ')
                var _data1 = new Date(date1[0]).getFullYear()
                var _data2 = new Date(date2[0]).getFullYear()
                return  _data2 - _data1
            })
          }else{
            data = data.sort(function(x,y){
                return y[sort] - x[sort]
            })
          }
        }else{
            data = data.sort(function(x,y){
                var a = x.isImproved
                var b = y.isImproved
                if(a == b){
                  return y.id - x.id
                }
                return x.isImproved - y.isImproved
            })
        }
        this.blockData = data
      })
    },
    async setSelectSetting(){
      this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
      this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
    },  
    async getPublicSafeFiles(id){ //取得公安申報的附件文檔
      this.publicSafeId = id
      this.files = []
      await this.$api.files.apiGetPublicSafeFiles(id).then(response =>{
        this.files = response.result.sort((x,y) => x.id - y.id)
      })
    },
    async getOptions(){
      await this.$api.setting.apiGetOptions('LackStatusOptions').then(response => {
        var _temp = response.result.sort((x,y) => x.id - y.id)
        this.options = _temp.map(v => {
          this.$set(v, 'value', v.id) 
          this.$set(v, 'label', v.textName) 
          this.$set(v, 'id', v.id) 
          return v
        })
      })
    },
    async getPublicSafeLack(id){ //取得缺失內容
      this.publicSafeId = id
      await this.$api.report.apiGetPublicSafeLack(id).then(response =>{
        var _temp = response.result.sort((x,y) => x.id - y.id)
        this.dialogData = _temp.map(v => {
          this.$set(v, 'isEdit', false) 
          return v
        })
      })
    },
    async handleBlock(title,index, content) { //公安申報的操作
      console.log(index,JSON.stringify(content))
      this.dialogData = []
      if(index === 'open'){
          this.dialogData.push(content)
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'update'},
          { name:'取消',type:'info',status:'cancel'}]
          this.dialogConfig = this.tableConfig
          this.innerVisible = true
          this.dialogStatus = 'update'
      }else if(index === 'delete'){
          await this.$api.report.apiDeletePublicSafeLack(content).then(async(response) => {
            this.$message('刪除成功')
            await this.getBuildingPublicSafeReport()
          })
      }else if(index === 'empty'){
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
          this.dialogConfig = this.tableConfig
          this.innerVisible = true
          this.dialogStatus = 'create'
      }else if(index === 'openfiles'){
          await this.getPublicSafeFiles(content)
          this.dialogButtonsName = []
          this.innerVisible = true
          this.dialogStatus = 'upload'
      }else if(index === 'openlacks'){
        await this.getPublicSafeLack(content)
        this.dialogButtonsName = []
        this.innerVisible = true
        this.dialogConfig = this.lackconfig
        this.dialogStatus = 'lack'
      }
    },
    async handleDialog(title ,index, content){ //Dialog相關操作
        console.log(title ,index,JSON.stringify(content))
        if(title === 'reportPublicSafe'){
          if(index === 'update'){
              await this.$api.report.apiPatchPublicSafe(content).then(async(response)  => {
                this.$message('更新成功')
                await this.getBuildingPublicSafeReport()
              })
          }else if(index === 'create'){
              await this.$api.report.apiPostPublicSafe(JSON.stringify(content)).then(async(response)  => {
                this.$message('新增成功')
                await this.getBuildingPublicSafeReport()
              })

          }else if(index === 'createfile'){
              const formData = new FormData();
                content.forEach(item => {
                  formData.append('file', item.raw)
              })
              await this.$api.files.apiPostPublicSafeFiles(this.publicSafeId,formData).then(async(response)  =>{
                  this.$message('上傳成功')
                  await this.getPublicSafeFiles(this.publicSafeId)
              })
          }else if(index === 'deletefile'){
              await this.$api.files.apiDeleteFile(content).then(async(response)  =>{
                this.$message('刪除成功')
                await this.getPublicSafeFiles(this.publicSafeId)
              })
          }
          this.innerVisible = false 
        }else{
          await this.handleLackDialog(title,index,content)
        }
    },
    async handleLackDialog(title ,index, content){ //LackDialog相關操作
        console.log(title ,index,content)
        if(index === 'create'){
          await this.$api.report.apiPostPublicSafeLack(this.publicSafeId,JSON.stringify(content)).then(response => {
            this.$message('新增成功')
          })
        }else if(index === 'update'){
          await this.$api.report.apiPatchPublicSafeLack(content).then(response => {
            this.$message('更新成功')
          })
        }else if(index === 'delete'){
          await this.$api.report.apiDeletePublicSafeLack(content).then(response => {
            this.$message('刪除成功')
          })
        }
        await this.getPublicSafeLack(this.publicSafeId)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form--inline .el-form-item{
     margin-right:40px
   }
    .chart-wrapper {
        background: #fff;
        padding: 10px 16px 0;
        margin-bottom: 32px;
        height: 110px;
        width: 100%;
        .report{
            font-size: 60px;
            color: red;
        }
    }
    .chart-mwrapper{
       background: #fff;
        padding: 10px 16px 0;
        margin-bottom: 32px;
        height: 310px;
        width: 100%;
        .report{
            font-size: 24px;
            color: red;
        }
    }
    .wrapper{
      background: #fff;
      padding: 10px;
      height: 720px;
      
      .block-wrapper {
        margin-bottom: 32px;
        height: 700px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    
    .top{
        width: 100%;
    }

</style>