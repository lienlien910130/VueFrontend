<template>
        <div class="editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="chart-wrapper" :style="{ height: blockwrapperheight }">
                    <Block 
                    :list-query-params.sync="listQueryParams"
                    :selectSetting.sync="selectSetting"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
            </el-col>
        </div>
</template>
<script>
import Device from '@/object/device'
import sharemixin  from '@/mixin/sharemixin'
import blockmixin  from '@/mixin/blockmixin'

export default {
    mixins:[sharemixin,blockmixin],
    computed: {
        blockEvent(){
            return{
                clickPagination:this.getAllDevice,
                handleBlock:this.handleBlock
            }
        }
    },
    methods:{
        async init(){
            this.title = 'address'
            this.tableConfig = Device.getAddressConfig()
            this.isHasButtons = false
            await this.reload()
        },
        async reload(){
            await this.setAllDevice()
            await this.getAllDevice()
        },
        async setAllDevice(){
            var data = await Device.get()
            this.origin = data.sort(function(x,y){
                    var a = x.status
                    var b = y.status
                    if(a == b){
                        return y.id - x.id
                    }
                    return y.status - x.status
            }).map(item=>{ return item.clone(item)})
        },
        async getAllDevice(){
            this.blockData = []
            var data = this.origin.map(item=>{ return item.clone(item)})
            this.listQueryParams.total = data.length
            this.blockData = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => y.status - x.status)
        },
        async handleBlock(title,index, content){
            console.log(title,index,JSON.stringify(content))
            if(content.length !== 0){
                var isOk = await Device.updateAddress(content)
                if(isOk){
                    this.$message('更新成功')
                    this.$store.dispatch('building/setbuildingdevices',await Device.get())
                    await this.reload()
                }
            }
        },
        async changeTable(value){
            this.isTable = value
        }
    }
}
</script>
<style lang="scss" scoped>
.chart-wrapper {
    background: #fff;
    padding: 5px 16px 0;
    height: 730px;
    overflow-x:hidden;
    overflow-y:auto;
    width: 100%;
}
</style>