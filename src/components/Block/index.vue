<template>
<div>
    <el-row  :gutter="32">
        <div class="infinite-list-wrapper">
            <div>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
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
                        class="filter-item" 
                        type="primary" 
                        @click="handleClickOption('empty','')">
                            新增
                    </el-button>
                    <el-button
                        v-if="title == 'equipment'"
                        class="filter-item" 
                        type="primary" 
                        @click="change('table')">
                            點位
                    </el-button>
                </el-col>
            </div>
            <div 
            v-if="isTable == false"
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
                            <div :style="{display:'inline-block','vertical-align':'top','padding-top':'5px',width:labelstyle}">
                                <span>{{ option.label }} :</span>
                            </div>
                            <div :style="{display:'inline-block','word-break':'break-all','padding-top':'5px',width:itemstyle,}">
                                <span 
                                v-if="option.format == 'YYYY' | option.format === 'YYYY-MM-DD'">
                                {{ dataStr(item[option.prop],option.format) }}
                                </span>
                                
                                <span 
                                v-else-if="option.format == 'range' ">
                                    {{ dataStr(item['checkStartDate'],'YYYY-MM-DD') }} 
                                    <span v-if="item['checkStartDate'] !== null">~</span> 
                                    {{ dataStr(item['checkEndDate'],'YYYY-MM-DD') }}
                                </span>

                                <el-tag 
                                v-else-if="option.format == 'tag' "
                                :class="item[option.prop] === false ? 'tag-co' : 'tag-noco' "
                                > 
                                    {{ tagChange(item[option.prop]) }}
                                </el-tag>

                                <span 
                                v-else-if="option.format == 'select' ">
                                {{ selectStr(item[option.prop]) }}
                                </span>

                                <span 
                                v-else-if="option.format == 'fullType' ">
                                {{ changefullType(item[option.prop]) }}
                                </span>

                                <span 
                                v-else-if="option.format == 'userInfo' " 
                                @click="handleClickOption('opendialog',item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ multipleStr('user',item[option.prop]) }}
                                </span>

                                <span v-else-if="option.format == 'openmaintain' ">
                                    {{ changeMaintain(item[option.prop]) }}
                                </span>

                                <el-button
                                v-else-if="option.format == 'openfiles' "
                                type="text" @click="handleClickOption('openfiles',item['id'])" 
                                style="padding-top:0px;padding-bottom:0px">查看</el-button>

                                <span 
                                v-else-if="option.format == 'MaintainContentOptions' || 
                                option.format == 'MaintainProcessOptions' || 
                                option.format == 'BrandOptions' || option.format == 'ContactUnitOptions' ||
                                option.format == 'DeviceStatusOptions' "
                                >
                                {{ optionfilter(item[option.prop]) }}
                                </span>
                                
                                <span 
                                v-else-if="option.format == 'floorOfHouseSelect' " 
                                @click="handleClickOption('openfloorofhouse',item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ multipleStr('floorOfHouse',item[option.prop]) }}
                                </span>

                                <el-button v-else-if="option.format == 'deviceSelect' " 
                                @click="toAnotherPage('devicesManagement',item[option.prop],'')"
                                type="text"
                                style="padding:0px"
                                >
                                    {{ deviceStr(item[option.prop]) }}
                                </el-button>

                                <span 
                                v-else-if="option.format == 'deviceTypeSelect' " 
                                @click="handleClickOption('openfloorofhouse',item[option.prop])"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ changedeviceType(item[option.prop]) }}
                                </span>

                                <span 
                                v-else-if="option.format == 'contactunitSelect' " 
                                @click="toAnotherPage('sys-Basic',item[option.prop],'co')"
                                style="color:#66b1ff;cursor:pointer">
                                    {{ multipleStr('contactunit',item[option.prop]) }}
                                </span>

                                <el-button 
                                v-else-if="option.format == 'openlacks' "
                                type="text" @click="handleClickOption('openlacks',item['id'])" 
                                style="padding-top:0px;padding-bottom:0px">查看</el-button>

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
                            <!-- <i v-if="index == 0" class="el-icon-view icon" @click="handleClickOption(button.status,item)"></i>
                            <i v-else class="el-icon-delete icon" @click="handleClickOption(button.status,item)"></i> -->
                            <el-button
                            :type="index == 0 ? 'primary' : 'info'"
                            @click="handleClickOption(button.status,item)"
                            size="mini"
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
                    :data="blockData"
                    :key="itemkey"
                    border
                    highlight-current-row
                    style="width: 100%;"
                    empty-text="暫無資料"
                    >
                    <el-table-column
                    fixed
                    type="index">
                    </el-table-column>

                    <template v-for="(option,index) in tablelabel">
                        <el-table-column 
                        align="left" 
                        :label="option.label" 
                        :key="index" 
                        :prop="option.prop" 
                        sortable
                        header-align="center"
                        :width="option.width"
                        >
                        <template slot-scope="scope">
                            <span v-if="scope.column.property == 'status'"> 
                                {{ scope.row[scope.column.property] | changeStatus }}</span>
                            <span v-else-if="scope.column.property == 'removable'"> 
                                {{ scope.row[scope.column.property] | changeRemoveable }}</span>
                            <span v-else-if="scope.column.property == 'linkOwners' || 
                            scope.column.property == 'linkFireManagers'"> 
                                {{ changeUserName(scope.row[scope.column.property]) }}
                            </span>
                            <span v-else-if="scope.column.property == 'linkRoles'"> 
                                {{  changeLinkRoles(scope.row[scope.column.property]) }}</span>
                            <span v-else-if="scope.column.property == 'linkBuildings'"> 
                                {{  changeLinkBuilding(scope.row[scope.column.property]) }}</span>
                            <span v-else >{{  scope.row[scope.column.property] }}</span>
                        </template>
                        </el-table-column>
                    </template>
                    <el-table-column
                        width="250px"
                        align="right">
                        <template slot-scope="scope">
                            <span
                                v-for="(button, index) in buttonsName"
                                :key="index"
                                class="button-margin-left"
                            >
                                <el-button
                                :type="index == 0 ? 'primary' : 'info'"
                                @click="handleClickOption(button.status,scope.row)"
                                size="mini"
                                >
                                <span >{{ button.name }}</span>
                                </el-button>
                            </span>
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
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
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
        tablelabel: {
            type: Array
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
        deviceList: {
            type: Array
        },
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
    computed: {
        ...mapGetters([
            'buildingoptions',
            'buildingusers',
            'buildingdevices',
            'buildingcontactunit',
            'deviceType'
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
                return "30%"
            }
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
            console.log(this.title)
            if(this.title == 'committee' || this.title == 'contactUnit'){
                return { height : '100px'}
            }else if(this.title == 'floorOfHouse'){
                return { height : '185px'}
            }else if(this.title == 'maintain'){
                return { height : '130px'}
            }else if(this.title == 'equipment'){
                return { height : '220px'}
            }else if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                return { height : '190px'}
            }else if(this.title == 'devicetype'){
                return { height : '150px'}
            }
        },
        FirstheightChange(){
            if(this.title == 'committee' || this.title == 'contactUnit'){
                return { height : '160px'}
            }else if(this.title == 'floorOfHouse'){
                return { height : '245px'}
            }else if(this.title == 'maintain'){
                return { height : '190px'}
            }else if(this.title == 'equipment'){
                return { height : '280px'}
            }else if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                return { height : '250px'}
            }else if(this.title == 'devicetype'){
                return { height : '210px'}
            }
        },
        noMore () {
         return this.count >= this.blockData.length
        },
        disabled () {
         return this.loading || this.noMore
        },
        dataStr(){
            return function (a,b) {
                if(a != null){
                    return moment(a).format(b)
                }else{
                    return ''
                }
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
        changefullType(){
            return function (val) {
                if(val !== null && val !== undefined){
                    var label = ''
                    this.deviceType.filter(function(item, index){
                        var array = item.options.filter((obj,index)=>{
                           return obj.value == val
                        })
                        if(array.length){
                           label = array[0].label 
                        }
                    })
                    return label
                }else{
                    return ""
                }
            } 
        },
        selectStr(){ //單選
            return function (a) {
                if(a !== null && a !== undefined){
                    let _array = this.selectData.filter((item, index) => 
                        item.id == a 
                    )
                    return _array[0].label
                }else{
                    return ""
                }
            }   
        },
        multipleStr(){ //多個
            return function (type,value) {
                var array = []
                var temp = []
                type === 'user' ?  temp = this.buildingusers : 
                type === 'contactunit' ?  temp = this.buildingcontactunit : temp = this.selectData 
                if(value !== null && value !== undefined ){
                    value.forEach(item=>{
                        var data = temp.filter(element=>{
                            return item.id == element.id
                        })
                        if(data.length>0){
                            type === 'floorOfHouse' ? array.push(data[0].houseNumber) : array.push(data[0].name)
                        }
                    })
                    return array.toString()
                }else{
                    return ""
                }
            }   
        },
        optionfilter(){
            return function (a) {
                if(a !== null && a !== undefined && this.buildingoptions.length>0){
                    let _array = this.buildingoptions.filter((item, index) => 
                        item.id == a 
                    )
                    return _array.length !== 0 ? _array[0].textName : ''
                }else{
                    return ""
                }
            }   
        },
        deviceStr(){
            return function (a) {
                if(a !== null ){
                    let _array = this.deviceList.filter((item, index) => 
                        item.id == a 
                    )
                    return _array[0].label
                }else{
                    return ""
                }
            } 
        },
        changedeviceType(){
            return function (a) {
                if(a !== null && a.length){
                    let _array = this.selectData.filter((item, index) => 
                        item.id == a[0].id
                    )
                    return _array[0].label
                }else{
                    return ""
                }
            }
        },
        changeMaintain(){
            return function (a) {
                return a.length
            } 
        },
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
        }
    },
    data() {
        return {
            textMap: {
                update: '編輯',
                create: '新增'
            },
            dialogStatus: '',
            temp: {},
            rangevalue: [],
            sort:'',
            rowlabel:[],
            itemkey: Math.random()
        }
    },
    methods: {
        handleClickOption(status,row) {
            if (status === 'delete') {
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                this.$emit('handleBlock',this.title,status, row.id)
                }).catch(() => {
                })
            } else {
                this.$emit('handleBlock',this.title,status, row)
            } 
        },
        toAnotherPage(page,data,block){
            console.log(page,data,block)
            this.$router.push({ name: page, params: { block:block, target: data }})
        },
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
        change(type){
            if(type == 'table'){
                this.isTable = true
            }else{
                this.isTable = false
            }
        }
    }
}
</script>

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