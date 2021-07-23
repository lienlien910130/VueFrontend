
<template>
    <div>
      <el-dialog
        top="5vh"
        :width="dialogWidth"
        title="上傳檔案"
        :visible="visible"
        :close-on-click-modal='false'
        append-to-body
        @close="handleFilesUpload('cancel','','')"
        center>
        
        <keep-alive>

        <Upload 
        ref="Upload"
        v-bind="uploadAttrs" 
        v-on:handleFilesUpload="handleFilesUpload">
        </Upload> 

        </keep-alive>
          
    </el-dialog>  
    </div>
</template>

<script>

export default {
    name:'DialogUpload',
    props:{
        visible: {
            type: Boolean,
            default: true
        },
        title:{
            type: String,
            required: true
        },
        files:{
            type: Array,
            default: function () {
                return []
            }
        },
        specialId:{
            type: String,
            default:'0' 
        }
    },
    computed:{
        dialogWidth(){
            if (this.$store.state.app.device === 'mobile') {
                return "90%"
            } else {
                return "1000px"
            }
        },
        uploadAttrs(){
            return{
                files:this.files,
                title:this.title,
                specialId:this.specialId
            }
        }
    },
    methods: {
        async handleFilesUpload(index,title,data) { 
            this.$emit('handleDialog',this.title, index , data)
        }
    }
}
</script>