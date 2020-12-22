<template>
    <el-form
        label-position="left" 
        label-width="auto" 
    >
    <el-form-item label="上傳檔案">
        <el-upload
            ref="upload"
            action="upload"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :before-remove="beforeRemove"
            :auto-upload="false"
            multiple
            :limit="limit"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button slot="trigger"  type="primary" icon="el-icon-folder-opened" >選取文件</el-button>
            <el-button type="success"
                :disabled="isDisabled" 
                @click="onUpload"
                style="margin-left:10px" 
                icon="el-icon-upload">上傳</el-button>
        </el-upload>
    </el-form-item>
    <el-form-item label="檔案">
        <div class="files">
            <div 
                v-for="(item,index) in files" :key="item.id" class="filesdiv">
                <el-radio 
                v-if="title === 'floor' || title === 'reportInspectio' "
                v-model="choose" :label="item.id">{{ title === 'floor' ? '平面圖' : '缺失內容'}}
                </el-radio>
                <el-link 
                    class="link" 
                    :href="downloadfile(item.id)" target="_blank" >
                    【{{ index+1 }}】{{ item.fileOriginalName }}.{{item.extName}}
                </el-link>
                <span>
                    <i class="el-icon-delete del" 
                    style="float:right;font-size: 25px;margin-top:5px" 
                    @click="deletefile(item.id)" />
                </span>
            </div>
        </div>
    </el-form-item>
    <el-form-item v-if="title === 'reportInspectio' || title === 'floor' " label="">
        <el-button type="primary" @click="onChange">
            {{ title === 'floor' ? '設定為平面圖' : '設定為缺失內容'}}</el-button>
    </el-form-item>
    <!-- <el-form-item v-if="title === 'floor'" label="">
        <el-button type="primary" @click="onChangeFloorImage">設定為平面圖</el-button>
    </el-form-item> -->
    </el-form>
<!-- accept="image/jpeg,image/gif,image/png,application/pdf" -->
</template>

<script>
  export default {
      props:{
        limit:{ 
            type: Number,
            default:5 
        },
        lackfileid: { 
            type: Number,
            default:0 
        },
        specialId: {
            type: String,
            default:'0' 
        },
        files:{
            type: Array
        },
        title:{
            type: String,
            required: true
        }
    },
    data() {
      return {
        fileList:[],
        isDisabled:true,
        importFiles:[],
        choose:''
      }
    },
    mounted(){
        this.choose = this.specialId
    },
    methods: {
        handleChange(file, fileList) {
            this.importFiles = fileList
            if (this.importFiles.length > 0) {
                this.isDisabled = false
            } else {
                this.isDisabled = true
            }
        },
        handleRemove(file, fileList) {
            if(fileList.length == 0){
                this.isDisabled = true
            }
        },
        handleExceed(files, fileList) {
            this.$message({
                message: '限制檔案上傳數為'+this.limit+'，請勿超出範圍',
                type: 'warning'
            })
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`確定移除 ${ file.name }？`);
        },
        onUpload(file){
            this.$emit('handleFilesUpload','createfile',this.title,this.importFiles)
            this.importFiles = []
            this.fileList = []
        },
        downloadfile(fileid) {
            return "http://192.168.88.65:59119/basic/fileDownload/" + fileid
        },
        async deletefile(fileId) {
            this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(async() => {
                if(fileId === this.specialId){
                    this.$message({
                        message: this.title === 'floor' ?
                        '此檔為平面圖，請先設定其他檔為平面圖再進行刪除' : 
                        '此為缺失內容檔案，不可刪除',
                        type: 'warning'
                    })
                }else{
                    this.$emit('handleFilesUpload','deletefile',this.title,fileId)
                }
            })
        },
        onChange(){
            if(this.title === 'reportInspectio' && this.specialId !== '0'){ //不是第一次設定缺失
                this.$confirm('缺失內容檔案已上傳過，重新上傳會將舊有資料全部刪除，請問是否確認上傳?',
                 '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('handleFilesUpload','changeAgain',this.title,this.choose)
                    this.importFiles = []
                    this.fileList = []
                }).catch(()=>{
                    this.choose = this.specialId
                })
            }else if(this.title === 'reportInspectio' && this.specialId === '0'){ //第一次設定缺失內容檔案
                this.$emit('handleFilesUpload','changeFirst',this.title,this.choose)  
            }else{
                this.$emit('handleFilesUpload','change',this.title,this.choose)  
            }
        }
    }
  }
</script>

<style lang="scss" scoped>
i{
    cursor: pointer;
}
</style>