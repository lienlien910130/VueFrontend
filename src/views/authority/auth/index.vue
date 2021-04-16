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
                        :list-query-params.sync="listQueryParams"
                        :selectSetting.sync="selectSetting"
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
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import AccessAuthority from '@/object/accessAuthority'
import Menu from '@/object/menu'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
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
                clickPagination:this.changePage
            }
        },
        treeAttrs(){
            return{
                treeData:this.treeData,
                selectId:this.selectId
            }
        }
    },
    watch:{
        menu:{
            handler:async function(){
                this.blockData = []
                this.listQueryParams = {
                    page: 1,
                    limit: 10,
                    total: 0
                }
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
                    var select = this.selectId
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
                    var data = concatarray.filter(function (el) {
                        return el.id == select
                    })[0]
                    this.origin = data.getAccessAuthorities()
                    await this.changePage()
                }
            },
            immediate:true
        }
    },
    methods:{
        async init(){
            this.title = 'accessAuthority'
            this.tableConfig = AccessAuthority.getConfig()
        },
        async reload(){
            await this.setAccessAuthority()
            await this.getAccessAuthority()
        },
        async changePage(){
            this.blockData = this.origin.filter(
                (item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
            .sort((x,y) => x.sort - y.sort)
            this.listQueryParams.total = this.origin.length
        },
        async handleTreeNode(node,data){
            this.origin = data.getAccessAuthorities()
            console.log(JSON.stringify(this.origin))
            this.selectId = data.getID()
            this.listQueryParams = {
                page: 1,
                limit: 10,
                total: 0
            }
            await this.changePage()
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
                var temp = this.selectId
                var isOk = await content.delete()
                if(isOk){
                    this.selectId = ''
                    this.$message('刪除成功')
                    this.selectId = temp
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                }
            }else if(index === 'empty'){
                if(this.selectId == null){
                    this.$message({
                        message: '請選擇目錄',
                        type: 'warning'
                    })
                }else{
                    this.dialogData.push( AccessAuthority.empty() )    
                    this.dialogButtonsName = [
                        { name:'儲存',type:'primary',status:'create'},
                        { name:'取消',type:'info',status:'cancel'}]
                    this.innerVisible = true
                    this.dialogStatus = 'create'
                }
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,JSON.stringify(content))
            if(index !== 'cancel'){
                if(index === 'create'){
                    content.setlinkMainMenus([{id : this.selectId}])
                }
                var isOk = index === 'update' ? await content.update() : await content.create()
                if(isOk){
                    index == 'update' ? this.$message('更新成功') : this.$message('新增成功')
                    this.$store.dispatch('permission/setmenu',await  Menu.get())
                }
            }
            this.innerVisible = false
        },
        async changeTable(value){
            this.isTable = value
            value == true ?  this.tableConfig = AccessAuthority.getTableConfig() : 
            this.tableConfig = AccessAuthority.getConfig()
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