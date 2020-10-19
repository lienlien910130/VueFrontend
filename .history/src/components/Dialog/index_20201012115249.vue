<template>
    <el-dialog
        width="40%"
        :title="textMap[dialogStatus]"
        :visible.sync="innerVisible"
        :close-on-click-modal='false'
        append-to-body>
        <el-form ref="userdataForm"  :model="userdata" :rules="formRules"  label-position="left" label-width="150px" 
            style="margin-left:50px;">
                <el-form-item label="姓名"  prop="name">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="userdata.name"
                    type="string">
                    </el-input>
                </el-form-item>
                <el-form-item label="身分證"  prop="identityCard">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="userdata.identityCard"
                    type="string" :disabled="dialogStatus == 'create' ? false : true">
                    </el-input>
                </el-form-item>
                <el-form-item label="生日"  prop="birthday">
                    <el-date-picker 
                    v-model="userdata.birthday" value-format="yyyy-MM-dd" type="date" /> 
                </el-form-item>
                <el-form-item label="電話" prop="callNumber">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="userdata.callNumber"
                    type="string">
                    </el-input>
                </el-form-item>
                <el-form-item label="手機" prop="cellPhoneNumber">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="userdata.cellPhoneNumber"
                    type="string">
                    </el-input>
                </el-form-item>
                <el-form-item label="緊急電話" prop="emergencyNumber">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="userdata.emergencyNumber"
                    type="text">
                    </el-input>
                </el-form-item>
                <el-form-item label="電子信箱" prop="email">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="userdata.email"
                    type="text">
                    </el-input>
                </el-form-item>
                <el-form-item label="備註" prop="note">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="userdata.note"
                    type="text">
                    </el-input>
                </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button v-if="dialogStatus == 'update'" @click="createData()">
                新增
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
        userdata,
        innerVisible: {
            type: Boolean,
            default: true
        },
        dialogStatus:{
            type: String
        }
    },
    data() {
        return {
            textMap: {
                update: '編輯',
                create: '新增'
            },
            formRules: {
                name: [{ required: true, trigger: 'blur', message:'請輸入內容'}],
                identityCard: [{ required: true, trigger: 'blur', message:'請輸入內容'}],
                birthday: [{ required: true, trigger: 'blur', message:'請輸入內容'}],
                callNumber: [{ required: true, trigger: 'blur', message:'請輸入內容'}],
                cellPhoneNumber: [{ required: true, trigger: 'blur', message:'請輸入內容'},{pattern:'^[0-9]{10}$',message:'請輸入10位數'}],
                emergencyNumber: [{ required: true, trigger: 'blur', message:'請輸入內容' }],
                email: [{ required: true, trigger: 'blur', message:'請輸入內容' }],
                note: [{ required: false, trigger: 'blur' }]
            }                 
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