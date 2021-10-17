<template>
        <div class="editor-container">
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

            <DialogForm
            ref="dialogform"
            v-if="innerVisible === true"
            v-bind="dialogAttrs"
            v-on:handleDialog="handleDialog"></DialogForm>

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
import { SelfDefenseFireMarshallingMgmt, SelfDefenseFireMarshalling, ContingencyProcess } from '@/object/index'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin,tablemixin, excelmixin],
    data(){
        return{
            marshallingList:null,
            marshalling:null,
            processArray:[]
        }
    },
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getMarshallingList,
                resetlistQueryParams:this.resetlistQueryParams,
                handleDialog:this.handleDialog
            }
        },
        tableEvent(){
            return{
                handleTableClick:this.handleTableClick,
                clickPagination:this.handleTableClick
            }
        }
    },
    methods:{
        async init(){
            this.title = 'selfDefenseFireMarshalling'
            this.tableConfig = SelfDefenseFireMarshalling.getTableConfig()
            this.buttonsName = [
                { name:'刪除',icon:'el-icon-delete',status:'delete', type:'info'},
                { name:'編輯',icon:'el-icon-edit',status:'open', type:'primary'},
                // { name:'建立流程',icon:'el-icon-folder-opened',status:'contingencyProcessMgmtCreate', type:'warning'},
                { name:'檢視流程',icon:'el-icon-folder-opened',status:'contingencyProcessMgmt', type:'danger'},
                { name:'班別',icon:'el-icon-folder-opened',status:'openMgmt', type:'warning'}
            ]
            //await this.getMarshallingList()
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.getMarshallingList()
        },
        async resettablelistQueryParams(){
            this.tablelistQueryParams = {
                pageIndex: 1,
                pageSize: 10,
                total:0
            }
            await this.getMarshallingMgmt()
        },
        async getMarshallingList(){ //取得消防編組大項
            var data = await SelfDefenseFireMarshalling.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async getMarshallingMgmt(){ //取得指定消防編組的細項
            var data = await SelfDefenseFireMarshallingMgmt.getSearchPage(this.marshallingList.getID(),
            this.tablelistQueryParams)
            this.tableTitle = 'listOfMgmt'
            this.dialogtableConfig = SelfDefenseFireMarshallingMgmt.getTableConfig()
            this.tableData = data.result
            this.tablelistQueryParams.total = data.totalPageCount
        },
        async handleBlock(title,index, content) { //消防編組大項的操作
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogButtonsName = []
            this.dialogTitle = this.title
            this.dialogConfig =  _.cloneDeep(this.tableConfig)
            this.marshallingList = content
            if(index === 'open'){
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
                    if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                        this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                    }
                    await this.getMarshallingList()
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'empty'){
                this.marshallingList = null
                this.dialogData.push( SelfDefenseFireMarshalling.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
            // else if(index === 'contingencyProcessMgmtCreate'){ //建立流程圖
            //     this.dialogConfig = ContingencyProcess.getTableConfig()
            //     this.dialogSelect = await content.getMarshallingMgmt() //選擇大項的所有班別
            //     this.dialogButtonsName = [
            //     { name:'儲存',type:'primary',status:'createProcess'},
            //     { name:'取消',type:'info',status:'cancel'}]
            //     this.innerVisible = true
            //     this.dialogStatus = 'create'
            // }
            else if(index === 'contingencyProcessMgmt'){
                var classArray = await content.getMarshallingMgmt()
                //var processArray = await SelfDefenseFireMarshalling.getProcess(this.marshallingList.getID())
                if(classArray.length){
                    this.$router.push({ path: '/process/index',query:{ l:this.marshallingList.getID() } })
                }else{
                    this.$message.error('尚未建立班別')
                }
            }else if(index === 'openMgmt'){
                this.tableheaderButtonsName = [
                    { name:'新增資料',icon:'el-icon-circle-plus-outline',status:'empty'},
                    { name:'匯入檔案',icon:'el-icon-upload2',status:'uploadExcel'}
                ]
                await this.resettablelistQueryParams()
                this.tableVisible = true
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(title === 'selfDefenseFireMarshallingMgmt'){ //消防編組細項
                await this.handleMarshallingMgmt(index,content)
            }else{ //消防編組大項
                if(index === 'create' || index === 'update'){
                    var isOk = index === 'update' ?
                      await content.update() : await content.create()
                    if(isOk){
                        this.innerVisible = false
                        index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                        await this.getMarshallingList()
                    }else{
                        this.$message.error('系統錯誤')
                    }
                }
                // else if(index === 'createProcess'){ //大項建立流程圖
                //     var process = await  ContingencyProcess.create(content)
                //     if(process !== null){
                //         this.innerVisible = false
                //         this.$message('新增成功')
                //         this.$router.push(
                //             { path: '/process/index',query:{ type:'pv', p:process, l:this.marshallingList.getID() } })
                //     }else{
                //         this.$message.error('流程圖名稱已存在，請重新輸入')
                //     }
                // }
                else{
                    this.innerVisible = false
                }
            }
        },
        async handleMarshallingMgmt(index, content){
            console.log(index,content)
            this.dialogData = []
            this.dialogTitle = 'selfDefenseFireMarshallingMgmt'
            this.dialogConfig = SelfDefenseFireMarshallingMgmt.getTableConfig()
            this.dialogButtonsName = []
            if(index === 'empty'){
                this.dialogButtonsName = [
                        { name:'儲存',type:'primary',status:'create'},
                        { name:'返回',type:'info',status:'cancel'}]
                this.dialogData.push( SelfDefenseFireMarshallingMgmt.empty() )
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'open'){
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
                    if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                        this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                    }
                    await this.getMarshallingMgmt()
                    await this.marshallingList.patchFloor()
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'create' || index === 'update'){
                var isOk = index === 'update' ?
                    await content.update(this.marshallingList.getID()) :
                    await content.create(this.marshallingList.getID())
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    await this.getMarshallingMgmt()
                    this.innerVisible = false
                    await this.marshallingList.patchFloor()
                }else{
                    this.$message.error('班別名稱已存在，請重新輸入')
                }
            }else if(index === 'cancel'){
                this.innerVisible = false
                this.excelVisible = false
            }else if(index === 'uploadExcel'){
                this.excelVisible = true
                this.excelType = 'uploadExcel'
            }else if(index === 'uploadExcelSave'){
                var result = await SelfDefenseFireMarshallingMgmt.postMany(this.marshallingList.getID(),content)
                if(result.result.length !== 0){
                    this.$message('新增成功')
                    await this.getMarshallingMgmt()
                    this.excelVisible = false
                }
                if(result.repeatDataList !== undefined){
                    var list = []
                    result.repeatDataList.forEach(item=>{
                        list.push(item.name)
                    })
                    this.$message.error('【'+list.toString()+'】名稱已存在，請重新上傳')
                }
            }else if(index === 'clickPagination'){
                this.tablelistQueryParams = content
                await this.getMarshallingMgmt()
            }
        },
        async handleTableClick(index, content){
            if(index === 'cancel'){
                this.tableVisible = false
                this.marshallingList = null
            }else {
                await this.handleMarshallingMgmt(index,content)
            }
        },
        async changeTable(value){
            this.isTable = value
            await this.resetlistQueryParams()
            // if(this.$route.query.type !== undefined &&
            //         this.$route.query.type == 'maintain' && this.$route.query.obj !== '' ){
            //     var data = await MaintainManagement.getOfID(this.$route.query.obj )
            //     await this.handleMaintain('open',data)
            // }
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
