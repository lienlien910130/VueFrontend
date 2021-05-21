<template>
        <div class="editor-container">
           <el-row :gutter="32">
               <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                        <MenuTree
                            v-bind="treeAttrs"
                            v-on:handleTreeNode="handleTreeNode">
                        </MenuTree>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                        <Block 
                        ref="block"
                        :list-query-params.sync="listQueryParams"
                        v-bind="blockAttrs" 
                        v-on="blockEvent"></Block>
                    </div>
                </el-col>
           </el-row>
           <Dialog 
                v-bind="dialogAttrs" 
                v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import Menu from '@/object/menu'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
    watch:{
        menu:{
            handler:async function(){
                this.blockData = []
                this.listQueryParams = { pageIndex: 1, pageSize: 12, total:0 }
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
                if(this.selectId !== null){
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
                    this.origin = data.getLink()
                    await this.getMainMenu()
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
                handleBlock:this.handleBlock,
                resetlistQueryParams:this.resetlistQueryParams
            }
        },
        treeAttrs(){
            return{
                treeData:this.treeData,
                selectId:this.selectId
            }
        }
    },
    methods:{
        async init(){
            this.title = 'mainMenu'
            this.hasSearch = false
        },
        async resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 12,
                total:0
            }
            await this.getMainMenu()
        },
        async getMainMenu(){
            this.blockData = this.origin
            this.$refs.block.resetpictLoading()
            await this.getFilterItems()
        },
        async handleTreeNode(node,data){
            this.origin = data.getLink()
            this.selectId = data.getID()
            await this.resetlistQueryParams()
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
                var temp = this.selectId
                var isOk = await content.delete()
                if(isOk){
                    this.selectId = ''
                    this.$message('刪除成功')
                    this.selectId = temp
                    this.$store.dispatch('permission/setRoutes')
                }
            }else if(index === 'empty'){
                if(this.selectId == null){
                    this.$alert('如需新增子目錄，請先選擇父節點，再進行新增', '新增提醒', {
                        confirmButtonText: '確定'
                    });
                }
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
                    this.innerVisible = true
                    this.dialogStatus = 'exportExcel'
                }
            }else if(index === 'uploadExcel'){
                if(this.selectId == null){
                    this.$message.error({
                        message: '請選擇目錄'
                    })
                }else{
                    this.innerVisible = true
                    this.dialogStatus = 'uploadExcel'
                }
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index == 'update' || index == 'create' || index === 'uploadExcelSave'){
                delete content.linkMainMenus
                delete content.linkAccessAuthorities
                var isOk = index == 'update' ? await content.update() : 
                index === 'create' ? await content.create(this.selectId) : 
                await Menu.postMany(this.selectId,content)
                if(isOk){
                    index == 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('permission/setRoutes')
                }    
            }   
            this.innerVisible = false
        },
        async changeTable(value){
            this.isTable = value
            value == true ?  this.tableConfig = Menu.getTableConfig() : 
            this.tableConfig = Menu.getConfig()
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

<style lang="scss">
.el-tree {
  color: black;
  background: transparent;
  font-size: 20px;
  margin:10px;
}
.custom-tree-node{
    margin: 5px;
    width:100%;
}
/* 设置三角形图标的颜色 */
.el-tree-node__expand-icon {
  color: black;
  font-size: 25px;
}

/* 树节点鼠标悬浮式改变背景色，字体颜色 */
.el-tree-node__content:hover {
  background-color: rgb(202, 191 , 220);
  color: rgb(29, 4, 4);
}
 
/* 改变节点高度 */
.el-tree-node__content {
  height: 30px;
}
 
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: lightgray;
  color:black;
}
.el-tree-node .is-focusable .is-checked{
background-color:rgb(147, 180 , 197);
  color: black;
}
</style>