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

        <keep-alive>
        <el-form 
        v-if="dialogStatus !== 'upload' && dialogStatus !== 'lack' "
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
            &&  item.format !== 'openlacks'"
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
                    item.format == 'deviceSelect' || item.format =='contactunitSelect' "
                    v-model="temp[item.prop]"
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
                    || item.format =='MaintainProcessOptions' "
                    v-model="temp[item.prop]"
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
                    v-else-if="item.format =='deviceStatusSelect'"
                    v-model="temp[item.prop]"
                    placeholder="請選擇"
                    style="width:100%"
                    >
                    <el-option label="良好" key="1" value="良好"></el-option>
                    <el-option label="損壞" key="2" value="損壞"></el-option>
                    <el-option label="叫修中" key="3" value="叫修中"></el-option>
                        <!-- <el-option
                        v-for="(item,index) in optionfilter(item.format)"
                        :key="index"
                        :label="item.label"
                        :value="item.id"
                        >
                        </el-option>   -->
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
                ></el-input-number>

                <el-input v-else-if="item.format =='textarea'"
                v-model="temp[item.prop]" 
                :autosize="{ minRows: 4, maxRows: 8}"
                type="textarea">
                </el-input>

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
    },
    watch:{
        dialogData(){
            this.init()
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
        },
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
            origin:[]
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
        handleClickOption(status){
            if(this.title == 'reportInspectio' || this.title == 'reportPublicSafe'){
                this.temp['checkStartDate'] = this.rangevalue[0]
                this.temp['checkEndDate'] = this.rangevalue[1]
            }
            const tempData = Object.assign({}, this.temp)
            this.$emit('handleDialog',this.title, status , tempData)
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
    }
}
</script>
