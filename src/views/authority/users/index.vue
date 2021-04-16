<template>
        <div class="editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                    <Block 
                        :list-query-params.sync="listQueryParams"
                        :selectSetting.sync="selectSetting"
                        v-bind="blockAttrs" 
                        v-on="blockEvent"></Block>
                </div>
            </el-col>
            <Dialog 
                v-bind="dialogAttrs" 
                v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Account from '@/object/account'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getAllAccount
            }
        }
    },
    methods:{
        async init(){
            this.tableConfig = Account.getConfig()
            this.title = 'account'
            await this.reload()
        },
        async reload(){
            await this.setAllAccount()
            await this.getAllAccount()
        },
        async setAllAccount(){
            var data = await Account.get()
            this.origin = data.map(item=>{ return item.clone(item) })
        },
        async getAllAccount(){
            this.blockData = []
            var data = this.origin.map(item=>{ return item.clone(item) })
            this.listQueryParams.total = data.length
            this.blockData = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => x.sort - y.sort)
        },
        async handleBlock(title,index, content){
            console.log(title ,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
            if(index === 'open'){
                this.dialogData.push(content)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                var isOk = await content.delete()
                if(isOk){
                    this.$message('刪除成功')
                    await this.reload()
                }
            }else if(index === 'empty'){
                this.dialogData.push( Account.empty() )
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
                    await this.reload()
                }
            }
            this.innerVisible = false
        },
        async changeTable(value){
            this.isTable = value
            value == true ?  this.tableConfig = Role.getTableConfig() : 
            this.tableConfig = Role.getConfig()
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