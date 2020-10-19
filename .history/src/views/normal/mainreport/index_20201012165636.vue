<template>
    <div class="mainreport-container">
        <div class="mainreport-editor-container">
            <div class="left">
              <el-form  class="report-form" :model="form" label-width="120px">
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
                            <span>{{ form.owner }}</span>
                        </el-form-item>
                        <el-form-item label="電話">
                            <span>{{ form.ownerphone }}</span>
                        </el-form-item>
                        <el-form-item label="防火管理人">
                            <span>{{ form.firemanager }}</span>
                        </el-form-item>
                        <el-form-item label="電話">
                            <span>{{ form.firemanagerphone }}</span>
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

            <Report v-bind="dialogAttrs" v-on="dialogEvent"></Report>

        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getbuInfo, 
getinspection, editinspection, creinspection, delinspection,
uploadinspection,getinspectionfiles } from '@/api/building'


export default {
    name:'',
    components:{ 
     Block: () => import('@/components/Block/index.vue'),
     Report: () => import('@/components/Dialog/report.vue')
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
                format:'range'
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
            form:{}
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
          visible: this.innerVisible,
          userdata: this.userdata,
          dialogStatus: this.dialogStatus
        }
      },
      dialogEvent(){
        return{
          subUserButton: this.handleUserOption
        }
      }
  },
  methods: {
    getbuInfo() {
      getbuInfo(this.id,this.buildingid).then(response => {
          console.log(JSON.stringify(response.result[0]))
          let array = {
              name:response.result[0].buildingName,
              repair:'2020/10/10',
              owner:response.result[0].linkOwners[0].name,
              ownerphone:response.result[0].linkOwners[0].cellPhoneNumber,
              firemanager:response.result[0].linkFireManagers[0].name,
              firemanagerphone:response.result[0].linkFireManagers[0].cellPhoneNumber
          }
          this.form = array
      })
    },
    async reportList() {
      try {
        getinspection(this.buildingid).then( response => {
           this.blockData = response.result.sort((x,y) => y.isImproved - x.isImproved)
        }).catch(error => {
          console.log(error)
        })
      } catch (error) {
        console.log(error)
      }
    },  
    handleBlockOption(index, content) {
      console.log(JSON.stringify(content))
      if (index === 'update'){
        editinspection(JSON.stringify(content)).then(response=>{
          this.$message('更新成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if(index === 'create'){
        content.class = 'ReportInspectio'
        creinspection(this.buildingid,JSON.stringify(content)).then(response=>{
          this.$message('新增成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else if(index === 'delete'){
        delinspection(content).then(response=>{
          this.$message('刪除成功')
          this.reportList()
        }).catch(error=>{
          console.log(error)
        })
      }else {
        const formData = new FormData();
        content.forEach(item => {
          formData.append('file', item.raw)
        })
        uploadbuildinginfo(this.buildingid,this.id,formData).then(respone => {
          this.$message('上傳成功')
          this.getbufiles()
        }).catch(error =>{
          console.log('error=>'+error)
        })
      }
    }
  },
}
</script>
<style lang="scss" scoped>
    
.mainreport-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 85px);
   
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