<template>
        <div class="editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="chart-wrapper">
                    <Table
                        :list-query-params.sync="listQueryParams"
                        v-bind="tableAttrs"
                        v-on="tableEvent">
                    </Table>
                </div>
            </el-col>
            <Dialog 
                v-bind="dialogAttrs" 
                v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    components:{ 
        Table: () => import('@/components/Table/index.vue'),
        Dialog:() => import('@/components/Dialog/index.vue'),
    },
    data(){
        return{
            originalRole:[],
            roleAccessAuthority:[],
            originalRoleAccessAuthority:[],
            selectRoleId:'',
            routes:[],
            tempTree:[],
            accessAuthority:[],
            treeData:[],
            tableData:[],
            config:[
                { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱',maxlength:'20'},
                { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述',maxlength:'200'},
                { label:'排序' , prop:'sort',format:'number', mandatory:true, message:'請輸入排序',
                isPattern:false,errorMsg:'',type:'number',typemessage:''},
                { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
                isPattern:false,errorMsg:'',type:'boolean',typemessage:''},
                { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
                isPattern:false,errorMsg:'',type:'boolean',typemessage:''}
            ],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            buttonsName: [
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'},
                { name:'分配權限',type:'danger',status:'distribution' }],
            //Dialog
            dialogButtonsName:[],
            dialogTitle:'',
            dialogConfig:[],
            dialogData:[],
            dialogStatus:'',
            innerVisible:false,
        }
    },
    computed: {
        ...mapGetters([
            'buildingid',
            'menu'
        ]),
        tableAttrs(){
            return {
                tableData: this.tableData,
                config:this.config,
                buttonsName:this.buttonsName,
            }
        },
        tableEvent(){
            return {
                clickPagination:this.getAllRole,
                handleTableRow:this.handleTableRow
            }
        },
        dialogAttrs(){
            return{
                title:'roles',
                visible: this.innerVisible,
                dialogData: this.dialogData,
                dialogStatus: this.dialogStatus,
                buttonsName: this.dialogButtonsName,
                config: this.dialogConfig,
                treeData:this.treeData,
                selectData:this.accessAuthority,
                accessAuthorities:this.roleAccessAuthority
            }
        },
    },
    watch:{
        buildingid:{
            handler:async function(){
                if(this.buildingid !== undefined){
                    await this.init()
                }
            },
            immediate:true
        },
        menu:{
            handler:async function(){
                await this.setMenuRoleAccess()
            },
            immediate:true
        },
    },
    methods:{
        async init(){
            await this.setAllRole()
            await this.getAllRole()
        },
        async setAllRole(){
            this.originalRole = this.$deepClone(await this.$obj.Authority.getAllRole())
        },
        async getAllRole(){
            var data = this.$deepClone(this.originalRole)
            this.listQueryParams.total = data.length
            this.tableData = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => x.sort - y.sort)
        },
        async setMenuRoleAccess(){
            this.accessAuthority = []
            for (let item of this.menu) {
                for (let obj of item.linkAccessAuthorities) {
                    this.accessAuthority.push(obj)
                }
                for (let children of item.children){
                    for (let obj of children.linkAccessAuthorities){
                        this.accessAuthority.push(obj)
                    }
                }
            }
        },
        async handleTableRow(row, option){
            console.log(row, option)
            this.dialogData = []
            this.dialogConfig = this.config
            if(option === 'open'){
                this.dialogData.push(row)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(option === 'delete'){
                var isOk = await this.$obj.Authority.deleteRole(row.id)
                if(isOk){
                    this.$message('刪除成功')
                    this.$store.dispatch('building/setroles',await this.$obj.Authority.getAllRole())
                    await this.init()
                }
            }
            else if(option === 'create'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
            else if(option === 'distribution'){
                this.selectRoleId = row.id
                this.roleAccessAuthority = await this.$obj.Authority.getRoleAccessAuthority(this.selectRoleId)
                this.originalRoleAccessAuthority = this.$deepClone(this.roleAccessAuthority)
                this.treeData = this.$deepClone(this.menu)
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
                content.sort = content.sort.toString()
                var isOk = index === 'update' ? 
                    await this.$obj.Authority.updateRole(JSON.stringify(content)) :
                    await this.$obj.Authority.postRole(JSON.stringify(content))
                if(isOk){
                    index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('building/setroles',await this.$obj.Authority.getAllRole())
                    await this.init()
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
                for(let obj of remove){
                    var data = this.accessAuthority.filter((item,index)=> item.id == obj )[0]
                    var array = []
                    var newRole = data.linkRoles.filter((item,index)=> item.id !== this.selectRoleId)
                    newRole.forEach(role=>{
                        array.push({id:role.id})
                    })
                    data.linkRoles = array
                    isOk = await this.$obj.Authority.updateRoleAccessAuthority(JSON.stringify(data))
                }
                for(let obj of add){
                    var data = this.accessAuthority.filter((item,index)=> item.id == obj )[0]
                    var array = []
                    data.linkRoles.forEach(role=>{
                        array.push({id:role.id})
                    })
                    array.push({id:this.selectRoleId})
                    data.linkRoles = array
                    isOk = await this.$obj.Authority.updateRoleAccessAuthority(JSON.stringify(data))
                }
                if(isOk){
                    loading.close()
                    this.$message('更新成功')
                    this.$store.dispatch('permission/setmenu',await this.$obj.Authority.getBuildingMenu())
                }
            }
            this.innerVisible = false
            
        },

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