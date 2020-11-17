<template>
    <el-dialog
        width="30%"
        title="檢附文件"
        :visible="visible"
        :close-on-click-modal='false'
        @close="cancelData"
        append-to-body
        center>
        <div class="files">
          <div 
          v-for="(item,index) in originFiles" :key="item.id" class="filesdiv">
            <el-link 
            class="link" 
            :href="downloadfile(item.id)" target="_blank" style="width:80%">
            【{{ index+1 }}】{{ item.fileOriginalName }}.{{item.extName}}
            </el-link>
            <span>
                <i class="el-icon-delete del" style="float:right;font-size: 25px;margin-top:5px;width:20%" 
                @click="delfile(item.id)" />
            </span>
          </div>
        </div>
        <Upload
        v-on="uploadEvent"
        ></Upload>
    </el-dialog>
</template>

<script>
export default {
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    props:{
        originFiles: {},
        visible: {}
    },
    computed:{
        uploadEvent(){
            return {
                subOpitonButton: this.handleUploadOption
            }
        }
    },
    data() {
        return {
                            
        }
    },
    methods: {
        downloadfile(fileid){
            return "http://192.168.88.65:59119/basic/fileDownload/"+fileid
        },
        handleUploadOption(index,content){
            this.$emit('subReportButton', 'fileupload', content)
        },
        cancelData(){
            this.$emit('subReportButton', 'cancel', '')
            
        },
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