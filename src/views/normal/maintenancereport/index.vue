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
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                    <Block 
                    :list-query-params.sync="listQueryParams"
                    :selectSetting.sync="selectSetting"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
              </el-col>
          </el-row>
          <Dialog 
            v-if="innerVisible === true"
            v-bind="dialogAttrs" 
            :specialId="lackFileId"
            :files="files"
            :formtableData="formtableData"
            :formtableconfig="formtableconfig"
            :listQueryParams="lacklistQueryParams"
            v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import { setSelectSetting } from '@/utils/index'
import Files  from '@/object/files'
import Inspection  from '@/object/inspection'
import InspectionLacks from '@/object/inspectionLacks'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
    data(){
        return{
            inspection:'',
            lackorigin:[],
            //dialog額外的參數
            lackFileId:'', //缺失檔案id
            files:[],
            formtableData:[],
            formtableconfig:InspectionLacks.getConfig(),
            lacklistQueryParams:{
                page: 1,
                limit: 10,
                total: 0
            }
        }
    },
    computed: {
      blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingMaintenanceReport
            }
      }
  },
  methods: {
    async init(){
      this.lacklistQueryParams = {page: 1,limit: 10,total: 0}
      this.tableConfig = Inspection.getConfig()
      this.title = 'reportInspectio'
      await this.reloadInspectio()
    },
    async reloadInspectio(){
      await this.saveBuildingMaintenanceReport()
      await this.getBuildingMaintenanceReport() 
      await this.setSelectSetting()
    },
    async lackinit(){
      this.lacklistQueryParams = {page: 1,limit: 10,total: 0}
      await this.saveInspectionLack()
      await this.getInspectionLack() 
    },
    async saveBuildingMaintenanceReport(){
      var data = await Inspection.get()
      this.origin = data.map(item=>{ return item.clone(item) })
    },
    async getBuildingMaintenanceReport(sort = null) { //取得檢修申報
      this.blockData = []
      var data = this.origin.map(item=>{ return item.clone(item) })
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
        data = data.filter((item, index) => 
          index < this.listQueryParams.limit * this.listQueryParams.page && 
          index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
        this.blockData = data
    },  
    async setSelectSetting(){
      this.selectSetting = await setSelectSetting(this.tableConfig,this.origin)
      this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
    },
    async saveInspectionLack(){
      var data =  await InspectionLacks.get(this.inspection.getID())
      this.lackorigin = data.map(item=>{ return item.clone(item) })
    },
    async getInspectionLack(){ //取得缺失內容
      var data = this.lackorigin.map(item=>{ return item.clone(item) })
      this.lacklistQueryParams.total = data.length
      this.formtableData = data.filter((item, index) => 
          index < this.lacklistQueryParams.limit * this.lacklistQueryParams.page && 
          index >= this.lacklistQueryParams.limit * (this.lacklistQueryParams.page - 1))
    },
    async handleBlock(title,index, content) { //檢修申報的操作
      console.log(index,JSON.stringify(content))
      this.dialogData = []
      this.dialogTitle = this.title
      if(index === 'open'){
        this.dialogData.push(content)
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'update'},
          { name:'取消',type:'info',status:'cancel'}]
        this.dialogConfig = this.tableConfig
        this.innerVisible = true
        this.dialogStatus = 'update'
      }else if(index === 'delete'){
        var isDelete = await content.delete()
        if(isDelete){
          this.$message('刪除成功')
          this.listQueryParams = {
                page: 1,
                limit: 10,
                total: 0
          }
          await this.reloadInspectio()
        }
      }else if(index === 'empty'){
          this.dialogData.push( Inspection.empty() )
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
          this.dialogConfig = this.tableConfig
          this.innerVisible = true
          this.dialogStatus = 'create'
      }else if(index === 'openfiles'){
        this.inspection = content
        this.files = await content.files()
        this.lackFileId = await content.getlackfileID()
        this.dialogButtonsName = []
        this.innerVisible = true
        this.dialogStatus = 'upload'
      }else if(index === 'openlacks'){
        this.dialogTitle = 'lack'
        this.inspection = content
        this.dialogButtonsName = []
        await this.lackinit()
        this.dialogStatus = 'lack'
        this.innerVisible = true
      }
    },
    async handleDialog(title ,index, content){ //Dialog相關操作
        console.log(title ,index,JSON.stringify(content))
        var isOk = false
        if(title === 'reportInspectio'){
          if(index === 'update' || index === 'create'){
            var isOk = index === 'update' ? await content.update() : await content.create()
            if(isOk){
              index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
              await this.reloadInspectio()
            }
            this.innerVisible = false
          }else if(index === 'createfile'){
              const formData = new FormData()
                content.forEach(item => {
                  formData.append('file', item.raw)
              })
              isOk = await this.inspection.createfiles(formData) 
              if(isOk){
                this.$message('上傳成功')
                this.files = await this.inspection.files()
              }
          }else if(index === 'deletefile'){
            var data = { id:content.toString() }
            isOk = await Files.delete(data)
            if(isOk){
              this.$message('刪除成功')
              this.files = await this.inspection.files()
            }
          }else if(index !== 'cancel'){ //更換缺失內容檔案
            const loading = this.$loading({
                lock: true,
                text: '更換缺失內容中，請稍後 ...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            isOk = await this.inspection.settinglackfile(parseInt(content),
            index === 'changeAgain' ? true : false)
            if(isOk){
              this.$message('更新成功')
              this.lackFileId = content
              loading.close()
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
        if(index === 'empty'){
          this.dialogData.push( InspectionLacks.empty() )
          this.dialogConfig = this.formtableconfig
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
          var isDelete = await content.delete()
          if(isDelete){
              this.$message('刪除成功')
              await this.lackinit()
          }
        }else if(index === 'createlack' || index === 'updatelack'){
          var isOk = index === 'createlack' ? await content.create(this.inspection.getID()) : await content.update()
          if(isOk){
              index === 'updatelack' ? this.$message('更新成功') : this.$message('新增成功')
              await this.handleBlock('lack','openlacks',this.inspection)
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
          await this.handleBlock('lack','openlacks',this.inspection)
        }else if(index === 'clickPagination'){
          this.lacklistQueryParams = content
          await this.getInspectionLack()
        }
    },
    async changeTable(value){
      this.isTable = value
      value == true ?  this.tableConfig = Inspection.getTableConfig() : this.tableConfig = Inspection.getConfig()
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
    .block-wrapper {
        background: #fff;
        padding: 30px 15px;
        height: 720px;
    }
    // .wrapper{
    //   background: #fff;
    //   padding: 10px;
    //   height: 720px;
      
    //   .block-wrapper {
    //     margin-bottom: 32px;
    //     height: 700px;
    //     width: 100%;
    //     overflow-x: hidden;
    //     overflow-y: auto;
    //   }
    // }
    
</style>