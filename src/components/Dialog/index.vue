<template>

    <el-dialog
        :width="dialogWidth"
        :title="textMap[dialogStatus]"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="handleClickOption('cancel')"
        center>

        <el-tabs 
        v-if="title === 'user' && dialogData.length > 1" 
        v-model="activeName" 
        @tab-click="handleTabClick">
            <el-tab-pane
            v-for="(item) in dialogData"
            :key="item.id"
            :label="item.name"
            :name="item.id"></el-tab-pane>
        </el-tabs>

        <!-- dialogStatus : 一般表單/upload/lack/authority -->
        <keep-alive>

        <el-form 
        v-if="dialogStatus !== 'upload' && dialogStatus !== 'lack' && dialogStatus !== 'authority'  "
        ref="dataForm"  
        :model="temp"  
        :label-position="label" 
        label-width="auto" 
            >
            <el-form-item 
            v-for="(item, index) in config"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            v-show="item.format !== 'hide' &&  item.format !== 'openfiles' 
            &&  item.format !== 'openlacks' "
            :rules="[
            { required: item.mandatory, message: item.message},
            item.isPattern ? { pattern: item.pattern , message:item.errorMsg } : 
            { type: item.type, message: item.typemessage }]"
            >
                <el-date-picker 
                v-if="item.format == 'YYYY'" 
                v-model="temp[item.prop]" 
                value-format="yyyy-MM-dd" 
                style="width:100%"
                type="year" /> 

                <el-date-picker 
                v-else-if="item.format == 'YYYY-MM-DD'" 
                :ref="item.prop"
                :name="item.prop"
                v-model="temp[item.prop]" 
                value-format="yyyy-MM-dd" 
                style="width:100%"
                type="date" /> 

                <span v-else-if="item.format == 'range'">
                    <el-date-picker
                        ref="picker"
                        v-model="rangevalue"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="開始日期"
                        end-placeholder="結束日期"
                        format="yyyy-MM-dd"
                        style="width:100%"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </span>

                <el-select
                    v-else-if="item.format =='select' || item.format =='userInfo' ||
                    item.format == 'deviceSelect' || item.format =='contactunitSelect' || 
                    item.format == 'floorOfHouseSelect' "
                    v-model="temp[item.prop]"
                    filterable
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="(item,index) in selectData"
                        :key="index"
                        :label="item.label"
                        :value="item.id"
                        >
                        </el-option>  
                </el-select>

                <el-select
                    v-else-if="item.format =='roleSelect' "
                    v-model="temp[item.prop]"
                    filterable
                    multiple 
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="(item,index) in selectData"
                        :key="index"
                        :label="item.label"
                        :value="item.id"
                        >
                        </el-option>  
                </el-select>

                <el-select
                    v-else-if="item.format =='DeviceOptions' 
                    || item.format =='BrandOptions' || 
                    item.format =='MaintainContentOptions' 
                    || item.format =='MaintainProcessOptions' || item.format == 'DeviceStatusOptions' "
                    v-model="temp[item.prop]"
                    filterable
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="(item,index) in optionfilter(item.format)"
                        :key="index"
                        :label="item.label"
                        :value="item.id"
                        >
                        </el-option>  
                </el-select>

                <el-select
                    v-else-if="item.format =='menuSelect'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option label="首頁" key="1" value="index"></el-option>
                    <el-option label="基本資料" key="2" value="basic"></el-option>
                    <el-option label="圖控" key="3" value="drawingControl"></el-option>
                    <el-option label="檢修&公安申報" key="4" value="report"></el-option>
                    <el-option label="設備管理" key="5" value="devicesManagement"></el-option>
                    <el-option label="維護保養" key="6" value="maintainManagement"></el-option>
                    <el-option label="菜單管理" key="7" value="mainMenuSetting"></el-option>
                    <el-option label="權限管理" key="8" value="accessAuthoritySetting"></el-option>
                    <el-option label="角色管理" key="9" value="roleSetting"></el-option>
                    <el-option label="帳號管理" key="10" value="accountSetting"></el-option>
                    <el-option label="設定" key="11" value="settings"></el-option>
                </el-select>

                <el-select
                    v-else-if="item.format =='actionSelect'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option label="查詢" key="1" value="query"></el-option>
                    <el-option label="新增" key="2" value="add"></el-option>
                    <el-option label="刪除" key="3" value="delete"></el-option>
                    <el-option label="修改" key="4" value="update"></el-option>
                </el-select>

                <el-select
                    v-else-if="item.format =='accountStatusSelect'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option v-for="(val,index) in [true, false]" 
                    :key="index"
                    :value="val" :label="val == true ? '啟用':'禁用'"></el-option>
                </el-select>

                <el-select
                    v-else-if="item.format =='removableSelect'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option v-for="(val,index) in [true, false]" 
                    :key="index"
                    :value="val" :label="val == true ? '允許':'禁止'"></el-option>
                </el-select>

                <el-checkbox 
                    v-else-if="item.format == 'tag' "
                    v-model="temp[item.prop]"
                >
                {{ checkboxChange(temp[item.prop]) }}
                </el-checkbox>

                <el-input-number 
                v-else-if="item.format =='number'"
                v-model="temp[item.prop]"  
                controls-position="right" 
                :min="0"
                :precision="0"
                style="width:100%"
                ></el-input-number>

                <el-input v-else-if="item.format =='textarea'"
                v-model="temp[item.prop]" 
                :autosize="{ minRows: 4, maxRows: 8}"
                type="textarea">
                </el-input>

                <div v-else-if="item.format =='openmaintain'">
                    <Table
                       :list-query-params.sync="listQueryParams"
                       v-bind="tableAttrs"
                       v-on="tableEvent">
                    </Table>
                </div>

                <el-input v-else
                v-model="temp[item.prop]" >
                </el-input>

            </el-form-item>
        </el-form>

        <Upload 
        v-if="dialogStatus === 'upload'"
        v-bind="uploadAttrs" 
        v-on:handleFilesUpload="handleFilesUpload"></Upload>   
        
        <el-table
        v-if="dialogStatus === 'lack'"
            :data="origin"
            border
            highlight-current-row
            style="width: 100%;"
            empty-text="暫無資料"
            >

            <el-table-column
            fixed
            type="index">
            </el-table-column>

            <el-table-column 
                v-for="(item,index) in config"
                align="left" 
                :label="item.label" 
                :key="index" 
                :prop="item.prop" 
                sortable
                header-align="center"
                >
                <template slot-scope="scope">
                    <span v-if="scope.row['isEdit'] === false">
                        <div v-if="scope.column.property == 'lackContent'"
                        v-html="stringToBr(scope.row[scope.column.property])"></div>
                        <span v-else-if="scope.column.property == 'status'">
                        {{  changeLabel(scope.row[item.prop]) }}
                        </span>
                        <span v-else>{{  scope.row[item.prop] }}</span>
                    </span>
                    <span v-else>
                        <span v-if="scope.column.property == 'lackItem'">
                            <span style="color:red">*必填</span>
                            <el-input v-model="scope.row[item.prop]"></el-input>
                        </span>
                        <span v-else-if="scope.column.property == 'lackContent'">
                            <span style="color:red">*必填</span>
                            <el-input
                                v-model="scope.row[item.prop]" 
                                :autosize="{ minRows: 4, maxRows: 8}"
                                type="textarea"></el-input>
                        </span>
                        <el-input v-else-if="scope.column.property == 'improveContent' || 
                        scope.column.property == 'notPassReason' || 
                        scope.column.property == 'accordLaws' || 
                        scope.column.property == 'improvePlan'" 
                        v-model="scope.row[item.prop]" 
                        :autosize="{ minRows: 4, maxRows: 8}"
                        type="textarea"></el-input>

                        <span v-else-if="scope.column.property == 'status'">
                            <span style="color:red">*必填</span>
                            <el-select
                                v-model="scope.row[item.prop]"
                                placeholder="請選擇"
                                style="width:100%"
                                >
                                    <el-option
                                    v-for="(item,index) in dialogOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.id"
                                    >
                                    </el-option>  
                            </el-select>
                        </span>
                        
                    </span>
                </template>
            </el-table-column>
            
            <el-table-column
            fixed="right"
            label="操作">
            <template slot="header" >
                <i class="el-icon-circle-plus-outline" 
                @click="onAddRow" 
                style="cursor: pointer;font-size:25px;float:right"></i>
            </template>
            <template slot-scope="scope">
                <span v-if="scope.row['isEdit'] == false">
                    <el-button @click="handleLackClick('open',scope.row)" type="primary" size="small">編輯</el-button>
                    <el-button type="info" size="small" @click="handleLackClick('delete',scope.row)">刪除</el-button>    
                </span>
                <span v-else>
                    <el-button v-if="scope.row['id'] !== undefined"
                    @click="handleLackClick('update',scope.row)" type="primary" size="small">儲存</el-button>
                    <el-button v-else
                    @click="handleLackClick('create',scope.row)" type="primary" size="small">儲存</el-button>
                    <el-button type="info" size="small" @click="handleLackClick('cancel',scope.row)">取消</el-button>
                </span>
            </template>
            </el-table-column>

        </el-table>

        <el-table
            v-if="dialogStatus === 'authority'"
            :data="treeData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            ref="authorityTable"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            @select="handleSelectionChange"
            @select-all="handleSelectionAll"
            v-loading = "pictLoading">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
            <el-table-column
            prop="label"
            label="菜單"
            min-width="20%">
            </el-table-column>
            <el-table-column
            prop="linkAccessAuthorities"
            label="權限"
            min-width="80%">
            <template slot-scope="scope">
                <el-checkbox-group v-model="scope.row.accessAuthorities" @change="handleCheckedChange(scope.row)">
                    <el-checkbox 
                    v-for="item in scope.row.linkAccessAuthorities"
                    :key="item.id"
                    :label="item.id">
                    {{ item.name }}
                    </el-checkbox>
                </el-checkbox-group>
            </template>
            </el-table-column>
        </el-table>

        </keep-alive>
        
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
</template>

<script>
export default {
    components:{
        Upload:() => import('@/components/Upload/index.vue'),
        Table: () => import('@/components/Table/index.vue'),
    },
    props:{
        dialogData: {
            type: Array
        },
        visible: {
            type: Boolean,
            default: true
        },
        dialogStatus:{
            type: String
        },
        isHasButtons: {
            type: Boolean,
            default: true
        },
        buttonsName: {
            type: Array
        },
        config: {
            type: Array
        },
        title:{
            type: String,
            required: true
        },
        selectData: {
            type: Array
        },
        treeData: {
            type: Array
        },
        files:{
            type: Array
        },
        dialogOptions: {
            type: Array
        },
        specialId:{
            type: String,
            default:'0' 
        },
        //表單內的表格
        formtableData: {
            type: Array
        },
        itemkey: {
            type: Array,
            dafault : Math.random()
        },
        formtableconfig: {
            type: Array
        },
        formtablebuttonsName: {
            type: Array
        }
    },
    watch:{
        dialogData(){
            this.init()
        },
        treeData(){
            this.$nextTick(()=>{
                this.treeSelection()
            })
        }
    },
    computed:{
        label() {
            if (this.$store.state.app.device === 'mobile') {
                return 'top'
            } else {
                return 'left'
            }
        },
        dialogWidth(){
            if (this.$store.state.app.device === 'mobile') {
                return "90%"
            } else {
                if(this.title == 'maintain'){
                    return "1400px"
                }
                return "1000px"
            }
        },
        checkboxChange(){
            return function (a) {
                if(this.title == 'reportInspectio' | this.title == 'reportPublicSafe'){
                    return '改善'
                }else if(this.title == 'contactUnit'){
                    return '配合'
                }
            }
        },
        uploadAttrs(){
            return{
                files:this.files,
                title:this.title,
                specialId:this.specialId
            }
        },
        tableAttrs(){
            return {
                tableData: this.formtableData,
                itemkey:this.itemkey,
                config:this.formtableconfig,
                buttonsName:this.formtablebuttonsName
            }
        },
        tableEvent(){
            return {
                clickPagination:this.handleTableRow,
                handleTableRow:this.handleTableRow
            }
        },
        optionfilter(){
            return function (a) {
                if(a !== null ){
                    let _array = this.dialogOptions.filter((item, index) => 
                        item.classType == a 
                    )
                    return _array
                }else{
                    return ""
                }
            }   
        },
        stringToBr(){
            return function (a) {
                return a.replace(/{ln}/g, "<br/>")
            }
        },
        changeLabel(){
            return function (a) {
                if(a !== null){
                    var temp = this.dialogOptions.filter((item, index) => 
                    item.id == a 
                )
                    return temp[0].label
                }
                return ""
            }
        }
    },
    mounted(){
        this.init()
    },
    data() {
        return {
            textMap: {
                update: '編輯',
                create: '新增'
            },
            activeName:'',
            temp:{},
            rangevalue: [],
            origin:[],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            pictLoading:false,
            isSelectAll:false
        }
    },
    methods: {
        init(){
            if(this.dialogData.length){
                this.activeName = this.dialogData[0]['id']
                this.temp = Object.assign({}, this.dialogData[0])
                if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                    var _temp =  JSON.stringify(this.dialogData)
                    this.origin = JSON.parse(_temp)
                    if(this.dialogData[0]['checkStartDate'] !== null){
                        this.rangevalue = [this.dialogData[0]['checkStartDate'],
                        this.dialogData[0]['checkEndDate']]
                    }
                }
            }else{
                this.temp = {}
            }
        },
        treeSelection(){
            this.pictLoading = true
            this.$refs.authorityTable.clearSelection()
            var _temp = this.treeData
            for(var i =0;i<_temp.length;i++){
                if(_temp[i].accessAuthorities.length>0){
                    this.$refs.authorityTable.toggleRowSelection(_temp[i],true)
                }
                if(_temp[i].children.length >0){
                    var _below = _temp[i].children
                    for(var x=0;x<_below.length;x++){
                        if(_below[x].accessAuthorities.length>0){
                            this.$refs.authorityTable.toggleRowSelection(_below[x],true)
                        }
                    }
                }
            }
            this.pictLoading = false
        },
        handleClickOption(status){
            if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                this.temp['checkStartDate'] = this.rangevalue[0]
                this.temp['checkEndDate'] = this.rangevalue[1]
            }
            const tempData = Object.assign({}, this.temp)
            var data = status == 'authoritycreate' ? this.treeData : tempData
            this.$emit('handleDialog',this.title, status , data)
        },
        onAddRow(){
            if(this.title == 'reportInspectio'){
                var _temp = {
                    "lackItem":"",
                    "lackContent":"",
                    "improveContent":"",
                    "status":null,
                    "isEdit":true
                }
            }else{
                var _temp = {
                    "lackItem":"",
                    "lackContent":"",
                    "notPassReason":"",
                    "accordLaws":"",
                    "improvePlan":"",
                    "status":null,
                    "isEdit":true
                }
            }
            this.origin.push(_temp)
        },
        handleLackClick(index,row){
            console.log(index,JSON.stringify(row))
            if(index === 'cancel'){
                var _temp =  JSON.stringify(this.dialogData)
                this.origin = JSON.parse(_temp)
            }else if(index === 'delete'){
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                    this.$emit('handleDialog','Lack', index , row.id)
                }).catch(() => {
                })
            }else if(index === 'create' || index === 'update'){
                if(row.lackItem === '' || row.lackContent === '' || row.status === null){
                    this.$message({
                        message: '請輸入缺失項目 & 缺失內容 & 改善狀態',
                        type: 'warning'
                    })
                }else{
                    row.status = parseInt(row.status)
                    this.$emit('handleDialog','Lack', index , row)
                }
            }else if(index === 'open'){
                if(row.status !== null){
                    row.status = row.status.toString()
                }
                row.isEdit = true
            }
        },
        async handleTabClick(tab, event) {
            await this.$api.building.apiGetUser(tab.name).then(response => {
                this.temp = response.result[0]
            })
        },
        async handleFilesUpload(index,title,data) { 
            this.$emit('handleDialog',this.title, index , data)
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
                await this.$api.authority.apiDeleteAccessAuthority(row.id).then(async(response)=>{
                    this.$message('刪除成功')
                    await this.getAllAccessAuthority()
                })
            }
            else if(option === '新增'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleSelectionChange(selection, row){
            var isSelect = selection.filter((obj,index)=> obj.id == row.id)
            if(isSelect.length > 0){ //選取
                if(row.linkMainMenus.length>0){
                    row.children.forEach(children =>{
                        this.$refs.authorityTable.toggleRowSelection(children,true)
                        if(children.linkAccessAuthorities.length > 0){
                            children.accessAuthorities = []
                            children.linkAccessAuthorities.forEach(ele=>{
                                children.accessAuthorities.push(ele.id)
                            })
                        }
                    })
                }else{
                    row.accessAuthorities = []
                    row.linkAccessAuthorities.forEach(ele=>{
                        row.accessAuthorities.push(ele.id)
                    })
                }
            }else{
                row.accessAuthorities = []
                if(row.linkMainMenus.length>0){
                    row.children.forEach(ele=>{
                        this.$refs.authorityTable.toggleRowSelection(ele,false)
                        ele.accessAuthorities = []
                    })
                }
            }
            
        },
        async handleCheckedChange(row){
            if(row.accessAuthorities.length>0){
                this.$refs.authorityTable.toggleRowSelection(row,true)
            }else{
                this.$refs.authorityTable.toggleRowSelection(row,false)
            }
        },
        async handleSelectionAll(val){
            // console.log(JSON.stringify(val))
            // if(!this.isSelectAll){
            //     val.forEach( item => {
            //         if(item.children.length>0){
            //             item.children.forEach(children=>{
            //                 this.$refs.authorityTable.toggleRowSelection(children,true)
            //             })
            //         }
            //     })
            //     this.isSelectAll = true
            // }else{
            //     this.treeData.forEach( item => {
            //         if(item.children.length>0){
            //             item.children.forEach(children=>{
            //                 this.$refs.authorityTable.toggleRowSelection(children,false)
            //             })
            //         }
            //     })
            //     this.isSelectAll = false
            // }
        }
    }
}
</script>
