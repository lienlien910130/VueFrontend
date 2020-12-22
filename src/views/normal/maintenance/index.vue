<template>

        <div class="editor-container">
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
                        <Block v-bind="blockAttrs" v-on:handleBlock="handleBlock" ></Block>
                    </div>
                </el-col>
            </div>
            <Dialog 
            v-if="innerVisible === true"
            v-bind="dialogAttrs" 
            v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>

export default {
    components:{ 
      Block: () => import('@/components/Block/index.vue'),
      Dialog:() => import('@/components/Dialog/index.vue'),
    },
    data(){
        return{
            form:{},
            tableConfig: [
              {
                label: '原因',
                prop: 'reason',
                format:'MaintainContentOptions',
                mandatory:true, message:'請選擇原因'
              },
              {
                label: '設備',
                prop: 'deviceID',
                format:'deviceSelect',
                mandatory:true, message:'請選擇設備'
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
                format:'MaintainProcessOptions',
                mandatory:true, message:'請選擇處理進度'
              },
              {
                label: '處理內容',
                prop: 'processContent',
                format:'textarea',
                mandatory:true, message:'請選擇處理內容'
              },
            ],
            buttonsName:[
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'}], 
            blockData:[],
            deviceList:[],
            options:[],
            innerVisible:false,
            dialogStatus:'',
            dialogData:[],
            dialogButtonsName:[],
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
                buttonsName:this.buttonsName,
                config: this.tableConfig,
                title:'maintain',
                deviceList:this.deviceList,
                options:this.options
            }
        },
        dialogAttrs(){
            return{
                title:'maintain',
                visible: this.innerVisible,
                dialogData: this.dialogData,
                dialogStatus: this.dialogStatus,
                buttonsName: this.dialogButtonsName,
                config: this.tableConfig,
                selectData: this.deviceList,
                dialogOptions: this.options
            }
        }
    },
    async mounted() {
        await this.getBuildingInfo()
        await this.getOptions()
        await this.getBuildingDevicesManage()
        await this.getBuildingMaintain()
    },
    methods:{
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
        async getBuildingMaintain(){ //取得大樓維護保養
            this.blockData = []
            var _temp = []
            await this.$api.device.apiGetBuildingMaintains().then(response =>{
                console.log(JSON.stringify(response))
                this.blockData = response.result.sort((x,y) => y.id - x.id)
            })
        },
        async getOptions(){
            this.options = []
            await this.$api.setting.apiGetBuildingOptions().then(response => {
                var _temp = response.result.sort((x,y) => x.id - y.id)
                this.options = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.textName) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },
        async getBuildingDevicesManage(){
            this.deviceList = []
            var _temp = []
            await this.$api.device.apiGetBuildingDevicesManagement().then(response =>{
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.deviceList = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.name) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        },
        async handleBlock(title,index, content) { //維護保養的操作
            console.log(index,JSON.stringify(content))
            this.dialogData = []
            if(index === 'open'){
                this.dialogData.push(content)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                await this.$api.device.apiDeleteMaintains(content).then(async(response) => {
                    this.$message('刪除成功')
                    await this.getBuildingMaintain()
                })
            }
            else if(index === 'empty'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index === 'update'){
                await this.$api.device.apiPatchMaintains(JSON.stringify(content)).then(async(response) => {
                    this.$message('更新成功')
                    await this.getBuildingMaintain()
                })
            }else if(index === 'create'){
                await this.$api.device.apiPostMaintains(JSON.stringify(content)).then(async(response) => {
                    this.$message('新增成功')
                    await this.getBuildingMaintain()
                })
            }
            this.innerVisible = false
        },
    }
}
</script>
<style lang="scss" scoped>
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
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
</style>