<template>
    <div>
      <el-dialog
        top="5vh"
        :width="dialogWidth"
        :title="textMap[dialogStatus]"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="handleClickOption('cancel')"
        center>
        <div v-if="dialogData.length > 1" >
           <el-tabs 
            v-model="activeName" 
            @tab-click="handleTabClick">
                <el-tab-pane
                v-for="(item) in dialogData"
                :key="item.id"
                :label="title === 'floorOfHouse' ? item.houseNumber :
                title === 'lack' ? item.lackItem : item.name "
                :name="item.id"></el-tab-pane>
            </el-tabs>
        </div>
        <!-- dialogStatus : 一般表單/upload/lack/authority -->
        <keep-alive>

        <el-form v-if="dialogStatus !== 'upload' && dialogStatus !== 'lack' 
        && dialogStatus !== 'authority'
         && dialogStatus !== 'exportExcel' && dialogStatus !== 'uploadExcel' 
         && dialogStatus !== 'selectMaintain' && dialogStatus !== 'floor' "
        ref="dataForm"  
        :model="temp"  
        :label-position="label" 
        label-width="auto" 
        
            >
            <!-- v-show="item.format !== 'hide' &&  item.format !== 'Options' &&  
            item.format !== 'openfiles' 
            &&  item.format !== 'openlacks' && item.format !== 'deviceName' " -->
            <el-form-item 
            v-for="(item, index) in config"
            :key="index"
            :prop="item.prop"
            v-show="item.isEdit"
            :rules="[
                { required: item.mandatory, message: item.message},
                item.isPattern ? 
                    { pattern: item.pattern , message:item.errorMsg } : 
                    { type: item.type, message: item.typemessage }
            ]"
            >
                <!-- label -->
                <span v-if="item.isAssociate == false" slot="label">{{ item.label }}</span>
                <i v-else slot="label" class="el-icon-edit">
                    <a @click="openWindows(item.format)" style="color:#66b1ff"> {{ item.label }} </a>
                </i>
                <!-- 年度&日期 -->
                <el-date-picker 
                v-if="item.format == 'YYYY' || item.format == 'YYYY-MM-DD'" 
                v-model="temp[item.prop]" 
                value-format="yyyy-MM-dd" 
                placeholder="請選擇"
                style="width:100%"
                :type="item.format == 'YYYY' ? 'year' : 'date' " /> 
                <!-- 範圍 -->
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
                <!-- 設備種類下拉選單(多-1) -->
                <el-select
                    v-else-if="item.format =='deviceTypeSelect'"
                    v-model="temp[item.prop]"
                    filterable
                    multiple
                    :multiple-limit="1"
                    value-key="id"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="(item,index) in selectfilter(item.format)"
                        :key="index"
                        :label="item.getSelectName()"
                        :value="item"
                        >
                        </el-option>  
                </el-select>
                <!-- 設備 / 廠商 / 角色 / 建築物 下拉選單(多) -->
                <el-select
                    v-else-if="item.format == 'deviceSelect' || 
                    item.format =='contactunitSelect' || 
                    item.format =='roleSelect' ||  
                    item.format =='buildingSelect' || 
                    item.format == 'floorOfHouseSelect'
                    || item.format =='userInfo'  "
                    v-model="temp[item.prop]"
                    value-key="id"
                    filterable
                    multiple 
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option
                        v-for="item in selectfilter(item.format)"
                        :key="item.id"
                        :label="item.label"
                        :value="item"
                        >
                        </el-option>  
                </el-select>
                <!-- 檢修申報下拉選單(多)-->
                <el-select
                    v-else-if="item.format == 'inspectionSelect' "
                    v-model="temp[item.prop]"
                    filterable
                    multiple
                    value-key="id"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                        <el-option-group
                        v-for="group in selectfilter('inspectionSelect')"
                        :key="group.label"
                        :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item"
                                :disabled="item.status !== ''">
                            </el-option>
                        </el-option-group>
                </el-select>
                <!-- 設備種類(後端)下拉選單(單) -->
                <el-cascader
                    v-else-if="item.format == 'fullType' "
                    v-model="fulltypevalue"
                    placeholder="請選擇"
                    :options="selectfilter('fullTypeSelect')"
                    filterable
                    style="width:100%"
                    clearable
                    @change="changeFullType">
                </el-cascader>
                <!-- 設定的下拉選單(單) -->
                <el-select
                    v-else-if="item.format =='BrandOptions' || 
                    item.format =='MaintainContentOptions' 
                    || item.format =='MaintainProcessOptions' || 
                    item.format == 'DeviceStatusOptions' 
                    || item.format == 'ContactUnitOptions' || 
                    item.format == 'LackStatusOptions'
                    "
                    ref="settingOption"
                    v-model="temp[item.prop]"
                    filterable
                    placeholder="請選擇項目，可直接新增值"
                    style="width:100%"
                    allow-create
                    default-first-option
                    @change="changeValue($event,item.format,item.prop)"
                    >
                        <el-option
                        v-for="(item,index) in optionfilter(item.format)"
                        :key="index"
                        :label="item.textName"
                        :value="item.id"
                        >
                        </el-option>  
                </el-select>
                <!-- 地址 -->
                <span
                 v-else-if="item.format =='address'">
                    <el-cascader
                      v-model="addressvalue"
                      :options="selectfilter(item.format)"
                      :props="{ value: 'label'}"
                      style="width:100%"
                      @change="handleChange"
                      placeholder="請選擇縣市區域"
                      ></el-cascader>
                    <el-input ref="address" name="address" v-model="temp[item.prop]"  
                      show-word-limit maxlength="100"/> 
                </span>
                <!-- <el-select
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
                </el-select> -->
                <!-- 權限設定 -->
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
                <!-- Boolean:啟用禁用 允許/禁止刪除 配合 改善 -->
                <el-select
                    v-else-if="item.format =='accountStatusSelect' || item.format == 'collaborateBoolean'
                    || item.format == 'removableSelect' || item.format == 'improvedBoolean'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option v-for="(val,index) in [true, false]" 
                    :key="index"
                    :value="val" :label="val | changeBoolean(item.format)"></el-option>
                </el-select>
                <!-- inputnumber -->
                <el-input
                v-else-if="item.format =='inputnumber'"
                v-model.number="temp[item.prop]" 
                type="number" :min="0"  :placeholder="item.placeholder" >
                    <template 
                    v-if="item.prop == 'floorsOfAboveGround' || 
                    item.prop == 'floorsOfUnderground'"
                    slot="prepend">
                    {{ item.prop == 'floorsOfAboveGround' ? '地上' : '地下'}}
                    </template>
                    <template 
                    v-if="item.prop !== 'sort'"
                    slot="append">
                        <span v-if="item.prop =='area'">m<sup>2</sup></span>
                        <span v-else-if="item.prop == 'capacity'">人</span>
                        <span v-else-if="item.prop == 'height'">m</span>
                        <span v-else>樓</span>
                    </template>
                </el-input>

                <el-autocomplete
                v-else-if="item.format =='searchColumn'"
                class="inline-input"
                v-model="temp[item.prop]"
                :fetch-suggestions="querySearch"
                :placeholder="item.placeholder"
                style="width:100%"
                ></el-autocomplete>   

                <el-input v-else-if="item.format =='textarea'"
                v-model="temp[item.prop]" 
                :autosize="{ minRows: 4, maxRows: 8}"
                maxlength="200"
                type="textarea"
                show-word-limit>
                </el-input>

                <div v-else-if="item.format =='openmaintain' ">
                    <Table 
                        :list-query-params.sync="listQueryParams"
                        v-bind="tableAttrs" 
                        v-on="tableEvent">
                    </Table>  
                </div>
                
                <el-input v-else
                v-model="temp[item.prop]" 
                :maxlength="item.maxlength"
                show-word-limit
                :placeholder="item.placeholder"
                >
                </el-input>

            </el-form-item>
        </el-form>

        </keep-alive>
        <!-- 檔案 -->
        <Upload v-if="dialogStatus === 'upload'"
        v-bind="uploadAttrs" 
        v-on:handleFilesUpload="handleFilesUpload">
        </Upload>   
        <!-- 缺失內容 -->
        <Table v-if="dialogStatus === 'lack' || dialogStatus === 'floor'"
        :list-query-params.sync="listQueryParams"
        v-bind="tableAttrs" 
        v-on="tableEvent">
        </Table>  
        <!-- 分配權限 -->
        <el-table v-if="dialogStatus === 'authority'"
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
            :row-class-name="rowClass"
            v-loading = "pictLoading">
            <el-table-column
            type="selection"
            :selectable="selectable"
            width="55">
            </el-table-column>
            <el-table-column
            prop="name"
            label="菜單"
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
        <!-- 下載檔案 -->
        <ExportExcel  v-if="dialogStatus === 'exportExcel'"
            v-bind="exportExcelAttrs">
        </ExportExcel>
        <!-- 上傳檔案 -->
        <UploadExcel  v-if="dialogStatus === 'uploadExcel'"
        :config="config"
        v-on:handleFilesUpload="handleFilesUpload">
        </UploadExcel>
        

        <el-select v-if="dialogStatus === 'selectMaintain'"
            v-model="maintainListID"
            filterable
            placeholder="請選擇"
            style="width:100%"
            value-key="id"
            >
                <el-option
                    v-for="(item,index) in selectData"
                    :key="index"
                    :label="item.getName()"
                    :value="item"
                >
                </el-option>  
        </el-select>
        
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
import Setting from '@/object/setting'
import { changeDeviceFullType } from '@/utils/index'
import constant from '@/constant/index'

export default {
    name:'Dialog',
    mixins:[computedmixin],
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
        //exportExcel
        exportExcelData: {
            type: Array
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
        accessAuthoritiesData:{ 
            handler:function(){
                this.$nextTick(()=>{
                    this.$refs.authorityTable.clearSelection()
                    this.accessArray = JSON.parse(JSON.stringify(this.accessAuthorities))
                    this.treeSelection()
                })
            }
        },
        // buildingdevices:{
        //     handler:function(){
        //         console.log('changeDevices')
        //         console.log(JSON.stringify(this.buildingdevices))
        //     },
        //     immediate:true
        // }
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
                if(this.dialogStatus == 'exportExcel'){
                    return "500px"
                }
                if(this.title == 'maintainList' || 
                this.title == 'lack'){
                    return "1400px"
                }
                return "1000px"
            }
        },
        uploadAttrs(){
            return{
                files:this.files,
                title:this.title,
                specialId:this.specialId
            }
        },
        exportExcelAttrs(){
            return{
                exportExcelData:this.exportExcelData,
                config:this.config,
                title:this.title
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
        selectfilter(){
            return function (value) {
                if(value !== null ){
                    switch(value){
                        case 'deviceSelect':
                            return this.buildingdevices.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getLinkType().getSelectName()+'-'+v.getOnlyName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'contactunitSelect':
                            return this.buildingcontactunit.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'inspectionSelect':
                            return this.selectData
                        case 'floorOfHouseSelect':
                            return this.selectData
                        case 'userInfo':
                            if(this.title == 'building'){
                                return this.selectData
                            }else{
                                return this.buildingusers.map(v => {
                                    this.$set(v, 'value', v.getID()) 
                                    this.$set(v, 'label', v.getName()) 
                                    this.$set(v, 'id', v.getID()) 
                                    return v
                                })
                            }
                        case 'roleSelect' :
                            return this.buildingroles.map(v => {
                                this.$set(v, 'value', v.getID()) 
                                this.$set(v, 'label', v.getName()) 
                                this.$set(v, 'id', v.getID()) 
                                return v
                            })
                        case 'deviceTypeSelect':
                            return this.selectData
                        case 'buildingSelect' :
                            return this.buildingarray.map(v => {
                                this.$set(v, 'value', v.id) 
                                this.$set(v, 'label', v.buildingName) 
                                this.$set(v, 'id', v.id) 
                                return v
                            })
                        case 'fullTypeSelect':
                            return this.deviceType
                        case 'address':
                            return constant.AreaCode
                    }
                }else{
                    return ""
                }
            }  
        }
    },
    data() {
        return {
            textMap: {
                update: '編輯',
                create: '新增',
                selectMaintain: '關聯維保大項'
            },
            activeName:'',
            temp:{},
            rangevalue: [],
            fulltypevalue:[],
            addressvalue:[],
            pictLoading:false,
            accessArray:[],
            createOption:[],
            prop:[],
            maintainListID:'',
            
        }
    },
    methods: {
        init(){
            if(this.dialogData.length){
                this.activeName = this.dialogData[0].getID()
                this.temp = this.dialogData[0].clone(this.dialogData[0])
                if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                    if(this.dialogData[0]['checkStartDate'] !== null){
                        this.rangevalue = [this.dialogData[0]['checkStartDate'],
                        this.dialogData[0]['checkEndDate']]
                    }
                }
                if(this.title == 'devicetype'){
                    var fullType = this.dialogData[0]['fullType']
                    var value = changeDeviceFullType(fullType,true,false)
                    this.fulltypevalue = [value,fullType]
                }
            }
            if(this.dialogStatus !== 'upload' && this.dialogStatus !== 'lack' 
                && this.dialogStatus !== 'authority' && this.dialogStatus !== 'exportExcel' 
                && this.dialogStatus !== 'uploadExcel' && this.dialogStatus !== 'selectMaintain'){
                this.$nextTick(() => {
                    if(this.$refs.dataForm !== undefined){
                        this.$refs.dataForm.clearValidate()
                    }
                })
            }
        },
        treeSelection(){ //初始化控制表格checkbox&row是否勾選狀態
            this.pictLoading = true
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
            this.pictLoading = false
        },
        optionfilter(format){
            if(format !== null ){
                let _array = this.buildingoptions.filter((item, index) => 
                    item.classType == format 
                )
                return _array
            }else{
                return ""
            }
        },
        querySearch(queryString, cb) {
            var restaurants = this.selectData
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : this.selectData
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
                console.log(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()))
                return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
            }
        },
        //打開新視窗
        openWindows(format){
            var routeData
            switch (format) {
                case 'userInfo':
                    if(this.buildingid == undefined){
                        this.$message.error('請選擇建築物後才可對所有權人&防火管理人進行新增')
                    }else{
                        routeData = this.$router.resolve(
                            { path: '/normal/basic',query:{ type:'user' } })
                    }
                    break;
                case 'deviceTypeSelect':
                    routeData = this.$router.resolve(
                            { path: '/equipment/type',query:{ type:'devicetype' } })
                    break;
                case 'contactunitSelect':
                    routeData = this.$router.resolve(
                            { path: '/normal/basic',query:{ type:'contactunit' } })
                    break;
                case 'floorOfHouseSelect':
                    routeData = this.$router.resolve(
                            { path: '/normal/basic',query:{ type:'floorOfHouse' } })
                    break;
                case 'inspectionSelect':
                    routeData = this.$router.resolve(
                            { path: '/normal/maintenancereport',query:{ type:'inspection' } })
                    break;
                case 'deviceSelect':
                    routeData = this.$router.resolve(
                            { path: '/equipment/index',query:{ type:'device' } })
                    break;
                case 'roleSelect':
                    routeData = this.$router.resolve(
                            { path: '/authority/roles',query:{ type:'role' } })
                    break;
                case 'MaintainProcessOptions':
                   routeData = this.$router.resolve({ name: 'sys-Setting' })
                    break;
                case 'MaintainContentOptions':
                   routeData = this.$router.resolve({ name: 'sys-Setting' })
                    break;
                case 'LackStatusOptions':
                   routeData = this.$router.resolve({ name: 'sys-Setting' })
                    break;
                default:
                    break;
            }
            window.open(routeData.href, '_blank')
        },
        //動態新增選項
        changeValue(event,format,prop){
            console.log(format)
            var array = this.optionfilter(format)
            var data = array.filter(item=> item.id == event)
            if(data.length == 0){
                var item = {
                    classType:format,
                    textName:event
                }
                this.prop.push(prop)
                this.createOption.push(item)
            }
        },
        async getOptions(){ //取得大樓的所有分類
            this.options = await Setting.getAllOption()
            this.$store.dispatch('building/setbuildingoptions',this.options)
        },
        //fulltype選單變動
        changeFullType(){
             this.temp['fullType'] = this.fulltypevalue[1]
        },
        //子傳父窗口
        handleClickOption(status){
            if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                this.temp['checkStartDate'] = this.rangevalue[0]
                this.temp['checkEndDate'] = this.rangevalue[1]
            }
            if(status !== 'cancel' && status !== 'cancellack' && status !== 'empty' && 
            status !== 'cancelfloor' &&
            this.dialogStatus !== 'upload' && this.dialogStatus !== 'exportExcel' && 
            this.dialogStatus !== 'uploadExcel' && this.dialogStatus !== 'selectMaintain' 
            &&
            this.dialogStatus !== 'lack' && this.dialogStatus !== 'floor' &&
             this.dialogStatus !== 'authority'){
                this.$refs.dataForm.validate(async(valid) => {
                    if (valid) {
                        if(this.createOption.length !== 0){ //有動態新增選項
                            for(var i =0;i<this.createOption.length;i++){
                                var isOk = await Setting.postOption(this.createOption[i])
                                if(isOk !== null){
                                    this.temp[this.prop[i]] = isOk.id
                                }
                            }
                            this.createOption = []
                            this.prop = []
                            await this.getOptions()
                        }
                        this.$emit('handleDialog',this.title, status , this.temp)   
                        
                    } else {
                        this.$message.error('請輸入完整資訊')
                        return false
                    }
                })
            }
            if(status == 'cancel' || status == 'cancellack' || status == 'cancelfloor' ||
            status == 'empty' || status == 'authoritycreate' ){
                var data = status == 'authoritycreate' ? this.accessArray : ''
                this.$emit('handleDialog',this.title, status , data)
            }else if (status == 'openempty'){
                console.log('tablemaintainlist')
                this.$emit('handleDialog','maintainList', status , '')
            }else if (status == 'tablemaintain'){
                this.$emit('handleDialog',this.title, 'empty' , this.maintainListID)
            }
        },
        //地址欄位
        handleChange(value){
            this.temp.address = value[0]+value[1]
        },
        //table表格
        handleTableClick(title,index,row){
            var str = title == '' ? this.title : title
            this.$emit('handleDialog', str , index , row)
        },
        //table表格分頁
        clickPagination(){
            this.$emit('handleDialog', this.title , 'clickPagination' , 
            this.listQueryParams)
        },
        //頁籤
        async handleTabClick(tab, event) {
            this.temp = this.dialogData
             .filter((element,index) => element.id == tab.name)[0]
        },
        async handleFilesUpload(index,title,data) { 
            this.$emit('handleDialog',this.title, index , data)
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
.el-table /deep/.disabledCheck .cell .el-checkbox__inner{
    display: none!important;
}
.el-table /deep/.disabledEdit  .cell .is-checked .el-checkbox__label{
    color: red;
}
</style>