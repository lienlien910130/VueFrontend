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
import { DeviceAddressManagement } from '@/object/index'

export default {
    name:'DeviceAddressManagement',
    mixins:[sharemixin,blockmixin,dialogmixin,excelmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicePLCAddressManagement,
                resetlistQueryParams:this.resetlistQueryParams
            }
        }
    },
    methods:{
        async init(){
            this.title = 'devicePLCAddressManagement'
            this.headerButtonsName = [
                { name:'多筆刪除',icon:'el-icon-delete',status:'deleteMany'},
                { name:'設定樓層',icon:'el-icon-position',status:'setfloors'},
                { name:'多筆更新',icon:'el-icon-edit',status:'updateMany'},
                { name:'多筆新增',icon:'el-icon-document',status:'manyempty'},
                { name:'單筆新增',icon:'el-icon-circle-plus-outline',status:'empty'},
                { name:'匯出檔案',icon:'el-icon-download',status:'exportExcel'},
                // { name:'匯入檔案',icon:'el-icon-upload2',status:'uploadExcel'}
            ]
            this.tableConfig = DeviceAddressManagement.getPLCTableConfig()
            //await this.getBuildingDevicePLCAddressManagement()
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex:1,
                pageSize:12,
                total:0,
                internet : this.listQueryParams.internet
            }
            await this.getBuildingDevicePLCAddressManagement()
        },
        async getBuildingDevicePLCAddressManagement(){
            var data = await DeviceAddressManagement.getSearchPage(this.listQueryParams,true)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = _.cloneDeep(DeviceAddressManagement.getPLCTableConfig())
            this.dialogTitle = this.title
            this.dialogButtonsName = []
            if(index === 'open'){
                 this.dialogConfig.shift()
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
                var isDelete = await content.delete(true)
                if(isDelete){
                    this.$message('刪除成功')
                    if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                        this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                    }
                    this.$socket.sendMsg('deviceAddress', index, content.getID())
                    await this.getBuildingDevicePLCAddressManagement()
                    // await this.resetlistQueryParams()
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
                this.dialogConfig[0].label = 'PLC'
                this.dialogConfig[0].format = 'assignPLCDeviceSelect'
                this.dialogData.push( DeviceAddressManagement.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'createmany'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'setfloors'){
                var array = []
                array.push(this.dialogConfig[1])
                this.dialogConfig = array
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'floorsupdate'},
                { name:'取消',type:'info',status:'cancelfloor'}]
                this.dialogStatus = 'update'
                this.innerVisible = true
                this.selectArray = _.cloneDeep(content)
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index == 'createmany' || index == 'create' ){
                var deviceId = content.linkAssignDevices[0].getID()
                //delete content.linkAssignDevices
                if(index == 'createmany'){
                    delete content.linkDevices
                    delete content.systemUsed
                    delete content.status
                }
                var result = index === 'create' ? await content.create(deviceId,true) : 
                    await DeviceAddressManagement.batchInsert(deviceId,content,true)
                if(Object.keys(result).length !== 0 || result == true){
                    this.$message('新增成功')
                    this.$socket.sendMsg('deviceAddress', index, result)
                    await this.getBuildingDevicePLCAddressManagement()
                    this.innerVisible = false
                }else{
                     this.$message.error('點位已存在，請重新輸入')
                }
            }else if(index == 'update'){
                delete content.linkAssignDevices
                var result = await content.update(false,true) 
                if(Object.keys(result).length !== 0){
                    this.$message('更新成功') 
                    this.$socket.sendMsg('deviceAddress', index, result)
                    await this.getBuildingDevicePLCAddressManagement()
                    this.innerVisible = false
                    // if(title == 'openDialog'){
                    //     this.$store.dispatch('building/setDevice')
                    //     var data = await DeviceAddressManagement.getOfID(content.getID(),true)
                    //     await this.handleBlock(this.title,'open',data)
                    // }
                }else{
                    this.$message.error('點位已存在，請重新輸入')
                }
            }else if(index == 'floorsupdate'){
                var updateData = []
                this.selectArray.forEach(item=>{
                    updateData.push({
                        id:item.id,
                        floorsId:content.floorsId
                    })
                })
                var result = await DeviceAddressManagement.updateMany(updateData,true)
                if(Object.keys(result).length !== 0){
                    this.$message('更新成功') 
                    this.$socket.sendMsg('deviceAddress', index, result)
                    await this.getBuildingDevicePLCAddressManagement()
                    this.innerVisible = false
                    this.$refs.block.clearSelectArray()
                }else{
                    this.$message.error('樓層更新錯誤')
                }
            }else{
                this.innerVisible = false
                this.excelVisible = false
                this.$refs.block.clearSelectArray()
            }
        },
        async changeTable(value){
            this.isTable = value
            if(this.$route.query.type !== undefined && 
                    this.$route.query.type == 'plc' && this.$route.query.obj !== '' ){
                var data = await DeviceAddressManagement.getOfID(this.$route.query.obj ,true)
                await this.handleBlock('','open',data)
            }
        }
    }
}
</script>
