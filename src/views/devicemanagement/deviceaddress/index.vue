<template>
    <div class="editor-container">
        <el-row  :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper" >
                    <Block 
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
            </el-col>
        </el-row>
        <!-- <Dialog 
        ref="dialog"
        v-if="innerVisible === true"
        v-bind="dialogAttrs" 
        v-on:handleDialog="handleDialog"></Dialog> -->

        <DialogForm 
        ref="dialogform"
        v-if="innerVisible === true"
        v-bind="dialogAttrs"
        v-on:handleDialog="handleDialog"></DialogForm>

        <DialogExcel 
        ref="dialogexcel"
        v-if="excelVisible === true"
        v-bind="excelAttrs"
        v-on:handleDialog="handleDialog"></DialogExcel>

    </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from '@/mixin/index'
import { Device, DeviceAddressManagement } from '@/object/index'

export default {
    name:'DeviceAddressManagement',
    mixins:[sharemixin,blockmixin,dialogmixin,excelmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDeviceAddressManagement,
                resetlistQueryParams:this.resetlistQueryParams
            }
        }
    },
    methods:{
        async init(){
            this.title = 'deviceAddressManagement'
            this.headerButtonsName = [
                { name:'多筆刪除',icon:'el-icon-delete',status:'deleteMany'},
                { name:'多筆更新',icon:'el-icon-edit',status:'updateMany'},
                { name:'多筆資料新增',icon:'el-icon-document',status:'manyempty'},
                { name:'單筆新增資料',icon:'el-icon-circle-plus-outline',status:'empty'},
                { name:'匯出檔案',icon:'el-icon-download',status:'exportExcel'},
                { name:'匯入檔案',icon:'el-icon-upload2',status:'uploadExcel'}
            ]
            this.tableConfig = DeviceAddressManagement.getTableConfig()
            await this.getBuildingDeviceAddressManagement()
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.getBuildingDeviceAddressManagement()
        },
        async getBuildingDeviceAddressManagement(){
            var data = await DeviceAddressManagement.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = DeviceAddressManagement.getTableConfig()
            this.dialogTitle = this.title
            this.dialogButtonsName = []
            if(index === 'open'){
                this.dialogConfig[0].isEdit = false
                this.dialogStatus = 'update'
                if(content.length !== undefined){ //代表不是外傳近來的
                    content.forEach(item=>{
                        this.dialogData.push(item)
                    })
                }else{
                    this.dialogData.push(content)
                }
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
            }else if(index === 'delete'){
                var isDelete = await content.delete()
                if(isDelete){
                    this.$message('刪除成功')
                    await this.resetlistQueryParams()
                }else{
                    this.$message.error('系統錯誤') 
                }
            }else if(index === 'empty'){
                this.dialogData.push( DeviceAddressManagement.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'exportExcel'){
                this.exportExcelData = this.blockData
                this.excelVisible = true
                this.excelType = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.excelVisible = true
                this.excelType = 'uploadExcel'
            }else if(index === 'manyempty'){
                this.dialogConfig = DeviceAddressManagement.getManyEmptyTableConfig()
                this.dialogData.push( DeviceAddressManagement.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'createmany'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index == 'createmany' || index == 'create' ){
                var deviceId = title == 'updateDevice' ? content.linkAssignDevices[0].getID() : null
                delete content.linkAssignDevices
                if(index == 'createmany'){
                    delete content.linkDevices
                    delete content.systemUsed
                    delete content.protocolMode
                    delete content.status
                    delete content.status
                }
                var isOk = index === 'create' ? await content.create() : 
                    await DeviceAddressManagement.batchInsert(content,deviceId)
                if(isOk){
                    this.$message('新增成功')
                    await this.getBuildingDeviceAddressManagement()
                    this.innerVisible = false
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index == 'update'){
                delete content.linkAssignDevices
                var isOk = await content.update(title == 'openDialog' ? true : false) 
                if(isOk){
                    this.$message('更新成功') 
                    await this.getBuildingDeviceAddressManagement()
                    this.innerVisible = false
                    if(title == 'openDialog'){
                        var data = await DeviceAddressManagement.getOfID(content.getID())
                        await this.handleBlock(this.title,'open',data)
                    }
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index == 'uploadExcelSave'){
                var isOk = await DeviceAddressManagement.postMany(content)
                if(isOk){
                    this.$message('新增成功')
                    await this.getBuildingDeviceAddressManagement()
                    this.excelVisible = false
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index == 'selectData'){
                switch (content) {
                    case 'deviceSelect':
                        this.$store.dispatch('building/setbuildingdevices',await Device.get())   
                        break;
                }
            }else{
                this.innerVisible = false
                this.excelVisible = false
            }
        },
        async changeTable(value){
            this.isTable = value
            if(this.$route.query.type !== undefined && 
                    this.$route.query.type == 'address' && this.$route.query.obj !== '' ){
                var data = await DeviceAddressManagement.getOfID(this.$route.query.obj )
                await this.handleBlock('','open',data)
            }
        }
    }
}
</script>
