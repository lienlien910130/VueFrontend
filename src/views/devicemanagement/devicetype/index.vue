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
        v-if="innerVisible === true"
        v-bind="dialogAttrs" 
        v-on:handleDialog="handleDialog"></Dialog>
    </div>
</template>
<script>
import { changeDeviceFullType } from '@/utils/index'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import DeviceType  from '@/object/deviceType'
import Device from '@/object/device'

export default {
    name:'Device',
    mixins:[sharemixin,blockmixin,dialogmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicesType,
                resetlistQueryParams:this.resetlistQueryParams
            }
        }
    },
    methods: {
        async init(){
            this.title = 'devicetype'
            await this.getBuildingDevicesType()
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.getBuildingDevicesType()
        },
        async getBuildingDevicesType(){
            var data = await DeviceType.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
            this.$refs.block.resetpictLoading()
            await this.getFilterItems()
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
            this.dialogButtonsName = []
            if(index === 'open'){
                this.dialogStatus = 'update'
                this.dialogData.push(content)
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
                this.dialogData.push( DeviceType.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
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
            if(index === 'update' || index === 'create'){
                var label = changeDeviceFullType(content.fullType,false,true)
                content.setTypeName(label) 
                var isOk = index === 'update' ? await content.update() : 
                await content.create()
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('building/setbuildingdevices',await Device.get())
                    await this.getBuildingDevicesType()
                }
            }else if(index === 'uploadExcelSave'){
                var isOk = await DeviceType.postMany(content)
                if(isOk){
                    this.$message('新增成功')
                    await this.getBuildingDevicesType()
                }
            }
            this.innerVisible = false
        },
        async changeTable(value){
            this.isTable = value
            this.tableConfig = DeviceType.getConfig()
            // value == true ?  this.tableConfig = DeviceType.getTableConfig() : 
            // this.tableConfig = DeviceType.getConfig()
            await this.getFilterItems()
            if(this.$route.params.target !== undefined && this.$route.params.target.length !== 0){
                if(typeof this.$route.params.target == 'object'){
                    await this.handleBlock('devicetype','open',this.$route.params.target[0])
                }
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