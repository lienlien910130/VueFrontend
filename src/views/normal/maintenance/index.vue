<template>
    <div class="maintain-container">
        <div class="maintain-editor-container">
            <div class="left">
              <el-form  class="report-form" :model="form" label-width="auto" :label-position="label">
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="chart-wrapper">
                      <el-form-item label="場所名稱">
                        <span>{{ form.name }}</span>
                      </el-form-item>
                      <el-form-item label="下次維護保養日期">
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
        </div>
    </div>
</template>
<script>

export default {
    components:{ 
      Block: () => import('@/components/Block/index.vue')
      
    },
    data(){
        return{
            form:{},
            tableConfig: [
              {
                label: '原因',
                prop: 'reason',
                format:'reasonselect',
                mandatory:true, message:'請選擇原因'
              },
              {
                label: '設備',
                prop: 'deviceID',
                format:'deviceselect',
                mandatory:true, message:'請選擇設備'
              },
              {
                label: '維護廠商',
                prop: 'contactUnitID',
                format:'contactunitselect',
                mandatory:true, message:'請選擇維護廠商'
              },
              {
                label: '故障日期',
                prop: 'dateOfFailure',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇故障日期'
              },
              {
                label: '叫修日期',
                prop: 'dateOfCallRepair',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇叫修日期'
              },
              {
                label: '處理進度',
                prop: 'processStatus',
                format:'processselect',
                mandatory:true, message:'請選擇處理進度'
              },
              {
                label: '處理內容',
                prop: 'processContent',
                format:'textarea',
                mandatory:true, message:'請選擇處理內容'
              },
            ],
            blockData: [],
            buttonsName: ['編輯','刪除'],
            maintaincontentoption:[],
            selectData:[],
            devicelist:[],
            processoption:[]
        }
    },
    computed: {
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
                title:'Maintain',
                selectData: this.selectData,
                maintaincontentoption:this.maintaincontentoption,
                devicelist:this.devicelist,
                processoption:this.processoption
            }
        },
        blockEvent() {
            return {
                subOpitonButton: this.handleBlockOption
            }
        }
    },
    async mounted() {
      await this.getbuInfo()
      await this.getcontactunitList()
      await this.getprocessoption()
      await this.getmaintaincontentoption()
      await this.getbuildingdevicesmanage()
      await this.getbuildingmaintain()

    },
    methods:{
        async getbuInfo() {
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
        async getbuildingmaintain(){
            this.blockData = []
            var _temp = []
            await this.$api.device.apiGetBuildingMaintains().then(response =>{
                console.log(JSON.stringify(response))
                this.blockData = response.result.sort((x,y) => y.id - x.id)
            })
        },
        async getcontactunitList(){
            this.selectData = []
            var _temp = []
            this.$api.building.apiGetContactUnit().then(response => {
              console.log(JSON.stringify(response))
              _temp = response.result.sort((x,y) => x.id - y.id)
               this.selectData = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.name) 
                    this.$set(v, 'id', v.id) 
                    return v
              })
            })
        },
        async getmaintaincontentoption(){ 
            this.maintaincontentoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('MaintainContentOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.maintaincontentoption = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.textName) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },
        async getprocessoption(){ 
            this.processoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('MaintainProcessOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.processoption = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.textName) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },
        async getbuildingdevicesmanage(){
            this.devicelist = []
            var _temp = []
            await this.$api.device.apiGetBuildingDevicesManagement().then(response =>{
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.devicelist = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.name) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },

        async handleBlockOption(index, content) { //維護保養的操作
            console.log(index,JSON.stringify(content))
            if (index === 'update'){
                this.$api.device.apiPatchMaintains(JSON.stringify(content)).then(async(response) => {
                    this.$message('更新成功')
                    await this.getbuildingmaintain()
                }).catch(error=>{
                    console.log(error)
                })
            }else if(index === 'create'){
                this.$api.device.apiPostMaintains(JSON.stringify(content)).then(async(response) => {
                    this.$message('新增成功')
                    await this.getbuildingmaintain()
                }).catch(error=>{
                    console.log(error)
                })
            }else if(index === 'delete'){
                this.$api.device.apiDeleteMaintains(content).then(async(response) => {
                    this.$message('刪除成功')
                    await this.getbuildingmaintain()
                }).catch(error=>{
                    console.log(error)
                })
            }else if(index == 'opendialog'){
              
            }
        },
    }
}
</script>
<style lang="scss" scoped>
    
.maintain-editor-container {
  padding: 20px;
  background-color: #d1e2ec;
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;
   
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

  .maintain-editor-container {
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