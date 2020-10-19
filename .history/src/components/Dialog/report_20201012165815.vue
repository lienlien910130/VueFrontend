<template>
    <el-dialog
        width="40%"
        title="上傳檔案"
        :visible.sync="visible"
        :close-on-click-modal='false'
        append-to-body>
        <div class="files">
          <div
            v-for="(item,index) in originFiles"
            :key="item.id"
          >
              <el-link 
              class="link"
              :href="downloadbufile(item.id)" target="_blank">{{ index+1 }}.{{ item.fileOriginalName }}
              </el-link>
              <span>
                <i class="el-icon-delete del" style="float:right;" @click="delbufile(item.id)" />
              </span>
          </div>
        </div>
        <Upload
        v-on="uploadEvent"
        ></Upload>
        <div slot="footer" class="dialog-footer">
            <el-button v-if="dialogStatus == 'update'" @click="createData()">
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
</template>

<script>
export default {
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    props:{
        userdata: {},
        visible: {
            type: Boolean,
            default: true
        },
        dialogStatus:{
            type: String
        }
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
        createData(){
            this.$emit('subUserButton', 'create', '')
        },
        cancelData(){
            this.$emit('subUserButton', 'cancel', '')
            this.$nextTick(() => {
                this.$refs.userdataForm.clearValidate()
            })
        },
        sendData(){
            const tempData = Object.assign({}, this.userdata)
            this.$refs.userdataForm.validate(valid =>{
            if(valid){
                    this.$emit('subUserButton',this.dialogStatus, tempData)
                    this.$nextTick(() => {
                        this.$refs.userdataForm.clearValidate()
                    })
                }
            })
        },
        downloadbufile(fileid){
            return "http://192.168.88.65:59119/basic/fileDownload/"+fileid
        },
    },
}
</script>