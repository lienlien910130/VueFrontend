<template>
    <div class="mainreport-container">
        <div class="mainreport-editor-container">
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
                      <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
                  </div>
                </div>
              </el-col>
          </el-row>
           
          <div
            v-if="reportVisible == true">
              <Report v-bind="dialogAttrs" v-on="dialogEvent"></Report>
          </div>
          <div
            v-if="lackVisible == true">
              <Lack v-bind="lackAttrs" v-on="lackEvent"></Lack>
          </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name:'',
    components:{ 
      Block: () => import('@/components/Block/index.vue'),
      Report: () => import('@/components/Dialog/report.vue'),
      Lack:() => import('@/components/Dialog/lackcontent.vue')
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
                format:'hide-f'
              },
              {
                label: '缺失內容',
                prop: 'missingContent',
                format:'hide-l'
              }
            ],
            lackconfig:[
              {
                label: '缺失項目',
                prop: 'lackItem',
                mandatory:true, message:'請輸入缺失項目',format:'lackItem'
              },
              {
                label: '缺失內容',
                prop: 'lackContent',
                mandatory:true, message:'請輸入缺失內容',format:'lackContent'
              },
              {
                label: '改善狀況',
                prop: 'improveContent',
                mandatory:false, format:'improveContent'
              },
              {
                label: '改善狀態',
                prop: 'status',
                mandatory:false, format:'status'
              },
            ],
            blockData: [],
            buttonsName: ['編輯','刪除'],
            form:{},
            reportVisible:false,
            lackVisible:false,
            originFiles:[],
            inspectionid:'',
            lackfileid:'',
            tableData:[],
            list:[]
        }
    },
    watch: {
      buildingid: function(val){
        this.reportList()
        this.getbuInfo()
      },
    },
    mounted() {
      this.reportList()
      this.getbuInfo()
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
          buttonsName: this.buttonsName,
          config: this.tableConfig,
          title:'ReportInspectio',
          selectData: []
        }
      },
      blockEvent() {
        return {
          subOpitonButton: this.handleBlockOption
        }
      },
      dialogAttrs(){
        return{
          originFiles: this.originFiles,
          visible: this.reportVisible,
          lackfileid:this.lackfileid
        }
      },
      dialogEvent(){
        return{
          subReportButton: this.handleReportOption
        }
      },
      lackAttrs(){
        return{
          lackVisible: this.lackVisible,
          tableData:this.list,
          lackconfig:this.lackconfig,
          itemkey:this.itemkey,
          title:'ReportInspectio',
          lackfileid:this.lackfileid
        }
      },
      lackEvent(){
        return{
          subReportLackButton : this.handleLackOption
        }
      }
  },
  methods: {
    getbuInfo() {
      this.$api.building.apiGetBuildingInfo().then(response => {
        let array = {
              name:response.result[0].buildingName,
              repair:'2020/10/10',
              owner:response.result[0].linkOwners,
              firemanager:response.result[0].linkFireManagers
          }
          this.form = array
      })
    },
    async reportList() {
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
    async handleBlockOption(index, content) { //檢修申報的操作
      console.log(index,JSON.stringify(content))
      if (index === 'update'){
        this.$api.report.apiPatchInspection(JSON.stringify(content)).then(response => {
          this.$message('更新成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if(index === 'create'){
        this.$api.report.apiPostInspection(JSON.stringify(content)).then(response => {
          this.$message('新增成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if(index === 'delete'){
        this.$api.report.apiDeleteInspection().then(response => {
          this.$message('刪除成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if (index === 'ReportInspectio'){
        await this.getinspectionfiles(content)
      }else{ // ReportInspectioLack
        await this.getinspectionlack(content)
        this.lackVisible = true
      }
    },
    async handleReportOption(index,content){ //附件文檔的操作
      if(index == 'fileupload'){
        const formData = new FormData();
          content.forEach(item => {
            formData.append('file', item.raw)
        })
        await this.$api.files.apiPostInspectionFiles(this.inspectionid,formData).then(response =>{
            this.$message('上傳成功')
            this.getinspectionfiles(this.inspectionid)
        }).catch(error =>{
            console.log('error=>'+error)
        })
      }else if(index == 'cancel'){
        this.reportVisible = false
      }else if(index == 'delete'){
        this.$api.files.apiDeleteFile(content).then(response =>{
            this.$message('刪除成功')
            this.getinspectionfiles(this.inspectionid)
        }).catch(error =>{
            console.log('error=>'+error)
        })
      }
    },
    async handleLackOption(index,content){ //缺失內容的操作
    console.log(index,content)
      if(index == 'fileupload'){
        const formData = new FormData();
          content.forEach(item => {
            formData.append('file', item.raw)
        })
        await this.getinspectionofID(this.inspectionid)
        if(this.lackfileid !== 0){
          await this.$api.files.apiPostInspectionFiles(this.inspectionid,formData).then(async(response) =>{
                await this.settinglackfile(response.result[0].id,true)
            }).catch(error =>{
                console.log('error=>'+error)
            })
            await this.getinspectionlack(this.inspectionid)
        }else{
          await this.$api.files.apiPostInspectionFiles(this.inspectionid,formData).then(async(response) =>{
              await this.settinglackfile(response.result[0].id,false)
          }).catch(error =>{
              console.log('error=>'+error)
          })
          await this.getinspectionlack(this.inspectionid)
        }
      }else if(index == 'cancel'){
        this.lackVisible = false
      }else if (index == 'create'){
        await this.$api.report.apiPostInspectionLack(this.inspectionid,content).then(response => {
            this.$message('新增成功')
        })
        await this.getinspectionlack(this.inspectionid)
      }else if(index == 'delete'){
        await this.$api.report.apiDeleteInspectionLack(content).then(response => {
            this.$message('刪除成功')
        })
        await this.getinspectionlack(this.inspectionid)
      }else if(index == 'update'){
        await this.$api.report.apiPatchInspectionLack(content).then(response => {
            this.$message('更新成功')
        })
        await this.getinspectionlack(this.inspectionid)
      }
    },
    async settinglackfile(fileid,cover){ //設定缺失檔案
      var _int = parseInt(fileid)
      await this.$api.report.apiPostInspectionLackFiles(this.inspectionid,_int,cover).then(response =>{
        this.$message('上傳成功')
      }).catch(error =>{
        console.log('error=>'+error)
      })
      await this.getinspectionofID(this.inspectionid)
    },
    async getinspectionfiles(id){ //取得檢修申報的附件文檔
      this.inspectionid = id
      await this.getinspectionofID(this.inspectionid)
      this.$api.files.apiGetInspectionFiles(id).then(response =>{
        this.originFiles = response.result.sort((x,y) => x.id - y.id)
        this.reportVisible = true
      }).catch(error =>{
        console.log('error=>'+error)
      })
    },
    async getinspectionofID(id){ //取得import檔案id
      await this.$api.report.apiGetInspection(id).then(response =>{
          this.lackfileid = response.result[0].imported
      }).catch(error =>{
          console.log('error=>'+error)
      })
    },
    async getinspectionlack(id){ //取得缺失內容
      this.inspectionid = id
      this.tableData = []
      this.list = []
      await this.getinspectionofID(this.inspectionid)
      await this.$api.report.apiGetInspectionLack(id).then(response =>{
        this.itemkey = Math.random()
        this.tableData = response.result.sort((x,y) => x.id - y.id)
        console.log(JSON.stringify(response))
        this.list = this.tableData.map(v => {
          this.$set(v, 'lackItem', v.lackItem) 
          this.$set(v, 'lackContent', v.lackContent) 
          this.$set(v, 'improveContent', v.improveContent) 
          this.$set(v, 'status', v.status) 
          return v
        })
      }).catch(error =>{
            console.log('error=>'+error)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
    
.mainreport-editor-container {
  padding: 20px;
  background-color: #d1e2ec;
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;
  
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
}


</style>