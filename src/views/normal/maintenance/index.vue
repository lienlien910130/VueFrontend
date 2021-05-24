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
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                    <Block 
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
              </el-col>
          </el-row>
            <Dialog 
            v-if="innerVisible === true"
            v-bind="dialogAttrs"
            :files="maintainFiles"
            :formtableData="formtableData"
            :formtableconfig="formtableconfig"
            :listQueryParams="maintainlistQueryParams"
            v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import { MaintainManagementList, MaintainManagement }  from '@/object/maintainManagement'
import Files  from '@/object/files'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import moment from 'moment'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
    data(){
        return{
            maintainList:'',
            maintain:'',
            maintainArray:[], //存放linkmaintain
            //dialog額外的參數
            maintainFiles:[],
            formtableData:[],
            formtableconfig: MaintainManagement.getConfig(),
            maintainlistQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            }
        }
    },
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.searchAndPage,
                handleDialog:this.handleDialog,
                changeTable:this.changeTable,
                resetlistQueryParams:this.resetlistQueryParams
            }
        }
    },
    methods:{
        async init(){   
            this.title = 'maintain'
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            if(this.isTable == true){
                this.title = 'maintain'
                this.tableConfig = MaintainManagement.getConfig()
                await this.getMaintainAll()
            }else{
                this.title = 'maintainList'
                this.tableConfig = MaintainManagementList.getConfig()
                await this.getBuildingMaintainList()
            }
        },
        async resetmaintainlistQueryParams(){
            this.maintainlistQueryParams = {
                pageIndex: 1,
                pageSize: 10,
                total:0
            }
            await this.getMaintain()
        },
        async searchAndPage(){
            if(this.isTable == true){
                this.title = 'maintain'
                this.tableConfig = MaintainManagement.getConfig()
                await this.getMaintainAll()
            }else{
                this.title = 'maintainList'
                this.tableConfig = MaintainManagementList.getConfig()
                await this.getBuildingMaintainList()
            }
        },
        async getBuildingMaintainList(){ //取得大樓維護保養大項
            var data = await MaintainManagementList.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
            this.$refs.block.resetpictLoading()
        },
        async getMaintainAll(){ //取得大樓所有維護保養細項
            var data = await MaintainManagement.getAllSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
            this.$refs.block.resetpictLoading()
            await this.getFilterItems()
        },
        async getMaintain(){ //取得維保大項的細項
            var data = await MaintainManagement.getSearchPage(this.maintainList.getID(),
            this.maintainlistQueryParams)
            this.formtableData = data.result
            this.maintainlistQueryParams.total = data.totalPageCount
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
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
                await this.getMaintain()
            }else if(index === 'delete'){
                var isDelete = await content.delete()
                if(isDelete){
                    this.$message('刪除成功')
                    await this.resetlistQueryParams()
                }
            }else if(index === 'empty'){
                this.dialogTitle = 'createmaintainlist'
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
                this.innerVisible = true
                this.dialogStatus = 'upload'
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
                        await this.resetlistQueryParams()
                    }
                }else if(index === 'createfile'){
                    const formData = new FormData()
                    content.forEach(item => {
                        formData.append('file', item.raw)
                    })
                    isOk = await this.maintainList.createfiles(formData) 
                    if(isOk){
                        this.$message('上傳成功')
                        this.maintainFiles = await this.maintainList.files()
                    }
                }else if(index === 'deletefile'){
                    var data = { id:content.toString() }
                    isOk = await Files.delete(data)
                    if(isOk){
                        this.$message('刪除成功')
                        this.maintainFiles = await this.maintainList.files()
                    }
                }else if(index === 'cancel'){
                    this.innerVisible = false
                }else if(index === 'clickPagination'){
                    this.maintainlistQueryParams = content
                    await this.getMaintain()
                }else if(index === 'openempty'){
                    await this.handleBlock('maintainList', 'empty' , '')
                }
            }
        },
        async changeTable(value){
            console.log('changeTable',value)
            this.isTable = value
            await this.resetlistQueryParams()
        },
        async handleMaintain(index, content){
            this.dialogData = []
            this.dialogTitle = 'maintain'
            this.dialogButtonsName = []
            if(index === 'empty'){
                if(content !== ''){
                    this.maintainList = content
                }
                this.dialogConfig = this.formtableconfig
                this.dialogSelect = await MaintainManagementList.getAllLack()
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'createmaintain'},
                { name:'返回',type:'info',status:'cancel'}]
                this.dialogData.push( MaintainManagement.empty() )
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'tablemaintain'){
                this.dialogSelect = await MaintainManagementList.get()
                this.dialogButtonsName = [
                    { name:'建立維保大項',type:'primary',status:'openempty'},
                    { name:'儲存',type:'primary',status:'tablemaintain'},
                    { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'selectMaintain'
            }else if(index === 'open'){
                this.dialogSelect = await MaintainManagementList.getAllLack()
                this.dialogConfig = this.formtableconfig  
                this.dialogData.push(content)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'updatemaintain'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                var isDelete = await content.delete()
                if(isDelete){
                    this.$message('刪除成功')
                    await this.resetlistQueryParams()
                    if(this.isTable == false){
                        var data = this.blockData.filter((item,index)=> item.id == this.maintainList.getID())[0]
                        await this.handleBlock('maintainList','open',data)
                    }
                }
            }else if(index === 'createmaintain' || index === 'updatemaintain'){
                var isOk = index === 'createmaintain' ? 
                await content.create(this.maintainList.getID()) : await content.update()
                if(isOk){
                    index === 'updatemaintain' ? this.$message('更新成功') : this.$message('新增成功')
                }
                if(this.isTable == false){
                    await this.getBuildingMaintainList()
                    var data = this.blockData.filter((item,index)=> item.id == this.maintainList.getID())[0]
                    await this.handleBlock('maintainList','open',data)
                }else{
                    await this.getMaintainAll()
                    this.innerVisible = false
                }
            }else if(index === 'cancel'){
                    if(this.isTable == false){
                        this.maintainlistQueryParams = {
                            page: 1,
                            limit: 10,
                            total: 0
                        }
                        var data = this.blockData.filter((item,index)=> item.id == this.maintainList.getID())[0]
                        await this.handleBlock('maintainList','open',data)
                    }else{
                        this.innerVisible = false
                    }
            }else if(index === 'openfiles'){
                    this.dialogTitle = 'maintain'
                    this.maintain = content
                    this.maintainFiles = await content.files()
                    this.dialogButtonsName = []
                    this.innerVisible = true
                    this.dialogStatus = 'upload'
            }else if(index === 'createfile'){
                const formData = new FormData()
                content.forEach(item => {
                    formData.append('file', item.raw)
                })
                isOk = await this.maintain.createfiles(formData)
                if(isOk){
                    this.$message('上傳成功')
                    this.maintainFiles = await this.maintain.files()
                }
            }else if(index === 'deletefile'){
                var data = { id:content.toString() }
                isOk = await Files.delete(data)
                if(isOk){
                    this.$message('刪除成功')
                    this.maintainFiles = await this.maintain.files()
                }
            }else if(index === 'exportExcel'){
                this.exportExcelData = this.blockData
                this.dialogConfig = this.formtableconfig 
                this.innerVisible = true
                this.dialogStatus = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.innerVisible = true
                this.dialogStatus = 'uploadExcel'
            }else if(index === 'uploadExcelSave'){
                var datetime = moment(new Date()).valueOf()
                var data = {name:'檔案上傳-'+datetime ,createdDate: moment(new Date()).format('YYYY-MM-DD') }
                var insertId = await MaintainManagementList.post(data)
                var isOk = await MaintainManagement.postMany(insertId,content)
                if(isOk){
                    this.$message('新增成功')
                    await this.getMaintainAll()
                    this.innerVisible = false
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
    .block-wrapper {
        background: #fff;
        padding: 30px 15px;
        height: 720px;
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