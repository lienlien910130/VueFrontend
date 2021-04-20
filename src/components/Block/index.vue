<template>
<div>
    <el-row  :gutter="gutter">
        <div class="infinite-list-wrapper" :style="{ height: infiniteheight }">
            <div style="margin-bottom:50px">
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                    <span v-if="isTable == false">
                        <span>排序</span>
                        <el-select 
                        placeholder="請選擇" 
                        style="width:8%;margin-left:5px;margin-right:5px;"
                        @change="blockSelect"
                        v-model="sort"
                        clearable >
                            <el-option
                                v-for="element in sortArray"
                                :key="element.prop"
                                :label="element.label"
                                :value="element.prop">
                            </el-option>
                        </el-select>
                    </span>
                    <span v-for="item in selectSetting"
                        :key="item.prop"
                        >
                            <span>{{ item.label }}</span>
                            <el-select 
                            placeholder="請選擇" 
                            style="width:8%;margin-left:5px;margin-right:5px;"
                            @change="blockSelect"
                            v-model="item.select"
                            clearable 
                            >
                                <el-option
                                v-for="element in item.options"
                                :key="element.id"
                                :label="element.label"
                                :value="element.value">
                                </el-option>
                            </el-select>
                    </span>
                    <el-button
                        v-if="isTable == false && title !== 'address'"
                        class="filter-item" 
                        type="primary" 
                        @click="handleClickOption('empty','')">
                        新增
                    </el-button>
                    <el-button
                        v-if="title == 'address'"
                        class="filter-item" 
                        type="primary" 
                        @click="handleClickOption('update',updateArray)">
                        儲存
                    </el-button>
                    <el-button
                        v-if="title == 'maintain'"
                        class="filter-item" 
                        type="primary" 
                        @click="change">
                            <span> {{ isTable == false ? '檢視細項' : '檢視大項'}} </span>                  
                    </el-button>
                </el-col>
            </div>
            <div v-if="isTable == false"
            class="list"  
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
                            width:itemstyle,}">
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

                                <!-- <span 
                                v-else-if="option.format == 'select' ">
                                {{ selectStr(item[option.prop]) }}
                                </span> -->

                                <span v-else-if="option.format == 'fullType' ">
                                {{ item.getTypeName() }}
                                </span>

                                <!-- <span 
                                v-else-if="option.format == 'deviceName' ">
                                {{ changedeviceType(item[option.prop]) }}
                                </span> -->

                                <span v-else-if="option.format == 'userInfo' " 
                                @click="handleClickOption('opendialog',item[option.prop])"
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
                                @click="handleClickOption('openfloorofhouse',item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeUsageOfFloor(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'floorOfHouseUsersName' " 
                                @click="handleClickOption('openfloorofhouse',item['linkUsageOfFloors'])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeUsageOfFloorUsersName(item['linkUsageOfFloors']) }}
                                </span>
                            
                                <el-button v-else-if="option.format == 'deviceSelect' " 
                                @click="toAnotherPage('devicesManagement',item[option.prop],'')"
                                type="text"
                                style="padding:0px"
                                >
                                    {{ changeDevice(item[option.prop]) }}
                                </el-button>

                                <span v-else-if="option.format == 'deviceTypeSelect' " 
                                @click="toAnotherPage('deviceTypesManagement',item[option.prop][0],'')"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ item.getOnlyType() }}
                                </span>

                                <span v-else-if="option.format == 'contactunitSelect' " 
                                @click="toAnotherPage('sys-Basic',item[option.prop],'co')"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeContainUnit(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'buildingSelect' " 
                                @click="toAnotherPage('sys-Basic',item[option.prop],'co')"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changeBuilding(item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'roleSelect' " 
                                @click="toAnotherPage('sys-Basic',item[option.prop],'co')"
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
                    class="table"
                    :key="itemkey"
                    :data="blockData"
                    border
                    highlight-current-row
                    style="width: 100%;margin-top:10px"
                    empty-text="暫無資料"
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
                                sortable
                                header-align="center"
                                >
                                <template slot-scope="scope">

                                        <!-- <span v-if="scope.column.property == 'dateOfFailure' || 
                                        scope.column.property == 'dateOfCallRepair' || 
                                        scope.column.property == 'completedTime' " style="width:150px"> 
                                            {{ dataStr(scope.row[scope.column.property],'YYYY-MM-DD')  }}</span> -->

                                        <span v-if="item.format== 'YYYY-MM-DD' || 
                                        item.format== 'YYYY'" style="width:150px"> 
                                            {{ dataStr(scope.row[scope.column.property],item.format)  }}</span>

                                        <span v-else-if="item.format == 'range' ">
                                            {{ dataStr(scope.row['checkStartDate'],'YYYY-MM-DD') }} 
                                            <span v-if="scope.row['checkStartDate'] !== null"><br></span> 
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
                                        @click="handleClickOption('opendialog',scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUserName(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'removableSelect' ">
                                            {{ scope.row[item.prop] | changeRemoveable }}
                                        </span>

                                        <span v-else-if="item.format == 'deviceTypeSelect' ">
                                            <el-popover
                                                v-if="scope.row[item.prop].length !== 0"
                                                placement="right"
                                                width="400"
                                                trigger="click">
                                                <div>
                                                <div 
                                                v-for="(item,index) in changeText(scope.row[item.prop][0])"
                                                :key="index">
                                                    <p>{{ item.label + ':' + item.value }} </p> 
                                                </div> 
                                                </div>
                                                <el-button slot="reference">{{ scope.row.getOnlyType()  }}</el-button>
                                            </el-popover>
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
                                        @click="toAnotherPage('devicesManagement',scope.row[item.prop],'')"
                                        style="color:#66b1ff;cursor:pointer" 
                                        > 
                                            {{ changeDevice(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'contactunitSelect' " 
                                        @click="toAnotherPage('sys-Basic',scope.row[item.prop],'co')"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeContainUnit(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'floorOfHouseSelect' " 
                                        @click="handleClickOption('openfloorofhouse',scope.row[item.prop])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUsageOfFloor(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'floorOfHouseUsersName' " 
                                        @click="handleClickOption('openfloorofhouse',scope.row['linkUsageOfFloors'])"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeUsageOfFloorUsersName(scope.row['linkUsageOfFloors']) }}
                                        </span>

                                        <span v-else-if="item.format == 'buildingSelect' " 
                                        @click="toAnotherPage('sys-Basic',scope.row[item.prop],'co')"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeBuilding(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="item.format == 'roleSelect' " 
                                        @click="toAnotherPage('sys-Basic',scope.row[item.prop],'co')"
                                        style="color:#66b1ff;cursor:pointer">
                                            {{ changeRoles(scope.row[item.prop]) }}
                                        </span>

                                        <span v-else-if="scope.column.property == 'linkInspectionLacks'"> 
                                            {{ changeInspectionLack(scope.row[scope.column.property]) }}
                                        </span>

                                        <span v-else-if="scope.column.property == 'fullType'"> 
                                            {{ scope.row.getTypeName() }}
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
                            <template slot="header"  v-if="title !== 'maintain'">
                                <i class="el-icon-circle-plus-outline" 
                                @click="handleTableClick('empty','')" 
                                style="cursor: pointer;font-size:25px;float:right"></i>
                            </template>
                            <template slot-scope="scope">
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
                                    <el-button v-if="title == 'roles'" 
                                    @click="handleTableClick('distribution',scope.row)" type="danger" size="small">
                                    分配權限
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
        // deviceList: {
        //     type: Array
        // },
        selectSetting: {
            type: Array
        },
        sortArray: {
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
        // changefullType(){
        //     return function (val) {
        //         if(val !== null && val !== undefined){
        //             var label = ''
        //             this.deviceType.filter(function(item, index){
        //                 var array = item.options.filter((obj,index)=>{
        //                    return obj.value == val
        //                 })
        //                 if(array.length){
        //                    label = array[0].label 
        //                 }
        //             })
        //             return label
        //         }else{
        //             return ""
        //         }
        //     } 
        // },
        // selectStr(){ //單選
        //     return function (a) {
        //         if(a !== null && a !== undefined){
        //             let _array = this.selectData.filter((item, index) => 
        //                 item.id == a 
        //             )
        //             return _array[0].label
        //         }else{
        //             return ""
        //         }
        //     }   
        // },
        // multipleStr(){ //多個
        //     return function (type,value) {
        //         var array = []
        //         var temp = []
        //         type === 'user' ?  temp = this.buildingusers : 
        //         type === 'contactunit' ?  temp = this.buildingcontactunit : 
        //         type === 'floorOfHouse' ? temp = this.selectData : this.deviceList
        //         if(value !== null && value !== undefined ){
        //             value.forEach(item=>{
        //                 var data = temp.filter(element=>{
        //                     return item.id == element.id
        //                 })
        //                 if(data.length>0){
        //                     type === 'floorOfHouse' ? array.push(data[0].houseNumber) : array.push(data[0].name)
        //                 }
        //             })
        //             return array.toString()
        //         }else{
        //             return ""
        //         }
        //     }   
        // },
        // optionfilter(){
        //     return function (a) {
        //         if(a !== null && a !== undefined && this.buildingoptions.length>0){
        //             let _array = this.buildingoptions.filter((item, index) => 
        //                 item.id == a 
        //             )
        //             return _array.length !== 0 ? _array[0].textName : ''
        //         }else{
        //             return ""
        //         }
        //     }   
        // },
        // deviceStr(){
        //     return function (a) {
        //         if(a !== null ){
        //             let _array = this.deviceList.filter((item, index) => 
        //                 item.id == a 
        //             )
        //             return _array[0].label
        //         }else{
        //             return ""
        //         }
        //     } 
        // },
        // changedeviceType(){
        //     return function (a) {
        //         if(a !== null && a.length){
        //             let _array = this.selectData.filter((item, index) => 
        //                 item.id == a[0].id
        //             )
        //             var str = _array[0].label.split('--')
        //             return str[1]
        //         }else{
        //             return ""
        //         }
        //     }
        // },
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
        // changeLackCount(){
        //     return function (a) {
        //         if(a !== null){
        //             console.log(a.getCount())
        //             return a.getCount()
        //         }else{
        //             return "0/0"
        //         }
        //     } 
        // },
        page: function() {
            return this.listQueryParams.page || 1
        },
        limit: function() {
            return this.listQueryParams.limit || 10
        },
        total: function() {
            return this.listQueryParams.total || 0
        }
    },
    watch:{
        config:{
            handler:async function(){
                this.rowlabel = this.config.filter((item,index)=> item.isHidden == false)
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
            sort:'',
            rowlabel:[],
            itemkey: Math.random(),
            gutter:0,
            updateArray:[]
        }
    },
    methods: {
        changeText(val){
            if(val !== undefined){
                var array = []
                var data = val.getInfo()
                var config = DeviceType.getConfig()
                var keys = Object.keys(data)
                keys.forEach(item=>{
                    var i = config.filter((obj)=>{ return obj.prop == item })
                    if(i.length !== 0){
                    var value = item == 'fullType' ? val.getName() : data[item]
                        array.push({
                            label:i[0].label,
                            value:value
                        })
                    }
                })
                return array
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
        handleClickOption(status,row) {
            console.log('status',status,'row',row)
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
        // toAnotherPage(page,data,block){
        //     console.log(page,data,block)
        //     this.$router.push({ name: page, params: { block:block, target: data }})
        // },
        // 改變翻頁組件中每頁數據總數
        handleSizeChange(val) {
            this.listQueryParams.limit = val
            this.listQueryParams.page = 1 // 改變翻頁數目，將頁面=1
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination', this.sort)
        },
        // 跳到當前是第幾頁
        handleCurrentChange(val) {
            this.listQueryParams.page = val
            this.$emit('update:listQueryParams', this.listQueryParams)
            this.$emit('clickPagination', this.sort)
        },
        blockSelect(){
            this.$emit('update:selectSetting', this.selectSetting)
            this.$emit('clickPagination',this.sort)
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