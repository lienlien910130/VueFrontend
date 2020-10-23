<template>

    <el-dialog
        width="40%"
        :title="textMap[dialogStatus]"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="cancelData">

        <el-tabs 
        v-if="userdata.length > 1" 
        v-model="activeName" 
        @tab-click="handleClick">
            <el-tab-pane
            v-for="(item) in userdata"
            :key="item.id"
            :label="item.name"
            :name="item.id"></el-tab-pane>
        </el-tabs>

        <keep-alive>
        <el-form ref="userdataForm"  :model="temp" :rules="formRules"  label-position="left" label-width="150px" 
            style="margin-left:50px;">
                <el-form-item label="姓名"  prop="name">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="temp.name"
                    type="string">
                    </el-input>
                </el-form-item>
                <el-form-item label="身分證"  prop="identityCard">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="temp.identityCard"
                    type="string" :disabled="dialogStatus == 'create' ? false : true">
                    </el-input>
                </el-form-item>
                <el-form-item label="生日"  prop="birthday">
                    <el-date-picker 
                    v-model="temp.birthday" value-format="yyyy-MM-dd" type="date" /> 
                </el-form-item>
                <el-form-item label="電話" prop="callNumber">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="temp.callNumber"
                    type="string">
                    </el-input>
                </el-form-item>
                <el-form-item label="手機" prop="cellPhoneNumber">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="temp.cellPhoneNumber"
                    type="string">
                    </el-input>
                </el-form-item>
                <el-form-item label="緊急電話" prop="emergencyNumber">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="temp.emergencyNumber"
                    type="text">
                    </el-input>
                </el-form-item>
                <el-form-item label="電子信箱" prop="email">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="temp.email"
                    type="text">
                    </el-input>
                </el-form-item>
                <el-form-item label="備註" prop="note">
                    <el-input  
                    ref="name"
                    name="name"
                    v-model="temp.note"
                    type="text">
                    </el-input>
                </el-form-item>
        </el-form>                        
        </keep-alive>
        
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
    watch:{
        userdata(){
            this.init()
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
            },
            activeName:'',
            temp:{}
        }
    },
    methods: {
        init(){
            if(this.userdata.length){
                this.activeName = this.userdata[0]['id']
                this.temp = Object.assign({}, this.userdata[0])
            }
        },
        createData(){
            this.temp = {}
            this.$emit('subUserButton', 'create', '')
        },
        cancelData(){
            this.$emit('subUserButton', 'cancel', '')
            this.$nextTick(() => {
                this.$refs.userdataForm.clearValidate()
            })
        },
        sendData(){
            const tempData = Object.assign({}, this.temp)
            this.$refs.userdataForm.validate(valid =>{
            if(valid){
                    this.$emit('subUserButton',this.dialogStatus, tempData)
                    this.$nextTick(() => {
                        this.$refs.userdataForm.clearValidate()
                    })
                }
            })
        },
        async handleClick(tab, event) {
            await this.$api.building.apiGetUser(tab.name).then(response => {
                this.temp = response.result[0]
            })
        },
    },
}
</script>