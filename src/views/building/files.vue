<template>
    <div class="editor-container">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="block-wrapper-files" :style="{ height: blockwrapperheight }">
                <Upload 
                    v-bind="UploadAttrs"
                    v-on:handleFilesUpload="handleFilesUpload">
                </Upload>
            </div>
        </el-col>
    </div>
</template>
<script>
import sharemixin  from '@/mixin/sharemixin'

export default {
    name:'Files',
    mixins:[sharemixin],
    computed:{
        UploadAttrs(){
            return{
                files:this.files,
                title:'files',
                isneed:true
            }
        },  
    },
    data(){
        return{
            files:[]
        }
    },
    watch:{
        buildinginfo:{
            handler:async function(){
                this.building = this.buildinginfo[0]
                this.files = await this.building.files()
            },
            immediate:true
        }
    },
    methods:{
        init(){
            
        },
        handleFilesUpload(){

        }
    }
}
</script>
<style>
.block-wrapper-files .el-upload-list{
  height:600px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>

<style lang="scss" scoped>
.block-wrapper-files {
    background: #fff;
    padding: 15px 15px;
    height: 720px;
}
</style>