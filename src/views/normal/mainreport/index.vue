<template>
    <div class="mainreport-container">
        <div class="mainreport-editor-container">
            <div class="left">
              <el-form  class="report-form" :model="form" label-width="auto" :label-position="label">
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="chart-wrapper">
                      <el-form-item label="場所名稱">
                        <span>{{ form.name }}</span>
                      </el-form-item>
                      <el-form-item label="下次檢修時間">
                        <br><br>
                        <span class="report">{{ form.repair }}</span>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="chart-wrapper">
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
                
                
            </div>

            <div class="right">
                 <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="chart-wrapper">
                        <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
                    </div>
                </el-col>
            </div>
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
                mandatory:true, message:'請選擇日期'
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
                label: '申報改善期限',
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
            blockData: [],
            buttonsName: ['編輯','刪除'],
            form:{},
            reportVisible:false,
            lackVisible:false,
            originFiles:[],
            inspectionid:'',
            imported:false
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
      label() {
            if (this.$store.state.app.device === 'mobile') {
                return 'top'
            } else {
                return 'left'
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
          visible: this.reportVisible
        }
      },
      dialogEvent(){
        return{
          subReportButton: this.handleReportOption
        }
      },
      lackAttrs(){
        return{
          imported: this.imported,
          lackVisible: this.lackVisible,
          inspectionid : this.inspectionid,
          tableData:this.tableData
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
      await this.$api.report.apiGetInspection().then(response => {
        this.blockData = response.result.sort((x,y) => y.isImproved - x.isImproved)
      })
    },  
    handleBlockOption(index, content) {
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
      }else if (index === 'inspectionfile'){
        this.getinspectionfiles(content)
      }else{ // inspectionLackfile
        this.getinspectionlack(content)
        
      }
    },
    handleReportOption(index,content){
      if(index == 'fileupload'){
        const formData = new FormData();
          content.forEach(item => {
            formData.append('file', item.raw)
        })
        this.$api.files.apiPostInspectionFiles(this.inspectionid,formData).then(response =>{
            this.$message('上傳成功')
            this.getinspectionfiles(this.inspectionid)
        }).catch(error =>{
            console.log('error=>'+error)
        })
      }else if(index == 'cancel'){
        this.reportVisible = false
      }
    },
    handleLackOption(index,content){
      if(index == 'fileupload'){
        const formData = new FormData();
          content.forEach(item => {
            formData.append('file', item.raw)
        })
        this.$api.files.apiPostInspectionLackFiles(this.inspectionid,formData).then(response =>{
            this.$message('上傳成功')
        }).catch(error =>{
            console.log('error=>'+error)
        })
      }else if(index == 'cancel'){
        this.lackVisible = false
      }else if (index == 'create'){
        this.lackVisible = false
        this.$api.report.apiPostInspectionLack(this.inspectionid,content).then(response => {
            this.$message('新增成功')
            this.getinspectionlack(this.inspectionid)
        })
      }else if(index == 'delete'){
        this.lackVisible = false
        this.$api.report.apiDeleteInspectionLack(this.inspectionid).then(response => {
            this.$message('刪除成功')
            this.getinspectionlack(this.inspectionid)
        })
      }else if(index == 'update'){
        this.lackVisible = false
        this.$api.report.apiPatchInspectionLack(content).then(response => {
            this.$message('更新成功')
            this.getinspectionlack(this.inspectionid)
        })
      }
        
    },
    getinspectionfiles(id){
      this.inspectionid = id
      this.$api.files.apiGetInspectionFiles(id).then(response =>{
        this.originFiles = response.result
        this.reportVisible = true
      }).catch(error =>{
        console.log('error=>'+error)
      })
    },
    getinspectionlack(id){
      this.inspectionid = id
      this.$api.report.apiGetInspectionLack(id).then(response =>{
          this.tableData = response.result
          this.lackVisible = true
      }).catch(error =>{
            console.log('error=>'+error)
      })
    },
  },
}
</script>
<style lang="scss" scoped>
    
.mainreport-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 125px);
   
    .chart-wrapper {
        background: #fff;
        padding: 5px 16px 0;
        margin-bottom: 32px;
        height: 280px;
        overflow-x:hidden;
        overflow-y:auto;
        width: 100%;
    }
    .top{
        width: 100%;
    }
    .left {
        float: left;
        width: 520px;
    }
    .right {
        overflow: hidden;
        padding-left: 32px;
        .chart-wrapper{
            height: 700px;
        }
    }
    .report{
        font-size: 70px;
        color: red;
    }
}


@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }

  .mainreport-editor-container {
    .left{
      float: none;
      width: 100%;
    }
    .right{
      float: none;
      width: 100%;
      padding-left:0px;
    }

  }
  
  
}

</style>