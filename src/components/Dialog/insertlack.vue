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
        ref="insertdataForm"  :model="temp"  
        :label-position="label" label-width="auto" >
                <el-form-item 
                    v-for="(item, index) in lackconfig"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :rules="[
                        { required: item.mandatory, message: item.message}
                    ]"
                >
                    <el-input  
                    v-if="item.textarea == false"
                    :ref="item.prop"
                    :name="item.prop"
                    v-model="temp[item.prop]"
                    type="string">
                    </el-input>
                    <el-input  
                    v-else
                    :ref="item.prop"
                    :name="item.prop"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    v-model="temp[item.prop]"
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
        },
        lackconfig:{}
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

