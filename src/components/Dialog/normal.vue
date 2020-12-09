<template>
    <el-dialog
        :width="dialogWidth"
        :title="textMap[dialogStatus]"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="cancelData"
        center>
        
        <el-form 
            ref="dataForm"  
            :model="temp" 
            :label-position="label" 
            label-width="auto">
                <el-form-item 
                    v-for="(item, index) in config"
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    v-show="item.format !== 'hide' && 
                    item.format !== 'hide-f' && item.format !== 'hide-l' "
                    :rules="[
                        { required: item.mandatory, message: item.message},
                            item.isPattern ? { pattern: item.pattern , message:item.errorMsg } : { type: item.type, message: item.typemessage }
                        ]">

                </el-form-item>
        </el-form>


        <div v-if="isHasButtons" style="float:right;margin-top:5px">
            <span
            v-for="(button, index) in buttonsName"
            :key="index"
            >
            <el-button
                :type="index == 0 ? 'primary' : 'info'"
                @click="Click(index,item,button)"
            >
                <span >{{ button }}</span>
            </el-button>
            </span>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props:{
        isHasButtons: {
            type: Boolean,
            default: true
        },
        buttonsName: {
            type: Array
        },
        visible: {
            type: Boolean,
            default: true
        },
        dialogStatus:{
            type: String
        },
        config: {
            type: Array,
            required: true
        },
    },
    data(){
        return{
            textMap: {
                update: '編輯',
                create: '新增'
            },
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
                return "600px"
            }
        }
    },
    methods:{
        Click(index, row, button) {
            if (button === '刪除') {
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
                }).then(() => {
                this.dialogStatus = 'delete'
                this.$emit('subOpitonButton', this.dialogStatus, row.id)
                }).catch(() => {
                    this.dialogStatus = ''
                });
            } else {
                this.dialogStatus = 'update'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                   this.$refs['dataForm'].clearValidate()
                })
                if(this.title == 'ReportInspectio'){
                    if(row['checkStartDate'] !== null){
                        this.rangevalue = [row['checkStartDate'],row['checkEndDate'],]
                    }
                }
                this.temp = Object.assign({}, row)
                if(this.title == 'floor'){
                    this.$emit('subOpitonButton', 'getfiles', row.id)
                }
            } 
        },
        cancelData(){
            this.$emit('subDeviceButton', 'cancel', '')
        },
    }
}
</script>