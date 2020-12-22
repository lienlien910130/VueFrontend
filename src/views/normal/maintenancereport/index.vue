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
                      <Block v-bind="blockAttrs" v-on:handleBlock="handleBlock"></Block>
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
                mandatory:true, message:'請選擇年度'
              },
              {
                label: '申報期限',
                prop: 'declareDeadline',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇期限'
              },
              {
                label: '申報日期',
                prop: 'declareDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇日期'
              },
              {
                label: '檢測日期',
                prop: 'rangeDate',
                format:'range',
                // mandatory:true, message:'請選擇日期'
              },
              {
                label: '專技人員',
                prop: 'professName'
              },
              {
                label: '證號',
                prop: 'certificateNumber'
              },
              {
                label: '申報結果',
                prop: 'declareResult'
              },
              {
                label: '改善期限',
                prop: 'declarationImproveDate',
                format:'YYYY-MM-DD'
              },
              {
                label: '改善狀況',
                prop: 'isImproved',
                format:'tag',
                type:'boolean',
                mandatory:false, isPattern:false,trigger:'change'
              },
              {
                label: '備註',
                prop: 'note',
                format:'textarea',
                mandatory:false, isPattern:false
              },
              {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles'
              },
              {
                label: '缺失內容',
                prop: 'missingContent',
                format:'openlacks'
              }
            ],
            lackconfig:[
              {
                label: '缺失項目',
                prop: 'lackItem',
                mandatory:true, message:'請輸入缺失項目',format:'input'
              },
              {
                label: '缺失內容',
                prop: 'lackContent',
                mandatory:true, message:'請輸入缺失內容',format:'textarea'
              },
              {
                label: '改善狀況',
                prop: 'improveContent',
                mandatory:false, format:'textarea'
              },
              {
                label: '改善狀態',
                prop: 'status',
                mandatory:false, format:'select'
              },
            ],
            blockData: [],
            buttonsName:[
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'}], 
            form:{},
            files:[],
            inspectionId:'', //檢修申報id
            lackFileId:'', //缺失檔案id
            dialogButtonsName:[],
            dialogConfig:[],
            dialogData:[],
            dialogStatus:'',
            innerVisible:false,
            options:[]
        }
    },
    watch: {
    },
    async mounted() {
      await this.getBuildingInfo()
      await this.getOptions() 
      await this.getBuildingMaintenanceReport() //檢修申報
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
            title:'reportInspectio'
          }
      },
      dialogAttrs(){
        return{
            title:'reportInspectio',
            visible: this.innerVisible,
            dialogData: this.dialogData,
            dialogStatus: this.dialogStatus,
            buttonsName: this.dialogButtonsName,
            dialogOptions:this.options,
            config: this.dialogConfig,
            files:this.files,
            specialId:this.lackFileId
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
    async getBuildingMaintenanceReport() { //取得檢修申報
      this.blockData = []
      await this.$api.report.apiGetBuildingInspection().then(response => {
        this.blockData = response.result.sort(function(x,y){
            var a = x.isImproved
            var b = y.isImproved
            if(a == b){
              return y.id - x.id
            }
            return y.isImproved - x.isImproved
          })
      })
    },  
    async getInspectionFiles(id){ //取得檢修申報的附件文檔
      this.inspectionId = id
      this.files = []
      await this.$api.files.apiGetInspectionFiles(id).then(response =>{
        this.files = response.result.sort((x,y) => x.id - y.id)
      })
    },
    async getInspectionLackFileOfId(id){ //取得import檔案id
      this.lackFileId = ''
      await this.$api.report.apiGetInspection(id).then(response =>{
          this.lackFileId = response.result[0].imported.toString()
      })
    },
    async setLackFile(fileId,cover){ //設定缺失檔案
      await this.$api.report.apiPostInspectionLackFiles(this.inspectionId,parseInt(fileId),cover).then(response =>{
        this.$message('上傳成功')
      })
      await this.getInspectionLackFileOfId(this.inspectionId)
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
    async getInspectionLack(id){ //取得缺失內容
      this.inspectionId = id
      await this.$api.report.apiGetInspectionLack(id).then(response =>{
        var _temp = response.result.sort((x,y) => x.id - y.id)
        this.dialogData = _temp.map(v => {
          this.$set(v, 'isEdit', false) 
          return v
        })
      })
    },
    async handleBlock(title,index, content) { //檢修申報的操作
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
          await this.$api.report.apiDeleteInspection(content).then(async(response) => {
            this.$message('刪除成功')
            await this.getBuildingMaintenanceReport()
          })
      }else if(index === 'empty'){
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
          this.dialogConfig = this.tableConfig
          this.innerVisible = true
          this.dialogStatus = 'create'
      }else if(index === 'openfiles'){
          await this.getInspectionFiles(content)
          await this.getInspectionLackFileOfId(content)
          this.dialogButtonsName = []
          this.innerVisible = true
          this.dialogStatus = 'upload'
      }else if(index === 'openlacks'){
        await this.getInspectionLack(content)
        this.dialogButtonsName = []
        this.innerVisible = true
        this.dialogConfig = this.lackconfig
        this.dialogStatus = 'lack'
      }
    },
    async handleDialog(title ,index, content){ //Dialog相關操作
        console.log(title ,index,content)
        if(title === 'reportInspectio'){
          if(index === 'update'){
              await this.$api.report.apiPatchInspection(JSON.stringify(content)).then(async(response)  => {
                this.$message('更新成功')
                await this.getBuildingMaintenanceReport()
              })
          }else if(index === 'create'){
              await this.$api.report.apiPostInspection(JSON.stringify(content)).then(async(response)  => {
                this.$message('新增成功')
                await this.getBuildingMaintenanceReport()
              })
          }else if(index === 'createfile'){
              const formData = new FormData();
                content.forEach(item => {
                  formData.append('file', item.raw)
              })
              await this.$api.files.apiPostInspectionFiles(this.inspectionId,formData).then(async(response)  =>{
                  this.$message('上傳成功')
                  await this.getInspectionFiles(this.inspectionId)
              })
          }else if(index === 'deletefile'){
              await this.$api.files.apiDeleteFile(content).then(async(response)  =>{
                this.$message('刪除成功')
                await this.getInspectionFiles(this.inspectionId)
              })
          }else if(index === 'changeAgain'){
              await this.setLackFile(content,true)
          }else if(index === 'changeFirst'){
              await this.setLackFile(content,false)
          }
          this.innerVisible = false 
        }else{
          await this.handleLackDialog(title,index,content)
        }
    },
    async handleLackDialog(title ,index, content){ //LackDialog相關操作
        console.log(title ,index,content)
        if(index === 'create'){
          await this.$api.report.apiPostInspectionLack(this.inspectionId,JSON.stringify(content)).then(response => {
            this.$message('新增成功')
          })
        }else if(index === 'update'){
          await this.$api.report.apiPatchInspectionLack(content).then(response => {
            this.$message('更新成功')
          })
        }else if(index === 'delete'){
          await this.$api.report.apiDeleteInspectionLack(content).then(response => {
            this.$message('刪除成功')
          })
        }
        await this.getInspectionLack(this.inspectionId)
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