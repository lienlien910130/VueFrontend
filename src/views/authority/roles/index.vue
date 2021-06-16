<template>
        <div class="editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                    <Block 
                        ref="block"
                        :list-query-params.sync="listQueryParams"
                        v-bind="blockAttrs" 
                        v-on="blockEvent"></Block>
                </div>
            </el-col>
            <Dialog 
                ref="dialog"
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
import Role from '@/object/role'
import Menu from '@/object/menu'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
    data(){
        return{
            roleAccessAuthority:[],
            originalRoleAccessAuthority:[],
            selectRoleId:'',
            accessAuthority:[],
            treeData:[]
        }
    },
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getAllRole,
                resetlistQueryParams:this.resetlistQueryParams
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
    methods:{
        async init(){
            this.title = 'roles'
            this.tableConfig = Role.getTableConfig()
            await this.getAllRole()
            this.buttonsName = [
                { name:'刪除',icon:'el-icon-delete',status:'delete'},
                { name:'編輯',icon:'el-icon-edit',status:'open'},
                { name:'分配權限',icon:'el-icon-magic-stick',status:'distribution'}
            ]
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0,
                orderBy:'sort'
            }
            await this.getAllRole()
        },
        async getAllRole(){
            this.listQueryParams.orderBy = 'sort'    
            var data = await Role.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
            this.$refs.block.resetpictLoading()
            await this.getFilterItems()
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
        async handleBlock(title,index, content){
            console.log(title,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
            this.dialogSelect = this.accessAuthority
            this.dialogButtonsName = []
            if(index === 'open'){
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
                this.dialogStatus = 'update'
            }else if(index === 'delete'){
                var isOk = await content.delete()
                if(isOk){
                    this.$message('刪除成功')
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                    this.$store.dispatch('building/setroles',await Role.get())
                    await this.resetlistQueryParams()
                }
            }else if(index === 'empty'){
                this.dialogData.push( Role.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'distribution'){
                this.selectRoleId = content.getID()
                this.roleAccessAuthority = await content.getAccess('role') //取得角色所有權限的id
                this.originalRoleAccessAuthority =  JSON.parse(JSON.stringify(this.roleAccessAuthority))
                this.treeData = this.menu.map(item=>{ return new Menu(item)})
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'authoritycreate'},
                { name:'取消',type:'info',status:'cancel'}]
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
            console.log(title , index, JSON.stringify(content))
            if(index === 'update' || index === 'create' || index === 'uploadExcelSave'){
                var isOk = index === 'update' ? await content.update() : 
                index === 'create' ? await content.create() : await Role.postMany(content)
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                    this.$store.dispatch('building/setroles',await Role.get())
                    await this.getAllRole()
                    if(index == 'create'){
                        this.$refs.dialog.insertSuccess('roleSelect')
                    }
                }
            }else if(index === 'authoritycreate'){
                var array = this.originalRoleAccessAuthority
                var array2 = content
                var remove = []
                var add = []
                array.forEach(item=>{ //以原始的role為基礎 比對是否有移除掉的權限
                    var stra = item
                    var count = 0
                    for (var j = 0; j < array2.length; j++) {
                        var strb = array2[j]
                        if (stra == strb) {
                            count++
                        }
                    }
                    if (count === 0) {   
                        remove.push(stra)
                    }
                })
                array2.forEach(item=>{ //以原始的role為基礎 比對是否有新增的權限
                    var stra = item
                    var count = 0
                    for (var j = 0; j < array.length; j++) {
                        var strb = array[j]
                        if (stra == strb) {
                            count++
                        }
                    }
                    if (count === 0) {   
                        add.push(stra)
                    }
                })
                console.log('原始',JSON.stringify(array))
                console.log('此次傳來',JSON.stringify(array2))
                console.log('移除',JSON.stringify(remove))
                console.log('新增',JSON.stringify(add))
                var isOk = false
                var updateArray = []
                for(let obj of remove){
                    var data = this.accessAuthority.filter((item,index)=> item.id == obj )[0]
                    var array = []
                    var newRole = data.linkRoles.filter((item,index)=> item.id !== this.selectRoleId)
                    newRole.forEach(role=>{
                        array.push({id:role.id})
                    })
                    data.linkRoles = array
                    updateArray.push(data)
                }
                for(let obj of add){
                    var data = this.accessAuthority.filter((item,index)=> item.id == obj )[0]
                    var array = []
                    data.linkRoles.forEach(role=>{
                        array.push({id:role.id})
                    })
                    array.push({id:this.selectRoleId})
                    data.linkRoles = array
                    updateArray.push(data)
                }
                isOk = await Role.updateAccessAuthority(updateArray)
                if(isOk){
                    this.$message('更新成功')
                    this.$store.dispatch('permission/setmenu',await Menu.get())
                    await this.getAllRole()
                }
            }
            this.innerVisible = false
        },
        async changeTable(value){
            this.isTable = value
            if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
                if(typeof this.$route.params.target == 'object'){
                    await this.handleBlock('roles','open',this.$route.params.target)
                }
            }else if(this.$route.query.type !== undefined && 
            this.$route.query.type == 'role'){
                await this.handleBlock('role','empty','')
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