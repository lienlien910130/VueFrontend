<template>

    <el-dialog
        :width="dialogWidth"
        :title="textMap[dialogStatus]"
        :visible="insertvisible"
        :close-on-click-modal='false'
        append-to-body
        @close="cancelData"
        center>

        <el-form 
        ref="insertdataForm"  :model="temp" :rules="formRules"  
        :label-position="label" label-width="auto" >
                <el-form-item label="缺失項目"  prop="lackItem">
                    <el-input  
                    ref="lackItem"
                    name="lackItem"
                    v-model="temp.lackItem"
                    type="string">
                    </el-input>
                </el-form-item>
                <el-form-item label="缺失內容"  prop="lackContent">
                    <el-input  
                    ref="lackContent"
                    name="lackContent"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    v-model="temp.lackContent"
                    type="textarea">
                    </el-input>
                </el-form-item>
                <el-form-item label="改善狀況" prop="improveContent">
                    <el-input  
                    ref="improveContent"
                    name="improveContent"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    v-model="temp.improveContent"
                    type="textarea">
                    </el-input>
                </el-form-item>
        </el-form>                        
        
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="sendData()">
                儲存
            </el-button>
            <el-button type="info" @click="cancelData()">
                取消
            </el-button>
            
        </div> 
    </el-dialog>
</template>

<script>
export default {
    props:{
        lackData: {},
        insertvisible: {
            type: Boolean,
            default: false
        },
        dialogStatus:{
            type: String
        }
    },
    watch:{
        insertvisible(){
            this.init()
        }
    },
    computed:{
        label() {
            if (this.$store.state.app.device === 'mobile') {
                return 'top'
            } else {
                return 'left'
            }
        },
        dialogWidth(){
            if (this.$store.state.app.device === 'mobile') {
                return "90%"
            } else {
                return "800px"
            }
        }
    },
    data() {
        return {
            textMap: {
                update: '編輯',
                create: '新增'
            },
            formRules: {
                lackItem: [{ required: true, trigger: 'blur', message:'請輸入內容'}],
                lackContent: [{ required: true, trigger: 'blur', message:'請輸入內容'}],
                improveContent: [{ required: false, trigger: 'blur', message:'請輸入內容'}]
            },
            temp:{}
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.temp = Object.assign({}, this.lackData)
        },
        cancelData(){
            this.$emit('subCancelButton', 'cancel', '')
            this.temp = {}
        },
        sendData(){
            const tempData = Object.assign({}, this.temp)
            this.$refs.insertdataForm.validate(valid =>{
                if(valid){
                    this.$emit('subSendDataButton',this.dialogStatus, tempData)
                    this.$nextTick(() => {
                        this.$refs.insertdataForm.clearValidate()
                    })
                }
            })
        }
    }
}
</script>

