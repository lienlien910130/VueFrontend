<template>
        <div class="editor-container">
            <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="block-wrapper">
                    <Block
                        ref="block"
                        :list-query-params.sync="listQueryParams"
                        v-bind="blockAttrs"
                        v-on="blockEvent"></Block>
                </div>
            </el-col>
            <!-- <Dialog
                v-bind="dialogAttrs"
                :accessAuthoritiesData="treeData"
                :accessAuthorities="roleAccessAuthority"
                v-on:handleDialog="handleDialog"></Dialog> -->
            <DialogForm
            ref="dialogform"
            v-if="innerVisible === true"
            v-bind="dialogAttrs"
            v-on:handleDialog="handleDialog"></DialogForm>

            <DialogExcel
            ref="dialogexcel"
            v-if="excelVisible === true"
            v-bind="excelAttrs"
            v-on:handleDialog="handleDialog"></DialogExcel>

            <DialogAuthority
            ref="dialogauthority"
            v-if="authorityVisible === true"
            v-bind="authorityAttrs"
            v-on:handleDialog="handleDialog"></DialogAuthority>
        </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from '@/mixin/index'
import { Menu, Role, Account } from '@/object/index'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin,excelmixin],
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getAllAccount,
                resetlistQueryParams:this.resetlistQueryParams
            }
        },
        authorityAttrs(){
            return{
                visible:this.authorityVisible,
                isHasButtons:false,
                title:this.title,
                accessAuthoritiesData:this.treeData,
                accessAuthorities:this.roleAccessAuthority
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
            authorityVisible:false
        }
    },
    methods:{
        async init(){
            this.title = 'account'
            this.tableConfig = Account.getTableConfig()
            await this.getAllAccount()
            this.buttonsName = [
                { name:'刪除',icon:'el-icon-delete',status:'delete'},
                { name:'編輯',icon:'el-icon-edit',status:'open'},
                { name:'查看權限',icon:'el-icon-view',status:'distribution'}
            ]
            // if(this.account_record == 0){
            //     this.$store.dispatch('building/setaccounts')
            //     this.$store.dispatch('record/saveAccountRecord',1)
            // }
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
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.getAllAccount()
        },
        async getAllAccount(){
            var data = await Account.getSearchPage(this.listQueryParams)
            this.blockData = data.result
            this.listQueryParams.total = data.totalPageCount
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
            }else if(index === 'delete' || index === 'deleteMany'){
                var isDelete = false
                if(index === 'delete'){
                  isDelete = await content.delete()
                }else{
                  var deleteArray = []
                  content.forEach(item=>{
                    deleteArray.push(item.id)
                  })
                  isDelete = await Account.deleteMany(deleteArray.toString())
                }
                if(isDelete){
                    this.$message('刪除成功')
                    if(this.listQueryParams.pageIndex !== 1 && this.blockData.length == 1){
                        this.listQueryParams.pageIndex = this.listQueryParams.pageIndex-1
                    }
                    this.$store.dispatch('building/setaccounts')
                    this.$socket.sendMsg('account','delete' ,
                        index === 'delete'  ? content.getID() : deleteArray.toString())
                    await this.getAllAccount()
                    this.$refs.block.clearSelectArray()
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'empty'){
                this.dialogData.push( Account.empty() )
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }else if(index === 'distribution'){
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
                this.authorityVisible = true
            }else if(index === 'exportExcel'){
                this.exportExcelData = this.blockData
                this.excelVisible = true
                this.excelType = 'exportExcel'
            }else if(index === 'uploadExcel'){
                this.excelVisible = true
                this.excelType = 'uploadExcel'
            }else if(index === 'updateMany'){
              this.dialogStatus = 'updateMany'
              content.forEach(item=>{
                var obj = _.cloneDeep(item)
                this.dialogData.push(obj)
              })
              this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'updateManySave'},
                { name:'取消',type:'info',status:'cancel'}]
              this.innerVisible = true
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index !== 'cancel'){
                var result = index === 'update' || index === 'updateManySave' ?
                await content.update() :
                index === 'create' ? await content.create() : await Account.postMany(content)
                var condition = index !== 'uploadExcelSave' ? result == true : result.result.length !== 0
                if(condition){
                    index === 'update' || index === 'updateManySave' ?
                        this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('building/setaccounts')
                    this.$socket.sendMsg('account', index , index !== 'uploadExcelSave' ? result: result.result)
                    await this.getAllAccount()
                    if(index !== 'updateManySave') this.innerVisible = false
                    this.excelVisible = false
                }else{
                    if(index !== 'uploadExcelSave'){
                        this.$message.error('該帳號已存在，請重新輸入')
                    }
                }
                if(index == 'uploadExcelSave' && result.repeatDataList !== undefined){
                    var list = []
                    result.repeatDataList.forEach(item=>{
                        list.push(item.account)
                    })
                    this.$message.error('【'+list.toString()+'】帳號已存在，請重新上傳')
                }
            }else{
                this.innerVisible = false
                this.excelVisible = false
                this.authorityVisible = false
                this.$refs.block.clearSelectArray()
            }
        },
        async changeTable(value){
            this.isTable = value
        }
    }
}
</script>
