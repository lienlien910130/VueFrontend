<template>
        <div class="editor-container">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12">
              <div class="chart-wrapper">
                <div class="verticalhalfdiv">
                  <div class="label">
                    <span>場所名稱 :</span>
                  </div>
                  <div class="content">
                    <span> {{ this.buildinginfo[0].buildingName }}</span> 
                  </div>
                </div>
                <div class="verticalhalfdiv">
                  <div class="label">
                    <span>下次申報時間 :</span>
                  </div>
                  <div class="content">
                    <span class="report"> 2021/03/20 </span> 
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12">
              <div class="chart-wrapper">
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                  <div class="horizontalhalfdiv">
                    <div class="label">
                      <span>管理權人 :</span>
                    </div>
                    <div class="content">
                      <div
                        v-for="(item,index) in this.buildinginfo[0].linkOwners"
                        :key="index" class="user">
                        <div style="padding-bottom:2px">
                            姓名 ： {{ item.name }}
                        </div>
                        <div>
                            電話 ： {{ item.cellPhoneNumber }}
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                  <div class="horizontalhalfdiv">
                    <div class="label">
                      <span>防火管理人 :</span>
                    </div>
                    <div class="content">
                      <div
                        v-for="(item,index) in this.buildinginfo[0].linkFireManagers"
                        :key="index" class="user">
                        <div style="padding-bottom:2px">
                            姓名 ： {{ item.name }}
                        </div>
                        <div>
                            電話 ： {{ item.cellPhoneNumber }}
                        </div>
                      </div> 
                    </div>
                  </div>
                </el-col>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="32">
              <el-col :xs="24" :sm="24" :md="24" :lg="24">
                <div class="wrapper">
                  <div class="block-wrapper">
                      <Block 
                      :list-query-params.sync="listQueryParams"
                      :selectSetting.sync="selectSetting"
                      v-bind="blockAttrs" 
                      v-on="blockEvent"></Block>
                  </div>
                </div>
              </el-col>
          </el-row>
          <Dialog 
            v-if="innerVisible === true"
            v-bind="dialogAttrs" 
            v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { setSelectSetting } from '@/utils/index'

export default {
    name:'',
    components:{ 
      Block: () => import('@/components/Block/index.vue'),
      Dialog:() => import('@/components/Dialog/index.vue')
    },
    data(){
        return{
            tableConfig: [
              {
                label: '申報年度',
                prop: 'declareYear',
                format:'YYYY',
                mandatory:true, message:'請選擇年度',isSelect:true,options:[],
                selectType:'dateOfYear',select:'',isSort:true
              },
              {
                label: '申報期限',
                prop: 'declareDeadline',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇期限',isSelect:true,options:[],
                selectType:'dateOfDate',select:'',isSort:true
              },
              {
                label: '申報日期',
                prop: 'declareDate',
                format:'YYYY-MM-DD',
                mandatory:true, message:'請選擇日期',isSelect:true,options:[],
                selectType:'dateOfDate',select:'',isSort:true
              },
              {
                label: '檢測日期',
                prop: 'rangeDate',
                format:'range',isSelect:false,isSort:false
                // mandatory:true, message:'請選擇日期'
              },
              {
                label: '專技人員',
                prop: 'professName',isSelect:true,options:[],
                        selectType:'',select:'',isSort:true
              },
              {
                label: '證號',
                prop: 'certificateNumber',isSelect:false,isSort:true
              },
              {
                label: '改善期限',
                prop: 'declarationImproveDate',
                format:'YYYY-MM-DD',mandatory:true, message:'請選擇日期',isSelect:true,options:[],
                  selectType:'dateOfDate',select:'',isSort:true
              },
              {
                label: '改善狀況',
                prop: 'isImproved',
                format:'tag',
                type:'boolean',
                mandatory:false, isPattern:false,trigger:'change',isSelect:true,options:[],
                selectType:'reportBool',select:'',isSort:true
              },
              {
                label: '備註',
                prop: 'note',
                format:'textarea',
                mandatory:false, isPattern:false,isSelect:false,isSort:false
              },
              {
                label: '檢附文件',
                prop: 'file',
                format:'openfiles',isSelect:false,isSort:false
              },
              {
                label: '缺失內容',
                prop: 'missingContent',
                format:'openlacks',isSelect:false,isSort:false
              }
            ],
            lackconfig:[
              {
                label: '缺失項目',
                prop: 'lackItem',
                mandatory:true, message:'請輸入缺失項目',format:'input'
              },
              {
                label: '缺失內容',
                prop: 'lackContent',
                mandatory:true, message:'請輸入缺失內容',format:'textarea'
              },
              {
                label: '改善狀況',
                prop: 'improveContent',
                mandatory:false, format:'textarea'
              },
              {
                label: '改善狀態',
                prop: 'status',
                mandatory:false, format:'select'
              },
            ],
            blockData: [],
            buttonsName:[
                { name:'編輯',type:'primary',status:'open'},
                { name:'刪除',type:'info',status:'delete'}], 
            files:[],
            inspectionId:'', //檢修申報id
            lackFileId:'', //缺失檔案id
            dialogButtonsName:[],
            dialogConfig:[],
            dialogTitle:'',
            dialogData:[],
            dialogStatus:'',
            innerVisible:false,
            options:[],
            listQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            selectSetting:[],
            sortArray:[],
            formtableData:[],
            formtableconfig:[
              { label:'項目' , prop:'lackItem',format:'', mandatory:true, message:'請輸入項目'},
              { label:'內容' , prop:'lackContent',format:'textarea',  mandatory:true,message:'請輸入內容'},
              { label:'改善內容' , prop:'improveContent',format:'textarea', mandatory:false, message:'請輸入改善內容'},
              { label:'處理進度' , prop:'status',format:'LackStatusOptions', mandatory:true, message:'請選擇處理進度'}
            ],
            lacklistQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            },
            origin:[],
            lackorigin:[],
        }
    },
    watch: {
      buildingid:{
        handler:async function(){
            await this.init()
        },
        immediate:true
      },
    },
    computed: {
      ...mapGetters([
        'id',
        'buildingid',
        'buildinginfo'
      ]),
      inline() {
            if (this.$store.state.app.device === 'mobile') {
                return false
            } else {
                return true
            }
      },
      chartwrapper(){
        if (this.$store.state.app.device === 'mobile') {
            return 'chart-mwrapper'
        } else {
            return 'chart-wrapper'
        }
      },
      blockAttrs() {
          return {
            blockData: this.blockData,
            buttonsName:this.buttonsName,
            config: this.tableConfig,
            title:'reportInspectio',
            sortArray:this.sortArray
          }
      },
      blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingMaintenanceReport
            }
      },
      dialogAttrs(){
        return{
            title:this.dialogTitle,
            visible: this.innerVisible,
            dialogData: this.dialogData,
            dialogStatus: this.dialogStatus,
            buttonsName: this.dialogButtonsName,
            config: this.dialogConfig,
            files:this.files,
            specialId:this.lackFileId,
             //表格
            formtableData: this.formtableData,
            formtableconfig:this.formtableconfig,
            listQueryParams:this.lacklistQueryParams
        }
      }
  },
  methods: {
    async init(){
      this.lacklistQueryParams = {page: 1,limit: 10,total: 0}
      await this.saveBuildingMaintenanceReport()
      await this.getBuildingMaintenanceReport() 
      await this.setSelectSetting()
    },
    async inspectioninit(){
      this.lacklistQueryParams = {page: 1,limit: 10,total: 0}
      await this.saveInspectionLack()
      await this.getInspectionLack() 
    },
    async saveBuildingMaintenanceReport(){
      var data = await this.$obj.Report.getBuildingInspection()
      this.origin = this.$deepClone(data)
    },
    async getBuildingMaintenanceReport(sort = null) { //取得檢修申報
      this.blockData = []
      var data = this.$deepClone(this.origin)
      this.listQueryParams.total = data.length
      this.selectSetting.forEach(element=>{
        if(element.select !== ''){
          data = data.filter(function(item,index){
              if(typeof item[element.prop] !== 'object'){
                  return item[element.prop] == element.select
              }else{
                  if(item[element.prop].length > 0){
                    return item[element.prop][0].id == element.select
                  }
              }
          })
        }
      })
      data = data.filter((item, index) => 
        index < this.listQueryParams.limit * this.listQueryParams.page && 
        index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
      if(sort !== '' && sort !== null){
          if(sort == 'declareDeadline' || sort == 'declareDate' || sort == 'declarationImproveDate'){
            data = data.sort(function(x,y){
              var date1 = x[sort].split(' ')
              var date2 = y[sort].split(' ')
              var _data1 = new Date(date1[0])
              var _data2 = new Date(date2[0])
              return  _data2 - _data1
            })
          }else if(sort == 'declareYear'){
            data = data.sort(function(x,y){
                var date1 = x[sort].split(' ')
                var date2 = y[sort].split(' ')
                var _data1 = new Date(date1[0]).getFullYear()
                var _data2 = new Date(date2[0]).getFullYear()
                return  _data2 - _data1
            })
          }else{
            data = data.sort(function(x,y){
                return y[sort] - x[sort]
            })
          }
        }else{
            data = data.sort(function(x,y){
                var a = x.isImproved
                var b = y.isImproved
                if(a == b){
                  return y.id - x.id
                }
                return x.isImproved - y.isImproved
            })
        }
      this.blockData = data
    },  
    async setSelectSetting(){
      this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
      this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
    },
    async saveInspectionLack(){
      var data =  await this.$obj.Report.getInspectionLack(this.inspectionId)
      this.lackorigin = this.$deepClone(data)
    },
    async getInspectionLack(){ //取得缺失內容
      var data =  this.$deepClone(this.lackorigin)
      this.lacklistQueryParams.total = data.length
      this.formtableData = data.filter((item, index) => 
          index < this.lacklistQueryParams.limit * this.lacklistQueryParams.page && 
          index >= this.lacklistQueryParams.limit * (this.lacklistQueryParams.page - 1))
    },
    async handleBlock(title,index, content) { //檢修申報的操作
      console.log(index,JSON.stringify(content))
      this.dialogData = []
      this.dialogTitle = 'reportInspectio'
      if(index === 'open'){
        var temp = this.$deepClone(content)
        this.dialogData.push(temp)
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'update'},
          { name:'取消',type:'info',status:'cancel'}]
        this.dialogConfig = this.tableConfig
        this.innerVisible = true
        this.dialogStatus = 'update'
      }else if(index === 'delete'){
        var isDelete = await this.$obj.Report.deleteInspection(content)
        if(isDelete){
          this.$message('刪除成功')
          this.listQueryParams = {
                page: 1,
                limit: 10,
                total: 0
          }
          await this.init()
        }
      }else if(index === 'empty'){
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
          this.dialogConfig = this.tableConfig
          this.innerVisible = true
          this.dialogStatus = 'create'
      }else if(index === 'openfiles'){
        this.inspectionId = content
        this.files = await this.$obj.Files.getBuildingInspectionFiles(this.inspectionId)
        this.lackFileId = await this.$obj.Report.getInspection(this.inspectionId)
        this.dialogButtonsName = []
        this.innerVisible = true
        this.dialogStatus = 'upload'
      }else if(index === 'openlacks'){
        this.dialogTitle = 'lack'
        this.inspectionId = content
        this.dialogButtonsName = []
        await this.inspectioninit()
        this.dialogStatus = 'lack'
        this.innerVisible = true
      }
    },
    async handleDialog(title ,index, content){ //Dialog相關操作
        console.log(title ,index,JSON.stringify(content))
        var isOk = false
        if(title === 'reportInspectio'){
          if(index === 'update' || index === 'create'){
            isOk = index === 'update' ? 
              await this.$obj.Report.updateInspection(JSON.stringify(content)) :
              await this.$obj.Report.postInspection(JSON.stringify(content))
            if(isOk){
              index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
              await this.init()
            }
            this.innerVisible = false
          }else if(index === 'createfile'){
              const formData = new FormData();
                content.forEach(item => {
                  formData.append('file', item.raw)
              })
              isOk = await this.$obj.Files.postBuildingInspectionFiles(this.inspectionId,formData)
              if(isOk){
                this.$message('上傳成功')
                this.files = await this.$obj.Files.getBuildingInspectionFiles(this.inspectionId)
              }
          }else if(index === 'deletefile'){
            isOk = await this.$obj.Files.deleteFiles(content)
            if(isOk){
              this.$message('刪除成功')
              this.files = await this.$obj.Files.getBuildingInspectionFiles(this.inspectionId)
            }
          }else if(index !== 'cancel'){
            isOk = await this.$obj.Report.postInspectionFiles(this.inspectionId,parseInt(content),
            index === 'changeAgain' ? true : false)
            if(isOk){
              this.$message('更新成功')
              this.lackFileId = await this.$obj.Report.getInspection(this.inspectionId)
            }
          }else{
            this.innerVisible = false
          }
        }else{
          await this.handleLackDialog(title,index,content)
        }
    },
    async handleLackDialog(title ,index, content){ //LackDialog相關操作
        this.dialogData = []
        this.dialogTitle = 'lack'
        this.dialogConfig = []
        if(index === 'empty'){
          this.dialogConfig = this.formtableconfig
          this.dialogSelect= [] //檢修申報下拉選單
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'createlack'},
          { name:'返回',type:'info',status:'cancellack'}]
          this.innerVisible = true
          this.dialogStatus = 'create'
        }else if(index === 'open'){
          this.dialogConfig = this.formtableconfig    
          this.dialogData.push(content)
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'updatelack'},
          { name:'取消',type:'info',status:'cancellack'}]
          this.innerVisible = true
          this.dialogStatus = 'update'
        }else if(index === 'delete'){
          var isDelete = await this.$obj.Report.deleteInspectionLack(content)
          if(isDelete){
              this.$message('刪除成功')
              await this.inspectioninit()
          }
        }else if(index === 'createlack' || index === 'updatelack'){
          var isOk = index === 'createlack' ? 
          await this.$obj.Report.postInspectionLack(this.inspectionId,JSON.stringify(content)) : 
          await this.$obj.Report.updateInspectionLack(JSON.stringify(content))
          if(isOk){
              index === 'updatelack' ? this.$message('更新成功') : this.$message('新增成功')
              await this.handleBlock('lack','openlacks',this.inspectionId)
          }
        }else if(index === 'cancel'){
          this.innerVisible = false
          this.lacklistQueryParams = {
            page: 1,
            limit: 10,
            total: 0
          }
        }else if(index === 'cancellack'){
          this.lacklistQueryParams = {
            page: 1,
            limit: 10,
            total: 0
          }
          await this.handleBlock('lack','openlacks',this.inspectionId)
        }else if(index === 'clickPagination'){
          this.lacklistQueryParams = content
          await this.getInspectionLack()
        }
    }
  }
}
</script>
<style lang="scss" scoped>
  .chart-wrapper {
        background: #fff;
        padding: 10px 10px;
        margin-bottom: 30px;
        height: 150px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        .verticalhalfdiv{
          width: 100%;
          min-height: 50%;
          .label{
            min-width: 30%;
            display:inline-block;
            text-align:center;
            font-size: 20px;
          }
          .content{
            min-width: 60%;
            display:inline-block;
            font-size: 30px;
          }
        }
        .horizontalhalfdiv{
          height: 100%;
          min-width: 50%;
          .label{
            min-width: 30%;
            display:inline-block;
            text-align:center;
            font-size: 20px;
            vertical-align:top;
          }
          .content{
            min-width: 70%;
            display:inline-block;
            font-size: 24px;
            .user{
              padding: 0px 8px 8px 8px;
            }
          }
        }
        .report{
            font-size: 50px;
            color: red;
        }
    }
    .chart-mwrapper{
       background: #fff;
        padding: 10px 16px 0;
        margin-bottom: 32px;
        height: 310px;
        width: 100%;
        .report{
            font-size: 24px;
            color: red;
        }
    }
    .wrapper{
      background: #fff;
      padding: 10px;
      height: 720px;
      
      .block-wrapper {
        margin-bottom: 32px;
        height: 700px;
        width: 100%;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
    
    .top{
        width: 100%;
    }

</style>