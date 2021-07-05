<template>
    <div class="editor-container">
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
            <div class="block-wrapper-files" :style="{ height: blockwrapperheight }">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="15" style="padding:0px">
                        
                        <el-button  
                            type="info" icon="el-icon-delete" @click="deletefile"
                            style="margin:0px 5px">
                        </el-button>
                        <el-radio-group v-model="type" @change="searchType(true)">
                            <el-radio-button label="總覽"></el-radio-button>
                            <el-radio-button label="大樓"></el-radio-button>
                            <el-radio-button label="樓層"></el-radio-button>
                            <el-radio-button label="門牌"></el-radio-button>
                            <el-radio-button label="維護保養"></el-radio-button>
                            <el-radio-button label="檢修申報"></el-radio-button>
                            <el-radio-button label="公安申報"></el-radio-button>
                        </el-radio-group>
                        <span style="margin-left:10px">類型</span>
                        <i 
                        class="el-icon-caret-top icon" 
                        :class="[{clicked:clickType == 'extName' && sortType == 'ascending'}]" 
                        @click="sort('extName','ascending')"></i>
                        <i 
                        class="el-icon-caret-bottom icon"
                        :class="[{clicked:clickType == 'extName' && sortType == 'descending'}]"
                        @click="sort('extName','descending')"></i>
                        <span style="margin-left:10px">來源</span>
                        <i 
                        class="el-icon-caret-top icon" 
                        :class="[{clicked:clickType == 'targetModule' && sortType == 'ascending'}]" 
                        @click="sort('targetModule','ascending')"></i>
                        <i 
                        class="el-icon-caret-bottom icon"
                        :class="[{clicked:clickType == 'targetModule' && sortType == 'descending'}]"
                        @click="sort('targetModule','descending')"></i>
                        <span style="margin-left:10px">上傳時間</span>
                        <i 
                        class="el-icon-caret-top icon" 
                        :class="[{clicked:clickType == 'uploadTime' && sortType == 'ascending'}]" 
                        @click="sort('uploadTime','ascending')"></i>
                        <i 
                        class="el-icon-caret-bottom icon"
                        :class="[{clicked:clickType == 'uploadTime' && sortType == 'descending'}]"
                        @click="sort('uploadTime','descending')"></i>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="9" style="padding:0px">
                            <el-input v-model="input" 
                                placeholder="請輸入關鍵字" 
                                style="margin-bottom:10px;width:100%"
                                @input="search"
                                >
                                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                            </el-input>
                    </el-col>
                </el-row>
                <el-row>
                        <div class="files" :style="{ height: filesheight }">
                            <div 
                            v-for="(item,index) in filescopy" :key="item.getID()" class="filesdiv">
                                <el-checkbox v-model="deleteItem" :label="item.getID()">【{{ index+1 }}】</el-checkbox>
                                <i 
                                v-if="item.getExtName() == 'png' || item.getExtName() == 'jpg' || item.getExtName() == 'jpeg'
                                || item.getExtName() == 'pdf' "
                                class="el-icon-view" style="font-size:18px" @click="onPreview(item)"/>
                                <span 
                                @click="downloadfile(item)"  style="color:'#606266';cursor:'pointer'">
                                    <span>
                                        {{ item.getFileName() }}.{{ item.getExtName() }} 
                                    </span>
                                    <span style="float:right">
                                        {{ item.getExtName() }} 
                                        {{ ' / 檔案來源：'}}
                                        {{item.getModule() | changeModule }}
                                        {{ ' / 上傳時間：'+item.getUploadTime() }}
                                    </span>
                                </span>
                            </div>
                        </div>
                </el-row>
                <el-row v-if="total > 0 " style="margin-top:10px">
                    <div  class="pagination-container">
                        <el-pagination
                            @current-change="handleCurrentChange"
                            :current-page="page"
                            :page-size="limit"
                            layout="total, prev, pager, next"
                            :total="total">
                        </el-pagination>
                    </div>
                </el-row>
            </div>
        </el-col>
    </div>
</template>
<script>
import sharemixin  from '@/mixin/sharemixin'
import Files from '@/object/files'

export default {
    name:'Files',
    mixins:[sharemixin],
    computed:{
        page: function() {
            return this.listQueryParams.pageIndex || 1
        },
        limit: function() {
            return this.listQueryParams.pageSize || 100
        },
        total: function() {
            return this.listQueryParams.total || 0
        }
    },
    filters:{
        changeModule: function(val) {
            var type = ''
            switch (val) {
                case 'BuildingInfo':
                    type = '大樓'
                    break;
                case 'Floors':
                    type = '樓層'
                    break;
                case 'UsageOfFloor':
                    type = '門牌'
                    break;
                case 'MaintainList':
                    type = '維護保養'
                    break;
                case 'Maintain':
                    type = '維護保養'
                    break;
                case 'ReportInspectionList':
                    type = '檢修申報'
                    break;
                case 'ReportPublicSafeList':
                    type = '公安申報'
                    break;
                default:
                    break;
            }
            return type
        }
    },
    data(){
        return{
            files:[],
            filescopy:[],
            deleteItem:[],
            input:'',
            filesheight:'',
            type:'總覽',
            clickType:'',
            sortType:'',
            currentPage:'1',
            listQueryParams:{
                pageIndex: 1,
                pageSize: 100,
                total:0
            }
        }
    },
    watch:{
        fullscreen:{
                handler:async function(){
                    this.fullscreen == true ? this.filesheight = '730px' : this.filesheight = '600px'
                },
                immediate:true
        }
    },
    methods:{
        async init(){
            var data = await Files.getSearchPage(this.listQueryParams)
            this.files = data.result
            this.searchType(false)
            this.listQueryParams.total = data.totalPageCount
        },
        resetlistQueryParams(){
            this.listQueryParams = {
                pageIndex: 1,
                pageSize: 100,
                total:0
            }
        },
        search(){ //關鍵字搜尋
            if(this.input !== ''){
                this.filescopy = this.filescopy.filter(item => {
                    if (item.fileOriginalName.toLowerCase().includes(this.input.toLowerCase())) {
                        return item
                    }
                })
            }else{
                this.filescopy = this.files
                this.searchType(true)
            }
        },
        searchType(reset){ //檔案來源分類
            switch (this.type) {
                case '總覽':
                    this.filescopy = this.files
                    break;
                case '大樓':
                    this.filescopy = this.files.filter(item => item.targetModule == 'BuildingInfo')
                    break;
                case '樓層':
                    this.filescopy = this.files.filter(item => item.targetModule == 'Floors')
                    break;
                case '門牌':
                    this.filescopy = this.files.filter(item => item.targetModule == 'UsageOfFloor')
                    break;
                case '維護保養':
                    this.filescopy = this.files.filter(item => item.targetModule == 'MaintainList' || item.targetModule == 'Maintain')
                    break;
                case '檢修申報':
                    this.filescopy = this.files.filter(item => item.targetModule == 'ReportInspectionList')
                    break;
                case '公安申報':
                    this.filescopy = this.files.filter(item => item.targetModule == 'ReportPublicSafeList')
                    break;
            }
            if(reset){
                this.resetlistQueryParams()
            }
        },
        sort(c,s){ //排序
            this.clickType = c
            this.sortType = s
            var self = this
            if (s === "descending") {
                this.filescopy = this.filescopy.sort(function(str1,str2){
                    var s1 = str1[c] == null ? '' : str1[c]
                    var s2 = str2[c] == null ? '' : str2[c]
                    return self.sortRule(s2,s1)
                })
            } else {
                this.filescopy = this.filescopy.sort(function(str1,str2){
                    var s1 = str1[c] == null ? '' : str1[c]
                    var s2 = str2[c] == null ? '' : str2[c]
                    return self.sortRule(s1,s2)
                })
            }
        },
        sortRule(str1, str2) {
            let res = 0
            for (let i = 0; ;i++) {
				if (!str1[i] || !str2[i]) {
                    res = str1.length - str2.length
                    if(typeof str1 == 'boolean' && typeof str2 == 'boolean'){
                        res = str1 - str2
                    }
                    break
                }
                const char1 = str1[i]
                const char1Type = this.getChartType(char1)
                const char2 = str2[i]
                const char2Type = this.getChartType(char2)

                if (char1Type[0] === char2Type[0]) {
                    if (char1 === char2) {
                        continue
                    } else {
                        if (char1Type[0] === 'zh') {
                            res = char1.localeCompare(char2)
                        } else if (char1Type[0] === 'en') {
                            res = char1.charCodeAt(0) - char2.charCodeAt(0)
                        } else {
                            res = char1 - char2
                        }
                        break
                    }
                } else {
                    // 类型不同的，直接用返回的数字相减
                    res = char1Type[1] - char2Type[1]
                    break
                }
			}
			return res
		},
		getChartType(char) {
			// 數字(0-9)->大寫字母(A->Z)->小寫字母(a->z)->中文拼音
			if (/^[\u4e00-\u9fa5]$/.test(char)) {
				return ['zh', 300]
			}
			if (/^[a-zA-Z]$/.test(char)) {
				return ['en', 200]
			}
			if (/^[0-9]$/.test(char)) {
				return ['number', 100]
			}
			return ['others', 999]
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
                   var data = { id:this.deleteItem.toString() }
                   var isOk = await Files.delete(data)
                   if(isOk){
                       this.$message('刪除成功')
                       this.resetlistQueryParams()
                        await this.init()
                   }
                })
            }
        },
        async handleCurrentChange(val) {
            this.listQueryParams.pageIndex = val
            await this.init()
        }
    }
}
</script>

<style lang="scss" scoped>
.block-wrapper-files {
    background: #fff;
    padding: 15px 15px;
    height: 720px;
    .icon{
        cursor: pointer;
    }
    .clicked{
        color:#409EFF;
    }
}
.files {
    width: 100%;
    height: 600px;
    overflow-x:hidden;
    overflow-y:auto;

    .filesdiv{
        padding:8px;
    }
}
</style>