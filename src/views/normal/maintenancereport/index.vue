<template>
        <div class="editor-container">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="24" :lg="12">
              <div class="chart-wrapper">
                <div class="verticalhalfdiv">
                  <div class="label">
                    <i class="el-icon-edit">
                        <a @click="openWindows('basic')" style="color:#66b1ff"> 場所名稱：</a>
                    </i>
                  </div>
                  <div class="content">
                    <span> {{ this.buildinginfo[0].getName() }}</span> 
                  </div>
                </div>
                <div class="verticalhalfdiv">
                  <div class="label">
                    <i class="el-icon-edit">
                        <a @click="openWindows('sys-Setting')" style="color:#66b1ff"> 下次申報時間：</a>
                    </i>
                  </div>
                  <div class="content">
                    <span class="report"> {{ TimeOptions("InspectionTimeOptions") }} </span> 
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12">
              <div class="chart-wrapper">
                <el-col :xs="24" :sm="24" :md="24" :lg="12">
                  <div class="horizontalhalfdiv">
                    <div class="label">
                      <i class="el-icon-edit">
                          <a @click="openWindows('user')" style="color:#66b1ff"> 管理權人：</a>
                      </i>
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
                      <i class="el-icon-edit">
                          <a @click="openWindows('user')" style="color:#66b1ff"> 防火管理人：</a>
                      </i>
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
                <div class="block-wrapper" >
                    <Block 
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
              </el-col>
          </el-row>
          <!-- <Dialog 
            ref="dialog"
            v-if="innerVisible === true"
            v-bind="dialogAttrs" 
            :specialId="lackFileId"
            :files="files"
            :formtableData="formtableData"
            :formtableconfig="formtableconfig"
            :listQueryParams="lacklistQueryParams"
            v-on:handleDialog="handleDialog"></Dialog> -->

          <DialogForm 
          ref="dialogform"
          v-if="innerVisible === true"
          v-bind="dialogAttrs"
          v-on:handleDialog="handleDialog"></DialogForm>

          <DialogTable 
          ref="dialogtable"
          v-if="tableVisible === true"
          v-bind="tableAttrs"
          v-on="tableEvent"></DialogTable>

           <DialogUpload
          ref="dialogupload"
          v-if="uploadVisible === true"
          v-bind="uploadAttrs"
          v-on:handleDialog="handleDialog"></DialogUpload>

          <DialogExcel 
          ref="dialogexcel"
          v-if="excelVisible === true"
          v-bind="excelAttrs"
          v-on:handleDialog="handleDialog"></DialogExcel>


        </div>
</template>
<script>
import { blockmixin, dialogmixin, sharemixin, tablemixin, excelmixin } from '@/mixin/index'
import { Files, Inspection, InspectionLacks } from '@/object/index'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin,tablemixin,excelmixin],
    data(){
        return{
            inspection:'',
            isUpdate:false,
            //dialog額外的參數
            lackFileId:'', //缺失檔案id
            files:[],
            uploadVisible:false
        }
    },
    computed: {
      blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingMaintenanceReport,
                resetlistQueryParams:this.resetlistQueryParams
            }
      },
      tableEvent(){
            return{
                handleTableClick:this.handleTableClick,
                clickPagination:this.handleTableClick
            }
      },
      uploadAttrs(){
            return{
                visible:this.uploadVisible,
                title:this.title,
                specialId:this.lackFileId,
                files:this.files
            }
      }
  },
  methods: {
    async init(){
      this.title = 'reportInspectio'
      this.tableConfig = Inspection.getTableConfig()
      await this.getBuildingMaintenanceReport()
      await this.getCertificateNumber()
      this.buttonsName = [
        { name:'刪除',icon:'el-icon-delete',status:'delete'},
        { name:'編輯',icon:'el-icon-edit',status:'open'},
        { name:'缺失內容',icon:'el-icon-document',status:'openlacks'},
        { name:'檔案',icon:'el-icon-folder-opened',status:'openfiles'}
      ]
    },
    async resetlistQueryParams(){
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total:0
      }
      await this.getBuildingMaintenanceReport()
    },
    async resettablelistQueryParams(){
      this.tablelistQueryParams = {
          pageIndex: 1,
          pageSize: 10,
          total:0
      }
      await this.getInspectionLack()
    },
    async getCertificateNumber(){
      var data = await Inspection.getColumn({
              "professName": "{IsNotNull}"
      })
      this.dialogSelect = data.map(item=> {
        return {value: item.professName}
      })
    },
    async getBuildingMaintenanceReport() { //取得檢修申報
      var data = await Inspection.getSearchPage(this.listQueryParams)
      this.blockData = data.result
      this.listQueryParams.total = data.totalPageCount
    },  
    async getInspectionLack(){ //取得缺失內容
      var data =  await InspectionLacks.getSearchPage(this.inspection.getID(),
      this.tablelistQueryParams)
      this.tableTitle = 'inspectionlack'
      this.dialogtableConfig = InspectionLacks.getTableConfig()
      this.tableData = data.result
      this.tablelistQueryParams.total = data.totalPageCount
    },
    async handleBlock(title,index, content) { //檢修申報的操作
      console.log(index,JSON.stringify(content))
      this.dialogData = []
      this.dialogTitle = this.title
      this.dialogButtonsName = []
      this.dialogConfig = this.tableConfig
      if(index === 'open'){
        this.dialogData.push(content)
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'update'},
          { name:'取消',type:'info',status:'cancel'}]
        this.innerVisible = true
        this.dialogStatus = 'update'
      }else if(index === 'delete'){
        var isDelete = await content.delete()
        if(isDelete){
          this.$message('刪除成功')
          await this.resetlistQueryParams()
        }else{
          this.$message.error('系統錯誤') 
        }
      }else if(index === 'empty'){
          this.dialogData.push( Inspection.empty() )
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
          this.innerVisible = true
          this.dialogStatus = 'create'
      }else if(index === 'openfiles'){
        this.inspection = content
        this.files = await content.files()
        this.lackFileId = await content.getlackfileID()
        this.uploadVisible = true
      }else if(index === 'openlacks'){
        this.inspection = content
        await this.resettablelistQueryParams()
        this.tableVisible = true
      }else if(index === 'exportExcel'){
        this.exportExcelData = this.blockData
        this.excelVisible = true
        this.excelType = 'exportExcel'
      }else if(index === 'uploadExcel'){
        this.excelVisible = true
        this.excelType = 'uploadExcel'
      }
    },
    async handleDialog(title ,index, content){ //Dialog相關操作
        console.log(title ,index,JSON.stringify(content))
        var isOk = false
        if(title === 'reportInspectio'){
          if(index === 'update' || index === 'create' || index === 'uploadExcelSave'){
            var isOk = index === 'update' ? await content.update() : 
             index === 'create' ? await content.create() : await Inspection.postMany(content)
            if(isOk){
              index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
              await this.getBuildingMaintenanceReport()
            }else{
              this.$message.error('系統錯誤')
            }
            this.innerVisible = false
            this.excelVisible = false
          }else if(index === 'createfile'){
              const formData = new FormData()
                content.forEach(item => {
                  formData.append('file', item.raw)
              })
              isOk = await this.inspection.createfiles(formData) 
              if(isOk){
                this.$message('上傳成功')
                this.files = await this.inspection.files()
              }else{
                this.$message.error('系統錯誤')
              }
          }else if(index === 'deletefile'){
            var data = { id:content.toString() }
            isOk = await Files.delete(data)
            if(isOk){
              this.$message('刪除成功')
              this.files = await this.inspection.files()
            }else{
              this.$message.error('系統錯誤')
            }
          }else if(index !== 'cancel'){ //更換缺失內容檔案
            var autoCreate = false
            await  this.$confirm('是否要同步建立維保資料?',
              '提示', {
                confirmButtonText: '確定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                autoCreate = true
               }).catch(()=>{
                autoCreate = false        
             })
            isOk = await this.inspection.settinglackfile(autoCreate,parseInt(content),
            index === 'changeAgain' ? true : false)
            if(isOk){
              this.$message('更新成功')
              this.lackFileId = content
              this.$refs.dialogform.insertSuccess('inspectionSelect')
            }else{
              this.$message.error('檔案格式有誤，請重新設定')
            }
          }else{
            if(this.isUpdate){
              await this.getBuildingMaintenanceReport()
              this.isUpdate = false
            }
            this.innerVisible = false
            this.excelVisible = false
            this.uploadVisible = false
          }
        }else{
          await this.handleLackDialog(title,index,content)
        }
    },
    async handleLackDialog(title ,index, content){ //LackDialog相關操作
        this.dialogData = []
        this.dialogTitle = 'inspectionlack'
        if(index === 'createlack' || index === 'updatelack'){
          var isOk = index === 'createlack' ? await content.create(this.inspection.getID()) : await content.update()
          if(isOk){
              index === 'updatelack' ? this.$message('更新成功') : this.$message('新增成功')
              if(index === 'createlack') this.isUpdate = true
              await this.getInspectionLack()
              this.innerVisible = false
          }else{
            this.$message.error('系統錯誤')
          }
        }else if(index === 'cancellack'){
          this.innerVisible = false
        }else if(index === 'cancel'){
          this.excelVisible = false
        }else if(index === 'uploadExcelSave'){
          var isOk = await InspectionLacks.postMany(this.inspection.getID(),content)
          if(isOk){
              this.$message('新增成功')
              this.isUpdate = true
              await this.getInspectionLack()
              this.excelVisible = false
          }else{
            this.$message.error('系統錯誤')
          }
        }
    },
    async handleTableClick(index, content){
      console.log(index,JSON.stringify(content))
      this.dialogData = []
      this.dialogTitle = 'inspectionlack'
      this.dialogConfig = InspectionLacks.getTableConfig()
      if(index === 'empty'){
        this.dialogData.push( InspectionLacks.empty() )
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'createlack'},
          { name:'返回',type:'info',status:'cancellack'}]
        this.innerVisible = true
        this.dialogStatus = 'create'
      }else if(index === 'delete'){
        var isDelete = await content.delete()
        if(isDelete){
            this.$message('刪除成功')
            await this.resettablelistQueryParams()
            this.isUpdate = true
        }else{
          this.$message.error('系統錯誤')
        }
      }else if(index === 'open'){
        if(content.length !== undefined){ //代表不是外傳近來的
          content.forEach(item=>{
            this.dialogData.push(item)
          })
        }else{
            this.dialogData.push(content)
        }
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'updatelack'},
          { name:'取消',type:'info',status:'cancellack'}]
        this.innerVisible = true
        this.dialogStatus = 'update'
      }else if(index === 'exportExcel'){
        this.exportExcelData = this.tableData
        this.excelVisible = true
        this.excelType = 'exportExcel'
      }else if(index === 'uploadExcel'){
        this.excelVisible = true
        this.excelType = 'uploadExcel'
      }else if(index === 'clickPagination'){
        this.tablelistQueryParams = content
        await this.getInspectionLack()
      }else{
        if(this.isUpdate){
          await this.getBuildingMaintenanceReport()
          this.isUpdate = false
        }
        this.tableVisible = false
      }
    },
    async changeTable(value){
      this.isTable = value
      if(this.$route.params.target !== undefined && this.$route.params.target.length !== 0 && this.$route.params.type == 'open'){
        if(typeof this.$route.params.target == 'object'){
          if(this.$route.params.type == 'open'){
            await this.handleTableClick('open',this.$route.params.target)
          }
        }
      }else if(this.$route.query.type !== undefined && 
          this.$route.query.type == 'inspection'){
        await this.handleBlock('','empty','')
        this.$message('請先建立新的檢修申報後進行缺失項目的檔案設定')
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
    
</style>