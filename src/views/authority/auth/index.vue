<template>
        <div class="editor-container">
           <el-row :gutter="32">
               <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="block-wrapper">
                        <MenuTree
                            ref="menuTree"
                            :treeData="treeData"
                            v-on:handleTreeNode="handleTreeNode">
                        </MenuTree>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper">
                        <Block
                        ref="block"
                        :list-query-params.sync="listQueryParams"
                        v-bind="blockAttrs"
                        v-on="blockEvent"></Block>
                    </div>
                </el-col>
           </el-row>
           <!-- <Dialog
                v-bind="dialogAttrs"
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
        </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, excelmixin } from '@/mixin/index'
import { Menu, AccessAuthority, Role } from '@/object/index'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin,excelmixin],
    data(){
        return{
            //tree
            treeData:[],
            selectId:null,
            classCode:''
        }
    },
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock
            }
        }
    },
    watch:{
        menu:{
            handler:async function(){
                this.blockData = []
                var data = this.menu.map(item=>{ return item.clone(item)})
                this.treeData = data.map(element => {
                    this.$set(element,'children',element.getLink())
                    element.getLink().map(children =>{
                        this.$set(children,'children',children.getLink())
                        return children
                    })
                    return element
                })
                if(this.selectId !== null){
                    this.$refs.menuTree.setHighlight(this.selectId)
                    var data = await AccessAuthority.get(this.selectId)
                    this.blockData = data.result
                }
            },
            immediate:true
        }
    },
    methods:{
        async init(){
            this.title = 'accessAuthority'
            this.tableConfig = AccessAuthority.getTableConfig()
            this.hasSearch = false

        },
        async handleTreeNode(node,data){
            this.selectId = data.getID()
            this.classCode = data.getCode()
            console.log(this.classCode)
            var array = await AccessAuthority.get(this.selectId)
            this.blockData = array.result
        },
        async handleBlock(title,index, content){
            console.log(title ,index,JSON.stringify(content))
            this.dialogData = []
            this.dialogConfig = this.tableConfig
            this.dialogTitle = this.title
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
                  isDelete = await AccessAuthority.deleteMany(deleteArray.toString())
                }
                if(isDelete){
                    this.$message('刪除成功')
                    this.$socket.sendMsg('menus','reset', '')
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                    this.$refs.block.clearSelectArray()
                    // var array = await AccessAuthority.get(this.selectId)
                    // this.blockData = array.result
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'empty'){
                if(this.selectId == null){
                    this.$message.error({
                        message: '請選擇目錄'
                    })
                }else{
                    this.dialogData.push( AccessAuthority.empty() )
                    this.dialogButtonsName = [
                        { name:'儲存',type:'primary',status:'create'},
                        { name:'取消',type:'info',status:'cancel'}]
                    this.innerVisible = true
                    this.dialogStatus = 'create'
                }
            }else if(index === 'exportExcel'){
                if(this.selectId == null){
                    this.$message.error({
                        message: '請選擇目錄'
                    })
                }else{
                    this.exportExcelData = this.blockData
                    this.excelVisible = true
                    this.excelType = 'exportExcel'
                }
            }else if(index === 'uploadExcel'){
                if(this.selectId == null){
                    this.$message.error({
                        message: '請選擇目錄'
                    })
                }else{
                    this.excelVisible = true
                    this.excelType = 'uploadExcel'
                }
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
            console.log(title ,index,JSON.stringify(content))
            if(index !== 'cancel'){
                if(index === 'create'){
                    content.setlinkMainMenus([{id : this.selectId}])
                    content.class = this.classCode
                }else if(index === 'uploadExcelSave'){
                    content.forEach(element => {
                        element.class = '{Check}'+this.classCode
                        element.linkMainMenus = [{id : this.selectId}]
                    })
                }
                var result = index === 'update' || index === 'updateManySave' ? await content.update() :
                index === 'create' ? await content.create() : await AccessAuthority.postMany(content)
                var condition = index !== 'uploadExcelSave' ? result == true : result.result.length !== 0
                if(condition){
                    index == 'update' || index == 'updateManySave' ?
                        this.$message('更新成功') : this.$message('新增成功')
                    this.$socket.sendMsg('menus', 'reset', '')
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                    if(index !== 'updateManySave') this.innerVisible = false
                    this.excelVisible = false
                }else{
                    this.$message.error('該權限已存在，請重新輸入')
                }
                if(index == 'uploadExcelSave' && result.repeatDataList !== undefined){
                    var list = []
                    result.repeatDataList.forEach(item=>{
                        list.push(item.name)
                    })
                    this.$message.error('【'+list.toString()+'】權限已存在，請重新上傳')
                }
            }else{
                this.innerVisible = false
                this.excelVisible = false
                this.$refs.block.clearSelectArray()
            }
        },
        async changeTable(value){
            this.isTable = value
        }
    }
}
</script>
