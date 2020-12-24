<template>
    <el-row  :gutter="32">
        <div class="infinite-list-wrapper">
            
            <div>
                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <el-button
                    class="filter-item" 
                    style="" 
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
                                {{ dataStr(item['checkStartDate'],'YYYY-MM-DD') }} ~ 
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
                            v-else-if="option.format == 'deviceStatusSelect' ">
                                <el-tag 
                                v-if="item[option.prop] === '良好' "
                                class="tag-noco"
                                > 
                                {{ item[option.prop] }}
                                </el-tag>
                                <el-tag 
                                v-else-if="item[option.prop] === '損壞' "
                                class="tag-co"
                                > 
                                {{ item[option.prop] }}
                                </el-tag>
                                <el-tag 
                                v-else
                                class="tag-mid"
                                > 
                                {{ item[option.prop] }}
                                </el-tag>
                            </span>

                            <el-button 
                            v-else-if="option.format == 'userInfo' "
                            type="text" @click="handleClickOption('opendialog',item[option.prop])" 
                            style="padding-top:0px;padding-bottom:0px">查看</el-button>

                            <el-button 
                            v-else-if="option.format == 'openfiles' "
                            type="text" @click="handleClickOption('openfiles',item['id'])" 
                            style="padding-top:0px;padding-bottom:0px">查看</el-button>

                            <span 
                            v-else-if="option.format == 'MaintainContentOptions' || 
                            option.format == 'DeviceOptions' || 
                            option.format == 'MaintainProcessOptions' || 
                            option.format == 'BrandOptions' || option.format == 'ContactUnitOptions' ">
                            {{ optionfilter(item[option.prop]) }}
                            </span>

                            <!-- <router-link v-else-if="option.format == 'deviceSelect' " 
                            :to="{ name: 'Equipment', params: { target: item[option.prop] }}" target='_blank'
                            style="color:blue">
                                {{ deviceStr(item[option.prop]) }}
                            </router-link> -->

                            <el-button v-else-if="option.format == 'floorOfHouseSelect' " 
                            @click="handleClickOption('openfloorofhouse',item[option.prop])"
                            type="text"
                            style="padding:0px"
                            >
                                {{ selectStr(item[option.prop]) }}
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
                                {{ selectStr(item[option.prop]) }}
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
</template>

<script>
import moment from 'moment';

export default {
    props:{
        blockData: {
            type: Array,
            required: true
        },
        buttonsName: {
            type: Array
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
            type: Array
        },
        deviceList: {
            type: Array
        },
        options: {
            type: Array
        }
    },
    computed: {
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
                }else if(this.title == 'contactunit'){
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
        selectStr(){
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
        optionfilter(){
            return function (a) {
                if(a !== null ){
                    let _array = this.options.filter((item, index) => 
                        item.id == a 
                    )
                    return _array[0].label
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
            rangevalue: []
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
        // handleCreate() {
        //     if(this.title == 'ContactUnit' && this.selectData.length == 0){
        //         this.$message({
        //             showClose: true,
        //             message: '請先至設定新增廠商類別',
        //             type: 'warning'
        //         });
        //     }else if(this.title == 'Management' && this.selectData.length == 0){
        //         this.$message({
        //             showClose: true,
        //             message: '請先至下方點選樓層新增門牌',
        //             type: 'warning'
        //         });
        //     }else{
        //         this.dialogStatus = 'create'
        //         this.rangevalue = []
        //         this.dialogFormVisible = true
        //         this.$nextTick(() => {
        //             this.$refs['dataForm'].clearValidate()
        //         })
        //         this.temp = {}
        //     }
        // },
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
        }
    }
}
</script>

<style lang="scss" scoped>
.infinite-list-wrapper {
	width: 100%;
    .filter-item{
        float: right;
    }
}

.dashboard-wrapper{
    background-color: rgb(219,231,237);
    padding: 16px 16px;
    margin-bottom: 32px;
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
</style>