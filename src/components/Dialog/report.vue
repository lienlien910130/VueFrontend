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
            <el-row>
                <el-col :xs="24" :sm="24" :md="12" :lg="15">
                    <span
                    v-if="lackfileid == item.id" style="color:red">*</span>
                    <el-link 
                    class="link" 
                    :href="downloadfile(item.id)" target="_blank" >
                    【{{ index+1 }}】{{ item.fileOriginalName }}.{{item.extName}}
                    </el-link>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="9">
                    <span style="margin-right:10px">
                    上傳時間：{{ date(item.uploadTime) }}
                    </span>
                    <span>
                    <i class="el-icon-delete del" style="font-size: 25px;margin-top:5px;" 
                        @click="delfile(item.id)" />
                    </span> 
                </el-col>
            </el-row>
            
          </div>
        </div>
        <Upload
        v-on="uploadEvent"
        ></Upload>
    </el-dialog>
</template>

<script>
import moment from 'moment';

export default {
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    props:['originFiles','visible','lackfileid'],
    computed:{
        uploadEvent(){
            return {
                subOpitonButton: this.handleUploadOption
            }
        },
        date(){
            return function (a,b) {
                if(a != null){
                    return moment(a).format('YYYY-MM-DD')
                }else{
                    return ''
                }
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
        delfile(id){
            if(this.lackfileid == id){
                this.$message({
                showClose: true,
                message: '此為缺失內容檔案，不可刪除',
                type: 'warning'
                });
            }else{
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    this.$emit('subReportButton', 'delete', id)
                })
            }
        }
    },
}
</script>
<style lang="scss" scoped>
.files {
  width: 100%;
  max-height: 500px;
  overflow: auto;
  margin-bottom: 20px;
  
  .filesdiv{
    line-height: 40px;
    width: 100%;
  }
  .del {
    cursor: pointer;
  }
  .el-link{
    display:inline;
  }
}
</style>