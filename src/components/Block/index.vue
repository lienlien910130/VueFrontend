<template>
<div>
    <el-row  :gutter="gutter">
        <div style="margin-bottom:50px;">
            <el-col 
                v-if="isTable == true"
                :xs="24" :sm="24" :md="24" :lg="24">
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
                            <span> 檢視大項 </span>                  
                    </el-button>
            </el-col>
            <el-col v-else
                :xs="24" :sm="24" :md="24" :lg="24">
                <el-collapse v-model="activeNames">
                    <!-- <el-collapse-item title="關鍵字搜尋" name="1">
                        <el-select
                        v-if="hasSearch == true"
                        v-model="inputSelect"
                        filterable
                        multiple
                        value-key="id"
                        placeholder="請選擇關鍵字查詢欄位"
                        style="width:100%"
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
                        <el-input 
                        v-if="hasSearch == true"
                        placeholder="請輸入關鍵字，多條件搜尋請依上方'勾選條件'依序輸入值並以'逗號'區隔" 
                        v-model="inputSearch" class="input-with-select" style="width:100%" clearable
                        @clear="clearInputSearch" @keyup.enter.native="handleSearchWord"
                        >
                        </el-input>
                    </el-collapse-item> -->
                    <el-collapse-item title="篩選條件搜尋" name="1">
                        <el-cascader
                        v-model="filterSearch"
                        :options="selectSetting"
                        :props="{ multiple: true }"
                        filterable
                        collapse-tags
                        size="mini"
                        placeholder="請選擇篩選條件"
                        clearable
                        style="width:100%"
                        >
                        </el-cascader>
                        <!-- <el-button icon="el-icon-search" 
                        circle
                        @click="handleFilterSearch"
                        ></el-button> -->
                    </el-collapse-item>
                    <el-collapse-item title="資料排序" name="3">
                        <el-select 
                        v-model="sortValue" 
                        placeholder="請選擇排序欄位"
                        style="width:100%"
                        clearable
                        >
                            <el-option
                            v-for="item in selectSetting"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        <el-select 
                        v-model="sortOrder" 
                        placeholder="請選擇排序欄位"
                        style="width:100%"
                        clearable
                        >
                            <el-option  key="1" value="ascending">
                                <i icon="el-icon-caret-top" ></i>
                            </el-option>
                             <el-option  key="2" value="descending">
                                <i icon="el-icon-caret-bottom" ></i>
                            </el-option>
                        </el-select>
                         <!-- <el-button icon="el-icon-caret-top" 
                         circle
                         @click="sortChange({prop:sortValue,order:'ascending'})"
                         ></el-button>
                          <el-button icon="el-icon-caret-bottom" 
                          circle
                          @click="sortChange({prop:sortValue,order:'descending'})"
                          ></el-button> -->
                    </el-collapse-item>
                </el-collapse>
                    <el-button
                        v-if="title == 'maintain' || title == 'maintainList'"
                        class="filter-item" 
                        type="primary" 
                        size="mini"
                        @click="change">
                            <span> 檢視細項 </span>                  
                    </el-button>
                    <!-- <el-button
                        v-if="isTable == false"
                        class="filter-item" 
                        size="mini"
                        type="primary" 
                        >
                        搜尋
                    </el-button> -->
                    <el-button
                        v-if="isTable == false"
                        class="filter-item" 
                        size="mini"
                        type="primary" 
                        @click="handleClickOption('empty','')">
                        新增
                    </el-button>
            </el-col>
        </div>
        <div class="infinite-list-wrapper" :style="{ height: infiniteheight+'px' }">
            <div v-if="isTable == false" 
            >
              <div 
              v-for="(item,index) in table" 
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

                                <span v-else-if="option.format == 'fullType' ">
                                {{ item.getType() }}
                                </span>

                                <span v-else-if="option.format == 'userInfo' " 
                                @click="clickMessageBox('住戶資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeUserName(item[option.prop]) }}
                                </span>

                                 <span v-else-if="option.format == 'accountStatusSelect' ||
                                option.format == 'removableSelect' || option.format == 'improvedBoolean'
                                || option.format == 'collaborateBoolean' ">
                                    {{ item[option.prop] | changeBoolean(option.format) }}
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
                                    {{ item.getUsageOfFloorsName() }}
                                </span>

                                <span v-else-if="option.format == 'floorOfHouseUsersName' " 
                                @click="clickMessageBox('住戶資料','floorOfHouseUsersName',item.getlinkUsageOfFloorsUser())"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeUserName(item.getlinkUsageOfFloorsUser()) }}
                                </span>

                                <span v-else-if="option.format == 'deviceSelect' " 
                                @click="clickMessageBox('設備資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ item.getDevicesName() }}
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
                                    {{ item.getBuildingsName() }}
                                </span>

                                <span v-else-if="option.format == 'roleSelect' " 
                                @click="clickMessageBox('角色資料',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ item.getRolesName() }}
                                </span>

                                <span v-else-if="option.format == 'inspectionSelect' " 
                                @click="clickMessageBox('缺失內容',option.format,item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ item.getInspectionLackName() }}
                                </span>

                                <!-- <el-input v-else-if="option.format == 'address' "
                                v-model="item[option.prop]"
                                :maxlength="option.maxlength"
                                show-word-limit
                                @change="checkUpdate(item)"
                                @input="item[option.prop] = 
                                item[option.prop].replace(/[^\d]/g,'').replace(/\s*/g,'')">
                                </el-input> -->
                                
                                <span v-else-if="option.format == 'openmaintain' ">
                                    {{ changeMaintain(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'openreportlack' ">
                                    {{ changeLackCount(item[option.prop]) }}
                                </span>
                                
                                <!-- <el-button v-else-if="option.format == 'openfiles' "
                                type="text" @click="handleClickOption('openfiles',item)" 
                                style="padding-top:0px;padding-bottom:0px">查看</el-button>

                                <el-button v-else-if="option.format == 'openlacks' "
                                type="text" @click="handleClickOption('openlacks',item)" 
                                style="padding-top:0px;padding-bottom:0px">
                                   查看
                                </el-button> -->

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
                            :type="button.status == 'open' ? 'primary' : button.status == 'delete' ? 'info' : 'danger'"
                            @click="handleClickOption(button.status,item)"
                            size="mini"
                            :disabled="button.status == 'delete' && 
                            item.removable !== undefined && item.removable == false"
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
                                        item.format == 'BrandOptions' || 
                                        item.format == 'ContactUnitOptions' ||
                                        item.format == 'DeviceStatusOptions' "
                                        >
                                        {{ changeOptionName(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'accountStatusSelect' ||
                                        item.format == 'removableSelect' || 
                                        item.format == 'improvedBoolean'
                                        || item.format == 'collaborateBoolean' ">
                                            {{ scope.row[item.prop] | changeBoolean(item.format) }}
                                        </span>

                                        <span v-else-if="item.format == 'userInfo' "
                                        @click="clickMessageBox('住戶資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUserName(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'deviceTypeSelect' "
                                        @click="clickMessageBox('設備種類',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ scope.row.getLinkType().getSelectName()  }}
                                        </span>

                                        <!-- <el-input v-else-if="item.format == 'address' "
                                            v-model="scope.row[scope.column.property]"
                                            :maxlength="item.maxlength"
                                            show-word-limit
                                            @change="checkUpdate(scope.row)"
                                            @input="scope.row[scope.column.property] = 
                                            scope.row[scope.column.property].replace(/[^\d]/g,'').replace(/\s*/g,'')">
                                        </el-input> -->

                                        <span v-else-if="item.format == 'deviceSelect' " 
                                        @click="clickMessageBox('設備資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                             {{ scope.row.getDevicesName() }}
                                        </span>

                                        <span v-else-if="item.format == 'contactunitSelect' " 
                                        @click="clickMessageBox('廠商資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeContainUnit(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'floorOfHouseSelect' " 
                                        @click="clickMessageBox('門牌資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ scope.row.getUsageOfFloorsName() }}
                                        </span>

                                        <span v-else-if="item.format == 'floorOfHouseUsersName' " 
                                        @click="clickMessageBox('住戶資料','floorOfHouseUsersName',scope.row.getlinkUsageOfFloorsUser())"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUserName(scope.row.getlinkUsageOfFloorsUser()) }}
                                        </span>

                                        <span v-else-if="item.format == 'buildingSelect' " 
                                        @click="clickMessageBox('建築物資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ scope.row.getBuildingsName() }}
                                        </span>

                                        <span v-else-if="item.format == 'roleSelect' " 
                                        @click="clickMessageBox('角色資料',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ scope.row.getRolesName() }}
                                        </span>

                                        <span v-else-if="item.format == 'inspectionSelect'"
                                        @click="clickMessageBox('缺失內容',item.format,scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer"> 
                                            {{ scope.row.getInspectionLackName() }}
                                        </span>

                                        <span v-else-if="item.format == 'fullType'"> 
                                            {{ scope.row.getType() }}
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
                                    <span
                                        v-for="(button, index) in headerButtonsName"
                                        :key="index"
                                        >
                                        <el-tooltip 
                                        class="item" effect="dark" :content="button.name" 
                                        placement="top">
                                            <i 
                                            :class="button.icon" 
                                            @click="handleClickOption(button.status,'')" 
                                            style="cursor: pointer;font-size:25px;float:right"></i>
                                        </el-tooltip>
                                    </span>
                                </template>
                                <template slot-scope="scope">
                                    <!-- 檔案&缺失&查看/分配權限&編輯&刪除 -->
                                    <div style="float:right"> 
                                        <span
                                        v-for="(button, index) in buttonsName"
                                        :key="index"
                                        >
                                            <el-tooltip
                                            class="item" effect="dark" :content="button.name" 
                                            placement="top">
                                                <i 
                                                :class="button.icon" 
                                                @click="handleClickOption(button.status,scope.row)" 
                                                style="cursor: pointer;font-size:25px;float:right"
                                                >
                                                </i>
                                            </el-tooltip>
                                        </span>
                                        <!-- <el-button v-if="title == 'maintain' || 
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
                                        </el-button>  -->
                                    </div>
                                </template>
                            </el-table-column>
                </el-table>
            </div>
        </div>
    </el-row>
    <el-row v-if="total > 0 && isTable == true">
        <div  class="pagination-container">
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
    <el-row v-else-if="total > 0 && isTable == false"
        style="margin-left:-10px">
        <div  class="pagination-container">
            <el-pagination
                small
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page"
                :page-size="limit"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
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
import InspectionLacks from '@/object/inspectionLacks'
import moment from 'moment'

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
                { name:'刪除',icon:'el-icon-delete',status:'delete'},
                { name:'編輯',icon:'el-icon-edit',status:'open'}]
            }
        },
        headerButtonsName:{
            type: Array,
            default: function() {
                return [
                { name:'新增資料',icon:'el-icon-circle-plus-outline',status:'empty'},
                { name:'匯出檔案',icon:'el-icon-download',status:'exportExcel'},
                { name:'匯入檔案',icon:'el-icon-upload2',status:'uploadExcel'}]
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
    computed: {
        table(){
            var array = []
            if(this.filterSearch.length){
                for(let obj of this.filterSearch){
                    var i = this.blockData.filter(item => {
                        return item[obj[0]].indexOf(obj[1]) > -1
                    })
                    if(i.length){
                        array.push(i[0])
                    }
                }
            }
            var temp = array.length !== 0 ? array : this.blockData

            if(this.sortValue !== '' && this.sortOrder !== ''){
                var self = this
                var sortvalue = this.sortValue
                if(this.sortOrder == 'descending'){
                    temp = temp.sort(function(str1,str2){
                        var s1 = str1[sortvalue] == null ? '' : str1[sortvalue]
                        var s2 = str2[sortvalue] == null ? '' : str2[sortvalue]
                        return self.sortRule(s2,s1)
                    })
                }else{
                    temp = temp.sort(function(str1,str2){
                        var s1 = str1[sortvalue] == null ? '' : str1[sortvalue]
                        var s2 = str2[sortvalue] == null ? '' : str2[sortvalue]
                        return self.sortRule(s1,s2)
                    })
                }
            }
            return temp
        },
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
            }else if(this.title == 'maintainList'){
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
            }else if(this.title == 'maintainList'){
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
        changeMaintain(){
            return function (all) {
                if(all !== null && all.length){
                    var doneobj = this.buildingoptions.filter(item=>
                    item.classType == 'MaintainProcessOptions' 
                    && item.textName == '已保養' && item.value == 'system')
                    var doneid = doneobj.length !== 0 ? doneobj[0].id : 0
                    var done = all.filter(item => item.getProcessStatus() == doneid)
                    return done.length.toString()+'/'+(all.length - done.length).toString()
                }else{
                    return "0/0"
                }
            } 
        },
        changeLackCount(){
            return function (all) {
                if(all !== null && all.length){
                    var doneobj = this.buildingoptions.filter(item=>
                    item.classType == 'LackStatusOptions' 
                    && item.textName == '已改善' && item.value == 'system')
                    var doneid = doneobj.length !== 0 ? doneobj[0].id : 0
                    var done = all.filter(item => item.getStatus() == doneid)
                    return done.length.toString()+'/'+(all.length - done.length).toString()
                }else{
                    return "0/0"
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
        isTable:{
            handler:async function(){
               this.isTable == true ? this.gutter = 0 :this.gutter =  32
               if(this.isTable == true){
                   this.rowlabel = this.config.filter((item,index)=> item.isHidden == false)
               }else{
                   this.rowlabel = this.config.filter((item,index)=> item.isBlock == true)
               }
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
            activeNames: ['1'],
            filterSearch:[],
            sortValue:'',
            sortOrder:''
        }
    },
    methods: {
        changeText(val){
            var config = null
            switch(val.constructor){
                case User:
                    config = User.getTableConfig()
                    break;
                case DeviceType:
                    config = DeviceType.getTableConfig()
                    break;
                case Device:
                    config = Device.getTableConfig()
                    break;
                case Contactunit:
                    config = Contactunit.getTableConfig()
                    break;
                case UsageOfFloor:
                    config = UsageOfFloor.getTableConfig()
                    break;
                case Role:
                    config = Role.getTableConfig()
                    break;
                case Building:
                    config = Building.getTableConfig()
                    break;
                case InspectionLacks:
                    config = InspectionLacks.getTableConfig()
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
                        }else if(item == 'linkOwners' || item == 'linkUsers' || 
                        item == 'linkFireManagers' ){
                            value = this.changeUserName(data[item])
                        }else if(item == 'linkKeeperUnits' || item == 'linkMaintainVendors'){
                            value = this.changeContainUnit(data[item])
                        }else if(item == 'linkDeviceTypes'){
                            value = val.getLinkType().getSelectName()
                        }else if(item == 'status'){
                            if(val.constructor == Role ){
                                value = data[item] == true ? '啟用中' : '未啟用'
                            }else{
                                value = this.changeOptionName(data[item])
                            }
                        }else if(item == 'removable'){
                            value = data[item] == true ? '允許' : '禁止'
                        }else if(item == 'systemUsed'){
                            value = data[item] == true ? '已使用' : '未使用'
                        }else if (item == 'birthday' || item == 'dateOfPurchase' ||
                        item == 'dateOfWarranty'){
                            value = moment(data[item]).format('YYYY-MM-DD')
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
                    message:  h('div', {style:'max-height:500px;overflow-x:hidden;overflow-y:auto;'}, bigData) ,
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
                                case 'inspectionSelect': //缺失內容>檢修申報
                                    this.$router.push({ name: 'ReportInspection', params: { target: data }})
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
        //區塊&表格&對外連結
        handleClickOption(status,row) {
            console.log('status=>',status,'row=>',row)
            if (status === 'delete') {
                if(row.removable !== undefined && row.removable == false){
                    this.$message.error('該筆資料不可刪除')
                }else{
                    this.$confirm('是否確定刪除該筆資料?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                    }).then(() => {
                        if(this.title == 'maintain'){
                            this.$emit('handleDialog', this.title , status , row)
                        }else{
                            this.$emit('handleBlock', this.title , status , row)
                        }
                    }).catch(() => {
                    })
                }
            } else {
                if(this.title == 'maintain'){
                    this.$emit('handleDialog', this.title , status , row)
                }else{
                    this.$emit('handleBlock', this.title , status , row)
                }
            } 
        },
        //篩選
        filterHandler(value, row, column) {
            const property = column['property']
            if(property.indexOf('link') !== -1){
                return row[property].findIndex(item => item.id == value) !== -1 
            }else if(property == 'rangeDate'){
                return row['checkStartDate'] == value
            }else if(value == null){
                return row[property] === value || row[property] === ''
            }else{
                return row[property] === value
            }
        },
        getFilterItems(prop){
            var data = this.selectSetting.filter(item=>{ 
                return item.value == prop })
            return data.length !== 0 ? data[0].children : null
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
                    var s1 = str1[column.prop] == null ? '' : str1[column.prop]
                    var s2 = str2[column.prop] == null ? '' : str2[column.prop]
                    return self.sortRule(s2,s1)
                })
            } else if (column.order === "ascending") {
                this.blockData = this.blockData.sort(function(str1,str2){
                    var s1 = str1[column.prop] == null ? '' : str1[column.prop]
                    var s2 = str2[column.prop] == null ? '' : str2[column.prop]
                    return self.sortRule(s1,s2)
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
            //this.pictLoading = true
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
                //this.pictLoading = true
                this.listQueryParams.pageIndex = 1
                this.$emit('update:listQueryParams', this.listQueryParams)
                this.$emit('clickPagination')
            }
        },
        // 改變翻頁組件中每頁數據總數
        handleSizeChange(val) {
            //this.pictLoading = true
            this.listQueryParams.pageSize = val
            this.listQueryParams.pageIndex = 1 // 改變翻頁數目，將頁面=1
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination')
        },
        // 跳到當前是第幾頁
        handleCurrentChange(val) {
            //this.pictLoading = true
            this.listQueryParams.pageIndex = val
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination')
        },
        resetpictLoading(){
            this.pictLoading = false
        },
        change(){
            //this.pictLoading = true
            this.$emit('changeTable',!this.isTable)
            
        }
    }
}
</script>

<style>
    .el-row {
        margin-left: 0px;
        margin-right: 0px;
    }
  .el-cascader-menu {
    min-width: 150px; 
    max-width: 150px;
    box-sizing: border-box;
    color: #606266;
    border-right: solid 1px #E4E7ED;
    height: 204px;
    overflow-x: scroll;
    overflow-y: scroll;
  }
  .el-cascader__suggestion-panel{
      min-width: 150px; 
    max-width: 150px;
    box-sizing: border-box;
    color: #606266;
    border-right: solid 1px #E4E7ED;
    height: 204px;
    overflow-x: scroll;
    overflow-y: scroll;
  }
  /* .el-scrollbar__wrap {
    height: 250px;
    width: 150px;
    overflow-y: auto;   
    overflow-x: auto;
    
  } */
  .el-cascader-node__label {
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-cascader-node__postfix {
    right: 10px;
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