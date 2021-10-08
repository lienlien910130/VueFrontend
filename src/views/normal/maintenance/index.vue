<template>

        <div class="editor-container">
            <el-row :gutter="20">
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <div class="chart-wrapper">
                    <div class="verticalhalfdiv">
                    <div class="label">
                        <i class="el-icon-edit">
                            <a @click="openWindows('basic')" style="color:#66b1ff"> 場所名稱：</a>
                        </i>
                    </div>
                    <div class="content">
                        <span> {{ this.buildinginfo.getName() }}</span> 
                    </div>
                    </div>
                    <div class="verticalhalfdiv">
                    <div class="label">
                        <span> 下次維保時間：</span> 
                        <!-- <i class="el-icon-edit">
                            <a @click="openWindows('sys-Setting')" style="color:#66b1ff"> 下次申報時間：</a>
                        </i> -->
                    </div>
                    <div class="content">
                        <span class="report"> </span> 
                    </div>
                    </div>
                </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                <div class="chart-wrapper">
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                    <div class="horizontalhalfdiv">
                            <div class="label">
                            <i class="el-icon-edit">
                                <a @click="openWindows('user')" style="color:#66b1ff"> 管理權人：</a>
                            </i>
                            </div>
                            <div class="content">
                            <div
                                v-for="(item,index) in this.buildinginfo.linkOwners"
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
                      <i class="el-icon-edit">
                          <a @click="openWindows('user')" style="color:#66b1ff"> 防火管理人：</a>
                      </i>
                    </div>
                    <div class="content">
                      <div
                        v-for="(item,index) in this.buildinginfo.linkFireManagers"
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
                <div class="block-wrapper">
                    <Block 
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
              </el-col>
          </el-row>
            <!-- <Dialog 
            v-if="innerVisible === true"
            v-bind="dialogAttrs"
            :files="maintainFiles"
            :formtableData="formtableData"
            :formtableconfig="formtableconfig"
            :listQueryParams="maintainlistQueryParams"
            v-on:handleDialog="handleDialog"></Dialog> -->

            <DialogForm 
            ref="dialogform"
            v-if="innerVisible === true"
            v-bind="dialogAttrs"
            v-on:handleDialog="handleDialog"></DialogForm>

             <DialogUpload
            ref="dialogupload"
            v-if="uploadVisible === true"
            v-bind="uploadAttrs"
            v-on:handleDialog="handleDialog"></DialogUpload>

            <DialogTable 
            ref="dialogtable"
            v-if="tableVisible === true"
            v-bind="tableAttrs"
            v-on="tableEvent"></DialogTable>
            
            <DialogExcel 
            ref="dialogexcel"
            v-if="excelVisible === true"
            v-bind="excelAttrs"
            v-on:handleDialog="handleDialog"></DialogExcel>



        </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, tablemixin, excelmixin } from '@/mixin/index'
import { Files, MaintainManagementList, MaintainManagement,Setting ,Device,Contactunit } from '@/object/index'
const moment = require('moment')

export default {
    mixins:[sharemixin,blockmixin,dialogmixin,tablemixin, excelmixin],
    data(){
        return{
            maintainList:'',
            maintain:'',
            maintainArray:[], //存放linkmaintain
            isUpdate:false,
            maintainFiles:[],
            uploadVisible:false,
            //dialog額外的參數
        }
    },
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.searchAndPage,
                resetlistQueryParams:this.resetlistQueryParams,
                handleDialog:this.handleDialog,
                changeTable:this.buttonChangeTable
            }
        },
        tableEvent(){
            return{
                handleTableClick:this.handleTableClick,
                clickPagination:this.handleTableClick
            }
        },
        uploadAttrs(){
                return{
                    visible:this.uploadVisible,
                    title:this.title,
                    files:this.maintainFiles
                }
        }
    },
    methods:{
        async init(){   
            this.title = 'maintain'
            this.tableConfig = MaintainManagement.getTableConfig()
            this.tablebuttonsName = [
                { name:'刪除',icon:'el-icon-delete',status:'delete'},
                { name:'編輯',icon:'el-icon-edit',status:'open'},
                { name:'檔案',icon:'el-icon-folder-opened',status:'openfiles'}
            ]
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.searchAndPage()
        },
        async resettablelistQueryParams(){
            this.tablelistQueryParams = {
                pageIndex: 1,
                pageSize: 10,
                total:0
            }
            await this.getMaintain()
        },
        async searchAndPage(){
            if(this.isTable == true){
                this.title = 'maintain'
                this.tableConfig = MaintainManagement.getTableConfig()
                this.buttonsName = [
                    { name:'刪除',icon:'el-icon-delete',status:'delete'},
                    { name:'編輯',icon:'el-icon-edit',status:'open'},
                    { name:'檔案',icon:'el-icon-folder-opened',status:'openfiles'}
                ]
                await this.getMaintainAll()
            }else{
                this.title = 'maintainList'
                this.tableConfig = MaintainManagementList.getTableConfig()
                this.buttonsName = [
                    { name:'刪除',icon:'el-icon-delete',status:'delete'},
                    { name:'編輯',icon:'el-icon-edit',status:'open'},
                    { name:'檔案',icon:'el-icon-folder-opened',status:'openfiles'},
                    { name:'細項',icon:'el-icon-folder-opened',status:'openmaintain'}
                ]
                await this.getBuildingMaintainList()
            }
        },
        async getBuildingMaintainList(){ //取得大樓維護保養大項
            var data = await MaintainManagementList.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async getMaintainAll(){ //取得大樓所有維護保養細項
            var data = await MaintainManagement.getAllSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async getMaintain(){ //取得指定維保大項的細項
            var data = await MaintainManagement.getSearchPage(this.maintainList.getID(),
            this.tablelistQueryParams)
            this.tableTitle = 'listOfMaintain'
            this.dialogtableConfig = MaintainManagement.getTableConfig()
            this.tableData = data.result
            this.tablelistQueryParams.total = data.totalPageCount
        },
        async handleBlock(title,index, content) { //維護保養的操作
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogButtonsName = []
            if(index === 'open'){
                this.dialogTitle = 'maintainList' //為了控制dialog大小
                this.maintainList = content
                this.dialogData.push(content)
                this.dialogConfig = this.tableConfig
                //await this.getMaintain()
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                var isDelete = await content.delete()
                if(isDelete){
                    this.$message('刪除成功')
                    if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                        this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                    }
                    await this.searchAndPage()
                    // await this.resetlistQueryParams()
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'empty'){
                this.dialogTitle = 'maintainList'
                this.dialogConfig = MaintainManagementList.getCreateConfig()
                this.dialogData.push( MaintainManagementList.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'openfiles'){
                this.dialogTitle = 'uploadFiles'
                this.maintainList = content
                this.maintainFiles = await content.files()
                this.dialogButtonsName = []
                this.uploadVisible = true
            }else if(index === 'openmaintain'){
                this.maintainList = content
                await this.resettablelistQueryParams()
                this.tableVisible = true
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(title === 'maintain'){
                await this.handleMaintain(index,content)
            }else{
                if(index === 'create' || index === 'update'){
                    this.$delete(content,'linkMaintains')
                    var isOk = index === 'update' ? 
                      await content.update() : await content.create()
                    if(isOk){
                        this.innerVisible = false
                        index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                        await this.searchAndPage()
                        //await this.resetlistQueryParams()
                    }else{
                        this.$message.error('系統錯誤')
                    }
                }else if(index === 'createfile'){
                    const formData = new FormData()
                    content.forEach(item => {
                        formData.append('file', item.raw)
                    })
                    isOk = this.maintain == null ? 
                        await this.maintainList.createfiles(formData) :
                        await this.maintain.createfiles(formData)
                    if(isOk){
                        this.$message('上傳成功')
                        this.maintainFiles = this.maintain == null ? 
                            await this.maintainList.files() :
                            await this.maintain.files()
                    }else{
                        this.$message.error('系統錯誤')
                    }
                }else if(index === 'deletefile'){
                    var data = { id:content.toString() }
                    isOk = await Files.delete(data)
                    if(isOk){
                        this.$message('刪除成功')
                        this.maintainFiles = this.maintain == null ? 
                            await this.maintainList.files() :
                            await this.maintain.files()
                    }else{
                        this.$message.error('系統錯誤')
                    }
                }else if(index === 'cancel'){
                    if(this.isUpdate){
                        await this.getBuildingMaintainList()
                        this.isUpdate = false
                    }
                    this.maintain = null
                    this.innerVisible = false
                    this.uploadVisible = false
                }else if(index === 'clickPagination'){
                    this.tablelistQueryParams = content
                    await this.getMaintain()
                }
            }
        },
        async handleMaintain(index, content){
            console.log(index,content)
            this.dialogData = []
            this.dialogTitle = 'maintain'
            this.dialogConfig = MaintainManagement.getTableConfig()
            this.dialogButtonsName = []
            this.dialogSelect = []
            if(index === 'empty'){
                var lacks = await MaintainManagementList.getAllLack()
                this.dialogSelect.push(lacks)
                this.dialogButtonsName = [
                        { name:'儲存',type:'primary',status:'create'},
                        { name:'返回',type:'info',status:'cancel'}]
                if(this.isTable == true){
                    // this.dialogButtonsName.unshift( { name:'建立新的維保大項',type:'primary',status:'openempty'})
                    this.dialogConfig.unshift(
                        { label:'維護保養大項' , prop:'maintainList',format:'maintainListSelect', 
                            mandatory:true, message:'請選擇維護保養大項',
                            isHidden:false,type:'array',typemessage:'',isSearch:false,
                            isAssociate:false,isEdit:true,isUpload:false,isExport:true,isBlock:true}
                    )
                    var maintainlist = await MaintainManagementList.get()
                    this.dialogSelect.push(maintainlist)
                }
                this.dialogData.push( MaintainManagement.empty() )
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'open'){
                this.dialogSelect = new Array(await MaintainManagementList.getAllLack())
                this.dialogData.push(content)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                var isDelete = await content.delete()
                if(isDelete){
                    this.$message('刪除成功')
                    if(this.isTable) {
                        if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                            this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                        }
                        await this.searchAndPage()
                        // await this.resetlistQueryParams()    
                    }else{
                        this.isUpdate = true
                        if(this.tablelistQueryParams.pageIndex !== 1 && this.tableData.length == 1){
                            this.tablelistQueryParams.pageIndex = this.tablelistQueryParams.pageIndex-1
                        }
                        await this.getMaintain()
                        //await this.resettablelistQueryParams()
                    }
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'create' || index === 'update'){
                var isOk = index === 'update' ? await content.update() :
                this.isTable == true ? 
                await content.create(content.maintainList[0].id) : await content.create(this.maintainList.getID())
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    if(this.isTable) {
                        await this.getMaintainAll()  
                    }else{
                        this.isUpdate = true
                        await this.getMaintain()
                    }
                    this.innerVisible = false
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'cancel'){
                this.maintain = null
                this.innerVisible = false
                this.excelVisible = false
                this.uploadVisible = false
            }else if(index === 'openempty'){
                // await this.handleBlock('maintainList', 'empty' , '')
            }else if(index === 'openfiles'){
                this.maintain = content
                this.maintainFiles = await content.files()
                this.uploadVisible = true
            }else if(index === 'createfile'){
                const formData = new FormData()
                content.forEach(item => {
                    formData.append('file', item.raw)
                })
                isOk = await this.maintain.createfiles(formData)
                if(isOk){
                    this.$message('上傳成功')
                    this.maintainFiles = await this.maintain.files()
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'deletefile'){
                var data = { id:content.toString() }
                isOk = await Files.delete(data)
                if(isOk){
                    this.$message('刪除成功')
                    this.maintainFiles = await this.maintain.files()
                }else{
                 this.$message.error('系統錯誤')
                }
            }else if(index === 'exportExcel'){
                this.exportExcelData = this.isTable == true ? this.blockData : this.tableData
                this.excelVisible = true
                this.excelType = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.excelVisible = true
                this.excelType = 'uploadExcel'
            }else if(index === 'uploadExcelSave'){
                var isOk = false
                if(this.isTable){
                    var datetime = moment(new Date()).valueOf()
                    var data = {name:'檔案上傳-'+datetime ,createdDate: moment(new Date()).format('YYYY-MM-DD') }
                    var insertId = await MaintainManagementList.post(data)
                    isOk = await MaintainManagement.postMany(insertId,content)
                }else{
                    isOk = await MaintainManagement.postMany(this.maintainList.getID(),content)
                }
                if(isOk){
                    this.$message('新增成功')
                    if(this.isTable){
                        await this.getMaintainAll()
                    }else{
                        this.isUpdate = true
                        await this.getMaintain()
                    }
                    this.excelVisible = false
                }else{
                 this.$message.error('系統錯誤')
                }
            }else if(index === 'clickPagination'){
                this.tablelistQueryParams = content
                await this.getMaintain()
            }
        },
        async handleTableClick(index, content){
            if(index === 'cancel'){
                if(this.isUpdate){
                    await this.getBuildingMaintainList()
                    this.isUpdate = false
                }
                this.tableVisible = false
            }else {
                await this.handleMaintain(index,content)
            }
        },
        async buttonChangeTable(value){
            this.isTable = value
            await this.resetlistQueryParams()
        },
        async changeTable(value){
            this.isTable = value
            await this.resetlistQueryParams()
            if(this.$route.query.type !== undefined && 
                    this.$route.query.type == 'maintain' && this.$route.query.obj !== '' ){
                var data = await MaintainManagement.getOfID(this.$route.query.obj )
                await this.handleMaintain('open',data)
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