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
import DeviceType  from '@/object/deviceType'

export default {
    name:'Device',
    mixins:[sharemixin,blockmixin,dialogmixin],
    computed:{
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingDevicesType
            }
        }
    },
    watch:{
        buildingid:{
            handler:async function(){
                if(this.buildingid !== undefined){
                    if(this.$route.params.target !== undefined && this.$route.params.target.length !== 0){
                        console.log(this.$route.params.target)
                        let _array = this.origin.filter((item, index) => 
                            item.id == this.$route.params.target[0].id
                        )
                        await this.handleBlock('devicetype','open',_array[0])
                    } 
                }
            },
            immediate:true
        },
    },
    methods: {
        async init(){
            this.tableConfig = DeviceType.getConfig()
            this.title = 'devicetype'
            await this.reload()
        },
        async reload(){
            await this.saveBuildingDevicesTypeArray()
            await this.getBuildingDevicesType() //大樓的所有設備類型
            await this.setSelectSetting()
        },
        async saveBuildingDevicesTypeArray(){
            var data = await DeviceType.get('deviceTypesManagement')
            this.origin = data.map(item=>{ return item.clone(item) })
        },
        async getBuildingDevicesType(sort = null){
            this.blockData = []
            var data = this.origin.map(item=>{ return item.clone(item) })
            this.listQueryParams.total = data.length
            this.selectSetting.forEach(element=>{
                if(element.select !== ''){
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
                data = data.sort(function(x,y){
                    return y[sort] - x[sort]
                })
            }else{
                data = data.sort(function(x,y){
                    return y.id - x.id
                })
            }
            data = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
            this.blockData = data
        },
        async setSelectSetting(){
            this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
            this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
        },
        async handleBlock(title,index, content) { //設備
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
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
                    //this.$store.dispatch('building/setbuildingdevices',await this.$obj.Device.getBuildingDevicesManage())
                    this.listQueryParams = {
                        page: 1,
                        limit: 10,
                        total: 0
                    }
                    await this.reload()
                }
            }else if(index === 'empty'){
                this.dialogData.push( DeviceType.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index !== 'cancel'){
                var isOk = index === 'update' ? await content.update() : await content.create()
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    //this.$store.dispatch('building/setbuildingdevices',await this.$obj.Device.getBuildingDevicesManage())
                    await this.reload()
                }
            }
            this.innerVisible = false
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
    padding: 30px 15px;
    height: 720px;
}
</style>