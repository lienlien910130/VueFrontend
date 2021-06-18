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
                    <span class="report"> 
                      {{ TimeOptions("PublicSafeTimeOptions") }} 
                    </span> 
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
                <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                  <Block 
                    ref="block"
                    :list-query-params.sync="listQueryParams"
                    v-bind="blockAttrs" 
                    v-on="blockEvent"></Block>
                </div>
              </el-col>
          </el-row>
          <Dialog 
            v-if="innerVisible === true"
            v-bind="dialogAttrs" 
            :files="files"
            :formtableData="formtableData"
            :formtableconfig="formtableconfig"
            :listQueryParams="lacklistQueryParams"
            v-on:handleDialog="handleDialog"></Dialog>
        </div>
</template>
<script>
import Files  from '@/object/files'
import PublicSafe from '@/object/publicSafe'
import PublicSafeLack from '@/object/publicSafeLack'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Setting from '@/object/setting'

export default {
    mixins:[sharemixin,blockmixin,dialogmixin],
    data(){
        return{
            publicSafe:'',
            //dialog額外的參數
            files:[],
            formtableData:[],
            formtableconfig: PublicSafeLack.getTableConfig(),
            lacklistQueryParams:{
                pageIndex: 1,
                pageSize: 10,
                total:0
            }
        }
    },
    computed: {
      blockEvent(){
            return{
                handleBlock:this.handleBlock,
                clickPagination:this.getBuildingPublicSafeReport,
                resetlistQueryParams:this.resetlistQueryParams
            }
      }
  },
  methods: {
    async init(){
      this.title = 'reportPublicSafe'
      this.tableConfig = PublicSafe.getTableConfig()
      await this.getBuildingPublicSafeReport()
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
      await this.getBuildingPublicSafeReport()
    },
    async resetlacklistQueryParams(){
      this.lacklistQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        total:0
      }
      await this.getPublicSafeLack()
    },
    async getCertificateNumber(){
      var data = await PublicSafe.getColumn({
              "professName": "{IsNotNull}"
      })
      this.dialogSelect = data.map(item=> {
        return {value: item.professName}
      })
    },
    async getBuildingPublicSafeReport() { 
      var data = await PublicSafe.getSearchPage(this.listQueryParams)
      this.blockData = data.result
      this.listQueryParams.total = data.totalPageCount
      this.$refs.block.resetpictLoading()
      await this.getFilterItems()
    },
    async getPublicSafeLack(){ //取得缺失內容
      var data =  await PublicSafeLack.getSearchPage(this.publicSafe.getID(),
      this.lacklistQueryParams)
      this.formtableData = data.result
      this.lacklistQueryParams.total = data.totalPageCount
    },
    async handleBlock(title,index, content) { //公安申報的操作
      console.log(title,index,JSON.stringify(content))
      this.dialogData = []
      this.dialogTitle = this.title
      this.dialogButtonsName = []
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
          await this.resetlistQueryParams()
        }
      }else if(index === 'empty'){
        this.dialogData.push( PublicSafe.empty() )
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
        this.dialogConfig = this.tableConfig
        this.innerVisible = true
        this.dialogStatus = 'create'
      }else if(index === 'openfiles'){
          this.publicSafe = content
          this.files = await content.files()
          this.innerVisible = true
          this.dialogStatus = 'upload'
      }else if(index === 'openlacks'){
        this.dialogTitle = 'lack'
        this.publicSafe = content
        await this.resetlacklistQueryParams()
        this.dialogStatus = 'lack'
        this.innerVisible = true
      }else if(index === 'exportExcel'){
        this.dialogConfig = this.tableConfig
        this.exportExcelData = this.blockData
        this.innerVisible = true
        this.dialogStatus = 'exportExcel'
      }else if(index === 'uploadExcel'){
        this.dialogConfig = this.tableConfig
        this.innerVisible = true
        this.dialogStatus = 'uploadExcel'
      }
    },
    async handleDialog(title ,index, content){ //Dialog相關操作
        console.log(title ,index, JSON.stringify(content))
        var isOk = false
        if(title === 'reportPublicSafe'){
          if(index === 'update' || index === 'create' || index === 'uploadExcelSave'){
            isOk = index === 'update' ? await content.update() :
            index === 'create' ? await content.create() : await PublicSafe.postMany(content)
            if(isOk){
              index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
              await this.getBuildingPublicSafeReport()
            }
            this.innerVisible = false
          }else if(index === 'createfile'){
            const formData = new FormData()
              content.forEach(item => {
                formData.append('file', item.raw)
            })
            isOk = await this.publicSafe.createfiles(formData) 
            if(isOk){
              this.$message('上傳成功')
              this.files = await this.publicSafe.files()
            }
          }else if(index === 'deletefile'){
            var data = { id:content.toString() }
            isOk = await Files.delete(data)
            if(isOk){
              this.$message('刪除成功')
              this.files = await this.publicSafe.files()
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
          this.dialogData.push( PublicSafeLack.empty() )
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
              await this.resetlacklistQueryParams()
          }
        }else if(index === 'createlack' || index === 'updatelack'){
          var isOk = index === 'createlack' ? 
          await content.create(this.publicSafe.getID()) : 
          await content.update()
          if(isOk){
              index === 'updatelack' ? this.$message('更新成功') : this.$message('新增成功')
              await this.handleBlock('lack','openlacks',this.publicSafe)
          }
        }else if(index === 'cancel'){
          this.innerVisible = false
          this.lacklistQueryParams = {
            pageIndex: 1,
            pageSize: 10,
            total:0
          }
          if(this.isTable == false){
            await this.getBuildingPublicSafeReport()
          }
        }else if(index === 'cancellack'){
          this.lacklistQueryParams = {
            pageIndex: 1,
            pageSize: 10,
            total:0
          }
          await this.handleBlock('lack','openlacks',this.publicSafe)
        }else if(index === 'clickPagination'){
          this.lacklistQueryParams = content
          await this.getPublicSafeLack()
        }else if(index === 'exportExcel'){
          this.dialogConfig = this.formtableconfig  
          this.exportExcelData = this.formtableData
          this.innerVisible = true
          this.dialogStatus = 'exportExcel'
        }else if(index === 'uploadExcel'){
          this.dialogConfig = this.formtableconfig 
          this.innerVisible = true
          this.dialogStatus = 'uploadExcel'
        }else if(index === 'uploadExcelSave'){
          var isOk = await PublicSafeLack.postMany(this.publicSafe.getID(),content)
           if(isOk){
              this.$message('新增成功')
              await this.handleBlock('lack','openlacks',this.publicSafe)
          }
        }else if(index === 'selectData'){
          this.$store.dispatch('building/setbuildingoptions',await Setting.getAllOption())
        }
    },
    async changeTable(value){
      this.isTable = value
       if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
        if(typeof this.$route.params.target == 'object'){
          await this.handleBlock('','open',this.$route.params.target)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form--inline .el-form-item{
     margin-right:40px
   }
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
        padding: 15px 15px;
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