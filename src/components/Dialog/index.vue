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

        <el-tabs 
        v-else-if="title === 'floorOfHouse' && dialogData.length > 1" 
        v-model="activeName" 
        @tab-click="handleTabClick">
            <el-tab-pane
            v-for="(item) in dialogData"
            :key="item.id"
            :label="item.houseNumber"
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
                    item.format == 'floorOfHouseSelect' "
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
                    v-else-if="item.format == 'deviceSelect' || item.format =='contactunitSelect' || 
                    item.format == 'inspectionSelect' || item.format =='roleSelect' ||  item.format =='buildingSelect' "
                    v-model="temp[item.prop]"
                    filterable
                    multiple 
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="(item,index) in selectfilter(item.format)"
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
                    || item.format =='MaintainProcessOptions' || item.format == 'DeviceStatusOptions' 
                    || item.format == 'ContactUnitOptions' || item.format == 'LackStatusOptions'
                    "
                    v-model="temp[item.prop]"
                    filterable
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="(item,index) in optionfilter(item.format)"
                        :key="index"
                        :label="item.textName"
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
                    v-else-if="item.format =='processContentSelect'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option label="檢修申報" key="1" value="檢修申報"></el-option>
                    <el-option label="一般檢查" key="2" value="一般檢查"></el-option>
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
                maxlength="200"
                type="textarea"
                show-word-limit>
                </el-input>

                <div v-else-if="item.format =='openmaintain' ">
                    <DialogTable 
                        :list-query-params.sync="listQueryParams"
                        v-bind="tableAttrs" 
                        v-on="tableEvent">
                    </DialogTable>  
                </div>
                
                <el-input v-else
                v-model="temp[item.prop]" 
                :maxlength="item.maxlength"
                show-word-limit
                >
                </el-input>

            </el-form-item>
        </el-form>

        <Upload 
        v-if="dialogStatus === 'upload'"
        v-bind="uploadAttrs" 
        v-on:handleFilesUpload="handleFilesUpload"></Upload>   
        
        <DialogTable 
        v-if="dialogStatus === 'lack'"
        :list-query-params.sync="listQueryParams"
        v-bind="tableAttrs" 
        v-on="tableEvent"></DialogTable>  
        
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
                <el-checkbox-group v-model="accessArray" @change="handleCheckedChange(scope.row)">
                    <el-checkbox 
                    v-for="item in scope.row.linkAccessAuthorities"
                    :key="item.id"
                    :label="item.id">
                    {{ item.name  }}
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
import { changeLink } from '@/utils'
import { mapGetters } from 'vuex'
export default {
    components:{
        Upload:() => import('@/components/Upload/index.vue'),
        Table: () => import('@/components/Table/index.vue'),
        DialogTable: () => import('@/components/Table/Table.vue'),
    },
    props:{
        dialogData: {
            type: Array,
            default: function () {
                return []
            }
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
        //auth
        treeData: {
            type: Array
        },
        accessAuthorities: {
            type: Array,
            default: function () {
                return []
            }
        },
        //upload
        files:{
            type: Array,
            default: function () {
                return []
            }
        },
        specialId:{
            type: String,
            default:'0' 
        },
        //表單內的表格
        formtableData: {
            type: Array,
            default: function () {
                return []
            }
        },
        formtableconfig: {
            type: Array
        },
        listQueryParams:{
            type:Object
        }
    },
    watch:{
        dialogData:{ 
            handler:function(){
                this.init()
            },
            immediate:true
        },
        treeData:{ 
            handler:function(){
                this.$nextTick(()=>{
                    this.$refs.authorityTable.clearSelection()
                    this.accessArray = this.$deepClone(this.accessAuthorities)
                    this.treeSelection()
                })
            },
        }
    },
    computed:{
        ...mapGetters([
            'buildingoptions',
            'buildingusers',
            'buildingdevices',
            'buildingcontactunit',
            'buildingroles',
            'buildingarray'
        ]),
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
                if(this.title == 'maintainList' || this.title == 'maintain' || this.title == 'lack'){
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
                title:this.title,
                tableData: this.formtableData,
                config:this.formtableconfig
            }
        },
        tableEvent(){
            return {
                clickPagination:this.clickPagination,
                handleTableClick:this.handleTableClick
            }
        },
        optionfilter(){
            return function (a) {
                if(a !== null ){
                    let _array = this.buildingoptions.filter((item, index) => 
                        item.classType == a 
                    )
                    return _array
                }else{
                    return ""
                }
            }   
        },
        selectfilter(){
            return function (value) {
                if(value !== null ){
                    switch(value){
                        case 'deviceSelect':
                            return this.buildingdevices.map(v => {
                                this.$set(v, 'value', v.id) 
                                this.$set(v, 'label', v.name) 
                                this.$set(v, 'id', v.id) 
                                return v
                            })
                        case 'contactunitSelect':
                            return this.buildingcontactunit.map(v => {
                                this.$set(v, 'value', v.id) 
                                this.$set(v, 'label', v.name) 
                                this.$set(v, 'id', v.id) 
                                return v
                            })
                        case 'inspectionSelect':
                            return this.selectData
                        case 'roleSelect' :
                            return this.buildingroles.map(v => {
                                this.$set(v, 'value', v.id) 
                                this.$set(v, 'label', v.name) 
                                this.$set(v, 'id', v.id) 
                                return v
                            })
                        case 'buildingSelect' :
                            return this.buildingarray.map(v => {
                                this.$set(v, 'value', v.id) 
                                this.$set(v, 'label', v.buildingName) 
                                this.$set(v, 'id', v.id) 
                                return v
                            })
                    }
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
            return function (value) {
                if(value !== null){
                    let _array = this.buildingoptions.filter((item, index) => 
                        item.id == value 
                    )
                    return _array[0].textName
                }
                return ""
            }
        },
        changeAccess(){
            return function (value) {
                if(value !== null){
                    let _array = this.selectData.filter((item, index) => 
                        item.id == value 
                    )
                    return _array[0].name
                }
                return ""
            }
        }
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
            pictLoading:false,
            isSelectAll:false,
            accessArray:[]
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
                if(this.dialogStatus !== 'upload' && this.dialogStatus !== 'lack' && this.dialogStatus !== 'authority'){
                    this.$nextTick(() => {
                        if(this.$refs.dataForm !== undefined){
                            this.$refs.dataForm.clearValidate()
                        }
                    })
                }
            }
        },
        treeSelection(){
            this.pictLoading = true
            var _temp = this.treeData
            for(var i =0;i<_temp.length;i++){
                _temp[i].linkAccessAuthorities.forEach(item=>{
                    var index = this.accessArray.indexOf(item.id)
                    if(index !== -1){
                        this.$refs.authorityTable.toggleRowSelection(_temp[i],true)
                    }
                })
                var _below = _temp[i].children
                for(var x=0;x<_below.length;x++){
                    _below[x].linkAccessAuthorities.forEach(item=>{
                        var index = this.accessArray.indexOf(item.id)
                        if(index !== -1){
                            this.$refs.authorityTable.toggleRowSelection(_below[x],true)
                        }
                    })
                }
            }
            this.pictLoading = false
        },
        handleClickOption(status){
            console.log(this.title , status , this.dialogStatus)
            if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                this.temp['checkStartDate'] = this.rangevalue[0]
                this.temp['checkEndDate'] = this.rangevalue[1]
            }
            if(status !== 'cancel' && status !== 'cancellack' && status !== 'empty' && 
            this.dialogStatus !== 'upload' && 
            this.dialogStatus !== 'lack' && this.dialogStatus !== 'authority'){
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        const tempData = Object.assign({}, this.temp)
                        this.$emit('handleDialog',this.title, status , tempData)     
                    } else {
                        this.$message.error('請輸入完整資訊')
                        return false
                    }
                })
            }
            if(status == 'cancel' || status == 'cancellack' || 
            status == 'empty' || status == 'authoritycreate'){
                var data = status == 'authoritycreate' ? this.accessArray : ''
                this.$emit('handleDialog',this.title, status , data)
            }
            
            // const tempData = Object.assign({}, this.temp)
            // var data = status == 'authoritycreate' ? this.treeData : tempData
            // this.$emit('handleDialog',this.title, status , data)
        },
        handleTableClick(title,index,row){
            this.$emit('handleDialog', title , index , row)
        },
        clickPagination(){
            this.$emit('handleDialog', this.title , 'clickPagination' , this.listQueryParams)
        },
        async handleTabClick(tab, event) {
            if(this.title === 'user'){
                this.temp = this.buildingusers.filter((element,index) => element.id == tab.name)[0]
            }else{
                var data = this.$deepClone(await this.$obj.Building.getBuildingOfHouseById(tab.name))
                this.temp = changeLink('floorOfHouse',data,'open')
            }
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
            }else if(option === '新增'){
                this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'create'},
                { name:'取消',type:'info',status:'cancel'}]
                this.innerVisible = true
                this.dialogStatus = 'create'
            }
        },
        async handleSelectionChange(selection, row){ //先檢查該列是否原先有被選取的選項 有的話先刪除 無的話則加入全部
            var isSelect = selection.filter((item,index) => item.id == row.id)
            var isLevelOne = row.children.length > 0 // 是否為第一層
            if(!isLevelOne){
                row.linkAccessAuthorities.forEach(item=>{
                    if(isSelect.length == 0){
                        var index = this.accessArray.indexOf(item.id)
                        if(index !== -1){
                            this.accessArray.splice(index, 1)
                        }
                    }else{
                        this.accessArray.push(item.id)
                    }
                })
            }else{
                row.children.forEach(children=>{
                    children.linkAccessAuthorities.forEach(item=>{
                        var index = this.accessArray.indexOf(item.id)
                        if(isSelect.length > 0){
                            this.$refs.authorityTable.toggleRowSelection(children,true)
                            if(index === -1){
                                this.accessArray.push(item.id)
                            }
                        }else{
                            this.$refs.authorityTable.toggleRowSelection(children,false)
                            this.accessArray.splice(index, 1)
                        }
                    })
                })
            }
            console.log(JSON.stringify(this.accessArray))
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
        async handleSelectionAll(val){
            console.log(JSON.stringify(val))
            // if(!this.isSelectAll){
            //     val.forEach(async(item) => {
            //         await this.handleSelectionChange(val,item)
            //         item.children.forEach(async(children)=>{
            //             this.$refs.authorityTable.toggleRowSelection(children,true)
            //             await this.handleSelectionChange(val,children)   
            //         })
            //     })
            //     this.isSelectAll = true
            //  }else{
            //     this.$refs.authorityTable.clearSelection()
            //     this.treeData.forEach(obj=>{
            //         obj.accessAuthorities = []
            //         obj.children.forEach(ele=>{
            //             ele.accessAuthorities = []
            //         })
            //     })
            //     this.isSelectAll = false
            // }
        }
    }
}
</script>
