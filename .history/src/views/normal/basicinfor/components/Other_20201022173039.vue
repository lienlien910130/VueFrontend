<template>
    <div>
        <el-form
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
                            :href="downloadbufile(item.id)" target="_blank">{{ index+1 }}.{{ item.fileOriginalName }}
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
    props:['selectfloor']
    ,
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
            floorsFiles:[]
        }
    },
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    watch:{
        selectfloor(){
            this.getfloorfiles(this.selectfloor)
        }
    },
    methods:{
        getfloorfiles(selectfloor){
            this.floorsFiles = []
            this.$api.files.apiGetFloorFiles(selectfloor).then(response =>{
                response.result.forEach( item => {
                    this.floorsFiles.push(item)
                })
            })
        },
        handleUploadOption(index,file){
            const formData = new FormData();
            file.forEach(item => {
                formData.append('file', item.raw)
            })
            this.$api.files.apiPostFloorFiles(this.selectfloor,formData).then(response=> {
                this.$message('上傳成功')
                this.getfloorfiles(this.selectfloor)
            })
        },
    }
}
</script>