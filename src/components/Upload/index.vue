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
            
            <div class="files">
                <div 
                    v-for="(item,index) in filescopy" :key="item.id" class="filesdiv">
                    <!-- <el-radio 
                    v-if="title === 'floor' || title === 'reportInspectio' "
                    v-model="choose" :label="item.id">{{ title === 'floor' ? '平面圖' : '缺失內容'}}
                    </el-radio> -->
                    <el-checkbox v-model="deleteItem" :label="item.id">【{{ index+1 }}】</el-checkbox>

                    <el-link 
                        class="link" 
                        :href="downloadfile(item.id)"  :style="check(item.id)">
                        {{ item.fileOriginalName }}.{{item.extName}}
                    </el-link>
                    <!-- <el-button 
                        class="link" 
                        @click="downloadfile(item.id)" >
                        【{{ index+1 }}】{{ item.fileOriginalName }}.{{item.extName}}
                    </el-button> -->
                    <!-- <span>
                        <i class="el-icon-delete del" 
                        style="float:right;font-size: 25px;margin-top:5px" 
                        @click="deletefile(item.id)" />
                    </span> -->
                </div>
            </div>
        </el-form-item>
        <!-- <el-form-item v-if="title === 'reportInspectio' || title === 'floor' " label="">
            <el-button type="primary" @click="onChange">
                {{ title === 'floor' ? '設定為平面圖' : '設定為缺失內容'}}</el-button>
        </el-form-item> -->
        <!-- <el-form-item v-if="title === 'floor'" label="">
            <el-button type="primary" @click="onChangeFloorImage">設定為平面圖</el-button>
        </el-form-item> -->
        </el-form>
    </div>
    

<!-- accept="image/jpeg,image/gif,image/png,application/pdf" -->
</template>

<script>
  export default {
    name:'Upload',
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
        }
    },
    data() {
      return {
            input:'',
            fileList:[],
            isDisabled:true,
            importFiles:[],
            choose:'',
            isLt10M:true,
            isType:true,
            disable:[],
            deleteItem:[],
            filescopy:[]
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
                this.filescopy = this.$deepClone(this.files)
            },
            immediate:true
        }
    },
    methods: {
        check(val){
            if(val == this.choose){
                return {color:'red'}
            }else{
                return {color:'#606266'}
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
                this.filescopy = this.$deepClone(this.files)
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
        downloadfile(fileid) {
            // const bufferUrl = btoa(new Uint8Array(await this.$obj.Files.downloadFiles(fileid)).reduce((data, byte) => data + String.fromCharCode(byte), ''))
            // let link = document.createElement('a')
            // link.href = 'data:image/png;base64,' + bufferUrl
            // link.download = 'qrCode.png'
            // link.click()
            //this.imageSrc = 'data:image/png;base64,' + bufferUrl
            return "http://192.168.88.65:59119/Public/fileDownload/" + fileid
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
                    message: '只能選一個',
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
                                message: '缺失內容檔案只能為pdf格式',
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
                }else{
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

.el-form--inline .el-form-item{
    margin-right: 0px;
}

.files {
    width: 100%;
    height: 570px;
    overflow-x:hidden;
    overflow-y:auto;
}

i{
    cursor: pointer;
    padding-right: 10px;
}
</style>