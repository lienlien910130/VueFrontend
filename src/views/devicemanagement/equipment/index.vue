<template>
    <div class="editor-container">
        <el-row  :gutter="32">
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
        ref="dialog"
        v-if="innerVisible === true"
        v-bind="dialogAttrs" 
        :formtableData="formtableData"
        :formtableconfig="formtableconfig"
        :listQueryParams="maintainlistQueryParams"
        v-on:handleDialog="handleDialog"></Dialog> -->

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
import { Device, DeviceType, Contactunit, Setting, DeviceAddressManagement, MaintainManagement } from '@/object/index'

export default {
    name:'Device',
    mixins:[sharemixin,blockmixin,dialogmixin,tablemixin,excelmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicesManage,
                resetlistQueryParams:this.resetlistQueryParams
            }
        },
        tableEvent(){
            return{
                handleTableClick:this.handleTableClick,
                clickPagination:this.handleTableClick,
                searchChange:this.searchChange
            }
        }
    },
    data(){
        return{
            selectdevice:null,
            searchType:'fire'
        }
    },
    methods: {
        async init(){
            this.title = 'equipment'
            this.buttonsName = [
                { name:'刪除',icon:'el-icon-delete',status:'delete'},
                { name:'編輯',icon:'el-icon-edit',status:'open'},
                { name:'維保紀錄',icon:'el-icon-document',status:'openmaintain'},
                { name:'點位',icon:'el-icon-setting',status:'openaddress'}
            ]
            this.tableConfig = Device.getTableConfig()
            this.dialogSelect = await DeviceType.get()
            await this.getBuildingDevicesManage()
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.getBuildingDevicesManage()
        },
        async resettablelistQueryParams(isMaintain){
            this.tablelistQueryParams = {
                pageIndex: 1,
                pageSize: 10,
                total:0
            }
            if(isMaintain){
                await this.getDevicesManageMaintain()
            }else{
                await this.getDevicesAddress()
            }
        },
        async getBuildingDevicesManage(){
            var data = await Device.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async getDevicesManageMaintain(){
            var data =  await this.selectdevice.getMaintain(this.selectdevice.getID(),
            this.tablelistQueryParams)
            this.tableTitle = 'devicemaintain'
            this.isHasHeaderButtons = false
            this.dialogtableConfig= MaintainManagement.getDeviceOfMaintainTableConfig()
            this.tableData = data.result
            this.tablelistQueryParams.total = data.totalPageCount
            this.tablebuttonsName = [
                { name:'檢視',icon:'el-icon-view',status:'openmaintain'}
            ]
        },
        async getDevicesAddress(){
            var data =  await this.selectdevice.getDeviceAddresss(this.tablelistQueryParams,this.searchType)
            this.tableTitle = 'deviceaddress'
            this.isHasHeaderButtons = false
            this.dialogtableConfig= this.searchType == 'fire' ? DeviceAddressManagement.getTableConfig() : DeviceAddressManagement.getPLCTableConfig()
            this.dialogtableConfig.shift()
            this.tableData = data.result
            this.tablelistQueryParams.total = data.totalPageCount
            this.tablebuttonsName = [
                { name:'檢視',icon:'el-icon-view',status:'openaddress'}
            ]
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
            this.dialogButtonsName = []
            if(index === 'open'){
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
                    this.$store.dispatch('building/setDevice')
                    this.$socket.sendMsg('device', 'delete' , content.getID())
                    if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                        this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                    }
                    await this.getBuildingDevicesManage()
                    // await this.resetlistQueryParams()
                }else{
                    this.$message.error('系統錯誤') 
                }
            }else if(index === 'empty'){
                this.dialogData.push( Device.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'openmaintain'){
                this.selectdevice = content
                await this.resettablelistQueryParams(true)
                this.tableVisible = true
            }else if(index === 'exportExcel'){
                this.exportExcelData = this.blockData
                this.excelVisible = true
                this.excelType = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.excelVisible = true
                this.excelType = 'uploadExcel'
            }else if(index === 'openaddress'){
                 this.selectdevice = content
                await this.resettablelistQueryParams(false)
                this.tableVisible = true
            }
        },
        async handleDialog(resetLink ,index, content){ //Dialog相關操作
            console.log(index,JSON.stringify(content))
            if(index === 'update' || index === 'create' || index === 'uploadExcelSave'){
                var result = index === 'update' ? await content.update(resetLink) : 
                index === 'create' ? await content.create() : await Device.postMany(content)
                if(Object.keys(result).length !== 0){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('building/setDevice')
                    this.$socket.sendMsg('device', index, result)
                    await this.getBuildingDevicesManage()
                    this.innerVisible = false
                    this.excelVisible = false
                    // var data = await Device.get()
                    // // this.$socket.sendMsg('device','dataupdate',data)
                    // if(index == 'create'){
                    //     this.$refs.dialogform.insertSuccess('deviceSelect')
                    // }
                }else{
                    this.$message.error('網路編號不可重複') 
                }
            }
            // else if(index === 'selectData' && window.child && window.child.open){
            //     switch (content) {
            //         case 'deviceTypeSelect':
            //             this.dialogSelect = await DeviceType.get()    
            //             break;
            //         case 'contactunitSelect':
            //             this.$store.dispatch('building/setbuildingcontactunit',await Contactunit.get())    
            //             break;
            //         case 'setting':
            //             this.$store.dispatch('building/setbuildingoptions',await Setting.getAllOption())
            //             break;
            //     }
            // }
            else{
                this.innerVisible = false
                this.excelVisible = false
            }
        },
        async handleTableClick(index, content){
            console.log(index,JSON.stringify(content))
            if(index == 'openmaintain'){
                var routeData = this.$router.resolve({ path: '/normal/maintenance',query:{ type:'maintain',obj:content.getID() } })
                window.open(routeData.href, '_blank')
            }else if(index == 'openaddress'){
                var routeData = this.$router.resolve({ path: '/equipment/address',query:{ type:'address',obj:content.getID() } })
                window.open(routeData.href, '_blank')
            }else if(index == 'clickPagination'){
                this.tablelistQueryParams = content
                if(this.tableTitle == 'devicemaintain'){
                    await this.getDevicesManageMaintain()
                }else{  
                    await this.getDevicesAddress()
                }
            }else{
                this.tableVisible = false
            }
        },
        async changeTable(value){
            this.isTable = value
            if(this.$route.params.target !== undefined && this.$route.params.target.length !== 0
            && this.$route.params.type == 'open'){
                if(typeof this.$route.params.target == 'object'){
                    await this.handleBlock('equipment','open',this.$route.params.target)
                }
            }else if(this.$route.query.type !== undefined && this.$route.query.type == 'device'){
                await this.handleBlock('','empty','')
            }
        },
        async searchChange(index){
            this.searchType = index
            await this.resettablelistQueryParams(false)
        }
    }
}
</script>
