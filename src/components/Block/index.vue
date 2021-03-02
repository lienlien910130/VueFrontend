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
                </el-col>
            </div>

            <div 
            class="list"  
            v-infinite-scroll="loadMore"  
            infinite-scroll-disabled="disabled"  
            infinite-scroll-immediate="false">
              <div 
              v-for="(item,index) in loadlist" 
              :key="index"
              >
              <el-col :xs="24" :sm="12" :md="6" :lg="6">
                <div class="dashboard-wrapper">
                    <div 
                    v-for="(option,index) in config"
                    :key="index"
                    width="100%"
                    >
                        <div :style="{display:'inline-block',width:labelstyle}">
                            <span>{{ option.label }} :</span>
                        </div>
                        <div :style="{display:'inline-block',width:itemstyle}">
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

                            <el-button 
                            v-else-if="option.format == 'userInfo' "
                            type="text" @click="handleClickOption('opendialog',item[option.prop])" 
                            style="padding-top:0px;padding-bottom:0px">
                                {{ multipleStr('user',item[option.prop]) }}
                            </el-button>

                            <span v-else-if="option.format == 'openmaintain' ">
                                {{ changeMaintain(item[option.prop]) }}
                            </span>
                            <!-- <el-button
                            v-else-if="option.format == 'openmaintain' "
                            type="text" @click="handleClickOption('openmaintain',item[option.prop])" 
                            style="padding-top:0px;padding-bottom:0px">
                                {{ changeMaintain(item[option.prop]) }}
                            </el-button> -->

                            <el-button
                            v-else-if="option.format == 'openfiles' "
                            type="text" @click="handleClickOption('openfiles',item['id'])" 
                            style="padding-top:0px;padding-bottom:0px">查看</el-button>

                            <span 
                            v-else-if="option.format == 'MaintainContentOptions' || 
                            option.format == 'DeviceOptions' || 
                            option.format == 'MaintainProcessOptions' || 
                            option.format == 'BrandOptions' || option.format == 'ContactUnitOptions' ||
                            option.format == 'DeviceStatusOptions' "
                            >
                            {{ optionfilter(item[option.prop]) }}
                            </span>
                            
                            <el-button v-else-if="option.format == 'floorOfHouseSelect' " 
                            @click="handleClickOption('openfloorofhouse',item[option.prop])"
                            type="text"
                            style="padding:0px"
                            >
                                {{ multipleStr('floorOfHouse',item[option.prop]) }}
                            </el-button>

                            <el-button v-else-if="option.format == 'deviceSelect' " 
                            @click="toAnotherPage('Equipment',item[option.prop],'')"
                            type="text"
                            style="padding:0px"
                            >
                                {{ deviceStr(item[option.prop]) }}
                            </el-button>

                            <el-button v-else-if="option.format == 'contactunitSelect' " 
                            @click="toAnotherPage('Basic',item[option.prop],'co')"
                            type="text"
                            style="padding:0px"
                            >
                                {{ multipleStr('contactunit',item[option.prop]) }}
                            </el-button>

                            <el-button 
                            v-else-if="option.format == 'openlacks' "
                            type="text" @click="handleClickOption('openlacks',item['id'])" 
                            style="padding-top:0px;padding-bottom:0px">查看</el-button>

                            <span v-else>{{ item[option.prop] }}</span>
                        </div>
                    </div>
                    
                    <div v-if="isHasButtons" style="float:right;margin-top:5px">
                        <span
                        v-for="(button, index) in buttonsName"
                        :key="index"
                        >
                        <el-button
                        :type="index == 0 ? 'primary' : 'info'"
                        @click="handleClickOption(button.status,item)"
                        >
                        <span >{{ button.name }}</span>
                        </el-button>
                        </span>
                    </div>
                </div>
              </el-col>
              </div>
            </div>
            <p v-if="loading">加載中...</p>
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
        title: {
            type: String
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
                return [10, 30, 50, 100]
            }
        },
    },
    computed: {
        ...mapGetters([
            'buildingoptions',
            'buildingusers',
            'buildingdevices',
            'buildingcontactunit'
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
                    return _array[0].textName
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
    watch: {
        blockData:function(){
            this.loadlist = this.blockData.slice(0, 9);
            this.count = 9
        }
    },
    data() {
        return {
            loading : false,
            count : 9,
            textMap: {
                update: '編輯',
                create: '新增'
            },
            dialogStatus: '',
            temp: {},
            loadlist:[],
            rangevalue: [],
            sort:''
        }
    },
    methods: {
        loadMore() {
            this.loading = true;
            setTimeout(() => {
                this.count += 3;
                if(this.count >= this.blockData.length){
                    this.count = this.blockData.length
                }
                this.loadlist = this.blockData.slice(0, this.count);
                this.loading = false;
            }, 500);
        },
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
    padding: 16px 16px;
    margin-top: 10px;
    margin-bottom: 10px;
    overflow-x:hidden;
    overflow-y:auto;
    line-height: 25px;

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

</style>