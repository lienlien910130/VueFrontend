<template>
    <div class="editor-container">
        <el-row  :gutter="32">
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
        ref="dialog"
        v-if="innerVisible === true"
        v-bind="dialogAttrs" 
        :formtableData="formtableData"
        :formtableconfig="formtableconfig"
        :listQueryParams="maintainlistQueryParams"
        v-on:handleDialog="handleDialog"></Dialog>
    </div>
</template>
<script>
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Device  from '@/object/device'
import DeviceType  from '@/object/deviceType'
import Contactunit from '@/object/contactunit'
import Setting from '@/object/setting'
import { MaintainManagement } from '@/object/maintainManagement'

export default {
    name:'Device',
    mixins:[sharemixin,blockmixin,dialogmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicesManage,
                resetlistQueryParams:this.resetlistQueryParams
            }
        }
    },
    data(){
        return{
            selectdevice:null,
            formtableData:[],
            formtableconfig: MaintainManagement.getDeviceOfMaintainTableConfig(),
            maintainlistQueryParams:{
                pageIndex: 1,
                pageSize: 10,
                total:0
            }
        }
    },
    methods: {
        async init(){
            this.title = 'equipment'
            this.buttonsName = [
                { name:'刪除',icon:'el-icon-delete',status:'delete'},
                { name:'編輯',icon:'el-icon-edit',status:'open'},
                { name:'維保紀錄',icon:'el-icon-document',status:'openmaintain'}
            ]
            this.tableConfig = Device.getTableConfig()
            this.dialogSelect = await DeviceType.get('devicesManagement')
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
        async resetmaintainlistQueryParams(){
            this.maintainlistQueryParams = {
                pageIndex: 1,
                pageSize: 10,
                total:0
            }
            await this.getDevicesManageMaintain()
        },
        async getBuildingDevicesManage(){
            var data = await Device.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
        },
        async getDevicesManageMaintain(){
            var data =  await this.selectdevice.getMaintain(
            this.maintainlistQueryParams)
            this.formtableData = data.result
            this.maintainlistQueryParams.total = data.totalPageCount
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
                    this.$store.dispatch('building/setbuildingdevices',await Device.get())
                    await this.resetlistQueryParams()
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
                this.dialogTitle = 'devicemaintain'
                await this.resetmaintainlistQueryParams()
                this.dialogStatus = 'devicemaintain'
                this.innerVisible = true
            }else if(index === 'exportExcel'){
                this.exportExcelData = this.blockData
                this.innerVisible = true
                this.dialogStatus = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.innerVisible = true
                this.dialogStatus = 'uploadExcel'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index === 'update' || index === 'create' || index === 'uploadExcelSave'){
                var isOk = index === 'update' ? await content.update() : 
                index === 'create' ? await content.create() : 
                await Device.postMany(content)
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('building/setbuildingdevices',await Device.get())
                    await this.getBuildingDevicesManage()
                    this.innerVisible = false
                    if(index == 'create'){
                        this.$refs.dialog.insertSuccess('deviceSelect')
                    }
                }
            }else if(index === 'selectData'){
                switch (content) {
                    case 'deviceTypeSelect':
                        this.dialogSelect = await DeviceType.get('devicesManagement')    
                        break;
                    case 'contactunitSelect':
                        this.$store.dispatch('building/setbuildingcontactunit',await Contactunit.get())    
                        break;
                    case 'setting':
                        this.$store.dispatch('building/setbuildingoptions',await Setting.getAllOption())
                        break;
                }
            }else if(index === 'clickPagination'){
                this.lacklistQueryParams = content
                await this.getDevicesManageMaintain()
            }else if(index === 'openmaintain'){
                var routeData = this.$router.resolve({ path: '/normal/maintenance',query:{ type:'maintain',obj:content.getID() } })
                window.open(routeData.href, '_blank')
            }else{
                this.innerVisible = false
            }
        },
        async changeTable(value){
            this.isTable = value
            if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
                if(typeof this.$route.params.target == 'object'){
                    await this.handleBlock('equipment','open',this.$route.params.target)
                }
            }else if(this.$route.query.type !== undefined && 
            this.$route.query.type == 'device'){
                await this.handleBlock('','empty','')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.block-wrapper {
    background: #fff;
    padding: 15px 15px;
    height: 720px;
}
</style>