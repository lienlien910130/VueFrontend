<template>
        <div class="editor-container">
           <el-row :gutter="32">
               <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="chart-wrapper">
                        <menuTree
                            v-bind="treeAttrs"
                            v-on:handleTreeNode="handleTreeNode">
                        </menuTree>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="chart-wrapper">
                       <Table
                       :list-query-params.sync="listQueryParams"
                       v-bind="tableAttrs"
                       v-on="tableEvent">
                       </Table>
                    </div>
                </el-col>
           </el-row>
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
        menuTree: () => import('@/components/Tree/menuTree.vue'),
        Dialog:() => import('@/components/Dialog/index.vue'),
    },
    watch:{
        menu:{
            handler:async function(){
                this.tableData = []
                this.listQueryParams = {
                    page: 1,
                    limit: 10,
                    total: 0
                }
                this.data = this.$deepClone(this.menu)
                if(this.selectId !== ''){
                   var d = this.data.filter((item, index) => item.id == this.selectId )
                   console.log('menu',JSON.stringify(d))
                    this.tableData = d[0].children 
                    this.listQueryParams.total = d[0].children.length
                }
            },
            immediate:true
        }
    },
    data(){
        return{
            data:[],
            selectData:[],
            original:[],
            tableData:[],
            selectId:'',
            config:[
                { label:'名稱' , prop:'name', mandatory:true, message:'請輸入名稱'},
                { label:'Code' , prop:'code', mandatory:true,message:'請輸入Code'},
                { label:'描述' , prop:'description',format:'textarea', mandatory:false, message:'請輸入描述'},
                { label:'狀態' , prop:'status',format:'accountStatusSelect', mandatory:true, message:'請選擇狀態',
                isPattern:false,errorMsg:'',type:'boolean',typemessage:''},
                { label:'排序' , prop:'sort',format:'number', 
                mandatory:true,message:'請輸入排序',isPattern:false,errorMsg:'',type:'number',typemessage:'' },
                { label:'刪除' , prop:'removable',format:'removableSelect', mandatory:true, message:'請選擇',
                isPattern:false,errorMsg:'',type:'boolean',typemessage:''},
            ],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
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
    filters:{
        changeicon(code){
            switch (code){
                case 'sys-DrawingControl':
                    return 'el-icon-menu'
                    break;
                case 'sys-DevicesManagement':
                    return 'el-icon-s-tools'
                    break;
                case 'sys-EmergencyResponse':
                    return 'el-icon-warning-outline'
                    break;
                case 'sys-HistoryAnalysis':
                    return 'el-icon-pie-chart'
                    break;
            }
        }
    },
    computed: {
        ...mapGetters([
            'buildingid',
            'menu'
        ]),
        treeAttrs(){
            return{
                data:this.data,
                selectId:this.selectId
            }
        },
        tableAttrs(){
            return {
                title:'mainMenu',
                tableData: this.tableData,
                config:this.config,
                selectId:this.selectId
            }
        },
        tableEvent(){
            return {
                clickPagination:this.changePage,
                handleTableRow:this.handleTableRow
            }
        },
        dialogAttrs(){
            return{
                title:'mainMenu',
                visible: this.innerVisible,
                dialogData: this.dialogData,
                dialogStatus: this.dialogStatus,
                buttonsName: this.dialogButtonsName,
                config: this.dialogConfig,
            }
        },
    },
    methods:{
        async changePage(){
            var data = this.$deepClone(this.original)
            this.tableData = data.filter(
                (item, index) => 
                index < this.listQueryParams.limit * this.listQueryParams.page && 
                index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
            .sort((x,y) => x.sort - y.sort)
            this.listQueryParams.total = data.length
        },
        async handleTreeNode(node,data){
            this.original = this.$deepClone(data.children)
            this.selectId = data.id
            this.listQueryParams = {
                page: 1,
                limit: 10,
                total: 0
            }
            this.changePage()
        },
        async handleTableRow( row, option){
            console.log( row, option)
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
                var temp = this.selectId
                var isOk = await this.$obj.Authority.deleteBuildingMenu(row.id)
                if(isOk){
                    this.selectId = ''
                    this.$message('刪除成功')
                    this.selectId = temp
                    this.$store.dispatch('permission/setmenu',await this.$obj.Authority.getBuildingMenu())
                }
            }
            else if(option === 'create'){
                if(this.selectId == ''){
                    this.$message({
                        message: '請選擇要新增的父節點',
                        type: 'warning'
                    })
                }else{
                    this.dialogButtonsName = [
                    { name:'儲存',type:'primary',status:'create'},
                    { name:'取消',type:'info',status:'cancel'}]
                    this.innerVisible = true
                    this.dialogStatus = 'create'
                }
            }
        },
        async handleDialog(title ,index, content){ //Dialog相關操作
            console.log(title ,index,content)
            if(index == 'update' || index == 'create'){
                content.sort = content.sort.toString()
                var isOk = index == 'update' ? 
                    await this.$obj.Authority.updateBuildingMenu(JSON.stringify(content)) :
                    await this.$obj.Authority.postBuildingMenu(this.selectId,JSON.stringify(content))
                if(isOk){
                    index == 'update' ? this.$message('更新成功') : this.$message('新增成功')
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
    .menu-list{
        width: 100%;
        height: 80%;
    }
    .dashboard-wrapper{
        padding: 16px 16px;
        margin-top: 10px;
        margin-bottom: 10px;
        overflow-x:hidden;
        overflow-y:auto;
        line-height: 25px;
    }
    .dashboard-wrapper-add{
        background-color: rgb(202, 191 , 220);
        padding: 16px 16px;
        margin-top: 10px;
        margin-bottom: 10px;
        overflow-x:hidden;
        overflow-y:auto;
        line-height: 25px;
        cursor: pointer;
    }
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