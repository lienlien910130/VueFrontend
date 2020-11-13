<template>
    <div>
        <p v-if="isChoose == false">請選擇樓層</p>
        <el-form
            v-else
            label-position="left" 
            label-width="auto" 
            >
                <el-form-item label="上傳檔案">
                    <Upload v-on="uploadEvent"></Upload>
                </el-form-item>
                <el-form-item label="檔案">
                    <div
                    class="files"
                    v-for="(item,index) in originFiles"
                    :key="item.id"
                    >
                        <el-radio v-model="choose" :label="item.id">平面圖</el-radio>
                        <el-link 
                            class="link"
                            :href="downloadfile(item.id)" target="_blank">{{ index+1 }}.{{ item.fileOriginalName }}
                        </el-link>
                        <span>
                            <i class="el-icon-delete del" style="float:right;font-size: 25px;" @click="delfile(item.id)" />
                        </span>
                        
                    </div>
                </el-form-item>
                
                <el-form-item label="">
                    <el-button type="primary" @click="changefloorimage">儲存</el-button>
                </el-form-item>
        </el-form>
    </div>
</template>

<script>

import { mapGetters } from 'vuex'
export default {
    props:['originFiles','isChoose','selectfloor','floorImage'],
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
    watch:{
        floorImage(){
            this.choose = this.floorImage
        }
    },
    data(){
        return{
            choose:''
        }
    },
    components:{
        Upload: () => import('@/components/Upload/index.vue')
    },
    mounted(){
       this.choose = this.floorImage
    },
    methods:{
        getFloorImagId(){
            this.$api.building.apiGetFloor(this.selectfloor).then(response=> {
                if(response.result[0].floorPlanID !== null){
                    this.choose = (response.result[0].floorPlanID).toString()
                }
            })
        },
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
            this.$confirm('是否確定刪除該筆資料?', '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.$api.files.apiDeleteFile(fileid).then(response => {
                    this.$message('刪除成功')
                    this.$emit('subOpitonButton', 'floorfile', '')
                })
            })
        },
        changefloorimage(){
            var _temp = {
                id:this.selectfloor,
                FloorPlanID:parseInt(this.choose)
            }
            this.$api.building.apiPatchFloors(_temp).then(response =>{
                this.$message('儲存成功')
            })
            
        }
    }
}
</script>