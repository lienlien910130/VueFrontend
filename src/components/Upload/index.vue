<template>
    <div>
        <el-form
            label-position="left" 
            label-width="auto" 
            :inline="true"
        >
        <el-form-item style="width:30%">
            <el-upload
                ref="upload"
                action="upload"
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
                    icon="el-icon-upload"></el-button>
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
                                v-if="title === 'reportInspectio' || title === 'floor' " 
                                type="danger" @click="onChange">
                                {{ title === 'floor' ? '平面圖' : '缺失內容'}}
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="files" :style="{ height: filesheight }">
                <div 
                v-for="(item,index) in filescopy" :key="item.getID()" class="filesdiv">
                    <el-checkbox v-model="deleteItem" :label="item.getID()">【{{ index+1 }}】</el-checkbox>
                    <i class="el-icon-view" style="font-size:18px" @click="onPreview(item)"/>
                    <!-- <el-link 
                        :href="downloadfile(item.getID())"  :style="check(item.getID())">
                        <span>
                            {{ item.getFileName() }}.{{item.getExtName()}}
                        </span>
                        <span style="float:right">
                            {{ item.getUploadTime() }}
                        </span>
                    </el-link> -->
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
        </el-form>

        <el-dialog
            :title="dialogTitle"
            :visible.sync="previewVisible"
            width="50%"
            :modal="isneed"
            >
            <img v-if="isImage==true" :src="previewPath" class="previewImg"/>
            <div v-else>
                <pdf
                :src="previewPath"
                :page="currentPage"
                @num-pages="pageCount=$event"
                @page-loaded="currentPage=$event"
                @loaded="loadPdfHandler">
                </pdf>
                <div style="text-align:center">
                    <el-button type="primary" @click="changePdfPage(0)" icon="el-icon-back">上一頁</el-button>
                    <span type="primary">{{currentPage}} / {{pageCount}}</span>
                    <el-button type="primary" @click="changePdfPage(1)" icon="el-icon-right">下一頁</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
    

<!-- accept="image/jpeg,image/gif,image/png,application/pdf" -->
</template>

<script>
import { mapGetters } from 'vuex'
import pdf from 'vue-pdf'

  export default {
    name:'Upload',
    components: { pdf },
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

            isImage:true,
            dialogTitle:'',
	        previewVisible:false,
	        previewPath:'',
            currentPage: 0, // pdf文件页码
	        pageCount: 0, // pdf文件总页数
	        fileType: 'pdf', // 文件类型
	        pdfUrl: '', // pdf文件地址
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
            const t = array[1] !== 'dwg'
            file.name = file.name + ' --- 大小:' + file.size
            if (!t) {
                this.disable.push(file)
                this.$message.error('dwg檔請壓縮成zip檔再上傳')
            }else if(m > 10){
                this.disable.push(file)
                this.$message.error('上傳檔案不能超過10MB')
                file.name = '(X)'+ file.name + ' --- 大小:' + file.size
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
            const obj = this.disable.findIndex((item, index) =>
                item.uid == file.uid
            )
            this.disable.splice(obj,1)
            if(fileList.length == 0){
                this.isDisabled = true
            }
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
            this.previewVisible = true
            this.previewPath = file.url
            this.dialogTitle = '【圖片預覽】'+file.name
            if(file.raw.type == 'application/pdf'){
                this.isImage = false
            }else{
                this.isImage = true
            }
        },
        onPreview(file){
            console.log(this.fileName)
            this.previewVisible = true
            this.previewPath = "http://192.168.88.65:59119/Public/fileDownload/" + file.getID()
            this.dialogTitle = '【圖片預覽】'+file.fileOriginalName
            if(file.extName == 'pdf'){
                this.isImage = false
            }else{
                this.isImage = true
            }
        },
        // handleExceed(files, fileList) {
        //     this.$message({
        //         message: '限制檔案上傳數為'+this.limit+'，請勿超出範圍',
        //         type: 'warning'
        //     })
        // },
        beforeRemove(file, fileList) {
            return this.$confirm(`確定移除 ${ file.name }？`)
        },
        onUpload(file){
            if(this.disable.length === 0){
                this.$emit('handleFilesUpload','createfile',this.title,this.importFiles)
                this.importFiles = []
                this.fileList = []
            }else{
                this.$message.error('上傳檔案格式或檔案大小錯誤,請移除錯誤的檔案後重新上傳')
            }
        },
        downloadfile(item) {
            let link = document.createElement('a')
            link.href = "http://192.168.88.65:59119/Public/fileDownload/" + item.getID()
            link.download = item.getFileName() + '.'+item.getExtName()
            link.click()
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
                            message: this.title === 'floor' ?
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
        },
        changePdfPage (val) {
	        if (val === 0 && this.currentPage > 1) {
	          this.currentPage--
	        }
	        if (val === 1 && this.currentPage < this.pageCount) {
	          this.currentPage++
	        }
	    },
	    loadPdfHandler (e) {
	      this.currentPage = 1 // 加载的时候先加载第一页
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
.el-form--inline .el-form-item{
    margin-right: 0px;
}
.el-dialog-s{
  z-index: 11;
}
.files {
    width: 100%;
    height: 530px;
    overflow-x:hidden;
    overflow-y:auto;
}

i{
    cursor: pointer;
    padding-right: 10px;
}
</style>