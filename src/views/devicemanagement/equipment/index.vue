<template>
    <div class="editor-container">
        <el-row  :gutter="32">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                    <Block 
                    :list-query-params.sync="listQueryParams"
                    :selectSetting.sync="selectSetting"
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
import { setSelectSetting } from '@/utils/index'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Device  from '@/object/device'
import DeviceType  from '@/object/deviceType'

export default {
    name:'Device',
    mixins:[sharemixin,blockmixin,dialogmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicesManage,
                
            }
        }
    },
    watch:{
        buildingid:{
            handler:async function(){
                if(this.buildingid !== undefined){
                    this.dialogSelect = await DeviceType.get('devicesManagement')
                    if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
                        if(typeof this.$route.params.target == 'object'){
                            await this.handleBlock('equipment','open',this.$route.params.target)
                        }
                    } 
                }
            },
            immediate:true
        },
    },
    methods: {
        async init(){
            this.tableConfig = Device.getConfig()
            this.title = 'equipment'
            await this.reload()
        },
        async reload(){
            await this.saveBuildingDevicesManageArray()
            await this.getBuildingDevicesManage() 
            await this.setSelectSetting()
        },
        async saveBuildingDevicesManageArray(){
            var data = await Device.get()
            this.origin = data.map(item=>{ return item.clone(item) })
        },
        async getBuildingDevicesManage(sort = null){
            this.blockData = []
            var data = this.origin.map(item=>{ return item.clone(item) })
            this.listQueryParams.total = data.length
            this.selectSetting.forEach(element=>{
                if(element.select != ''){
                    data = data.filter(function(item,index){
                        if(typeof item[element.prop] !== 'object'){
                            return item[element.prop] == element.select
                        }else{ //物件形式
                            for(let obj of item[element.prop]){
                                if(obj.id == element.select){
                                return item
                                }
                            }
                        }
                    })
                }
            })
            if(sort !== '' && sort !== null){
                if(sort == 'dateOfPurchase' || sort == 'dateOfWarranty'){
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
                    var a = x.status
                    var b = y.status
                    if(a == b){
                        return y.id - x.id
                    }
                    return y.status - x.status
                })
            }
            data = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
            this.blockData = data
        },
        async setSelectSetting(){
            this.selectSetting = await setSelectSetting(this.tableConfig,this.origin,this.dialogSelect)
            this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
            if(index === 'open'){
                this.dialogStatus = 'update'
                if(content.length>1){
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
                    this.listQueryParams = {
                        page: 1,
                        limit: 10,
                        total: 0
                    }
                    await this.reload()
                }
            }else if(index === 'empty'){
                this.dialogData.push( Device.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index !== 'cancel'){
                var isOk = index === 'update' ? await content.update() : await content.create()
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('building/setbuildingdevices',await Device.get())
                    await this.reload()
                }
            }
            this.innerVisible = false
        },
        async changeTable(value){
            this.isTable = value
            value == true ?  this.tableConfig = Device.getTableConfig() : this.tableConfig = Device.getConfig()
        }
    }
}
</script>
<style lang="scss" scoped>
.block-wrapper {
    background: #fff;
    padding: 30px 15px;
    height: 720px;
}
</style>