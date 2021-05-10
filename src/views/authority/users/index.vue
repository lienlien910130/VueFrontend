<template>
        <div class="editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                    <Block 
                        :list-query-params.sync="listQueryParams"
                        v-bind="blockAttrs" 
                        v-on="blockEvent"></Block>
                        <!-- :selectSetting.sync="selectSetting" -->
                </div>
            </el-col>
            <Dialog 
                v-bind="dialogAttrs" 
                :accessAuthoritiesData="treeData"
                :accessAuthorities="roleAccessAuthority"
                v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Account from '@/object/account'
import Menu from '@/object/menu'

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
    watch:{
        menu:{
            handler:async function(){
                await this.setMenuRoleAccess()
            },
            immediate:true
        }
    },
    data(){
        return{
            roleAccessAuthority:[],
            treeData:[],
            accessAuthority:[],
            exportExcelData:[]
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
        async setMenuRoleAccess(){
            this.accessAuthority = []
            for (let item of this.menu) {
                for (let obj of item.getAccessAuthorities()) {
                    this.accessAuthority.push(obj)
                }
                for (let children of item.getLink()){
                    for (let obj of children.getAccessAuthorities()){
                        this.accessAuthority.push(obj)
                    }
                }
            }
        },
        async setAllAccount(){
            var data = await Account.get()
            this.origin = data.map(item=>{ return item.clone(item) })
        },
        async getAllAccount(){
            this.blockData = []
            var data = this.origin.map(item=>{ return item.clone(item) })
            this.listQueryParams.total = data.length
            this.blockData = data.sort((x,y) => x.sort - y.sort).filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
        },
        async handleBlock(title,index, content){
            console.log(title ,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
            this.dialogSelect = this.accessAuthority
            this.dialogButtonsName = []
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
            }else if(index === 'distribution'){
                const mask = this.$loading({
                    lock: true,
                    text: '查詢中，請稍後...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                var roles = content.getRoles()  
                var array = []
                for(let element in roles){
                    array.push(await roles[element].getAccess('account'))
                }
                var concatarray = array.reduce(
                    function(a, b) {
                        return a.concat(b)
                    },[]
                ).filter(function(element, index, arr){
                    return arr.indexOf(element) === index
                })
                this.roleAccessAuthority = concatarray
                this.treeData = this.menu.map(item=>{ return new Menu(item)})
                this.dialogButtonsName = [
                { name:'取消',type:'info',status:'cancel'}]
                mask.close()
                this.innerVisible = true
                this.dialogStatus = 'authority'
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
            this.tableConfig =  value == true ?  Account.getTableConfig() : Account.getConfig()
            await this.getFilterItems()
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