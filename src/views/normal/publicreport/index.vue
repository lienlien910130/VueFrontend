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
            lackconfig:[
              {
                label: '缺失項目',
                prop: 'lackItem'
              },
              {
                label: '缺失內容',
                prop: 'lackContent'
              },
              {
                label: '改善狀況',
                prop: 'improveContent'
              }
            ],
            blockData: [],
            buttonsName: ['編輯','刪除'],
            form:{},
            reportVisible:false,
            lackVisible:false,
            originFiles:[],
            publicSafeid:'',
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
          itemkey:this.itemkey
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
      await this.$api.report.apiGetBuildingPublicSafe().then(response => {
        this.blockData = response.result.sort((x,y) => y.isImproved - x.isImproved)
      })
    },  
    async handleBlockOption(index, content) { //區塊的操作
      console.log(index,JSON.stringify(content))
      if (index === 'update'){
        this.$api.report.apiPatchPublicSafe(JSON.stringify(content)).then(response => {
          this.$message('更新成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if(index === 'create'){
        this.$api.report.apiPostPublicSafe(JSON.stringify(content)).then(response => {
          this.$message('新增成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if(index === 'delete'){
        this.$api.report.apiDeletePublicSafe().then(response => {
          this.$message('刪除成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if (index === 'publicSafefile'){
        await this.getpublicSafefiles(content)
      }else{ // publicSafeLackfile
        await this.getpublicSafelack(content)
        await this.getpublicSafeofID(content)
        this.lackVisible = true
      }
    },
    handleReportOption(index,content){ //附件文檔的操作
      if(index == 'fileupload'){
        const formData = new FormData();
          content.forEach(item => {
            formData.append('file', item.raw)
        })
        this.$api.files.apiPostPublicSafeFiles(this.publicSafeid,formData).then(response =>{
            this.$message('上傳成功')
            this.getpublicSafefiles(this.publicSafeid)
        }).catch(error =>{
            console.log('error=>'+error)
        })
      }else if(index == 'cancel'){
        this.reportVisible = false
      }else if(index == 'delete'){
        this.$api.files.apiDeleteFile(content).then(response =>{
            this.$message('刪除成功')
            this.getpublicSafefiles(this.publicSafeid)
        }).catch(error =>{
            console.log('error=>'+error)
        })
      }
    },
    async handleLackOption(index,content){ //缺失內容的操作
      if(index == 'fileupload'){
        const formData = new FormData();
          content.forEach(item => {
            formData.append('file', item.raw)
        })
        await this.getpublicSafeofID(this.publicSafeid)
        if(this.lackfileid !== 0){
          this.$confirm('缺失內容檔案已上傳過，重新上傳會將舊有資料全部刪除，請問是否確認上傳?', '提示', {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.files.apiPostPublicSafeFiles(this.publicSafeid,formData).then(response =>{
                this.settinglackfile(response.result[0].id,true)
            }).catch(error =>{
                console.log('error=>'+error)
            })
          })
        }else{
          this.$api.files.apiPostPublicSafeFiles(this.publicSafeid,formData).then(response =>{
              this.settinglackfile(response.result[0].id,false)
          }).catch(error =>{
              console.log('error=>'+error)
          })
        }
      }else if(index == 'cancel'){
        this.lackVisible = false
      }else if (index == 'create'){
        await this.$api.report.apiPostPublicSafeLack(this.publicSafeid,content).then(response => {
            this.$message('新增成功')
        })
        await this.getpublicSafelack(this.publicSafeid)
      }else if(index == 'delete'){
        await this.$api.report.apiDeletePublicSafeLack(content).then(response => {
            this.$message('刪除成功')
        })
        await this.getpublicSafelack(this.publicSafeid)
      }else if(index == 'update'){
        await this.$api.report.apiPatchPublicSafeLack(content).then(response => {
            this.$message('更新成功')
        })
        await this.getpublicSafelack(this.publicSafeid)
      }
    },
    settinglackfile(fileid,cover){ //設定缺失檔案
      var _int = parseInt(fileid)
      this.$api.report.apiPostPublicSafeLackFiles(this.publicSafeid,_int,cover).then(response =>{
        this.$message('上傳成功')
        this.getpublicSafeofID(this.publicSafeid)
      }).catch(error =>{
        console.log('error=>'+error)
      })
    },
    async getpublicSafefiles(id){ //取得申報的附件文檔
      this.publicSafeid = id
      await this.getpublicSafeofID(this.publicSafeid)
      this.$api.files.apiGetPublicSafeFiles(id).then(response =>{
        this.originFiles = response.result.sort((x,y) => x.id - y.id)
        this.reportVisible = true
      }).catch(error =>{
        console.log('error=>'+error)
      })
    },
    async getpublicSafeofID(id){ //取得import檔案id
      await this.$api.report.apiGetPublicSafe(id).then(response =>{
        console.log('lackfileid=>'+JSON.stringify(response.result[0]))
          this.lackfileid = response.result[0].imported
      }).catch(error =>{
          console.log('error=>'+error)
      })
    },
    async getpublicSafelack(id){ //取得缺失內容
      this.publicSafeid = id
      this.tableData = []
      this.list = []
      await this.$api.report.apiGetPublicSafeLack(id).then(response =>{
        this.itemkey = Math.random()
        this.tableData = response.result.sort((x,y) => x.id - y.id)
        this.list = this.tableData.map(v => {
          this.$set(v, 'lackItem', v.lackItem) 
          this.$set(v, 'lackContent', v.lackContent) 
          this.$set(v, 'improveContent', v.improveContent) 
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