<template>

        <div class="editor-container">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <div class="chart-wrapper">
                    <div class="verticalhalfdiv">
                    <div class="label">
                        <span>場所名稱 :</span>
                    </div>
                    <div class="content">
                        <span> {{ this.buildinginfo[0].buildingName }}</span> 
                    </div>
                    </div>
                    <div class="verticalhalfdiv">
                    <div class="label">
                        <span>下次保養時間 :</span>
                    </div>
                    <div class="content">
                        <span class="report"> 2021/03/20 </span> 
                    </div>
                    </div>
                </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <div class="chart-wrapper">
                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="horizontalhalfdiv">
                        <div class="label">
                        <span>管理權人 :</span>
                        </div>
                        <div class="content">
                        <div
                            v-for="(item,index) in this.buildinginfo[0].linkOwners"
                            :key="index" class="user">
                            <div style="padding-bottom:2px">
                                姓名 ： {{ item.name }}
                            </div>
                            <div>
                                電話 ： {{ item.cellPhoneNumber }}
                            </div>
                        </div>
                        </div>
                    </div>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="horizontalhalfdiv">
                        <div class="label">
                        <span>防火管理人 :</span>
                        </div>
                        <div class="content">
                        <div
                            v-for="(item,index) in this.buildinginfo[0].linkFireManagers"
                            :key="index" class="user">
                            <div style="padding-bottom:2px">
                                姓名 ： {{ item.name }}
                            </div>
                            <div>
                                電話 ： {{ item.cellPhoneNumber }}
                            </div>
                        </div> 
                        </div>
                    </div>
                    </el-col>
                </div>
                </el-col>
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
import { setSelectSetting,changeLink } from '@/utils/index'

export default {
    components:{ 
      Block: () => import('@/components/Block/index.vue'),
      Dialog:() => import('@/components/Dialog/index.vue'),
    },
    data(){
        return{
            maintainListId:'',
            maintainId:'',
            maintainFiles:[],
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
                mandatory:false, message:'請選擇',isSelect:false,isSort:false,type:'array',typemessage:''
              },
              {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles',isSelect:false,isSort:false
              },
            ],
            blockData:[],
            deviceList:[],
            options:[],
            innerVisible:false,
            dialogStatus:'',
            dialogData:[],
            dialogTitle:'',
            dialogSelect:[],
            dialogConfig:[],
            dialogButtonsName:[],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            maintainlistQueryParams:{
                page: 1,
                limit: 5,
                total: 0
            },
            maintainArray:[], //存放linkmaintain
            origin:[], //存放maintainlist
            selectSetting:[],
            sortArray:[],
            formtableData:[],
            formtableconfig:[],
            
        }
    },
    computed: {
        ...mapGetters([
            'id',
            'buildingid',
            'buildinginfo',
            'buildingdevices'
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
                config: this.tableConfig,
                title:'maintain',
                deviceList:this.deviceList,
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
                title:this.dialogTitle,
                visible: this.innerVisible,
                dialogData: this.dialogData,
                dialogStatus: this.dialogStatus,
                buttonsName: this.dialogButtonsName,
                config: this.dialogConfig,
                selectData: this.dialogSelect,
                files:this.maintainFiles,
                //表格
                formtableData: this.formtableData,
                formtableconfig:this.formtableconfig,
                listQueryParams:this.maintainlistQueryParams
            }
        }
    },
    watch: {
      buildingid:{
        handler:async function(){
            await this.init()
        },
        immediate:true
      },
      buildingdevices:{
        handler:async function(){
            this.deviceList = this.buildingdevices.map(v => {
                this.$set(v, 'value', v.id) 
                this.$set(v, 'label', v.name) 
                this.$set(v, 'id', v.id) 
                return v
            })
        },
        immediate:true
      }
    },
    methods:{
        async init(){   
            this.maintainlistQueryParams = {
                page: 1,
                limit: 5,
                total: 0
            }
            await this.saveBuildingMaintain()
            await this.getBuildingMaintain()
            await this.setSelectSetting()
        },
        async saveBuildingMaintain(){
            var data = await this.$obj.Device.getBuildingMaintainList()
            this.origin = this.$deepClone(data)
        },
        async getBuildingMaintain(sort = null){ //取得大樓維護保養
            this.blockData = []
            var data = this.$deepClone(this.origin)
            this.listQueryParams.total = data.length
            this.selectSetting.forEach(element=>{
                if(element.select !== ''){
                    data = data.filter(function(item,index){
                        if(typeof item[element.prop] !== 'object'){
                            return item[element.prop] == element.select
                        }else{
                            if(item[element.prop].length > 0){
                                return item[element.prop][0].id == element.select
                            }
                        }
                    })
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
        async handleBlock(title,index, content) { //維護保養的操作
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            if(index === 'open'){
                this.dialogTitle = 'maintainList' //為了控制dialog大小
                this.maintainListId = content.id
                this.dialogData.push(content)
                this.dialogConfig = this.tableConfig
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
                this.maintainArray = this.$deepClone(content.linkMaintains)
                var data =  this.$deepClone(this.maintainArray)
                this.maintainlistQueryParams.total = this.maintainArray.length
                this.formtableData = data.filter((item, index) => 
                    index < this.maintainlistQueryParams.limit * this.maintainlistQueryParams.page && 
                    index >= this.maintainlistQueryParams.limit * (this.maintainlistQueryParams.page - 1))
                this.formtableconfig = [
                    { label:'故障日期' , prop:'dateOfFailure',format:'YYYY-MM-DD', mandatory:false, message:'請選擇故障日期'},
                    { label:'叫修日期' , prop:'dateOfCallRepair',format:'YYYY-MM-DD',  mandatory:true,message:'請選擇叫修日期'},
                    { label:'完成時間' , prop:'completedTime',format:'YYYY-MM-DD', mandatory:false, message:'請選擇完成時間'},
                    { label:'處理進度' , prop:'processStatus',format:'MaintainProcessOptions', mandatory:false, message:'請選擇處理進度'},
                    { label:'處理內容' , prop:'processContent',format:'processContentSelect', mandatory:true, message:'請輸入內容'},
                    { label:'改善廠商' , prop:'linkContactUnits',format:'contactunitSelect', mandatory:true,message:'請選擇廠商',type:'array',typemessage:''},
                    { label:'檢修申報' , prop:'linkInspectionLacks',format:'inspectionSelect', mandatory:false,message:'請選擇申報',type:'array',typemessage:''},
                    { label:'設備' , prop:'linkDevices',format:'deviceSelect', mandatory:true,message:'請選擇設備',type:'array',typemessage:''},
                    { label:'備註' , prop:'note',format:'textarea', mandatory:false,message:'請輸入備註'},
                ]
            }else if(index === 'delete'){
                var isDelete = await this.$obj.Device.deleteMaintainList(content)
                if(isDelete){
                    this.$message('刪除成功')
                    this.listQueryParams = {
                        page: 1,
                        limit: 10,
                        total: 0
                    }
                    await this.init()
                }
            }else if(index === 'empty'){
                this.dialogTitle = 'createmaintainlist'
                this.dialogConfig = [{
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
                            }]
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'openfiles'){
                this.dialogTitle = 'uploadFiles'
                this.maintainListId = content
                this.maintainFiles = await this.$obj.Files.getBuildingMaintainListFiles(this.maintainListId)
                this.dialogButtonsName = []
                this.innerVisible = true
                this.dialogStatus = 'upload'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(title === 'maintain'){
                await this.handleMaintain(title,index,content)
            }else{
                if(index === 'create' || index === 'update'){
                    this.$delete(content,'linkMaintains')
                    var isOk = index === 'update' ? 
                    await this.$obj.Device.updateMaintainList(JSON.stringify(content)) : 
                    await this.$obj.Device.postMaintainList(JSON.stringify(content))
                    if(isOk){
                        index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                        await this.init()
                        this.innerVisible = false
                    }
                }else if(index === 'createfile'){
                    const formData = new FormData();
                        content.forEach(item => {
                        formData.append('file', item.raw)
                    })
                    isOk = await this.$obj.Files.postBuildingMaintainListFiles(this.maintainListId,formData)
                    if(isOk){
                        this.$message('上傳成功')
                        this.maintainFiles = await this.$obj.Files.getBuildingMaintainListFiles(this.maintainListId)
                    }
                }else if(index === 'deletefile'){
                    isOk = await this.$obj.Files.deleteFiles(content)
                    if(isOk){
                        this.$message('刪除成功')
                        this.maintainFiles = await this.$obj.Files.getBuildingMaintainListFiles(this.maintainListId)
                    }
                }else if(index === 'cancel'){
                    this.innerVisible = false
                }else if(index === 'clickPagination'){
                    this.maintainlistQueryParams = content
                    this.formtableData = this.maintainArray.filter((item, index) => 
                        index <  this.maintainlistQueryParams.limit *  this.maintainlistQueryParams.page && 
                        index >=  this.maintainlistQueryParams.limit * ( this.maintainlistQueryParams.page - 1))
                }
            }
        },
        async handleMaintain(title ,index, content){
            this.dialogData = []
            this.dialogTitle = 'maintain'
            this.dialogConfig = []
            if(index === 'empty'){
                this.dialogConfig = this.formtableconfig
                this.dialogSelect= [] //檢修申報下拉選單
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'createmaintain'},
                { name:'返回',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'open'){
                this.dialogConfig = this.formtableconfig    
                var temp = this.$deepClone(content)
                temp = changeLink('maintain',temp,'open')
                this.dialogData.push(temp)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'updatemaintain'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                var isDelete = await this.$obj.Device.deleteMaintain(content)
                if(isDelete){
                    this.$message('刪除成功')
                    await this.init()
                    var data = this.blockData.filter((item,index)=> item.id == this.maintainListId)[0]
                    await this.handleBlock('maintainList','open',data)
                }
            }else if(index === 'createmaintain' || index === 'updatemaintain'){
                content = changeLink('maintain',content,'')
                var isOk = index === 'createmaintain' ? 
                await this.$obj.Device.postMaintain(this.maintainListId,JSON.stringify(content)) : 
                await this.$obj.Device.updateMaintain(JSON.stringify(content))
                if(isOk){
                    index === 'updatemaintain' ? this.$message('更新成功') : this.$message('新增成功')
                    await this.init()
                    var data = this.blockData.filter((item,index)=> item.id == this.maintainListId)[0]
                    await this.handleBlock('maintainList','open',data)
                }
            }else if(index === 'cancel'){
                this.maintainlistQueryParams = {
                    page: 1,
                    limit: 5,
                    total: 0
                }
                var data = this.blockData.filter((item,index)=> item.id == this.maintainListId)[0]
                await this.handleBlock('maintainList','open',data)
            }else if(index === 'openfiles'){
                this.dialogTitle = 'maintain'
                this.maintainId = content.id
                this.maintainFiles = await this.$obj.Files.getBuildingMaintainFiles(this.maintainId)
                this.dialogButtonsName = []
                this.innerVisible = true
                this.dialogStatus = 'upload'
            }else if(index === 'createfile'){
                const formData = new FormData();
                    content.forEach(item => {
                    formData.append('file', item.raw)
                })
                isOk = await this.$obj.Files.postBuildingMaintainFiles(this.maintainListId,this.maintainId,formData)
                if(isOk){
                    this.$message('上傳成功')
                    this.maintainFiles = await this.$obj.Files.getBuildingMaintainFiles(this.maintainId)
                    console.log(JSON.stringify(this.maintainFiles))
                }
            }else if(index === 'deletefile'){
                isOk = await this.$obj.Files.deleteFiles(content)
                if(isOk){
                    this.$message('刪除成功')
                    this.maintainFiles = await this.$obj.Files.getBuildingMaintainFiles(this.maintainId)
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .chart-wrapper {
        background: #fff;
        padding: 10px 10px;
        margin-bottom: 30px;
        height: 150px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .verticalhalfdiv{
          width: 100%;
          min-height: 50%;
          .label{
            min-width: 30%;
            display:inline-block;
            text-align:center;
            font-size: 20px;
          }
          .content{
            min-width: 60%;
            display:inline-block;
            font-size: 30px;
          }
        }
        .horizontalhalfdiv{
          height: 100%;
          min-width: 50%;
          .label{
            min-width: 30%;
            display:inline-block;
            text-align:center;
            font-size: 20px;
            vertical-align:top;
          }
          .content{
            min-width: 70%;
            display:inline-block;
            font-size: 24px;
            .user{
              padding: 0px 8px 8px 8px;
            }
          }
        }
        .report{
            font-size: 50px;
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