<template>
        <div class="editor-container">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                        <h3>基本資料</h3>
                        <Form 
                        :buildingUsers="buildingUsers"
                        v-on:handleBuildingInfo="handleBuildingInfo"
                        />
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                        <el-tabs v-model="activeName" type="border-card" 
                        >
                          <el-tab-pane label="管委會" name="MC" >
                            <Block 
                            v-if="activeName == 'MC'"
                            ref="block"
                            :list-query-params.sync="listQueryParams"
                            v-bind="blockAttrs" 
                            v-on="ManagementListblockEvent">
                            </Block>
                          </el-tab-pane>
                          <el-tab-pane label="廠商資料" name="Vender" >
                            <Block 
                            v-if="activeName == 'Vender'"
                            ref="block"
                            :list-query-params.sync="listQueryParams"
                            v-bind="blockAttrs" 
                            v-on="ContactunitListblockEvent">
                            </Block>
                          </el-tab-pane>
                          <el-tab-pane label="大樓相關資料" name="BOT" >
                            <Upload 
                            v-if="activeName == 'BOT'"
                            v-bind="buildingUploadAttrs"
                            v-on:handleFilesUpload="handleFilesUpload"></Upload>
                          </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div :class="floorwrapper" :style="{ height: blockwrapperheight }">
                        <h3>大樓樓層</h3>
                        <Range v-on:handleBuildingFloorSelect="handleBuildingFloorSelect"></Range>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper" :style="{ height: blockwrapperheight }">
                        <el-tabs v-model="activeFloor" type="border-card">
                            <el-tab-pane label="大樓住戶資料" name="US" >
                              <Block 
                              ref="downblock"
                              :list-query-params.sync="downlistQueryParams"
                              v-bind="downBlockAttrs" 
                              v-on="UserblockEvent"></Block>
                            </el-tab-pane>
                            <el-tab-pane label="樓層門牌資料" name="IN" :disabled="!isChoose">
                              <Block 
                              v-if="activeFloor == 'IN' && isChoose"
                              ref="downblock"
                              :list-query-params.sync="downlistQueryParams"
                              v-bind="downBlockAttrs" 
                              v-on="FloorblockEvent"></Block>
                            </el-tab-pane>
                            <el-tab-pane label="樓層平面圖" name="IM" :disabled="!isChoose">
                              <FloorImage
                              v-if="activeFloor == 'IM' && isChoose"
                              v-bind="floorImageAttrs"></FloorImage>
                            </el-tab-pane>
                            <el-tab-pane  label="樓層相關資料" name="OT" :disabled="!isChoose">
                              <Upload 
                              v-if="activeFloor == 'OT' && isChoose"
                              v-bind="floorUploadAttrs" 
                              v-on:handleFilesUpload="handleFilesUpload"></Upload>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <Dialog 
                v-bind="dialogAttrs"
                :files="floorFiles" 
                v-on:handleDialog="handleDialog"></Dialog>
                
            </el-row>
        </div>
</template>

<script>
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Committee from '@/object/committee'
import UsageOfFloor from '@/object/usageOfFloor'
import Contactunit from '@/object/contactunit'
import User from '@/object/user'
import Building from '@/object/building'
import Files  from '@/object/files'
import Floors from '@/object/floors'


export default {
  name: 'Tab',
  mixins:[sharemixin,blockmixin,dialogmixin],
  components: { 
    Form: () => import('./components/Form'),
    FloorImage: () => import('./components/Floor'),
    Range: () => import('./components/Range')
  },
  computed: {
    floorwrapper(){
      if (this.$store.state.app.device === 'mobile') {
        return 'floorMobile'
      } else {
        return 'floornotMobile'
      }
    },
    floorImageAttrs(){
      return{
        imageSrc:this.imageSrc,
        loading:this.loading,
      }
    },
    buildingUploadAttrs(){
      return{
        files:this.buildingFiles,
        title:'buildingFiles',
        isneed:true
      }
    },
    floorUploadAttrs(){
      return{
        specialId:this.floorImageId,
        files:this.floorFiles,
        title:'floorFiles',
        isneed:true
      }
    },
    downBlockAttrs(){
      return {
        blockData: this.downData,
        config: this.downConfig,
        title:this.downTitle,
        isTable:this.isTable,
        selectSetting:this.downselectSetting,
        buttonsName:this.downButtonsName
      }
    },
    ManagementListblockEvent(){
      return{
          handleBlock:this.handleBlock,
          clickPagination:this.getManagementList,
          resetlistQueryParams:this.resetlistQueryParams
      }
    },
    ContactunitListblockEvent(){
      return{
          handleBlock:this.handleBlock,
          clickPagination:this.getContactunitList,
          resetlistQueryParams:this.resetlistQueryParams
      }
    },
    FloorblockEvent(){
      return{
          handleBlock:this.handleBlock,
          clickPagination:this.getFloorOfHouseList,
          resetlistQueryParams:this.resetdownlistQueryParams
      }
    },
    UserblockEvent(){
      return{
          handleBlock:this.handleBlock,
          clickPagination:this.getUserList,
          resetlistQueryParams:this.resetdownlistQueryParams
      }
    }
  },
  data() {
    return {
      activeName: 'MC',
      activeFloor:'US',
      selectFloor:null,
      isChoose:false,
      usageOfFloorSelectList:[],
      floorofhouse :'',
      building:null,
      //Form 
      buildingUsers:[],
      //Buildingupload
      buildingFiles:[],
      //FloorImage
      loading:false,
      imageSrc:'',
      //Floorupload
      floorImageId:'',
      floorFiles:[],
      //block
      downTitle:'',
      downData:[],
      downConfig:[],
      downselectSetting:[],
      downButtonsName:[
        { name:'刪除',icon:'el-icon-delete',status:'delete'},
        { name:'編輯',icon:'el-icon-edit',status:'open'}],
      downlistQueryParams:{
        pageIndex: 1,
        pageSize: 12,
        total:0
      }
    }
  },
  watch: {
    buildingusers:{
      handler:async function(){
        this.buildingUsers = this.buildingusers.map(v => {
              this.$set(v, 'value', v.id) 
              this.$set(v, 'label', v.name) 
              this.$set(v, 'id', v.id) 
              return v
        })
      },
      immediate:true
    },
    buildinginfo:{
      handler:async function(){
        this.building = this.buildinginfo[0]
      },
      immediate:true
    },
    async activeFloor(val){
      this.downData = []
      this.downselectSetting = []
      this.downButtonsName = [
        { name:'刪除',icon:'el-icon-delete',status:'delete'},
        { name:'編輯',icon:'el-icon-edit',status:'open'}]
      if(val == 'US'){
        this.downTitle = 'user'
        this.downConfig = User.getTableConfig()
        await this.resetdownlistQueryParams()
      }
      if(this.selectFloor !== null){
        if(val == 'IN'){
          this.downTitle = 'floorOfHouse'
          this.downConfig = UsageOfFloor.getTableConfig()
          await this.resetdownlistQueryParams()
          this.downButtonsName = [
            { name:'刪除',icon:'el-icon-delete',status:'delete'},
            { name:'編輯',icon:'el-icon-edit',status:'open'},
            { name:'檔案',icon:'el-icon-folder-opened',status:'openfiles'}
          ]
        }else if(val == 'IM'){
          this.downTitle = 'floorImage'
          this.getFloorImage()
        }else if(val == 'OT'){
          this.downTitle = 'floorFiles'
          this.floorFiles = await this.selectFloor.files()
        }
      } 
    },
    async activeName(val){ 
      this.blockData = []
      this.usageOfFloorSelectList = []
      this.selectSetting = []
      if(val == 'MC'){
        this.title = 'committee'
        this.tableConfig = Committee.getTableConfig()
        await this.getFloorOfHouse()
        await this.resetlistQueryParams()
      }else if(val == 'Vender'){
        this.title = 'contactUnit'
        this.tableConfig = Contactunit.getTableConfig()
        await this.resetlistQueryParams()
      }else{ //BOT
        this.title = 'buildingFiles'
        this.buildingFiles = await this.building.files()
      }
    }
  },
  methods: { 
    async init(){
      this.title = 'committee'
      this.downTitle = 'user'
      this.tableConfig = Committee.getTableConfig()
      this.downConfig = User.getTableConfig()
      await this.getFloorOfHouse()
      await this.getManagementList()
      await this.getUserList()
    },
    async resetlistQueryParams(){
      this.listQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total:0
      }
      if(this.activeName == 'MC'){
        await this.getManagementList()
      }else{
        await this.getContactunitList()
      }
    },
    async resetdownlistQueryParams(){
      this.downlistQueryParams = {
        pageIndex: 1,
        pageSize: 12,
        total:0
      }
      if(this.activeFloor == 'US'){
        await this.getUserList()
      }else{
        await this.getFloorOfHouseList()
      }
    },
    async getFloorImage(){ //載入平面圖
      if(this.floorImageId == null){
          this.imageSrc = -1
      }else{
          this.loading = true
          this.imageSrc = await this.selectFloor.getImage()
          this.loading = false
      }
    },
    async getFloorOfHouse(){ //取得大樓所有門牌
      var data = await UsageOfFloor.getAll()
      this.usageOfFloorSelectList = data.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.houseNumber) 
          this.$set(v, 'value', v.id) 
          return v
      })
    },
    async getManagementList() { //取得管委會
      var data = await Committee.getSearchPage(this.listQueryParams)
      this.blockData = data.result
      this.listQueryParams.total = data.totalPageCount
      this.$refs.block.resetpictLoading()
      await this.getFilterItems()
    },
    async getContactunitList(){ //取得廠商資料
      var data = await Contactunit.getSearchPage(this.listQueryParams)
      this.blockData = data.result
      this.listQueryParams.total = data.totalPageCount
      this.$refs.block.resetpictLoading()
      await this.getFilterItems()
    },
    async getFloorOfHouseList(){ //取得樓層門牌資料
      var data = await UsageOfFloor.getSearchPage(this.selectFloor.getID(),
      this.downlistQueryParams)
      this.downData = data.result
      this.downlistQueryParams.total = data.totalPageCount
      this.$refs.downblock.resetpictLoading()
      await this.getFilterItems(this.downConfig)
    },
    async getUserList(){ //取得大樓住戶資料
      var data = await User.getSearchPage(this.downlistQueryParams)
      this.downData = data.result
      this.downlistQueryParams.total = data.totalPageCount
      this.$refs.downblock.resetpictLoading()
      await this.getFilterItems(this.downConfig)
    },
    async handleBuildingInfo(index, content){ //轉接口
      console.log('handleBuildingInfo',index,content)
      if (index == 'empty'){
        await this.handleBlock('user','empty','')
      }else if (index == 'open') {
        await this.handleBlock('user','open',content)
      }else if(index == 'openfloorofhouse'){
        await this.handleBlock('floorOfHouse','open',content)
      }
    },
    async handleBuildingFloorSelect(content){ //選擇樓層後的操作-儲存樓層&儲存樓層平面圖ID
      this.isChoose = true
      this.selectFloor = content
      this.floorImageId = content.floorPlanID == null ? 
         null : content.getImageID()
      if(this.activeFloor  == 'IN'){
        this.downTitle = 'floorOfHouse'
        this.changeTable(this.isTable)
        await this.resetdownlistQueryParams()
      }else if(this.activeFloor == 'IM'){
        this.downTitle = 'floorImage'
        this.getFloorImage()
      }else if(this.activeFloor == 'OT'){
        this.downTitle = 'floorFiles'
        this.floorFiles = await this.selectFloor.files()
      }
    },
    async handleFilesUpload(index,title,content) { //檔案上傳操作
      console.log(index,title,JSON.stringify(content))
      var isOk = false
      if(index === 'createfile'){
        const formData = new FormData()
        content.forEach(item => {
          formData.append('file', item.raw)
        })
        isOk = 
          title === 'buildingFiles' ? 
            await this.building.createfiles(formData) : 
          title === 'floorFiles' ?
            await this.selectFloor.createfiles(formData) :
            await this.floorofhouse.createfiles(formData)
      }else if(index === 'deletefile'){
        var data = { id:content.toString() }
        isOk = await Files.delete(data)
      }else{ //設定平面圖
        this.selectFloor.setFloorPlanID(parseInt(content))
        isOk = await this.selectFloor.update()
        if(isOk){
          this.floorImageId = content
          this.$store.dispatch('building/setbuildingfloors',await Floors.get())
        }
      }
      if(isOk){
        index === 'createfile' ? this.$message('上傳成功') : 
        index === 'deletefile' ? this.$message('刪除成功') : this.$message('更新成功')
        title === 'buildingFiles' ? 
          this.buildingFiles = await this.building.files() :  
        title === 'floorFiles' ?
          this.floorFiles = await this.selectFloor.files() : this.floorFiles = await this.floorofhouse.files()
      }
    },
    async handleBlock(title,index, content) { //管委會、廠商資料、樓層門牌相關操作
      console.log(title,index,JSON.stringify(content))
      var empty = []
      var exportdata = [] 
      this.dialogData = []
      this.dialogSelect =  []
      this.dialogTitle =  title
      this.dialogConfig = []
      this.dialogButtonsName = []
      switch(title){
        case 'committee':
          this.dialogSelect = this.usageOfFloorSelectList
          this.dialogConfig = Committee.getTableConfig()
          empty = Committee.empty()
          exportdata = this.blockData
          break;
        case 'contactUnit':
          this.dialogConfig = Contactunit.getTableConfig()
          empty = Contactunit.empty()
          exportdata = this.blockData
          break;
        case 'floorOfHouse':
          this.dialogSelect = this.buildingUsers
          this.dialogConfig = UsageOfFloor.getTableConfig()
          empty = UsageOfFloor.empty()
          exportdata = this.downData
          break;
        case 'user':
          this.dialogConfig = User.getTableConfig()
          empty = User.empty()
          exportdata = this.downData
          break;  
      }
      if (index === 'open') {
        this.dialogStatus = 'update'
        if(content.length !== undefined){ //代表不是外傳近來的
          content.forEach(item=>{
              this.dialogData.push(item)
          })
        }else{
          this.dialogData.push(content)
        }
        this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
        this.innerVisible = true
      }else if(index === 'delete'){
        var isDelete = await content.delete()
        if(isDelete){
            this.$message('刪除成功')
            switch(title){
              case 'committee':
                await this.resetlistQueryParams()
                break;
              case 'contactUnit':
                this.$store.dispatch('building/setbuildingcontactunit',await Contactunit.get())
                await this.resetlistQueryParams()
                break;
              case 'user': //刪除user時重整建築物資料&管委會資料
                this.$store.dispatch('building/setbuildinginfo',await Building.getInfo())
                this.$store.dispatch('building/setbuildingusers',await User.get())
                if(this.activeName == 'MC'){ //重整管委會
                  await this.getFloorOfHouse()
                  await this.getManagementList()
                }
                await this.resetdownlistQueryParams()
                break;
              case 'floorOfHouse':
                if(this.activeName == 'MC'){ //重整管委會
                  await this.getFloorOfHouse()
                  await this.getManagementList()
                }  
                await this.resetdownlistQueryParams()
                break;
            }
        }
      }else if(index === 'empty'){
        this.dialogData.push(empty)
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
        this.innerVisible = true
        this.dialogStatus = 'create'
      }else if(index == 'openuser'){ //打開住戶資訊
        await this.handleBuildingInfo('open',content)
      }else if(index === 'openfiles'){ //門牌檔案
        this.floorofhouse = content
        this.floorFiles = await content.files()
        this.dialogTitle = 'floorOfHouse'
        this.innerVisible = true
        this.dialogStatus = 'upload'
      }else if(index === 'openfloorofhouse'){ //管委會關聯門牌
        await this.handleBuildingInfo('openfloorofhouse',content)
      }else if(index === 'exportExcel'){
        this.exportExcelData = exportdata
        this.innerVisible = true
        this.dialogStatus = 'exportExcel'
      }else if(index === 'uploadExcel'){
        this.innerVisible = true
        this.dialogStatus = 'uploadExcel'
      }
    },
    async handleDialog(title ,index, content){ //Dialog相關操作
      console.log(title ,index,JSON.stringify(content))
      if(index === 'cancel'){
        this.innerVisible = false
      }else{
        switch(title){
          case 'user':
            this.onUserActions(index, content)
            break;
          case 'committee':
            this.onCommitteeActions(index, content)
            break;
          case 'contactUnit':
            this.onContactUnitActions(index, content)
            break;  
          case 'floorOfHouse':
            this.onFloorOfHouseActions(index, content)
            break;  
        }
      }
    },
    async onCommitteeActions(index, content){
      if(index !== 'cancel'){
        var isOk = index === 'update' ? await content.update() : 
        index === 'create' ? await content.create() : await Committee.postMany(content)
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          await this.getManagementList()
        }
      }
      this.innerVisible = false
    },
    async onContactUnitActions(index, content){
       if(index !== 'cancel'){
        var isOk = index === 'update' ? await content.update() : 
        index === 'create' ? await content.create() : await Contactunit.postMany(content)
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          this.$store.dispatch('building/setbuildingcontactunit',await Contactunit.get())
          await this.getContactunitList()
        }
      }
      this.innerVisible = false
    },
    async onFloorOfHouseActions(index, content){
      if(index === 'update' || index === 'create' || index === 'uploadExcelSave'){
        var isOk = index === 'update' ? await content.update() :
        index === 'create' ? 
          await content.create(this.selectFloor.getID()) : 
          await UsageOfFloor.postMany(this.selectFloor.getID(),content)
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          this.innerVisible = false
          if(this.selectFloor !== null){
            await this.getFloorOfHouseList()
          }
          if(this.activeName == 'MC'){ //重整管委會
            await this.getFloorOfHouse()
            if(index === 'update') await this.getManagementList()
          }
        }
      }else if(index === 'createfile'){
          await this.handleFilesUpload('createfile','floorOfHouse',content)
      }else{
        await this.handleFilesUpload('deletefile','floorOfHouse',content)
      }
    },
    async onUserActions(index, content){
      if(index !== 'cancel'){
        var isOk = index === 'update' ? await content.update() : 
        index === 'create' ? await content.create() : await User.postMany(content)
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          this.$store.dispatch('building/setbuildingusers',await User.get())
          this.$store.dispatch('building/setbuildinginfo',await Building.getInfo())
          await this.getUserList()
          if(this.activeName == 'MC'){ //重整管委會
            await this.getFloorOfHouse()
            await this.getManagementList()
          }
        }
      }
      this.innerVisible = false
    },
    async changeTable(value){
      this.isTable = value
      if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
        if(typeof this.$route.params.target == 'object' && 
        this.$route.params.type == 'user'){
          await this.handleBuildingInfo('open',this.$route.params.target)
        }else if(typeof this.$route.params.target == 'object' && 
        this.$route.params.type == 'contactunit'){
          this.activeName = 'Vender'
          this.title = 'contactUnit'
          this.tableConfig = Contactunit.getTableConfig() 
          await this.resetlistQueryParams()
          this.$nextTick(async()=>{
            await this.handleBlock('contactUnit','open',this.$route.params.target)
          })
        }
      }
    }
  }
}
</script>

<style>
.el-upload-list{
  height:500px;
  overflow-y: auto;
  overflow-x: hidden;
}

</style>

<style lang="scss" scoped>
// .block-wrapper {
//     background: #fff;
//     padding: 10px;
//     margin-bottom: 32px;
//     height: 750px;
//   }
.block-wrapper {
    background: #fff;
    padding: 30px 15px;
    margin-bottom: 20px;
    height: 720px;
}

  .floornotMobile {
    background: #fff;
    padding: 10px;
    margin-bottom: 32px;
    height: 750px;
    overflow-x:hidden;
    overflow-y:auto;
  }

  .floorMobile {
    background: #fff;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    height: 100px;
    p{
      padding-top:10px
    }
  }

.files {
  
  max-height: 200px;
  overflow: auto;
  .filesdiv{
    line-height: 40px;
    .del {
      cursor: pointer;
    }
    .el-link{
      display:inline;
    }
  }
}


@media (max-width:1024px) {
  .block-wrapper {
    padding: 8px;
  }
}
</style>