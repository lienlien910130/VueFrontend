<template>
<div>
        <el-upload
          ref="upload"
          action="upload"
          accept="image/jpeg,image/gif,image/png,application/pdf"
          multiple
          :file-list="fileList"
          :before-remove="beforeRemove"
          :on-change="handleChange"
          :auto-upload="false"
          >
            <el-button slot="trigger"  type="primary" icon="el-icon-folder-opened" >選取文件</el-button>
            <el-button type="success"
            :disabled="isDisabled" 
            @click="submitupload"
            style="margin-left:10px" icon="el-icon-upload">上傳</el-button>
          
        </el-upload>
 
</div>
</template>

<script>
export default {
    props:{

    },
    data(){
        return{
            fileList: [],
            isDisabled:true,
            importFiles:[],
        }
    },
    methods:{
        handleChange(file, fileList) {
            this.importFiles = fileList
            if (this.importFiles.length > 0) {
                this.isDisabled = false
            } else {
                this.isDisabled = true
            }
        },
        beforeRemove(file, fileList) {
            return this.$confirm('是否確定刪除?');
        },
        submitupload(file){
            this.$emit('subOpitonButton', 'fileupload', this.importFiles)
            this.importFiles = []
            this.fileList = []
        }
    }
}
</script>