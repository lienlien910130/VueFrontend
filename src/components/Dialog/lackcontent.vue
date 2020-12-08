<template>
    <el-dialog
        :width="dialogWidth"
        title="缺失內容"
        :visible="lackVisible"
        :close-on-click-modal='false'
        @close="cancelData"
        append-to-body
        center>
        
        <Upload
        v-if="title=='ReportInspectio'"
        v-bind="uploadAttrs"
        v-on="uploadEvent"
        ></Upload>
        
        <el-button type="primary" @click="handleCreate">新增</el-button>
        
        <el-table
            :data="tableData"
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

            <el-table-column 
                v-for="(item,index) in lackconfig"
                align="left" 
                :label="item.label" 
                :key="index" 
                :prop="item.prop" 
                sortable
                header-align="center"
                >
                <template slot-scope="scope">
                    
                    <div v-if="scope.column.property == 'lackContent'"
                    v-html="stringToBr(scope.row[scope.column.property])"></div>
                    <span v-else-if="scope.column.property == 'status'">
                        {{  changelabel(scope.row[item.prop]) }}
                    </span>
                    <span v-else>{{  scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
            
            
            <el-table-column
            fixed="right"
            label="操作">
            <template slot-scope="scope">
                <el-button @click="handleUpdata(scope.row)" type="primary" size="small">編輯</el-button>
                <el-button type="info" size="small" @click="handleDelete(scope.row)">刪除</el-button>
            </template>
            </el-table-column>

        </el-table>

        <InsertLack
        v-bind="insertLackAttrs"
        v-on="insertLackEvent">
        </InsertLack>
    </el-dialog>
</template>

<script>
import app from '@/store/modules/app'
export default {
    components:{
        Upload: () => import('@/components/Upload/index.vue'),
        InsertLack: () => import('@/components/Dialog/insertlack.vue')
    },
    props:['lackVisible','tableData','lackconfig','itemkey','title','lackfileid'],
    watch:{
    },
    computed:{
        stringToBr(){
            return function (a) {
                return a.replace(/{ln}/g, "<br/>")
            }
        },
        changelabel(){
            return function (a) {
                if(a !== null){
                    var temp = this.lackstatusoption.filter((item, index) => 
                    item.id == a 
                )
                    return temp[0].label
                }
                return ""
            }
        },
        uploadAttrs(){
            return {
                limit: this.limit,
                lackfileid:this.lackfileid
            }
        },
        uploadEvent(){
            return {
                subOpitonButton: this.handleUploadOption
            }
        },
        dialogWidth(){
            if (this.$store.state.app.device === 'mobile') {
                return "90%"
            } else {
                return "70%"
            }
        },
        insertLackAttrs(){
            return{
                insertvisible: this.insertvisible,
                dialogStatus:this.dialogStatus,
                lackData:this.lackData,
                lackconfig:this.lackconfig,
                selectData:this.lackstatusoption
            }
        },
        insertLackEvent(){
            return {
                subCancelButton: this.handleCancelOption,
                subSendDataButton:this.handleSendDataOption
            }
        }
    },
    data() {
        return {
            limit:1,
            insertvisible:false,
            dialogStatus:'',
            lackData:[],
            lackstatusoption:[],
            options:[]

        }
    },
    async mounted(){
        await this.getstatusOption()
    },
    methods: {
        handleUploadOption(index,content){
            this.$emit('subReportLackButton', 'fileupload', content)
        },
        handleCancelOption(index,content){
            this.insertvisible = false
            this.dialogStatus = ''
        },
        handleSendDataOption(index,content){
            this.$emit('subReportLackButton', this.dialogStatus, content)
            this.insertvisible = false
        },
        async handleUpdata(content){
            await this.getstatusOption()
            this.dialogStatus = 'update'
            this.lackData = content
            this.insertvisible = true
        },
        cancelData(){
            this.$emit('subReportLackButton', 'cancel', '')
        },
        handleDelete(row){
            this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                    this.dialogStatus = 'delete'
                    this.$emit('subReportLackButton', this.dialogStatus, row.id)
                })
        },
        async handleCreate(){
            this.lackData = []
            //await this.getstatusOption()
            this.dialogStatus = 'create'
            this.insertvisible = true
        },
        async getstatusOption(){ 
            this.lackstatusoption = []
            var _temp = []
            await this.$api.setting.apiGetOptions('LackStatusOptions').then(response => {
                console.log(JSON.stringify(response))
                _temp = response.result.sort((x,y) => x.id - y.id)
                this.lackstatusoption = _temp.map(v => {
                    this.$set(v, 'value', v.id) 
                    this.$set(v, 'label', v.textName) 
                    this.$set(v, 'id', v.id) 
                    return v
                })
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.files {
  width: 100%;
  max-height: 200px;
  overflow: auto;
  margin-bottom: 20px;
  
  .filesdiv{
    line-height: 40px;
  }
  .del {
    cursor: pointer;
  }
  .el-link{
    display:inline;
  }
}
</style>