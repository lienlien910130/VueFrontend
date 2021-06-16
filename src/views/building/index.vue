<template>
  <div class="editor-container">
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
        :specialId="floorImageId"
        :formtableData="formtableData"
        :formtableconfig="formtableconfig"
        :listQueryParams="floorlistQueryParams"
        v-on:handleDialog="handleDialog"></Dialog>
    <el-dialog
      top="5vh"
      :title="previewTitle"
      :visible.sync="previewVisible"
      width="80%"
      :modal="isneed"
      >
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
  </div>
</template>
<script>
import Files  from '@/object/files'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Building from '@/object/building'
import Floors from '@/object/floors'
import User from '@/object/user'

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
  async created(){
    await this.initBuilding()
  },
  data() {
    return {
      floorsArray:[],
      building:null,
      floor:null,
      files:[],
      floorImageId:'',
      //平面圖
      isneed:false,
      previewVisible:false,
      previewPath:'',
      previewTitle:'',
      //dialog額外的參數
      formtableData:[],
      formtableconfig: Floors.getTableConfig(),
      floorlistQueryParams:{
        pageIndex: 1,
        pageSize: 10,
        total:0,
        orderBy:'sort'
      }
    }
  },
  methods: {
    async init(){},
    async initBuilding(){
      this.title = 'building'
      this.tableConfig = Building.getTableConfig()
      await this.getAllBuilding()  
      this.buttonsName = [
        { name:'刪除',icon:'el-icon-delete',status:'delete'},
        { name:'編輯',icon:'el-icon-edit',status:'open'},
        { name:'樓層',icon:'el-icon-position',status:'openfloors'},
        { name:'檔案',icon:'el-icon-folder-opened',status:'openfiles'}
      ]
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
        total:0,
        orderBy:'sort'
      }
      await this.getFloorList()
    },
    async getAllBuilding(){
      this.blockData = []
      var data = await Building.getSearchPage(this.listQueryParams)
      this.blockData = data.result
      this.listQueryParams.total = data.totalPageCount
      this.$refs.block.resetpictLoading()
      await this.getFilterItems()
    },
    async getFloorList(){
      var data =  await Floors.getSearchPage(this.building.getID(),
      this.floorlistQueryParams)
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
        this.dialogSelect = []
        this.building = null
        if(index === 'open'){
          this.building = content
          var userlist = await User.getOfBuildingID(this.building.getID())
          this.dialogConfig = Building.getUpdateConfig()
          this.dialogSelect = userlist.map(v => {
                this.$set(v, 'value', v.getID()) 
                this.$set(v, 'label', v.getName()) 
                this.$set(v, 'id', v.getID()) 
                return v
            })
          this.dialogData.push(content)
          this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'update'},
          { name:'取消',type:'info',status:'cancel'}]
          this.innerVisible = true
          this.dialogStatus = 'update'
        }else if(index === 'empty'){
          this.dialogConfig = this.tableConfig
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
            this.$store.dispatch('building/setbuildingarray',await Building.get())
            if(this.buildingid == content.getID()){
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
          this.dialogConfig = this.tableConfig
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
            this.innerVisible = false
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
            this.innerVisible = false
          }
        }else if(index === 'uploadExcelSave'){
          var buildingarray = await Building.postMany(content)
          var isOk
          for(let item of buildingarray){
            this.floorsArray = []
            await this.crefloor('up',item.floorsOfAboveGround)
            await this.crefloor('down',item.floorsOfUnderground)
            isOk = await this.postFloor(item.id)
          }
          if(isOk){
            this.$message('新增成功')
            this.$store.dispatch('building/setbuildingarray',await Building.get())
            await this.getAllBuilding()
            this.innerVisible = false
          }
        }else if(index === 'createfile' || index === 'deletefile'){
          await this.handleUpload(this.building,index,content)
        }else if(index === 'selectData'){
          if(this.innerVisible == true && this.building !== null){
            var userlist = await User.getOfBuildingID(this.building.getID())
            this.dialogSelect = userlist.map(v => {
                  this.$set(v, 'value', v.getID()) 
                  this.$set(v, 'label', v.getName()) 
                  this.$set(v, 'id', v.getID()) 
                  return v
            })
          }
        }else{
          this.innerVisible = false
        }
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
            if(this.buildingid == this.building.getID()){
              this.$store.dispatch('building/setbuildingfloors',await Floors.get())
            }
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
          total:0,
          orderBy:'sort'
        }
      }else if(index === 'cancelfloor'){
        this.floorlistQueryParams = {
          pageIndex: 1,
          pageSize: 10,
          total:0,
          orderBy:'sort'
        }
        await this.handleBlock('floor','openfloors',this.building)
      }else if(index === 'clickPagination'){
        this.floorlistQueryParams = content
        await this.getFloorList()
      }else if(index === 'exportExcel'){
        this.exportExcelData = this.formtableData
        this.innerVisible = true
        this.dialogStatus = 'exportExcel'
      }else if(index === 'change'){
        this.dialogTitle = 'floorFiles'
        this.floor.setFloorPlanID(parseInt(content))
        var isOk = await this.floor.update()
        if(isOk){
          this.$message('更新成功')
          this.floorImageId = content
          this.$store.dispatch('building/setbuildingfloors',await Floors.get())
        }
      }else if(index === 'image'){
        var _temp = await content.getImage()
        this.previewPath = _temp
        this.previewTitle = content.getName() + '平面圖'
        this.previewVisible = true
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
.previewImg{
    width: 100%;
    height: auto;
}
</style>

