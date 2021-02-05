<template>

        <div class="editor-container">
            <div class="left">
              <el-form  class="report-form" label-width="auto" :label-position="label">
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="chart-wrapper">
                      <el-form-item label="場所名稱">
                        <span>{{ this.$obj.Building.building.buildingName }}</span>
                      </el-form-item>
                      <el-form-item label="下次維護保養日期">
                        <br><br>
                        <span class="report">xxx</span>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <div class="chart-wrapper">
                        <el-form-item label="管理權人">
                            <div
                            v-for="(item,index) in this.$obj.Building.building.linkOwners"
                            :key="index">
                             姓名 ： {{ item.name }} ， 電話 ： {{ item.cellPhoneNumber }}
                            </div>
                        </el-form-item>
                        <el-form-item label="防火管理人">
                            <div
                            v-for="(item,index) in this.$obj.Building.building.linkFireManagers"
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
                        <Block 
                        :list-query-params.sync="listQueryParams"
                        :selectSetting.sync="selectSetting"
                        v-bind="blockAttrs" 
                        v-on="blockEvent" ></Block>
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
import { setSelectSetting } from '@/utils/index'

export default {
    components:{ 
      Block: () => import('@/components/Block/index.vue'),
      Dialog:() => import('@/components/Dialog/index.vue'),
    },
    data(){
        return{
            maintainListId:'',
            maintainFiles:'',
            tableConfig: [
              {
                label: '名稱',
                prop: 'name',
                format:'MaintainContentOptions',
                mandatory:true, message:'請選擇名稱',isSelect:true,options:[],
                        selectType:'options',select:'',isSort:true
              },
              {
                label: '建立時間',
                prop: 'createdDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇建立時間',isSelect:true,options:[],
                        selectType:'dateOfDate',select:'',isSort:true
              },
              {
                label: '細項',
                prop: 'linkMaintains',
                format:'openmaintain',
                mandatory:true, message:'請選擇建立時間',isSelect:false,isSort:false
              },
              {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles',
                mandatory:true, message:'請選擇建立時間',isSelect:false,isSort:false
              }
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
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            selectSetting:[],
            sortArray:[],
            formtableData:[],
            formtableconfig:[],
            formtablebuttonsName:[]
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
                options:this.options,
                sortArray:this.sortArray
            }
        },
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingMaintain
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
                dialogOptions: this.options,
                files:this.maintainFiles,
                //表格
                formtableData: this.formtableData,
                formtableconfig:this.formtableconfig,
                formtablebuttonsName:this.formtablebuttonsName
            }
        }
    },
    async mounted() {
        await this.getOptions()
        await this.getBuildingDevicesManage()
        await this.getBuildingMaintain()
        await this.getBuildingContactunitList()
        await this.setSelectSetting()
    },
    methods:{
        async getBuildingMaintain(sort = null){ //取得大樓維護保養
            this.blockData = []
            var data = await this.$obj.Device.getBuildingMaintainList()
            this.listQueryParams.total = data.length
            this.selectSetting.forEach(element=>{
                if(element.select != ''){
                    data = data.filter((item, index) => item[element.prop] == element.select )
                }
            })
            data = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
            if(sort !== '' && sort !== null){
                if(sort == 'createdDate'){
                    data = data.sort(function(x,y){
                        var date1 = x[sort].split(' ')
                        var date2 = y[sort].split(' ')
                        var _data1 = new Date(date1[0])
                        var _data2 = new Date(date2[0])
                        return  _data2 - _data1
                    })
                }else{
                    data = data.sort(function(x,y){
                        return y[sort] - x[sort]
                    })
                }
            }else{
                data = data.sort(function(x,y){
                    return y.id - x.id
                })
            }
            this.blockData = data
        },
        async setSelectSetting(){
            this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
            this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
        },
        async getOptions(){
            var data = await this.$obj.Setting.getAllOption()
            this.options = data.map(v => {
                this.$set(v, 'value', v.id) 
                this.$set(v, 'label', v.textName) 
                this.$set(v, 'id', v.id) 
                return v
            })
        },
        async getBuildingDevicesManage(){
            this.deviceList = []
            var data = await this.$obj.Device.getBuildingDevicesManage()
            this.deviceList = data.map(v => {
                this.$set(v, 'value', v.id) 
                this.$set(v, 'label', v.name) 
                this.$set(v, 'id', v.id) 
                return v
            })
        },
        async getBuildingContactunitList(){
            await this.$obj.Building.getBuildingContactunit()
            // this.deviceList = data.map(v => {
            //     this.$set(v, 'value', v.id) 
            //     this.$set(v, 'label', v.name) 
            //     this.$set(v, 'id', v.id) 
            //     return v
            // })
        },
        async getMaintainListFiles(content){
            this.maintainFiles = []
            await this.$api.files.apiGetMaintainsListFiles(content).then(response =>{
                response.result.forEach( item => {
                    this.maintainFiles.push(item)
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
                this.formtableData = content.linkMaintains
                this.formtableconfig = [
                    { label:'故障日期' , prop:'dateOfFailure',format:'YYYY-MM-DD', mandatory:false, message:'請選擇故障日期'},
                    { label:'叫修日期' , prop:'dateOfCallRepair',format:'YYYY-MM-DD',  mandatory:true,message:'請選擇叫修日期'},
                    { label:'完成時間' , prop:'completedTime',format:'YYYY-MM-DD', mandatory:false, message:'請選擇完成時間'},
                    { label:'處理進度' , prop:'processStatus',format:'MaintainProcessOptions', mandatory:false, message:'請選擇處理進度'},
                    { label:'處理內容' , prop:'processContent',format:'', mandatory:true, message:'請輸入內容'},
                    { label:'備註' , prop:'note',format:'', mandatory:false,message:'請輸入備註'},
                    { label:'設備' , prop:'linkDevices',format:'', mandatory:false,message:'請選擇角色'},
                    { label:'改善廠商' , prop:'linkContactUnits',format:'', mandatory:false,message:'請選擇角色'},
                    { label:'檢修申報項目' , prop:'linkInspectionLacks',format:'', mandatory:false,message:'請選擇角色'}
                ]
                this.formtablebuttonsName = ['編輯','刪除']
            }else if(index === 'delete'){
                await this.$api.device.apiDeleteMaintainsList(content).then(async(response) => {
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
            }else if(index === 'openfiles'){
                await this.getMaintainListFiles(content)
                this.maintainListId = content
                this.dialogButtonsName = []
                this.dialogTitle = 'maintainList'
                this.innerVisible = true
                this.dialogStatus = 'upload'
            }else if(index === 'openmaintain'){
                this.dialogButtonsName = []
                this.dialogTitle = 'maintain'
                this.innerVisible = true
                this.dialogStatus = 'maintain'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index === 'update'){
                await this.$api.device.apiPatchMaintainsList(JSON.stringify(content)).then(async(response) => {
                    this.$message('更新成功')
                    await this.getBuildingMaintain()
                })
                 this.innerVisible = false
            }else if(index === 'create'){
                await this.$api.device.apiPostMaintainsList(JSON.stringify(content)).then(async(response) => {
                    this.$message('新增成功')
                    await this.getBuildingMaintain()
                })
                 this.innerVisible = false
            }else if(index === 'createfile'){
                const formData = new FormData()
                content.forEach(item => {
                formData.append('file', item.raw)
                })
                await this.$api.files.apiPostMaintainsListFiles(this.maintainListId,formData).then(async(response)=>{
                    this.$message('新增成功')
                    await this.getMaintainListFiles(this.maintainListId)
                })
            }else if(index == 'deletefile'){
                await this.$api.files.apiDeleteFile(content).then(async(response) =>{
                    this.$message('刪除成功')
                    await this.getMaintainListFiles(this.maintainListId)
                })
            }else if(index == 'cancel'){
                this.innerVisible = false
            }
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