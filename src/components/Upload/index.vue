<template>
    <div class="upload-drag-wrap">
        <el-col :xs="24" :sm="24" :md="24" :lg="6" >
            <el-upload
                ref="upload"
                action="upload"
                accept="text/plain,image/jpeg,image/png,application/pdf,
                .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,
                application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                application/x-rar-compressed,application/zip
                "
                :on-remove="handleRemove"
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :auto-upload="false"
                :on-preview="handlePreview"
                list-type="picture"
                multiple
                :file-list="fileList">
                <el-button slot="trigger"  type="primary" icon="el-icon-folder-opened" style="margin:0px 5px"></el-button>
                <el-button type="success"
                    :disabled="isDisabled" 
                    @click="onUpload"
                    icon="el-icon-upload" style="margin:0px 5px">
                </el-button>
                <el-tooltip class="item" effect="light" 
                content="限圖片、txt、word、ppt、excel、pdf、rar、zip格式的檔案，且不超過10MB" placement="top">
                 <el-button type="warning"
                    icon="el-icon-warning-outline" style="margin:0px 5px"></el-button>
                </el-tooltip>
            </el-upload>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="18" style="padding:0px">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" style="padding:0px">
                <el-col :xs="24" :sm="24" :md="24" :lg="18" style="padding:0px">
                    <el-input v-model="input" 
                        placeholder="請輸入關鍵字" 
                        style="margin-bottom:10px;width:100%"
                        @input="search"
                        >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="6" style="padding:0px">
                    <el-button  
                    type="info" icon="el-icon-delete" @click="deletefile"
                    style="margin:0px 5px">
                    </el-button>
                    <el-button 
                        v-if="title === 'reportInspectio' || title === 'floorFiles'  " 
                        type="danger" @click="onChange" style="margin:0px 5px">
                        {{ title === 'floorFiles' ? '平面圖' : '缺失內容'}}
                    </el-button>
                </el-col>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" style="padding:0px">
                <div class="files" :style="{ height: filesheight }">
                    <div 
                    v-for="(item,index) in filescopy" :key="item.getID()" class="filesdiv">
                        <el-checkbox v-model="deleteItem" :label="item.getID()">【{{ index+1 }}】</el-checkbox>
                        <i 
                        v-if="item.getExtName() == 'png' || item.getExtName() == 'jpg' || item.getExtName() == 'jpeg'
                        || item.getExtName() == 'pdf' "
                        class="el-icon-view" style="font-size:18px" @click="onPreview(item)"/>
                        <span 
                        @click="downloadfile(item)"  :style="check(item.getID())">
                            <span>
                                {{ item.getFileName() }}.{{ item.getExtName() }} 
                            </span>
                            <span style="float:right">
                                {{ item.getExtName() }}  
                                {{ ' / 上傳時間：'+item.getUploadTime() }}
                            </span>
                        </span>
                    </div>
                </div>
            </el-col>
        </el-col>
        <!-- <el-form
            label-position="left" 
            label-width="auto" 
            :inline="true"
        >
        txt,jpg,png,jpeg,pdf,word,excel,ppt,zip,7z,rar
        <el-form-item style="width:30%">
            <el-upload
                ref="upload"
                action="upload"
                accept="text/plain,image/jpeg,image/png,application/pdf,
                .doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,
                application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                application/x-rar-compressed,application/zip
                "
                :on-remove="handleRemove"
                :on-change="handleChange"
                :before-remove="beforeRemove"
                :auto-upload="false"
                :on-preview="handlePreview"
                list-type="picture"
                multiple
                :file-list="fileList">
                <el-button slot="trigger"  type="primary" icon="el-icon-folder-opened" ></el-button>
                <el-button type="success"
                    :disabled="isDisabled" 
                    @click="onUpload"
                    icon="el-icon-upload">
                </el-button>
                <el-tooltip class="item" effect="light" 
                content="限圖片、txt、word、ppt、excel、pdf、rar、zip格式的檔案，且不超過10MB" placement="top">
                 <el-button type="warning"
                    icon="el-icon-warning-outline"></el-button>
                </el-tooltip>
            </el-upload>
        </el-form-item>

        <el-form-item  style="width:70%;padding-left:8px">
            <div style="display:table;width:100%">
                 <div style="display:table-cell;width:80%">
                    <el-input v-model="input" 
                    placeholder="請輸入關鍵字" 
                    style="margin-bottom:10px;width:100%"
                    @input="search"
                    >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </div> 
                <div style="display:table-cell;width:20%">
                    <div style="display:table;width:100%">
                        <div style="display:table-cell;width:20%">
                            <el-button  type="info" icon="el-icon-delete" @click="deletefile"></el-button>
                        </div>
                        <div style="display:table-cell;width:80%">
                            <el-button 
                                v-if="title === 'reportInspectio' || title === 'floorFiles'  " 
                                type="danger" @click="onChange">
                                {{ title === 'floorFiles' ? '平面圖' : '缺失內容'}}
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="files" :style="{ height: filesheight }">
                <div 
                v-for="(item,index) in filescopy" :key="item.getID()" class="filesdiv">
                    <el-checkbox v-model="deleteItem" :label="item.getID()">【{{ index+1 }}】</el-checkbox>
                    <i 
                    v-if="item.getExtName() == 'png' || item.getExtName() == 'jpg' || item.getExtName() == 'jpeg'
                    || item.getExtName() == 'pdf' "
                    class="el-icon-view" style="font-size:18px" @click="onPreview(item)"/>
                    <span 
                    @click="downloadfile(item)"  :style="check(item.getID())">
                        <span>
                            {{ item.getFileName() }}.{{ item.getExtName() }} 
                        </span>
                        <span style="float:right">
                            {{ item.getExtName() }}  
                            {{ ' / 上傳時間：'+item.getUploadTime() }}
                        </span>
                    </span>
                </div>
            </div>
        </el-form-item>
        </el-form>  -->

        <el-dialog
            top="5vh"
            :title="dialogTitle"
            :visible.sync="previewVisible"
            width="80%"
            :modal="isneed"
            >
            <img v-if="type =='image' " :src="previewPath" class="previewImg"/>
            <div v-else>
                <iframe :src="previewPath" frameborder="0" style="width: 100%; height:800px"></iframe>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name:'Upload',
    computed:{
            ...mapGetters([
                'fullscreen'
            ])
    },
    props:{
        limit:{ 
            type: Number,
            default:5 
        },
        lackfileid: { 
            type: Number,
            default:0 
        },
        specialId: {
            type: String,
            default:'0' 
        },
        files:{
            type: Array
        },
        title:{
            type: String,
            required: true
        },
        isneed:{
            type:Boolean,
            default:false
        }
    },
    data() {
      return {
            input:'',
            fileList:[],
            isDisabled:true,
            importFiles:[],
            choose:'',
            disable:[],
            deleteItem:[],
            filescopy:[],
            type:'',
            dialogTitle:'',
	        previewVisible:false,
	        previewPath:'',
            filesheight:''
      }
    },
    watch:{
        specialId:{
            handler:async function(){
                this.choose = this.specialId
            },
            immediate:true
        },
        files:{
            handler:async function(){
                this.filescopy = this.files.map(item=>{ return item.clone(item) })
            },
            immediate:true
        },
        fullscreen:{
                handler:async function(){
                    this.fullscreen == true ? this.filesheight = '690px' : this.filesheight = '530px'
                },
                immediate:true
        }
    },
    methods: {
        check(val){
            if(val == this.choose){
                return {color:'red',cursor:'pointer'}
            }else{
                return {color:'#606266',cursor:'pointer'}
            }
        },
        handleChange(file, fileList) {
            const m = file.size / 1024 / 1024 
            const array = file.name.split('.')
            const t = array[1]
            if(m > 10){
                this.disable.push(file)
                this.$message.error('上傳檔案不能超過10MB')
                file.name = '(X)'+ file.name + ' --- 大小:' + file.size
            }else if(t !== 'txt' && t !== 'pdf' && t !== 'png' && t !== 'jpeg' && t !== 'jpg'
            && t !== 'doc' && t !== 'docx' && t !== 'xlsx' && t !== 'xls' && t !== 'ppt' && t !== 'pptx'
            && t !== 'zip' && t !== 'rar' ){
                this.disable.push(file)
                this.$message.error('請勿上傳')
                file.name = '(X)'+ file.name + ' --- 大小:' + file.size
            }else{
                file.name = file.name + ' --- 大小:' + file.size
            }
            fileList.sort((x,y)=>y.size-x.size)
            this.importFiles = fileList
            if (this.importFiles.length > 0) {
                this.isDisabled = false
            } else {
                this.isDisabled = true
            }
        },
        handleRemove(file, fileList) {
            console.log('handleRemove',file,fileList)
            const obj = this.disable.findIndex((item, index) =>
                item.uid == file.uid
            )
            this.disable.splice(obj,1)
            // if(fileList.length == 0){
            //     this.isDisabled = true
            // }
        },
        search(){
            if(this.input !== ''){
                this.filescopy = this.files.filter(item => {
                    if (item.fileOriginalName.toLowerCase().includes(this.input.toLowerCase())) {
                        return item
                    }
                })
            }else{
                this.filescopy = this.files.map(item=>{ return item.clone(item) })
            }
        },
        handlePreview(file){
            var type = file.raw.type
            if(type !== 'application/pdf' && type !== 'image/png' && type !== 'image/jpeg'
            && type !== 'image/jpg' ){
                this.$message.error('該檔案類型不可預覽')
            }else{
                this.previewPath = file.url
                if(type == 'application/pdf'){
                    this.type = 'pdf'
                }else{
                    this.type = 'image'
                }
                this.previewVisible = true
                this.dialogTitle = '【圖片預覽】'+file.name
            }
        },
        async onPreview(file){
            var filename = file.getExtName()
            var fileType = this.changeFileType(filename)
            var data 
            if(filename == 'png' || filename == 'jpeg' 
            || filename == 'jpg'){
                data = await file.image()
                this.type = 'image'
            }else {
                data = await file.download()
                this.type = 'pdf'
            }
            let url = URL.createObjectURL(new Blob([data], { type: fileType }))
            this.previewPath = url
            this.dialogTitle = '【圖片預覽】'+file.getFileName()
            this.previewVisible = true

        },
        beforeRemove(file,fileList) {
            return this.$confirm(`確定移除 ${ file.name }？`)
        },
        onUpload(file){
            if(this.disable.length === 0){
                this.$emit('handleFilesUpload','createfile',this.title,this.importFiles)
                this.importFiles = []
                this.fileList = []
            }else{
                this.$message.error('檔案格式或大小錯誤,請移除錯誤的檔案後重新上傳')
            }
        },
        async downloadfile(item) {
            var fileType = this.changeFileType(item.getExtName())
            var data = await item.download()
            let pdfUrl = URL.createObjectURL(new Blob([data], { type: fileType }))
            let link = document.createElement('a')
            link.href = pdfUrl
            link.download = item.getFileName() + '.'+item.getExtName()
            link.style.display = 'none'
            document.body.appendChild(link)
            link.click()
            URL.revokeObjectURL(link.href)
            document.body.removeChild(link)
        },
        changeFileType(extName){
            var fileType
            switch(extName){
                case 'txt':
                    fileType = 'text/plain'
                    break;
                case 'jpg':
                    fileType = 'image/jpeg'
                    break;
                case 'jpeg':
                    fileType = 'image/jpeg'
                    break;
                case 'png':
                    fileType = 'image/png'
                    break;
                case 'pdf':
                    fileType = 'application/pdf'
                    break;
                case 'doc':
                    fileType = 'application/msword'
                case 'docx':
                    fileType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    break;
                case 'ppt':
                    fileType = 'application/vnd.ms-powerpoint'
                case 'pptx':
                    fileType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    break;
                case 'xls':
                    fileType = 'application/vnd.ms-excel'
                    break;
                case 'xlsx':
                    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    break;
                case 'rar':
                    fileType = 'application/x-rar-compressed'
                    break;
                case 'zip':
                    fileType = 'application/zip'
                    break;
            }
            return fileType
        },
        async deletefile() {
            if(this.deleteItem.length == 0){
                this.$message({
                    message: '請選擇要刪除的檔案',
                    type: 'warning'
                })
            }else{
                this.$confirm('是否確定刪除該筆資料?', '提示', {
                    confirmButtonText: '確定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(async() => {
                    if(this.deleteItem.indexOf(this.specialId) !== -1){
                        this.$message({
                            message: this.title === 'floorFiles' ?
                            '此檔為平面圖，請先設定其他檔為平面圖再進行刪除' : 
                            '此為缺失內容檔案，不可刪除',
                            type: 'warning'
                        })
                    }else{
                        this.$emit('handleFilesUpload','deletefile',this.title,this.deleteItem)
                    }
                })
            }
        },
        onChange(){
            if(this.deleteItem.length > 1){
                this.$message({
                    message: '只能選擇一個檔案',
                    type: 'warning'
                })
            }else if(this.deleteItem.length == 0){
                this.$message({
                    message: '請選擇檔案',
                    type: 'warning'
                })
            }else{
                if(this.title === 'reportInspectio' && this.specialId !== '0'){ //不是第一次設定缺失
                    this.$confirm('缺失內容檔案已上傳過，重新上傳會將舊有資料全部刪除，請問是否確認上傳?',
                    '提示', {
                        confirmButtonText: '確定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var name = this.files.filter((item,index)=> item.id == this.deleteItem[0])[0].extName
                        if(name == 'pdf'){
                            this.$emit('handleFilesUpload','changeAgain',this.title,this.deleteItem[0])
                            this.importFiles = []
                            this.fileList = []
                            this.deleteItem = []
                        }else{
                            this.$message({
                                message: '缺失內容只能為pdf格式',
                                type: 'warning'
                            })
                            this.deleteItem = []
                        }
                    }).catch(()=>{
                        this.choose = this.specialId
                    })
                }else if(this.title === 'reportInspectio' && this.specialId === '0'){ //第一次設定缺失內容檔案
                    var name = this.files.filter((item,index)=> item.id == this.deleteItem[0])[0].extName
                    if(name == 'pdf' || name == 'jpg'){
                        this.$emit('handleFilesUpload','changeFirst',this.title,this.deleteItem[0]) 
                        this.deleteItem = []
                    }else{
                        this.$message({
                            message: '缺失內容檔案只能為pdf格式',
                            type: 'warning'
                        })
                        this.deleteItem = []
                    }
                }else{ //設定平面圖
                    var name = this.files.filter((item,index)=> item.id == this.deleteItem[0])[0].extName
                    if(name == 'png' || name == 'jpg'){
                        this.$emit('handleFilesUpload','change',this.title,this.deleteItem[0])  
                        this.deleteItem = []
                        this.choose = this.deleteItem[0]
                    }else{
                        this.$message({
                            message: '平面圖只能為png或jpg格式',
                            type: 'warning'
                        })
                        this.deleteItem = []
                    }
                } 
            }
        }
    }
  }
</script>
<style >
.el-form--inline .el-form-item__content{
    width: 100%;
}
</style>
<style lang="scss" scoped>
.previewImg{
    width: 100%;
    height: auto;
}

.el-dialog-s{
  z-index: 11;
}
.files {
    width: 100%;
    height: 530px;
    overflow-x:hidden;
    overflow-y:auto;

    .filesdiv{
        padding:8px;
    }
}

i{
    cursor: pointer;
    padding-right: 10px;
}
</style>
