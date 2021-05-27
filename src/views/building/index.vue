<template>
  <div class="editor-container">
    <el-row :gutter="32">
      <!-- <el-col :xs="24" :sm="24" :md="24" :lg="7">
          <div class="block-wrapper" :style="{ height: blockwrapperheight }">
              <h3>建築物</h3>
              <el-form class="buildinginfo" 
                  ref="form" :model="form" 
                  :rules="formRules" :label-position="label" label-width="auto">
                  <el-form-item label="名稱" prop="buildingName">
                      <el-input ref="buildingName" name="buildingName" v-model="form.buildingName" show-word-limit maxlength="20"/>
                  </el-form-item>
                  <el-form-item label="地址" prop="address">
                      <el-cascader
                      v-model="addressValue"
                      :options="options"
                      :props="{ value: 'label'}"
                      style="width:100%"
                      ></el-cascader>
                      <el-input ref="address" name="address" v-model="form.address"  
                      show-word-limit maxlength="100"/> 
                  </el-form-item>
                  <el-form-item label="面積" prop="area">
                      <el-input ref="area" name="area" 
                      v-model.number="form.area" 
                      type="number" min="0">
                      <template slot="append">
                          m<sup>2</sup>
                      </template>
                      </el-input>
                  </el-form-item>
                  <el-form-item label="高度" prop="height">
                      <el-input ref="height" name="height" v-model.number="form.height"  type="number" min="0"/>
                  </el-form-item>
                  <el-form-item label="層數" prop="floorsOfAboveGround">
                      <el-input ref="floorsOfAboveGround" name="floorsOfAboveGround" 
                      v-model.number="form.floorsOfAboveGround" type="number" min="0" :disabled="disable">
                      <template slot="prepend">地上</template>
                      <template slot="append">樓</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item prop="floorsOfUnderground">
                      <el-input ref="floorsOfUnderground" name="floorsOfUnderground" 
                      v-model.number="form.floorsOfUnderground" type="number" min="0" :disabled="disable">
                      <template slot="prepend">地下</template>
                      <template slot="append">樓</template>
                      </el-input>
                  </el-form-item>
                  <el-form-item label="使用執照字號" prop="licenseNumber">
                      <el-input ref="licenseNumber" name="licenseNumber" v-model="form.licenseNumber" show-word-limit maxlength="30"/>
                  </el-form-item>

              </el-form>
              <div style="float:right">
                  <el-button v-if="type=='create'" type="primary" @click="onPost" :loading="loading">新增</el-button>
                  <el-button v-else type="primary" @click="onEdit">更新</el-button>
                  <el-button type="info" @click="onCancel">清空</el-button>
              </div>
          </div>
      </el-col> -->
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
        :specialId="floorImageId"
        :formtableData="formtableData"
        :formtableconfig="formtableconfig"
        :listQueryParams="floorlistQueryParams"
        v-on:handleDialog="handleDialog"></Dialog>
  </div>
</template>
<script>
import Files  from '@/object/files'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Building from '@/object/building'
import Floors from '@/object/floors'
export default {
  mixins:[sharemixin,blockmixin,dialogmixin],
  computed: {
    blockEvent(){
      return{
        handleBlock:this.handleBlock,
        clickPagination:this.getAllBuilding,
        resetlistQueryParams:this.resetlistQueryParams
      }
    }
  },
  async mounted(){
    await this.init()
  },
  data() {
    return {
      floorsArray:[],
      building:null,
      floor:null,
      files:[],
      floorImageId:'',
      //dialog額外的參數
      formtableData:[],
      formtableconfig: Floors.getConfig(),
      floorlistQueryParams:{
        pageIndex: 1,
        pageSize: 10,
        total:0
      }
    }
  },
  methods: {
    async init(){
      this.tableConfig = Building.getConfig()
      this.title = 'building'
      this.buttonsName = [
        { name:'刪除',icon:'el-icon-delete',status:'delete'},
        { name:'編輯',icon:'el-icon-edit',status:'open'},
        { name:'樓層',icon:'el-icon-position',status:'openfloors'},
        { name:'檔案',icon:'el-icon-folder-opened',status:'openfiles'}
      ]
      await this.getAllBuilding()
    },
    async resetlistQueryParams(){
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total:0
      }
      await this.getAllBuilding()
    },
    async resetfloorlistQueryParams(){
      this.floorlistQueryParams = {
        pageIndex: 1,
        pageSize: 10,
        total:0
      }
      await this.getFloorList()
    },
    async getAllBuilding(){
      this.blockData = []
      var data = await Building.get()
      // console.log(JSON.stringify(data))
      this.listQueryParams.total = data.length
      this.blockData = data
      await this.getFilterItems()
    },
    async getFloorList(){
      var data =  await Floors.getSearchPage(this.building.getID(),
      this.floorlistQueryParams)
      console.log(JSON.stringify(data))
      this.formtableData = data.result
      this.floorlistQueryParams.total = data.totalPageCount
    },
    async crefloor(index,val) {
      const length = this.floorsArray.length
      for (var i = 1; i <= val; i++) {
          var str = index == "up" ? i.toString() + 'F' : '地下'+ i.toString() + 'F'
          var sor = index == "up" ? i*10 : (length+i)*10
          var floor = { floor: str,sort:sor }
          await this.floorsArray.push(floor)
      }
    },
    async postFloor(buildingId){
      var isOk = await Floors.create(buildingId,this.floorsArray)
      return isOk
    },
    async handleBlock(title,index, content){
        console.log(title,index,JSON.stringify(content))
        this.dialogData = []
        this.dialogTitle = this.title
        this.dialogButtonsName = []
        if(index === 'open'){
          this.dialogConfig = this.tableConfig
          this.dialogData.push(content)
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'update'},
          { name:'取消',type:'info',status:'cancel'}]
          this.innerVisible = true
          this.dialogStatus = 'update'
        }else if(index === 'empty'){
          this.dialogConfig = Building.getCreateConfig()
          this.dialogData.push( Building.empty() )
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
          this.innerVisible = true
          this.dialogStatus = 'create'
        }else if(index === 'delete'){
          var isOk = await content.delete()
          if(isOk){
            this.$message('刪除成功')
            await this.resetlistQueryParams()
            if(this.buildingid == content.getID()){
              this.$store.dispatch('building/setbuildingarray',await Building.get())
              this.$store.dispatch('permission/generateRoutes', true)
              this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
            }
          }
        }else if(index === 'exportExcel'){
          this.dialogConfig = this.tableConfig
          this.exportExcelData = this.blockData
          this.innerVisible = true
          this.dialogStatus = 'exportExcel'
        }else if(index === 'uploadExcel'){
          this.innerVisible = true
          this.dialogStatus = 'uploadExcel'
        }else if(index === 'openfloors'){
          this.dialogTitle = 'floor'
          this.building = content
          await this.resetfloorlistQueryParams()
          this.dialogStatus = 'floor'
          this.innerVisible = true
        }else if(index === 'openfiles'){
          this.building = content
          await this.handleUpload(this.building,index,content)
        }
    },
    async handleDialog(title ,index, content){
      console.log(title ,index,JSON.stringify(content))
      if(title === 'building'){
        if(index === 'create'){
          this.floorsArray = []
          await this.crefloor('up',content.floorsOfAboveGround)
          await this.crefloor('down',content.floorsOfUnderground)
          var buildingId = await content.create()
          var isOk = await this.postFloor(buildingId)
          if(isOk){
            this.$message('新增成功')
            this.$store.dispatch('building/setbuildingarray',await Building.get())
            await this.getAllBuilding()
          }
        }else if(index === 'update'){
          var isOk = await content.update()
          if(isOk){
            this.$message('更新成功')
            this.$store.dispatch('building/setbuildingarray',await Building.get())
            if(this.buildingid == content.getID()){
              this.$store.dispatch('building/setbuildinginfo',await Building.getInfo())
            }
            await this.getAllBuilding()
          }
        }else if(index === 'uploadExcelSave'){

        }else if(index === 'createfile' || index === 'deletefile'){
          await this.handleUpload(this.building,index,content)
        }
        this.innerVisible = false
      }else{
        await this.handleFloor(index,content)
      }
    },
    async handleFloor(index,content){
      this.dialogData = []
      this.dialogTitle = 'floor'
      this.dialogConfig = this.formtableconfig
      this.dialogButtonsName = []
      if(index === 'empty'){
        this.dialogData.push( Floors.empty() )
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'createfloor'},
          { name:'返回',type:'info',status:'cancelfloor'}]
        this.innerVisible = true
        this.dialogStatus = 'create'
      }else if(index === 'open'){   
        this.dialogData.push(content)
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'updatefloor'},
          { name:'取消',type:'info',status:'cancelfloor'}]
        this.innerVisible = true
        this.dialogStatus = 'update'
      }else if(index === 'delete'){
        var isDelete = await content.delete()
        if(isDelete){
            this.$message('刪除成功')
            await this.resetfloorlistQueryParams()
        }
      }else if(index === 'createfloor' || index === 'updatefloor'){
        var floorsArray = []
        floorsArray.push(content)
        var isOk = index === 'createfloor' ? 
        await Floors.create(this.building.getID(),floorsArray) : 
        await content.update()
        if(isOk){
            index === 'updatefloor' ? this.$message('更新成功') : this.$message('新增成功')
            if(this.buildingid == this.building.getID()){
              this.$store.dispatch('building/setbuildingfloors',await Floors.get())
            }
            await this.handleBlock('floor','openfloors',this.building)
        }
      }else if(index === 'openfiles'){
        this.dialogTitle = 'floorFiles'
        this.floor = content
        this.floorImageId = content.floorPlanID == null ? 
         null : content.getImageID()
        await this.handleUpload(this.floor,index,content)
      }else if(index === 'createfile' || index === 'deletefile'){
        await this.handleUpload(this.floor,index,content)
      }else if(index === 'cancel'){
        this.innerVisible = false
        this.floorlistQueryParams = {
          pageIndex: 1,
          pageSize: 10,
          total:0
        }
      }else if(index === 'cancelfloor'){
        this.floorlistQueryParams = {
          pageIndex: 1,
          pageSize: 10,
          total:0
        }
        await this.handleBlock('floor','openfloors',this.building)
      }else if(index === 'clickPagination'){
        this.floorlistQueryParams = content
        await this.getFloorList()
      }else if(index === 'exportExcel'){
        this.dialogConfig = Floors.getDownloadConfig()
        this.exportExcelData = this.formtableData
        this.innerVisible = true
        this.dialogStatus = 'exportExcel'
      }else if(index === 'change'){
        console.log('更換平面圖')
        var _temp = {
          id:this.floor.getID(),
          FloorPlanID:parseInt(content)
        }
        isOk = await this.floor.update(_temp)
        if(isOk){
          this.floorImageId = content
          this.$store.dispatch('building/setbuildingfloors',await Floors.get())
        }
      }
    },
    //打開檔案&上傳檔案&刪除檔案
    async handleUpload(type,index,content){
      if(index == 'openfiles'){
        this.files = await content.files()
        this.innerVisible = true
        this.dialogStatus = 'upload'
      }else if(index === 'createfile'){
        const formData = new FormData()
        content.forEach(item => {
          formData.append('file', item.raw)
        })
        isOk = await type.createfiles(formData)
        if(isOk){
          this.$message('上傳成功')
          this.files = await type.files()
        }
      }else {
        var data = { id:content.toString() }
        isOk = await Files.delete(data)
        if(isOk){
          this.$message('刪除成功')
          this.files = await type.files()
        }
      }
    },
    async changeTable(value){
      this.isTable = value
      this.tableConfig = Building.getConfig()
      await this.getFilterItems()
    }
  }
}

</script>
<style lang="scss" scoped>
.line {
  text-align: center;
}

.block-wrapper {
    background: #fff;
    padding: 15px 15px;
    height: 750px;
}
</style>

