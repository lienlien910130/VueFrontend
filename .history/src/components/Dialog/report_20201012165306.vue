<template>
    <el-dialog
        width="40%"
        :title="textMap[dialogStatus]"
        :visible.sync="visible"
        :close-on-click-modal='false'
        append-to-body>
        

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
        }
    },
}
</script>