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
import { Menu } from '@/object/index'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin,excelmixin],
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
                }).filter(item=>{return item.code !== 'sys-Setting' && item.code !== 'sys-Building'
                    && item.code !== 'sys-Index'})
                this.treeData.unshift(new Menu({
                    id: '0' ,
                    sort:'0',
                    name:'主選單'
                }))
                if(this.selectId !== null){
                    if(this.selectId == '0'){
                        this.$refs.menuTree.setHighlight(this.selectId)
                        var a = this.menu.map(item=>{ return item.clone(item)})
                        this.blockData = a
                    }else{
                        this.$refs.menuTree.setHighlight(this.selectId)
                        var array = []
                        for(let element of this.treeData){
                            array.push(element)
                            array.push(element.linkMainMenus)
                        }
                        var concatarray = array.reduce(
                            function(a, b) {
                                return a.concat(b)
                            },[]
                        )
                        var data = concatarray.filter(item=>{ return item.id == this.selectId})[0]
                        this.blockData = data.getLink()
                    }
                }
            },
            immediate:true
        }
    },
    data(){
        return{
            //tree
            treeData:[],
            selectId:null
        }
    },
    computed: {
        blockEvent(){
            return{
                handleBlock:this.handleBlock
            }
        }
    },
    methods:{
        async init(){
            this.title = 'mainMenu'
            this.tableConfig = Menu.getTableConfig()
            this.hasSearch = false
        },
        async handleTreeNode(node,data){
            console.log(node,data)
            this.blockData = data.getLink()
            this.selectId = data.getID()
            if(this.selectId == '0'){
                var a = this.menu.map(item=>{ return item.clone(item)})
                this.blockData = a
            }
        },
        async handleBlock(title,index, content){
            console.log(title,index, JSON.stringify(content))
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
            }else if(index === 'delete'){
                var isOk = await content.delete()
                if(isOk){
                    this.$message('刪除成功')
                    this.$store.dispatch('permission/setRoutes')
                    this.$socket.sendMsg('menus', 'routes' , '')
                }else{
                    this.$message.error('系統錯誤')
                }
            }else if(index === 'empty'){
                // if(this.selectId == null){
                //     this.$alert('如需新增子目錄，請先選擇父節點，再進行新增', '新增提醒', {
                //         confirmButtonText: '確定'
                //     })
                // }
                this.dialogData.push( Menu.empty() )    
                    this.dialogButtonsName = [
                    { name:'儲存',type:'primary',status:'create'},
                    { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
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
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index == 'update' || index == 'create' || index === 'uploadExcelSave'){
                delete content.linkMainMenus
                delete content.linkAccessAuthorities
                var isOk = index == 'update' ? await content.update() : 
                index === 'create' ? await content.create(this.selectId == '0' ? null : this.selectId) : 
                await Menu.postMany(this.selectId,content)
                if(isOk){
                    index == 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('permission/setRoutes')
                    this.$socket.sendMsg('menus', 'routes' , '')
                    this.innerVisible = false
                    this.excelVisible = false
                }else{
                    this.$message.error('系統錯誤')
                }
            }else{
                this.innerVisible = false
                this.excelVisible = false
            }
        },
        async changeTable(value){
            this.isTable = value
        }
    }
}
</script>
