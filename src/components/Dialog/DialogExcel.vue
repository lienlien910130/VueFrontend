

<template>
    <div>
      <el-dialog
        top="5vh"
        :width="dialogWidth"
        :title="textMap[excelType]"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="handleExcekClick('cancel','')"
        center>
        <keep-alive>
             <!-- 下載檔案 -->
            <ExportExcel  
            v-if="excelType === 'exportExcel'"
            ref="ExportExcel"
            v-bind="exportExcelAttrs">
            </ExportExcel>
            <!-- 上傳檔案 -->
            <UploadExcel  
            v-if="excelType === 'uploadExcel'"
            ref="UploadExcel"
            :config="config"
            v-on:handleFilesUpload="handleExcekClick">
            </UploadExcel>

        </keep-alive>
    </el-dialog>  
    </div>
</template>

<script>

export default {
    name:'DialogExcel',
    props:{
        title: {
            type: String
        },
        visible: {
            type: Boolean,
            default: false
        },
        excelType:{
            type: String
        },
        exportExcelData: {
            type: Array
        },
        config: {
            type: Array
        }
    },
    computed:{
        dialogWidth(){
            if (this.$store.state.app.device === 'mobile') {
                return "90%"
            } else {
                if(this.excelType == 'exportExcel') return "500px"
                return "1000px"
            }
        },
        exportExcelAttrs(){
            return{
                exportExcelData:this.exportExcelData,
                config:this.config,
                title:this.title
            }
        },
    },
    data() {
        return {
            textMap: {
                exportExcel:'匯出檔案',
                uploadExcel:'匯入檔案'
            },
        }
    },
    methods: {
        async handleExcekClick(index,title,data) { 
            this.$emit('handleDialog',this.title, index , data)
        }
    }
}
</script>
