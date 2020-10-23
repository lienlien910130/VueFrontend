<template>
    <div>
        <p v-if="isChoose == false">請選擇樓層</p>
        <el-form
            v-else
            label-position="left" 
            label-width="150px" 
            style="margin-left:50px;">
                <el-form-item label="檔案">
                    <div
                    class="files"
                    v-for="(item,index) in originFiles"
                    :key="item.id"
                    >
                        <el-link 
                            class="link"
                            :href="downloadfile(item.id)" target="_blank">{{ index+1 }}.{{ item.fileOriginalName }}
                        </el-link>
                        <span>
                            <i class="el-icon-delete del" style="float:right;font-size: 25px;" @click="delfile(item.id)" />
                        </span>
                    </div>
                </el-form-item>
                <el-form-item label="上傳檔案">
                    <Upload v-on="uploadEvent"></Upload>
                </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
    props:{
        originFiles:{},
        isChoose:{},
        selectfloor:{}
    },
    computed:{
        ...mapGetters([
            'id',
            'buildingid'
        ]),
        uploadEvent(){
            return {
                subOpitonButton: this.handleUploadOption
            }
        },
    },
    data(){
        return{
        }
    },
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    methods:{
        handleUploadOption(index,file){
            const formData = new FormData()
            file.forEach(item => {
                    formData.append('file', item.raw)
            })
            this.$api.files.apiPostFloorFiles(this.selectfloor,formData).then(response=> {
                this.$message('上傳成功')
                this.$emit('subOpitonButton', 'floorfile', '')
            })
        },
        downloadfile(fileid){
            return "http://192.168.88.65:59119/basic/fileDownload/"+fileid
        },
        delfile(fileid){
            this.$api.files.apiDeleteFile(fileid).then(response =>{
                this.$message('刪除成功')
                this.$emit('subOpitonButton', 'floorfile', '')
            })
        }
    }
}
</script>