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
        v-bind="multiple"
        v-on="uploadEvent"
        ></Upload>
        
        <el-button type="primary" @click="handleCreate" style="margin-top:20px;margin-bottom:20px">新增</el-button>
        
         <el-table
         
            :data="tableData"
            :key="itemkey"
            border
            highlight-current-row
            style="width: 100%"
            empty-text="暫無資料">

            <el-table-column
            fixed
            type="index">
            </el-table-column>

            <template v-for="(item,index) in lackconfig">
                <el-table-column 
                align="center" 
                :label="item.label" 
                :key="index" 
                :prop="item.prop" 
                sortable
                >
                    <template slot-scope="scope">
                        <span>{{  scope.row[scope.column.property] }}</span>
                    </template>
                </el-table-column>
            </template>
            
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
export default {
    components:{
        Upload: () => import('@/components/Upload/index.vue'),
        InsertLack: () => import('@/components/Dialog/insertlack.vue')
    },
    props:['lackVisible','tableData','lackconfig','itemkey'],
    computed:{
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
                lackData:this.lackData
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
            multiple:false,
            insertvisible:false,
            dialogStatus:'',
            lackData:[]

        }
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
        handleUpdata(content){
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
        handleCreate(){
            this.lackData = []
            this.dialogStatus = 'create'
            this.insertvisible = true
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