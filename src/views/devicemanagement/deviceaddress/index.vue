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
        v-on:handleDialog="handleDialog"></Dialog>
    </div>
</template>
<script>
import DeviceAddressManagement from '@/object/deviceAddressManagement'
import Device from '@/object/device'
import sharemixin  from '@/mixin/sharemixin'
import blockmixin  from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'

export default {
    name:'DeviceAddressManagement',
    mixins:[sharemixin,blockmixin,dialogmixin],
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
                    await this.resetlistQueryParams()
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
                this.innerVisible = true
                this.dialogStatus = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.innerVisible = true
                this.dialogStatus = 'uploadExcel'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index !== 'cancel' && index !== 'selectData'){
                var isOk = index === 'update' ? await content.update() : 
                index === 'create' ? await content.create() : 
                await DeviceAddressManagement.postMany(content)
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    await this.getBuildingDeviceAddressManagement()
                    this.innerVisible = false
                }
            }else if(index == 'selectData'){
                switch (content) {
                    case 'deviceSelect':
                        this.$store.dispatch('building/setbuildingdevices',await Device.get())   
                        break;
                }
            }else{
                this.innerVisible = false
            }
        },
        async changeTable(value){
            this.isTable = value
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