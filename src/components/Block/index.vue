<template>
<div>
    <el-row  :gutter="gutter">
        <div class="infinite-list-wrapper" :style="{ height: infiniteheight+'px' }">
            <div style="margin-bottom:50px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <el-input 
                    v-if="hasSearch == true"
                    placeholder="請輸入內容，多條件搜尋請依左側'勾選條件'依序輸入值並以'逗號'區隔" 
                    v-model="inputSearch" class="input-with-select" style="width:42%;float:right" clearable
                    @clear="clearInputSearch" @keyup.enter.native="handleSearchWord"
                    >
                        <el-select
                            v-model="inputSelect"
                            filterable
                            multiple
                            slot="prepend"
                            value-key="id"
                            placeholder="請選擇欄位"
                            style="width:170px"
                            collapse-tags
                            clearable 
                            >
                                <el-option
                                v-for="(item,index) in inputSelectChange()"
                                :key="index"
                                :label="item.label"
                                :value="item.prop"
                                >
                                </el-option>  
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="handleSearchWord"></el-button>
                    </el-input>
                    <el-button
                        v-if="title == 'maintain' || title == 'maintainList'"
                        class="filter-item" 
                        type="primary" 
                        @click="change">
                            <span> {{ isTable == false ? '檢視所有細項' : '檢視大項'}} </span>                  
                    </el-button>
                    <el-button
                        v-if="isTable == false"
                        class="filter-item" 
                        type="primary" 
                        @click="handleClickOption('empty','')">
                        新增
                    </el-button>
                    <!-- <el-button
                        v-if="title == 'address'"
                        class="filter-item" 
                        type="primary" 
                        @click="handleClickOption('update',updateArray)"
                        >
                        儲存
                    </el-button> -->
                    
                </el-col>
            </div>
            <div v-if="isTable == false" 
            >
              <div 
              v-for="(item,index) in blockData" 
              :key="index"
              >
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <div class="dashboard-wrapper" :style="FirstheightChange">
                    <div class="wrapper" :style="heightChange">
                        <div 
                        v-for="(option,index) in rowlabel"
                        :key="index"
                        width="100%"
                        >
                            <div :style="{display:'inline-block','vertical-align':'top','padding-top':'5px',
                            width:labelstyle}">
                                <span>{{ option.label }} :</span>
                            </div>
                            <div :style="{display:'inline-block','word-break':'break-all','padding-top':'5px',
                            width:itemstyle}">
                                <span v-if="option.format == 'YYYY' | option.format === 'YYYY-MM-DD'">
                                {{ dataStr(item[option.prop],option.format) }}
                                </span>
                                
                                <span v-else-if="option.format == 'range' ">
                                    {{ dataStr(item['checkStartDate'],'YYYY-MM-DD') }} 
                                    <span v-if="item['checkStartDate'] !== null">~</span> 
                                    {{ dataStr(item['checkEndDate'],'YYYY-MM-DD') }}
                                </span>

                                <el-tag v-else-if="option.format == 'tag' "
                                :class="item[option.prop] === false ? 'tag-co' : 'tag-noco' "
                                > 
                                    {{ tagChange(item[option.prop]) }}
                                </el-tag>

                                <span v-else-if="option.format == 'fullType' ">
                                {{ item.getType() }}
                                </span>

                                <span v-else-if="option.format == 'userInfo' " 
                                @click="clickMessageBox('住戶資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeUserName(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'accountStatusSelect' ">
                                    {{ item[option.prop] | changeStatus }}
                                </span>

                                <span v-else-if="option.format == 'MaintainContentOptions' || 
                                option.format == 'MaintainProcessOptions' || 
                                option.format == 'BrandOptions' || option.format == 'ContactUnitOptions' ||
                                option.format == 'DeviceStatusOptions' "
                                >
                                {{ changeOptionName(item[option.prop]) }}
                                </span>
                                
                                <span v-else-if="option.format == 'floorOfHouseSelect' " 
                                @click="clickMessageBox('門牌資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeUsageOfFloor(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'floorOfHouseUsersName' " 
                                @click="clickMessageBox('住戶資料','floorOfHouseUsersName',item.getlinkUsageOfFloorsUser())"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeUsageOfFloorUsersName(item.getlinkUsageOfFloorsUser()) }}
                                </span>

                                <span v-else-if="option.format == 'deviceSelect' " 
                                @click="clickMessageBox('設備資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeDevice(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'deviceTypeSelect' "
                                @click="clickMessageBox('設備種類',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ item.getLinkType().getSelectName()  }}
                                </span>

                                <span v-else-if="option.format == 'contactunitSelect' " 
                                @click="clickMessageBox('廠商資料',option.format,item[option.prop])"
                                 style="color:#66b1ff;cursor:pointer">
                                    {{ changeContainUnit(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'buildingSelect' " 
                                @click="clickMessageBox('建築物資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeBuilding(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'roleSelect' " 
                                @click="clickMessageBox('角色資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeRoles(item[option.prop]) }}
                                </span>

                                <el-input v-else-if="option.format == 'address' "
                                v-model="item[option.prop]"
                                :maxlength="option.maxlength"
                                show-word-limit
                                @change="checkUpdate(item)"
                                @input="item[option.prop] = 
                                item[option.prop].replace(/[^\d]/g,'').replace(/\s*/g,'')">
                                </el-input>
                                
                                <span v-else-if="option.format == 'openmaintain' ">
                                    {{ changeMaintain(item[option.prop]) }}
                                </span>
                                
                                <el-button v-else-if="option.format == 'openfiles' "
                                type="text" @click="handleClickOption('openfiles',item)" 
                                style="padding-top:0px;padding-bottom:0px">查看</el-button>

                                <el-button v-else-if="option.format == 'openlacks' "
                                type="text" @click="handleClickOption('openlacks',item)" 
                                style="padding-top:0px;padding-bottom:0px">
                                   查看
                                </el-button>

                                <span v-else>{{ item[option.prop] }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        <div v-if="isHasButtons" style="float:right;margin-top:10px">
                            <span
                            v-for="(button, index) in buttonsName"
                            :key="index"
                            >
                            <el-button
                            :type="index == 0 ? 'primary' : index == 1 ? 'info' : 'danger'"
                            @click="handleClickOption(button.status,item)"
                            size="mini"
                            :disabled="index == 1 && item.removable !== undefined && item.removable == false"
                            >
                            <span >{{ button.name }}</span>
                            </el-button>
                            </span>
                        </div>
                    </div>
                </div>
              </el-col>
              </div>
            </div>
            <div v-else>
                <el-table
                    ref="tableData"
                    class="table"
                    :key="itemkey"
                    :data="blockData"
                    border
                    highlight-current-row
                    style="width: 100%;margin-top:10px"
                    empty-text="暫無資料"
                    @sort-change="sortChange"
                    :header-cell-class-name="handleHeaderCellClass"
                    :max-height="height"
                    v-loading="pictLoading"
                    element-loading-background = "rgba(0, 0, 0, 0.5)"
                    element-loading-text = "資料載入中，請稍後..."
                    element-loading-spinner = "el-icon-loading"
                    >
                        <el-table-column
                            fixed
                            type="index">
                        </el-table-column>

                        <el-table-column 
                            v-for="(item,index) in rowlabel"
                            align="left" 
                            :label="item.label" 
                            :key="index" 
                            :prop="item.prop" 
                            header-align="center"
                            :column-key="item.prop"
                            sortable="custom"
                            :filters="getFilterItems(item.prop)" 
                            :filter-method="filterHandler"
                        >
                                <template slot-scope="scope">

                                        <span v-if="item.format== 'YYYY-MM-DD' || 
                                        item.format== 'YYYY'" style="width:150px"> 
                                            {{ dataStr(scope.row[scope.column.property],item.format)  }}</span>

                                        <span v-else-if="item.format == 'range' ">
                                            {{ dataStr(scope.row['checkStartDate'],'YYYY-MM-DD') }} 
                                            <span v-if="scope.row['checkStartDate'] !== null || 
                                            scope.row['checkStartDate'] !== undefined"><br></span> 
                                            {{ dataStr(scope.row['checkEndDate'],'YYYY-MM-DD') }}
                                        </span>

                                        <span v-else-if="item.format == 'MaintainContentOptions' || 
                                        item.format == 'MaintainProcessOptions' || 
                                        item.format == 'BrandOptions' || item.format == 'ContactUnitOptions' ||
                                        item.format == 'DeviceStatusOptions' "
                                        >
                                        {{ changeOptionName(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'accountStatusSelect' ">
                                            {{ scope.row[item.prop] | changeStatus }}
                                        </span>

                                        <span v-else-if="item.format == 'userInfo' "
                                        @click="clickMessageBox('住戶資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUserName(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'removableSelect' ">
                                            {{ scope.row[item.prop] | changeRemoveable }}
                                        </span>

                                        <span v-else-if="item.format == 'deviceTypeSelect' "
                                        @click="clickMessageBox('設備種類',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ scope.row.getLinkType().getSelectName()  }}
                                        </span>

                                        <el-input v-else-if="item.format == 'address' "
                                            v-model="scope.row[scope.column.property]"
                                            :maxlength="item.maxlength"
                                            show-word-limit
                                            @change="checkUpdate(scope.row)"
                                            @input="scope.row[scope.column.property] = 
                                            scope.row[scope.column.property].replace(/[^\d]/g,'').replace(/\s*/g,'')">
                                        </el-input>

                                        <span v-else-if="item.format == 'deviceSelect' " 
                                        @click="clickMessageBox('設備資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                             {{ changeDevice(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'contactunitSelect' " 
                                        @click="clickMessageBox('廠商資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeContainUnit(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'floorOfHouseSelect' " 
                                        @click="clickMessageBox('門牌資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUsageOfFloor(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'floorOfHouseUsersName' " 
                                        @click="clickMessageBox('住戶資料','floorOfHouseUsersName',scope.row.getlinkUsageOfFloorsUser())"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUsageOfFloorUsersName(scope.row.getlinkUsageOfFloorsUser()) }}
                                        </span>

                                        <span v-else-if="item.format == 'buildingSelect' " 
                                        @click="clickMessageBox('建築物資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeBuilding(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'roleSelect' " 
                                        @click="clickMessageBox('角色資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeRoles(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="scope.column.property == 'linkInspectionLacks'"> 
                                            {{ changeInspectionLack(scope.row[scope.column.property]) }}
                                        </span>

                                        <span v-else-if="scope.column.property == 'fullType'"> 
                                            {{ scope.row.getType() }}
                                        </span>

                                        <span v-else-if="item.format == 'tag' "> 
                                            {{ tagChange(scope.row[scope.column.property]) }}
                                        </span>

                                        <span v-else>{{  scope.row[item.prop] }}</span>
                                </template>
                            </el-table-column>
                            
                            <el-table-column
                            fixed="right"
                            label="操作"
                            v-if="title !== 'address'"
                            >
                                <template slot="header">
                                    <!-- 建立維保大項&檔案上傳&檔案下載&新增資料 -->
                                    <el-tooltip 
                                    v-if="title == 'maintain'"
                                    class="item" effect="dark" content="請先選擇維保大項" 
                                    placement="top">
                                        <i 
                                        class="el-icon-circle-plus-outline" 
                                        @click="handleTableClick('tablemaintain','')" 
                                        style="cursor: pointer;font-size:25px;float:right"></i>
                                    </el-tooltip>
                                    <el-tooltip 
                                    v-else
                                    class="item" effect="dark" content="新增" 
                                    placement="top">
                                        <i 
                                        class="el-icon-circle-plus-outline" 
                                        @click="handleTableClick('empty','')" 
                                        style="cursor: pointer;font-size:25px;float:right"></i>
                                    </el-tooltip>
                                    <el-tooltip 
                                    class="item" effect="dark" content="匯出檔案" 
                                    placement="top">
                                        <i class="el-icon-download" 
                                        @click="handleTableClick('exportExcel','')" 
                                        style="cursor: pointer;font-size:25px;float:right"></i>
                                    </el-tooltip>
                                    <el-tooltip 
                                    class="item" effect="dark" content="匯入檔案" 
                                    placement="top">
                                        <i class="el-icon-upload2" 
                                        @click="handleTableClick('uploadExcel','')" 
                                        style="cursor: pointer;font-size:25px;float:right"></i>
                                    </el-tooltip>
                                </template>
                                <template slot-scope="scope">
                                    <!-- 檔案&缺失&查看/分配權限&編輯&刪除 -->
                                    <div style="float:right"> 
                                        <el-button v-if="title == 'maintain' || 
                                        title == 'reportInspectio' || title == 'reportPublicSafe' 
                                        || title == 'floorOfHouse'   " 
                                        @click="handleTableClick('openfiles',scope.row)" type="primary" size="small">
                                        <i class="el-icon-folder-opened"  
                                        style="cursor: pointer;float:right"></i>
                                        </el-button>
                                        <el-button v-if="title == 'reportInspectio' || title == 'reportPublicSafe' " 
                                        @click="handleTableClick('openlacks',scope.row)" type="danger" size="small">
                                        缺失
                                        </el-button>
                                        <el-button v-if="title == 'roles' || title == 'account'"
                                        @click="handleTableClick('distribution',scope.row)" type="danger" size="small">
                                        {{ title == 'roles' ? '分配權限' : '查看權限'}}
                                        </el-button>
                                        <el-button 
                                            @click="handleTableClick('open',scope.row)" 
                                            type="primary" 
                                            size="small">
                                            編輯
                                        </el-button>
                                        <el-button 
                                            type="info" size="small" 
                                            @click="handleTableClick('delete',scope.row)"
                                            :disabled="scope.row.removable !== undefined && scope.row.removable == false">
                                            刪除
                                        </el-button> 
                                    </div>
                                </template>
                            </el-table-column>
                </el-table>
            </div>
        </div>
    </el-row>
    <el-row>
        <div v-if="total > 0" class="pagination-container">
            <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="page"
                :page-sizes="pageSizeList"
                :page-size="limit"
                :total="total"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
            ></el-pagination>
        </div>
    </el-row>

</div>
    
</template>

<script>
import computedmixin  from '@/mixin/computedmixin'
import DeviceType from '@/object/deviceType'
import Device from '@/object/device'
import User from '@/object/user'
import Contactunit from '@/object/contactunit'
import UsageOfFloor from '@/object/usageOfFloor'
import Role from '@/object/role'
import Building from '@/object/building'

export default {
    mixins:[computedmixin],
    name:'Block',
    props:{
        blockData: {
            type: Array,
            required: true
        },
        buttonsName: {
            type: Array,
            default: function() {
                return [
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'}]
            }
        },
        isHasButtons: {
            type: Boolean,
            default: true
        },
        hasSearch: {
            type: Boolean,
            default: true
        },
        config: {
            type: Array,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        selectData: {
            type: Array,
            default: function() {
                return []
            }
        },
        selectSetting: {
            type: Array
        },
        listQueryParams: {
            type: Object
        },
        pageSizeList: {
            type: Array,
            default: function() {
                return [12, 30, 50, 100]
            }
        },
        isTable:{
            type: Boolean,
            default: false
        }
    },
    filters:{
        changeStatus: function(val) {
            return val == true ?  '啟用' : '禁用'
        },
        changeRemoveable: function(val) {
            return val == true ?  '允許' : '禁止'
        }
    },
    computed: {
        labelstyle(){
            if (this.$store.state.app.device === 'mobile') {
                return '40%'
            } else {
                return '40%'
            }
        },
        itemstyle(){
            if (this.$store.state.app.device === 'mobile') {
                return '60%'
            } else {
                return '60%'
            }
        },
        heightChange(){
            if(this.title == 'committee'){
                return { height : '120px'}
            }else if(this.title == 'contactUnit'){
                return { height : '130px'}
            }else if(this.title == 'floorOfHouse'){
                return { height : '185px'}
            }else if(this.title == 'maintain'){
                return { height : '130px'}
            }else if(this.title == 'equipment'){
                return { height : '270px'}
            }else if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                return { height : '220px'}
            }else if(this.title == 'devicetype'){
                return { height : '150px'}
            }else if(this.title == 'mainMenu'){
                return { height : '120px'}
            }else if(this.title == 'accessAuthority'){
                return { height : '120px'}
            }else if(this.title == 'roles'){
                return { height : '60px'}
            }else if(this.title == 'account'){
                return { height : '150px'}
            }else if(this.title == 'building'){
                return { height : '345px'}
            }
        },
        FirstheightChange(){
            if(this.title == 'committee'){
                return { height : '180px'}
            }else if(this.title == 'contactUnit'){
                return { height : '190px'}
            }else if(this.title == 'floorOfHouse'){
                return { height : '245px'}
            }else if(this.title == 'maintain'){
                return { height : '190px'}
            }else if(this.title == 'equipment'){
                return { height : '330px'}
            }else if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                return { height : '280px'}
            }else if(this.title == 'devicetype'){
                return { height : '210px'}
            }else if(this.title == 'mainMenu'){
                return { height : '180px'}
            }else if(this.title == 'accessAuthority'){
                return { height : '180px'}
            }else if(this.title == 'roles'){
                return { height : '120px'}
            }else if(this.title == 'account'){
                return { height : '210px'}
            }else if(this.title == 'building'){
                return { height : '405px'}
            }
        },
        tagChange(){
            return function (a) {
                if(this.title == 'reportInspectio' | this.title == 'reportPublicSafe'){
                    switch(a){
                        case false:
                            return '未改善'
                            break;
                        case true:
                            return '已改善'
                            break;    
                    }
                }else if(this.title == 'contactUnit'){
                    switch(a){
                        case false:
                            return '未配合'
                            break;
                        case true:
                            return '配合中'
                            break;    
                    }
                }
            }
        },
        changeMaintain(){
            return function (a) {
                if(a !== null && a.length){
                    var done = a.filter(item=>{
                        return item.getProcess() === "79"
                    })
                    return done.length.toString()+'/'+(a.length - done.length).toString()+'/'+a.length.toString()
                }else{
                    return "0/0/0"
                }
            } 
        },
        page: function() {
            return this.listQueryParams.pageIndex || 1
        },
        limit: function() {
            return this.listQueryParams.pageSize || 12
        },
        total: function() {
            return this.listQueryParams.total || 0
        }
    },
    watch:{
        config:{
            handler:async function(){
                this.rowlabel = this.config.filter((item,index)=> item.isHidden == false)
                this.inputSelectChange()
            },
            immediate:true
        },
        isTable:{
            handler:async function(){
               this.isTable == true ? this.gutter = 0 :this.gutter =  32
            },
            immediate:true
        }
    },
    data() {
        return {
            textMap: {
                update: '編輯',
                create: '新增'
            },
            temp: {},
            rowlabel:[],
            itemkey: Math.random(),
            gutter:0,
            updateArray:[],
            orderArray:[],
            inputSelect:null,
            inputSearch:'',
            pictLoading:false,
            dialogVisible:false
        }
    },
    methods: {
        changeText(val){
            var config = null
            switch(val.constructor){
                case User:
                    config = User.getConfig()
                    break;
                case DeviceType:
                    config = DeviceType.getConfig()
                    break;
                case Device:
                    config = Device.getConfig()
                    break;
                case Contactunit:
                    config = Contactunit.getConfig()
                    break;
                case UsageOfFloor:
                    config = UsageOfFloor.getConfig()
                    break;
                case Role:
                    config = Role.getConfig()
                    break;
                case Building:
                    config = Building.getConfig()
                    break;
            }
            if(val !== undefined){
                var array = []
                var data = val.getInfo()
                var config = config
                var keys = Object.keys(data)
                keys.forEach(item=>{
                    var i = config.filter((obj)=>{ return obj.prop == item })
                    if(i.length !== 0){
                        var value = ''
                        if(item == 'fullType'){
                            value = val.getType()
                        }else if(item == 'collaborate'){
                            value = data[item] == true ? '合作中' : '未配合'
                        }else if(item == 'linkOwners'){
                            value = val.getOwners()
                        }else if(item == 'linkUsers' || item == 'linkFireManagers'){
                            value = val.getUsers()
                        }else if(item == 'linkKeeperUnits'){
                            value = val.getKeeperUnits()
                        }else if(item == 'linkMaintainVendors'){
                            value = val.getMaintainVendors()
                        }else if(item == 'linkDeviceTypes'){
                            value = val.getLinkType().getSelectName()
                        }else if(item == 'status'){
                            if(val.constructor !== Device){
                                value = data[item] == true ? '啟用中' : '未啟用'
                            }else{
                                value = this.changeOptionName(data[item])
                            }
                        }else if(item == 'removable'){
                            value = data[item] == true ? '允許' : '禁止'
                        }else{
                            value = data[item]
                        }
                        array.push({
                            label:i[0].label,
                            value:value
                        })
                    }
                })
                return array
            }
        },
        clickMessageBox(title,format,data){
            if(data.length == 0){
                this.$message({
                    message: '無資料',
                    type: 'warning'
                })
            }else{
                const h = this.$createElement
                const bigData = []
                data.forEach(item=>{
                    const newDatas = []
                    var changetext = this.changeText(item)
                    changetext.forEach(obj=>{
                        newDatas.push(
                            h('p',{ style: 'width:100%' },[
                                h('span',{ style: 'width:40%;display:inline-block;vertical-align:top' },obj.label),
                                h('span',{ style: 'width:60%;display:inline-block;vertical-align:top' },obj.value)
                            ])
                        )
                    })
                    bigData.push( h('div', {style:'border:1px solid;padding:10px;margin-bottom:5px'},newDatas))
                })
                this.$msgbox({
                    title: title,
                    message:  h('div', {style:'max-height:700px;overflow-x:hidden;overflow-y:auto;'}, bigData) ,
                    showCancelButton: true,
                    distinguishCancelAndClose: true,
                    confirmButtonText: '編輯',
                    cancelButtonText: '取消',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            done()
                            switch(format){
                                case 'userInfo': //住戶資料>平時管理-基本資料
                                    if(this.buildinginfo.length == 0){
                                        this.$message({
                                            message: '請先選擇該棟建築物，才可對住戶進行編輯',
                                            type: 'warning'
                                        })
                                    }else if(this.title == 'floorOfHouse'){ //門牌資料>打開住戶資料
                                        this.handleClickOption('openuser',data)
                                    }else{
                                        this.$router.push({ name: 'basic', params: { target: data,type:'user' }})
                                    }
                                    break;
                                case 'deviceTypeSelect': //設備種類>設備管理-設備種類
                                    this.$router.push({ name: 'deviceTypesManagement', params: { target: data }})
                                    break;
                                case 'deviceSelect': //設備>設備管理-設備清單
                                    this.$router.push({ name: 'devicesManagement', params: { target: data }})
                                    break;
                                case 'contactunitSelect': //廠商資料>平時管理-基本資料
                                    this.$router.push({ name: 'basic', params: { target: data,type:'contactunit' }})
                                    break;
                                case 'floorOfHouseSelect': //門牌資料>打開當前視窗
                                    this.handleClickOption('openfloorofhouse',data)
                                    break;
                                case 'floorOfHouseUsersName': //管委會>打開住戶資料
                                    this.handleClickOption('openuser',data)
                                    break;
                                case 'roleSelect': //角色資料>權限設定-角色管理
                                    this.$router.push({ name: 'roleSetting', params: { target: data }})
                                    break;
                                case 'buildingSelect':
                                    break;
                            }
                        } else {
                        done()
                        }
                    }
                }).then(action => {
                    done()
                }).catch(()=>{
                })
            }
        },
        checkUpdate(row){
            var index = this.updateArray.findIndex(d => d.id === row.id)
            if(index !== -1){
                this.updateArray[index].systemNumber = row.systemNumber
                this.updateArray[index].circuitNumber = row.circuitNumber
                this.updateArray[index].address = row.address
            }else{
                var data = {
                    id:row.id,
                    systemNumber:row.systemNumber,
                    circuitNumber:row.circuitNumber,
                    address:row.address
                }
                this.updateArray.push(data)
            }
        },
        //區塊&對外連結
        handleClickOption(status,row) {
            console.log('status=>',status,'row=>',row)
            if (status === 'delete') {
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                    this.$emit('handleBlock',this.title,status, row)
                }).catch(() => {
                })
            } else {
                this.$emit('handleBlock',this.title,status, row)
            } 
        },
        //表格操作
        handleTableClick(index,row){
            if (index === 'delete') {
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                    if(this.title == 'maintain'){
                        this.$emit('handleDialog', this.title , index , row)
                    }else{
                        this.$emit('handleBlock', this.title , index , row)
                    }
                }).catch(() => {
                })
            } else {
                if(this.title == 'maintain'){
                    this.$emit('handleDialog', this.title , index , row)
                }else{
                    this.$emit('handleBlock', this.title , index , row)
                }
            } 
        },
        //篩選
        filterHandler(value, row, column) {
            const property = column['property']
            console.log(value,row,property)
            if(property.indexOf('link') !== -1){
                return row[property].findIndex(item => item.id == value) !== -1 
            }else if(property == 'rangeDate'){
                return row['checkStartDate'] == value
            }else{
                return row[property] === value
            }
        },
        getFilterItems(prop){
            var data = this.selectSetting.filter(item=>{ 
                return item.type == prop })
            return data.length !== 0 ? data[0].options : null
        },
        //排序
        handleHeaderCellClass({row, column, rowIndex, columnIndex}){
            this.orderArray.forEach(element => {
                if (column.property===element.prop) {
                    column.order=element.order
                }
            })
        },
        //表格排序
        sortChange(column){
            var self = this
            if (column.order === "descending") {
                this.blockData = this.blockData.sort(function(str1,str2){
                    return self.sortRule(str2[column.prop],str1[column.prop])
                })
            } else if (column.order === "ascending") {
                this.blockData = this.blockData.sort(function(str1,str2){
                    return self.sortRule(str1[column.prop],str2[column.prop])
                })
            }
        },
        sortRule(str1, str2) {
            let res = 0
            for (let i = 0; ;i++) {
				if (!str1[i] || !str2[i]) {
                    res = str1.length - str2.length
                    if(typeof str1 == 'boolean' && typeof str2 == 'boolean'){
                        res = str1 - str2
                    }
                    break
                }
                const char1 = str1[i]
                const char1Type = this.getChartType(char1)
                const char2 = str2[i]
                const char2Type = this.getChartType(char2)

                if (char1Type[0] === char2Type[0]) {
                    if (char1 === char2) {
                        continue
                    } else {
                        if (char1Type[0] === 'zh') {
                            res = char1.localeCompare(char2)
                        } else if (char1Type[0] === 'en') {
                            res = char1.charCodeAt(0) - char2.charCodeAt(0)
                        } else {
                            res = char1 - char2
                        }
                        break
                    }
                } else {
                    // 类型不同的，直接用返回的数字相减
                    res = char1Type[1] - char2Type[1]
                    break
                }
			}
			return res
		},
		getChartType(char) {
			// 數字(0-9)->大寫字母(A->Z)->小寫字母(a->z)->中文拼音
			if (/^[\u4e00-\u9fa5]$/.test(char)) {
				return ['zh', 300]
			}
			if (/^[a-zA-Z]$/.test(char)) {
				return ['en', 200]
			}
			if (/^[0-9]$/.test(char)) {
				return ['number', 100]
			}
			return ['others', 999]
		},
        // 改變搜尋條件
        inputSelectChange(){
            return this.config.filter(item => item.isSearch == true)
        },
        clearInputSearch(){
            this.pictLoading = true
            this.inputSelect = null
            this.$emit('resetlistQueryParams')
        },
        handleSearchWord(){
            if(this.inputSelect == null || this.inputSelect.length == 0){
                this.$message.error('請選擇搜尋欄位')
                return false
            }
            var data = this.config.filter(config=>{
                if(this.inputSelect.findIndex(item=>item == config.prop) !== -1) return config
            })
            if(this.inputSearch == ''){
                this.clearInputSearch()
            }else{
                var words = this.inputSearch.split(',')
                words = words.filter(item=> item !=='')
                data.forEach((item,index)=>{
                    if(words[index] !== undefined){
                        this.$set(this.listQueryParams,item.prop,'{LIKE}'+words[index])
                    }
                })
                this.pictLoading = true
                this.listQueryParams.pageIndex = 1
                this.$emit('update:listQueryParams', this.listQueryParams)
                this.$emit('clickPagination')
            }
        },
        // 改變翻頁組件中每頁數據總數
        handleSizeChange(val) {
            this.pictLoading = true
            this.listQueryParams.pageSize = val
            this.listQueryParams.pageIndex = 1 // 改變翻頁數目，將頁面=1
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination')
        },
        // 跳到當前是第幾頁
        handleCurrentChange(val) {
            this.pictLoading = true
            this.listQueryParams.pageIndex = val
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination')
        },
        resetpictLoading(){
            this.pictLoading = false
        },
        change(){
            this.$emit('changeTable',!this.isTable)
        }
    }
}
</script>

<style scoped>
.el-row {
    margin-left: 0px;
    margin-right: 0px;
}

</style>

<style lang="scss" scoped>
.infinite-list-wrapper {
    width: 100%;
    height: 600px;
    overflow-x:hidden;
    overflow-y:auto;
    .filter-item {
        float: right;
        margin-bottom: 0px;
        margin-top: 0px;
    }
}
.dashboard-wrapper{
    background-color: rgb(219,231,237);
    padding: 5px 15px 15px 15px;
    margin-top: 10px;
    margin-bottom: 10px;
    
    .tag-co{
        background-color:rgb(237,237,237);
        color: red;
    }
    .tag-noco{
        background-color:rgb(237,237,237);
        color: #409EFF;
    }
    .tag-mid{
        background-color:rgb(237,237,237);
        color: #e6a23c;
    }
    .wrapper{
        overflow-x:hidden;
        overflow-y:auto;
        line-height: 25px;

        .table{
            padding-right: 0px;
            padding-left: 0px;
        }
    }
}
.files {
  width: 100%;
  max-height: 200px;
  overflow: auto;
}
.el-select{
    width: 100%;
}
.el-date-editor.el-input{
    width: 100%;
}
.el-range-editor{
    width: 100%;
}
.pagination-container{
  margin-top: 20px;
  margin-bottom: 10px;
}

.icon{
    font-size:20px;
    padding:0px 8px;
    cursor: pointer;
}

</style>