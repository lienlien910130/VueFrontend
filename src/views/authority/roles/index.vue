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
                clickPagination:this.getAllRole
            }
        }
    },
    watch:{
        menu:{
            handler:async function(){
                await this.setMenuRoleAccess()
            },
            immediate:true
        },
    },
    methods:{
        async init(){
            this.tableConfig = Role.getConfig()
            this.title = 'roles'
            this.buttonsName = [
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'},
                { name:'分配權限',type:'danger',status:'distribution' }]
            await this.reload()
        },
        async reload(){
            await this.setAllRole()
            await this.getAllRole()
        },
        async setAllRole(){
            var data = await Role.get()
            this.origin = data.map(item=>{ return item.clone(item) })
        },
        async getAllRole(){
            this.blockData = []
            var data = this.origin.map(item=>{ return item.clone(item) })
            this.listQueryParams.total = data.length
            this.blockData = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => x.sort - y.sort)
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
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                    this.$store.dispatch('building/setroles',await Role.get())
                    await this.reload()
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
                this.roleAccessAuthority = await content.getAccess()
                this.originalRoleAccessAuthority = this.$deepClone(this.roleAccessAuthority)
                this.treeData = this.menu.map(item=>{ return new Menu(item)})
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'authoritycreate'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'authority'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title , index, JSON.stringify(content))
            if(index === 'update' || index === 'create'){
                var isOk = index === 'update' ? await content.update() : await content.create()
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                    this.$store.dispatch('building/setroles',await Role.get())
                    await this.reload()
                }
            }else if(index === 'authoritycreate'){
                const loading = this.$loading({
                    lock: true,
                    text: '更新權限中，請稍後...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
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
                    loading.close()
                    this.$message('更新成功')
                    this.$store.dispatch('permission/setmenu',await Menu.get())
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