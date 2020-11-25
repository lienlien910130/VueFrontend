<template>
<el-upload
    ref="upload"
    action="upload"
    accept="image/jpeg,image/gif,image/png,application/pdf"
    :on-preview="handlePreview"
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
        @click="submitupload"
    style="margin-left:10px" icon="el-icon-upload">上傳</el-button>
</el-upload>
</template>

<script>
  export default {
      props:{
        limit:{ default:5 },
        lackfileid:{ default:0 }
    },
    data() {
      return {
        fileList:[],
        isDisabled:true,
        importFiles:[]
      }
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
        handlePreview(file) {
            console.log(file);
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
        submitupload(file){
            if(this.lackfileid !== 0){
                this.$confirm('缺失內容檔案已上傳過，重新上傳會將舊有資料全部刪除，請問是否確認上傳?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('subOpitonButton', 'fileupload', this.importFiles)
                    this.importFiles = []
                    this.fileList = []
                }).catch(()=>{

                })
            }else{
                this.$emit('subOpitonButton', 'fileupload', this.importFiles)
                this.importFiles = []
                this.fileList = []
            }
        },
    }
  }
</script>