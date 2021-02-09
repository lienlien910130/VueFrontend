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

import { getRoutes } from '@/utils/router'

export default {
    components:{ 
        Table: () => import('@/components/Table/index.vue'),
        Dialog:() => import('@/components/Dialog/index.vue'),
    },
    data(){
        return{
            selectRoleId:'',
            routes:[],
            treeData:[],
            tableData:[],
            config:[
                { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱'},
                { label:'描述' , prop:'description',format:'textarea', mandatory:false,message:'請輸入描述'},
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
            buttonsName: ['編輯','刪除','分配權限'],
            //Dialog
            dialogButtonsName:[],
            dialogTitle:'',
            dialogConfig:[],
            dialogSelect:[],
            dialogData:[],
            dialogStatus:'',
            innerVisible:false,
        }
    },
    computed: {
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
                selectData: this.dialogSelect,
                treeData:this.treeData
            }
        },
    },
    async mounted() {
        await this.getAllRole()
    },
    methods:{
        async getAllRole(){
            var data = await this.$obj.Authority.getRole()
            this.tableData = data.filter((item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1)).sort((x,y) => x.sort - y.sort)
                this.listQueryParams.total = data.length
        },
        async handleTableRow(index, row, option){
            console.log(index, row, option)
            this.dialogData = []
            this.dialogConfig = this.config
            if(option === '編輯'){
                this.dialogData.push(row)
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'update'
            }else if(option === '刪除'){
                var isOk = await this.$obj.Authority.deleteRole()
                if(isOk){
                    this.$message('刪除成功')
                    await this.getAllRole()
                }
            }
            else if(option === '新增'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
            else if(option === '分配權限'){
                this.selectRoleId = row.id
                var data = await this.$obj.Authority.getBuildingMenu()
                this.treeData = data[0].children
                this.treeData.forEach(item => {
                    item.linkAccessAuthorities.forEach(authority => {
                        var role = authority.linkRoles
                        var roleauthority = role.filter((r,index)=> r.id == this.selectRoleId)
                        if(roleauthority.length > 0){
                            item.accessAuthorities.push(authority.id)
                            item.originalAccessAuthorities.push(authority.id)
                        }
                    })
                    item.children.forEach(children => {
                        children.linkAccessAuthorities.forEach(childrenauthority => {
                            var role = childrenauthority.linkRoles
                            var roleauthority = role.filter((r,index)=> r.id == this.selectRoleId)
                            if(roleauthority.length > 0){
                                children.accessAuthorities.push(childrenauthority.id)
                                children.originalAccessAuthorities.push(childrenauthority.id)
                            }
                        })
                    })
                })
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'authoritycreate'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'authority'
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index === 'update'){
                content.sort = content.sort.toString()
                await this.$api.authority.apiPatchRoleAuthority(content).then(async(response)=>{
                    this.$message('更新成功')
                    await this.getAllRole()
                })
            }else if(index === 'create'){
                content.sort = content.sort.toString()
                await this.$api.authority.apiPostRoleAuthority(content).then(async(response)=>{
                    this.$message('新增成功')
                    await this.getAllRole()
                })
            }else if(index === 'authoritycreate'){
                content.forEach(async(item)=>{
                    item.accessAuthorities.forEach(async(authId)=>{
                        var index = item.originalAccessAuthorities.indexOf(authId) //先檢查原先是否有勾選
                        if(index == '-1'){ //角色新增的權限
                            var linkaccess = item.linkAccessAuthorities.filter((item,index)=> item.id==authId)
                            var array = [] //先把原本的角色放入 //再新增該角色
                            linkaccess[0].linkRoles.forEach(obj=>{
                                var temp = {
                                    id:obj.id
                                }
                                array.push(temp)
                            })
                            array.push({id:this.selectRoleId})
                            var updateData = {
                                id:authId,
                                linkRoles:array
                            }
                            await this.$obj.Authority.updateMenuAccessAuthority(JSON.stringify(updateData))
                        }
                    })
                    item.originalAccessAuthorities.forEach(async(authId)=>{ //移除的權限
                        var index = item.accessAuthorities.indexOf(authId) //先檢查原先是否有勾選
                        if(index == '-1'){
                            var linkaccess = item.linkAccessAuthorities.filter((item,index)=> item.id==authId)
                            var array = [] //先把原本的角色放入 //再移除該角色
                            linkaccess[0].linkRoles.forEach(obj=>{
                            if(obj.id !== this.selectRoleId){
                                var temp = {
                                        id:obj.id
                                    }
                                    array.push(temp)
                                }
                            })
                            var updateData = {
                                id:authId,
                                linkRoles:array
                            }
                            await this.$obj.Authority.updateMenuAccessAuthority(JSON.stringify(updateData))
                        }   
                    })
                    item.children.forEach(children => {
                        children.accessAuthorities.forEach(async(authId) => { //勾選的權限
                            var index = children.originalAccessAuthorities.indexOf(authId) //先檢查原先是否有勾選
                            if(index == '-1'){ //角色新增的權限
                                var linkaccess = children.linkAccessAuthorities.filter((item,index)=> item.id==authId)
                                var array = [] //先把原本的角色放入 //再新增該角色
                                linkaccess[0].linkRoles.forEach(obj=>{
                                    var temp = {
                                        id:obj.id
                                    }
                                    array.push(temp)
                                })
                                array.push({id:this.selectRoleId})
                                var updateData = {
                                    id:authId,
                                    linkRoles:array
                                }
                                await this.$obj.Authority.updateMenuAccessAuthority(JSON.stringify(updateData))
                            }
                        })
                        children.originalAccessAuthorities.forEach(async(authId)=>{ //移除的權限
                            var index = children.accessAuthorities.indexOf(authId) //先檢查原先是否有勾選
                            if(index == '-1'){
                                var linkaccess = children.linkAccessAuthorities.filter((item,index)=> item.id==authId)
                                var array = [] //先把原本的角色放入 //再移除該角色
                                linkaccess[0].linkRoles.forEach(obj=>{
                                    if(obj.id !== this.selectRoleId){
                                        var temp = {
                                            id:obj.id
                                        }
                                        array.push(temp)
                                    }
                                })
                                var updateData = {
                                    id:authId,
                                    linkRoles:array
                                }
                                await this.$obj.Authority.updateMenuAccessAuthority(JSON.stringify(updateData))
                            }   
                        })
                    })
                })
                this.$message('更新成功')
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