
<template>
    <div>
      <el-dialog
        top="5vh"
        :width="dialogWidth"
        :title="title == 'account' ? '查看權限' : '分配權限' "
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="handleClickOption('cancel')"
        center>

        <keep-alive>

        <el-table
            :data="accessAuthoritiesData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            ref="authorityTable"
            :tree-props="{children: 'linkMainMenus', hasChildren: 'hasChildren'}"
            @select="handleSelectionChange"
            @select-all="handleSelectionAll"
            :header-cell-class-name="cellClass"
            :row-class-name="rowClass">
            <el-table-column
            type="selection"
            :selectable="selectable"
            width="55">
            </el-table-column>
            <el-table-column
            prop="name"
            label="選單"
            min-width="20%">
            </el-table-column>
            <el-table-column
            prop="linkAccessAuthorities"
            label="權限"
            min-width="80%">
                <template slot-scope="scope">
                    <el-checkbox-group 
                    v-model="accessArray" 
                    @change="handleCheckedChange(scope.row)">
                        <el-checkbox 
                        v-for="item in scope.row.getAccessAuthorities()"
                        :key="item.getID()"
                        :label="item.getID()"
                        :disabled="title == 'account'">
                        {{ item.getName()  }}
                        </el-checkbox>
                    </el-checkbox-group>
                </template>
            </el-table-column>
        </el-table>

        </keep-alive>
        
        <!-- 分配權限 -->
        
        <div v-if="isHasButtons" slot="footer" class="dialog-footer">
            <span
            v-for="(button, index) in buttonsName"
            :key="index"
            >
            <el-button
            :type="button.type"
            @click="handleClickOption(button.status)"
            >
            <span >{{ button.name }}</span>
            </el-button>
            </span>
        </div>
    </el-dialog>  
    </div>
</template>

<script>
import computedmixin from '@/mixin/computedmixin'

export default {
    name:'DialogAuthority',
    mixins:[computedmixin],
    props:{
        visible: {
            type: Boolean,
            default: true
        },
        isHasButtons: {
            type: Boolean,
            default: true
        },
        buttonsName: {
            type: Array
        },
        title:{
            type: String,
            required: true
        },
        //auth-menu&該角色所有權限id
        accessAuthoritiesData: {
            type: Array
        },
        accessAuthorities: {
            type: Array,
            default: function () {
                return []
            }
        },
        
    },
    watch:{
        accessAuthoritiesData:{ 
            handler:function(){
                this.$nextTick(()=>{
                    this.$refs.authorityTable.clearSelection()
                    this.accessArray = JSON.parse(JSON.stringify(this.accessAuthorities))
                    this.treeSelection()
                })
            },
            immediate:true
        }
    },
    computed:{
        dialogWidth(){
            if (this.$store.state.app.device === 'mobile') {
                return "90%"
            } else {
                return "1000px"
            }
        },
    },
    data() {
        return {
            accessArray:[]
        }
    },
    methods: {
        treeSelection(){ //初始化控制表格checkbox&row是否勾選狀態
            var _temp = this.accessAuthoritiesData
            for(var i =0;i<_temp.length;i++){
                _temp[i].getAccessAuthorities().forEach(item=>{
                    var index = this.accessArray.indexOf(item.getID())
                    if(index !== -1){
                        this.$refs.authorityTable.toggleRowSelection(_temp[i],true)
                    }
                })
                var _below = _temp[i].getLink()
                for(var x=0;x<_below.length;x++){
                    _below[x].getAccessAuthorities().forEach(item=>{
                        var index = this.accessArray.indexOf(item.getID())
                        if(index !== -1){
                            this.$refs.authorityTable.toggleRowSelection(_below[x],true)
                            this.$refs.authorityTable.toggleRowSelection(_temp[i],true)
                        }
                    })
                }
            }
        },
        //子傳父窗口
        handleClickOption(status){
            this.$emit('handleDialog',this.title, status , this.accessArray)
        },
        //客製化樣式
        cellClass(row){
            if (this.title == 'account') {//帳號管理不可選全選
                return 'disabledCheck'
            }
        },
        rowClass(row){
            if (this.title == 'account') {//帳號管理不可選全選
                return 'disabledEdit'
            }
        },
        selectable(row,index){ //帳號管理不可選每列
            if(this.title == 'account'){
                return false
            }else {
                return true
            }
        },
        //權限勾選
        async handleSelectionChange(selection, row){ //先檢查該列是否原先有被選取的選項 有的話先刪除 無的話則加入全部
            var isSelect = selection.filter((item,index) => item.id == row.getID())
            var isLevelOne = row.getLink().length > 0 // 是否為第一層
            if(!isLevelOne){
                row.getAccessAuthorities().forEach(item=>{
                    if(isSelect.length == 0){
                        var index = this.accessArray.indexOf(item.id)
                        if(index !== -1){
                            this.accessArray.splice(index, 1)
                        }
                    }else{
                        this.accessArray.push(item.getID())
                    }
                })
            }else{
                row.getLink().forEach(children=>{
                    children.getAccessAuthorities().forEach(item=>{
                        var index = this.accessArray.indexOf(item.getID())
                        if(isSelect.length > 0){
                            this.$refs.authorityTable.toggleRowSelection(children,true)
                            if(index === -1){
                                this.accessArray.push(item.getID())
                            }
                        }else{
                            this.$refs.authorityTable.toggleRowSelection(children,false)
                            this.accessArray.splice(index, 1)
                        }
                    })
                })
            }
        },
        async handleCheckedChange(row){ //選取checkbox時table該列要勾選
            var isHas = false
            var data = row.linkAccessAuthorities
            for(let acc of data ){
                var index = this.accessArray.indexOf(acc.id)
                if(index !== -1){
                    isHas = true
                }
            }
            if(isHas){
                this.$refs.authorityTable.toggleRowSelection(row,true)
            }else{
                this.$refs.authorityTable.toggleRowSelection(row,false)
            }
        },
        async handleSelectionAll(val){ //全選
            var array = val.filter(item => item.linkMainMenus.length !== 0)
            this.accessArray = []
            if(array.length == 0){ //代表取消全選
                this.$refs.authorityTable.clearSelection()
            }else{
                var _temp = this.accessAuthoritiesData
                for(var i =0;i<_temp.length;i++){
                    _temp[i].getAccessAuthorities().forEach(item=>{
                        this.accessArray.push(item.getID())
                    })
                    var _below = _temp[i].getLink()
                    for(var x=0;x<_below.length;x++){
                        this.$refs.authorityTable.toggleRowSelection(_below[x],true)    
                        _below[x].getAccessAuthorities().forEach(item=>{
                            this.accessArray.push(item.getID())
                        })
                    }
                }
            }
        }
    }
}
</script>
<style scoped>
.el-table ::v-deep.disabledCheck .cell .el-checkbox__inner{
    display: none!important;
}
.el-table ::v-deep.disabledEdit  .cell .is-checked .el-checkbox__label{
    color: red;
}
</style>
