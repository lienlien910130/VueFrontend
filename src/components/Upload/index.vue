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
          <el-button slot="trigger"  style="background:rgb(0,140,214);color:white">選取文件</el-button>
          <el-button 
          style="background:rgb(171,205,3);color:white"
          
          type="success"
          :disabled="isDisabled" 
          @click="submitupload">上傳</el-button>
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