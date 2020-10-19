<template>
    <el-row  :gutter="32">
        <div class="infinite-list-wrapper">
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">
                新增
            </el-button>
            <p v-if="loadlist.length == 0 && title === 'floor'">請選擇樓層</p>
            <div 
            class="list"  
            v-infinite-scroll="loadMore"  
            infinite-scroll-disabled="disabled"  
            infinite-scroll-immediate="false">
              <div 
              v-for="(item,index) in loadlist" 
              :key="index"
              >
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <div class="dashboard-wrapper">
                    <div 
                    v-for="(option,index) in config"
                    :key="index"
                    >
                        <span 
                        v-if="option.format == 'YYYY' | option.format === 'YYYY-MM-DD'">
                            {{ option.label }} : {{ dataStr(item[option.prop],option.format) }}
                        </span>
                        
                        <span 
                        v-else-if="option.format == 'range' | option.format === 'YYYY-MM-DD'">
                            {{ option.label }} : 
                            {{ dataStr(item['checkStartDate'],'YYYY-MM-DD') }} ~ 
                            {{ dataStr(item['checkEndDate'],'YYYY-MM-DD') }}
                        </span>

                        <el-tag 
                        v-else-if="option.format == 'tag' "
                        :type=" item[option.prop] === false ? 'danger' : '' "> 
                            {{ tagChange(item[option.prop]) }}
                        </el-tag>

                        <el-button 
                        v-else-if="option.format == 'hide-f' "
                        type="text" @click="openfile(item['id'])"> {{ option.label }}</el-button>

                        <el-button 
                        v-else-if="option.format == 'hide-l' "
                        type="text" @click="open"> {{ option.label }}</el-button>
                        
                        <el-button 
                        v-else-if="option.format == 'link' "
                        type="text" @click="open"> {{ option.label }}</el-button>

                        <el-button 
                        v-else-if="option.format == 'userselect' "
                        type="text" @click="open(item[option.prop])"> 
                        {{ option.label }}
                        </el-button>

                        <el-button 
                        v-else-if="option.format == 'ownerselect' "
                        type="text" @click="open(item[option.prop])"> 
                        {{ option.label }}
                        </el-button>

                        <span 
                        v-else-if="option.format == 'manageselect' ">
                        {{ option.label }} : {{ labelchange(item[option.prop]) }}
                        </span>

                        <span 
                        v-else-if="option.format == 'select' ">
                            {{ option.label }} : {{ selectStr(item[option.prop]) }}
                        </span>

                        <span
                        v-else-if="option.format == 'floor' ">
                        </span>
                         
                        <span v-else>{{ option.label }} : {{ item[option.prop] }}</span>

                    </div>
                    <div v-if="isHasButtons">
                        <span
                        v-for="(button, index) in buttonsName"
                        :key="index"
                        >
                        <el-button
                        size="small"
                        :type="index == 0 ? 'primary' : ''"
                        @click="handleClickOption(index,item,button)"
                        >
                        <span >{{ button }}</span>
                        </el-button>
                        </span>
                    </div>
                </div>
              </el-col>
              </div>
            </div>
            <p v-if="loading">加載中...</p>

            <el-dialog 
            :title="textMap[dialogStatus]" 
            :visible.sync="dialogFormVisible"
            :close-on-click-modal='false'
            >
                <el-form 
                ref="dataForm"  
                :model="temp" 
                label-position="left" 
                label-width="150px" 
                style="margin-left:50px;">
                    <el-form-item 
                        v-for="(item, index) in config"
                        :key="index"
                        :prop="item.prop"
                        :label="item.label"
                        v-show="item.format !== 'hide' && 
                        item.format !== 'hide-f' && item.format !== 'hide-l' "
                        :rules="[
                            { required: item.mandatory, message: item.message},
                            item.isPattern ? { pattern: item.pattern , message:item.errorMsg } : { type: item.type, message: item.typemessage }
                        ]"
                    >
                    <el-date-picker 
                    v-if="item.format == 'YYYY'" 
                    v-model="temp[item.prop]" value-format="yyyy-MM-dd" type="year" /> 
                    
                    <el-date-picker 
                    v-else-if="item.format == 'YYYY-MM-DD'" 
                    v-model="temp[item.prop]" value-format="yyyy-MM-dd" type="date" /> 

                    <span v-else-if="item.format == 'range'">
                        <el-date-picker 
                            type="date" 
                            v-model="temp['checkStartDate']" 
                            value-format="yyyy-MM-dd"
                            style="width: 50%;">
                        </el-date-picker>

                        <el-date-picker 
                            type="date" 
                            v-model="temp['checkEndDate']" 
                            value-format="yyyy-MM-dd"
                            style="width: 50%;">
                        </el-date-picker>
                    </span>

                    <el-select
                    v-else-if="item.format =='manageselect' "
                    filterable 
                    v-model="temp[item.prop]"
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
                    v-else-if="item.format =='select' "
                    v-model="temp[item.prop]"
                    >
                        <el-option
                        v-for="(item,index) in selectData"
                        :key="index"
                        :label="item.label"
                        :value="item.type"
                        >
                        </el-option>        
                    </el-select>

                    <el-checkbox 
                        v-else-if="item.format == 'tag' "
                        v-model="temp[item.prop]"
                        >
                        {{ checkboxChange(temp[item.prop]) }}
                    </el-checkbox>

                    <el-select
                    v-else-if="item.format =='userselect' || item.format =='ownerselect'"
                    filterable
                    v-model="temp[item.prop]"
                    >
                        <el-option
                        v-for="(item,index) in selectData"
                        :key="index"
                        :label="item.label"
                        :value="item.id"
                        >
                        </el-option>        
                    </el-select>
                    
                    <el-input v-else
                    :ref="item.prop"
                    :name="item.prop"
                    v-model="temp[item.prop]" >
                    </el-input>

                    </el-form-item>
                    
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button 
                    v-if="title === 'floor'"
                    @click="createuser()">
                    新增用戶資料
                    </el-button>
                    <el-button @click="cancelData()">
                    取消
                    </el-button>
                    <el-button type="primary" @click="sendData()">
                    儲存
                    </el-button>
                </div>
            </el-dialog>

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
        userconfig: {
            type: Array
        },
        title: {
            type: String
        },
        selectData: {
            type: Array
        }
    },
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    computed: {
        uploadEvent(){
            return {
                subOpitonButton: this.handleUploadOption
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
                if(this.title == 'ReportInspectio' | this.title == 'ReportPublic'){
                    switch(a){
                        case false:
                            return '未改善'
                            break;
                        case true:
                            return '已改善'
                            break;    
                    }
                }else if(this.title == 'ContactUnit'){
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
        checkboxChange(){
            return function (a) {
                if(this.title == 'ReportInspectio' | this.title == 'ReportPublic'){
                    return '改善'
                }else if(this.title == 'ContactUnit'){
                    return '配合'
                }
            }
        },
        selectStr(){
            return function (a) {
                let _array = this.selectData.filter((item, index) => 
                    item.type == a 
                )
                return _array[0].label
            }   
        },
        labelchange(){
            return function (a){
                let data = this.selectData.filter((item, index) => 
                    item.id == a 
                )
                return data[0].label
            }
        },
        
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
            dialogFormVisible: false,
            innerVisible:false,
            textMap: {
                update: '編輯',
                create: '新增'
            },
            dialogStatus: '',
            temp: {},
            origin:[],
            loadlist:[],
            innerdata:{}
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
        handleCreate() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
            this.temp = {}
        },
        handleClickOption(index, row, button) {
            if (button === '刪除') {
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                this.dialogStatus = 'delete'
                this.$emit('subOpitonButton', this.dialogStatus, row.id)
                }).catch(() => {
                    this.dialogStatus = ''
                });
            } else {
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
                console.log('temp=>'+JSON.stringify(row))
                this.temp = Object.assign({}, row)
            } 
        },
        cancelData(){
            this.dialogFormVisible = false
        },
        //新增或更新的操作
        sendData(){
            const tempData = Object.assign({}, this.temp)
            this.$refs.dataForm.validate(valid =>{
              if(valid){
                this.$emit('subOpitonButton', this.dialogStatus, tempData)
                setTimeout(() => {
                    this.dialogFormVisible = false
                }, 1000);
              }
            })
        },
        createuser(){
            this.$emit('subOpitonButton', 'createUser', '')
        },
        open(id) {
            this.$emit('subOpitonButton', 'openUser', id)
        },
        openfile(id){
            this.$emit('subOpitonButton', 'openfile', id)
        },
        handleUploadOption(index,file){
            this.$emit('subOpitonButton', index, file)
        }
    },
}
</script>

<style lang="scss" scoped>
.infinite-list-wrapper {
    height:680px; // 1. 指定高度
	overflow: auto; // 2. 内容超过指定高度 出现滚动条
	width: 100%;
	  
}

.dashboard-wrapper{
    background: #DEDEDE;
    padding: 5px 16px 0;
    margin-bottom: 32px;
    height: 300px;
    overflow-x:hidden;
    overflow-y:auto;
  }

</style>