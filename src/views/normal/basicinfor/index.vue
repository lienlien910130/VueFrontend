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
                          :list-query-params.sync="listQueryParams"
                          :selectSetting.sync="selectSetting"
                          v-bind="blockAttrs" 
                          v-on="ManagementListblockEvent"></Block>
                          </el-tab-pane>
                          <el-tab-pane label="廠商資料" name="Vender" >
                            <Block 
                            v-if="activeName == 'Vender'"
                            :list-query-params.sync="listQueryParams"
                            :selectSetting.sync="selectSetting"
                            v-bind="blockAttrs" 
                            v-on="ContactunitListblockEvent">
                            </Block>
                          </el-tab-pane>
                          <el-tab-pane label="相關資料" name="BOT" >
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
                            <el-tab-pane label="基本資料" name="IN" :disabled="!isChoose">
                              <Block 
                              v-if="activeFloor == 'IN' && isChoose"
                              :list-query-params.sync="floorlistQueryParams"
                              :selectSetting.sync="floorselectSetting"
                              v-bind="floorAttrs" 
                              v-on="FloorblockEvent"></Block>
                            </el-tab-pane>
                            <el-tab-pane label="樓層平面圖" name="IM" :disabled="!isChoose">
                              <FloorImage
                              v-if="activeFloor == 'IM' && isChoose"
                              v-bind="floorImageAttrs"></FloorImage>
                            </el-tab-pane>
                            <el-tab-pane  label="相關資料" name="OT" :disabled="!isChoose">
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
import { setSelectSetting  } from '@/utils/index'
import blockmixin from '@/mixin/blockmixin'
import dialogmixin from '@/mixin/dialogmixin'
import sharemixin  from '@/mixin/sharemixin'
import Committee from '@/object/committee'
import UsageOfFloor from '@/object/usageOfFloor'
import Contactunit from '@/object/contactunit'
import User from '@/object/user'
import Building from '@/object/building'
import Files  from '@/object/files'
import idb from '@/utils/indexedDB'
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
    floorImageAttrs(){
      return{
        imageSrc:this.imageSrc,
        loading:this.loading,
      }
    },
    buildingUploadAttrs(){
      return{
        files:this.buildingFiles,
        title:'building'
      }
    },
    floorUploadAttrs(){
      return{
        specialId:this.floorImageId,
        files:this.floorFiles,
        title:'floor'
      }
    },
    floorAttrs() {
      return {
        blockData: this.floorData,
        config: this.floorConfig,
        title:'floorOfHouse',
        sortArray:this.floorsortArray,
        isTable:this.isTable
      }
    },
    floorwrapper(){
      if (this.$store.state.app.device === 'mobile') {
        return 'floorMobile'
      } else {
        return 'floornotMobile'
      }
    },
    ManagementListblockEvent(){
      return{
          handleBlock:this.handleBlock,
          clickPagination:this.getManagementList
      }
    },
    ContactunitListblockEvent(){
      return{
          handleBlock:this.handleBlock,
          clickPagination:this.getContactunitList
      }
    },
    FloorblockEvent(){
      return{
          handleBlock:this.handleBlock,
          clickPagination:this.getFloorList
      }
    },
  },
  data() {
    return {
      activeName: 'MC',
      activeFloor:'IN',
      selectFloor:null,
      isChoose:false,
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
      
      usageOfFloorSelectList:[],
      floorofhouse :'',
      floorData:[],
      floorConfig: UsageOfFloor.getConfig(),
      floorselectSetting:[],
      floorsortArray:[],
      floororigin:[],
      floorlistQueryParams:{
          page: 1,
          limit: 10,
          total: 0
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
    async activeFloor(val){
      if(this.selectFloor !== null){
        if(val == 'IN'){
          await this.floorOfHouseinit()
        }else if(val == 'IM'){
          this.getFloorImage()
        }else {
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
        this.changeTable(this.isTable)
        await this.getFloorOfHouse()
        await this.managementListinit()
      }else if(val == 'Vender'){
        this.title = 'contactUnit'
        this.changeTable(this.isTable)
        await this.contactunitListinit()
      }else{ //BOT
        this.buildingFiles = await Building.files()
      }
    }
  },
  // async mounted() {
  //   if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
  //     console.log(this.$route.params.target,this.$route.params.type)
  //     if(typeof this.$route.params.target == 'object' && this.$route.params.type == 'user'){
  //       await this.handleBuildingInfo('open',this.$route.params.target)
  //     }else if(typeof this.$route.params.target == 'object' && this.$route.params.type == 'contactunit'){
  //       this.activeName = 'Vender'
  //       // this.blockData = []
  //       // this.usageOfFloorSelectList = []
  //       // this.selectSetting = []
  //       this.title = 'contactUnit'
  //       this.changeTable(this.isTable)
  //       await this.contactunitListinit()
  //       this.$nextTick(async()=>{
  //         await this.handleBlock('contactUnit','open',this.$route.params.target)
  //       })
  //     }
  //     // this.activeName = 'Vender'
  //     // this.usageOfFloorSelectList = []
  //     // this.tableConfig = [
  //     //     { label:'公司名稱' , prop:'name', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true,isHidden:false,maxlength:'20'},
  //     //     { label:'類別' , prop:'type', format:'ContactUnitOptions', mandatory:true, message:'請選擇類別',
  //     //     isSelect:true,options:[],selectType:'options',select:'',isSort:true,isHidden:false },
  //     //     { label:'電話' , prop:'contactNumber',mandatory:true, message:'請輸入內容',
  //     //     pattern:/^[0][9]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true,isSelect:false,isSort:false,isHidden:true,maxlength:'10'},
  //     //     { label:'地址' , prop:'address', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false,isHidden:true,maxlength:'200'},
  //     //     { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false,isHidden:true,maxlength:'200'},
  //     //     { label:'狀態' , prop:'collaborate', format:'tag', mandatory:false, message:'請輸入內容',
  //     //     isSelect:true,options:[],selectType:'collaborateBool',select:'',isSort:true,type:'boolean',typemessage:'',isHidden:false }
  //     // ]
  //     // await this.contactunitListinit()
  //     // let _array = this.blockData.filter((item, index) => 
  //     //   item.id == this.$route.params.target
  //     // )
  //     // await this.handleBlock('contactunit','open',_array[0])
  //   } 
  // },
  methods: { 
    async init(){
      this.title = 'committee'
      this.tableConfig = Committee.getConfig()
      await this.getFloorOfHouse()
      await this.managementListinit()
      if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
        if(typeof this.$route.params.target == 'object' && this.$route.params.type == 'user'){
          await this.handleBuildingInfo('open',this.$route.params.target)
        }else if(typeof this.$route.params.target == 'object' && this.$route.params.type == 'contactunit'){
          this.activeName = 'Vender'
          this.title = 'contactUnit'
          this.changeTable(this.isTable)
          await this.contactunitListinit()
          this.$nextTick(async()=>{
            await this.handleBlock('contactUnit','open',this.$route.params.target)
          })
        }
      }
    },
    async managementListinit(){
      await this.saveManagementList()
      await this.getManagementList()
      await this.setSelectSetting()
    },
    async contactunitListinit(){
      await this.saveContactunitList()
      await this.getContactunitList()
      await this.setSelectSetting()
    },
    async floorOfHouseinit(){
      await this.saveFloorList()
      await this.getFloorList()
      await this.setFloorSelectSetting()
    },
    async getFloorImage(){ //載入平面圖
      if(this.floorImageId == null){
          this.imageSrc = -1
      }else{
          this.loading = true
          var _temp = await idb.loadCacheImage(this.floorImageId)
          this.imageSrc = _temp
          this.loading = false
      }
    },
    async getFloorOfHouse(){ //取得大樓所有門牌
      var data = await UsageOfFloor.get()
      this.usageOfFloorSelectList = data.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.houseNumber) 
          this.$set(v, 'value', v.id) 
          return v
      })
    },
    async saveManagementList(){
      var data = await Committee.get()
      this.origin = data.map(item=>{ return item.clone(item)})
    },
    async getManagementList(sort = null) { //取得管委會
      this.blockData = []
      var data = this.origin.map(item=>{ return item.clone(item)})
      this.selectSetting.forEach(element=>{
        if(element.select != ''){
          data = data.filter(function(item,index){
              if(typeof item[element.prop] !== 'object'){
                  return item[element.prop] == element.select
              }else{ //物件形式
                  for(let obj of item[element.prop]){
                    if(obj.id == element.select){
                      return item
                    }
                  }
              }
          })
        }
      })
      this.listQueryParams.total = data.length
      if(sort !== '' && sort !== null){
          data = data.sort(function(x,y){
            return y[sort] - x[sort]
          })
      }else{
          data = data.sort(function(x,y){
            return y.id - x.id
          })
      }
      data = data.filter((item, index) => 
          index < this.listQueryParams.limit * this.listQueryParams.page && 
          index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
      this.blockData = data
    },
    async saveContactunitList(){
      var data = await Contactunit.get()
      this.origin = data.map(item=>{ return item.clone(item)})
    },
    async getContactunitList(sort = null){ //取得廠商資料
      this.blockData = []
      var data = this.origin.map(item=>{ return item.clone(item)})
      this.selectSetting.forEach(element=>{
        if(element.select !== '' || typeof element.select === 'boolean'){
          data = data.filter((item,index)=> item[element.prop] == element.select)
        }
      })
      this.listQueryParams.total = data.length
      if(sort !== '' && sort !== null){
            data = data.sort(function(x,y){
              return y[sort] - x[sort]
            })
      }else{
            data = data.sort(function(x,y){
                var a = x.collaborate
                var b = y.collaborate
                if(a == b){
                  return y.id - x.id
                }
                return y.collaborate - x.collaborate
              })
          }
      data = data.filter((item, index) => 
          index < this.listQueryParams.limit * this.listQueryParams.page && 
          index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
      this.blockData = data
    },
    async saveFloorList(){
      this.floororigin = await this.selectFloor.getUsageOfFloor()
    },
    async getFloorList(sort = null){ //取得樓層資料
      this.floorData = []
      var data = this.floororigin.map(item=>{ return item.clone(item)})
      this.floorlistQueryParams.total = data.length
      this.floorselectSetting.forEach(element=>{
        if(element.select != ''){
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
          data = data.sort(function(x,y){
            return y[sort] - x[sort]
      })}else{
          data = data.sort(function(x,y){
            return y.id - x.id
          })
      }
      data = data.filter((item, index) => 
        index < this.floorlistQueryParams.limit * this.floorlistQueryParams.page && 
        index >= this.floorlistQueryParams.limit * (this.floorlistQueryParams.page - 1))
      this.floorData = data
    },
    async setSelectSetting(){
      this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData,this.usageOfFloorSelectList)
      this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
    },
    async setFloorSelectSetting(){
        this.floorselectSetting = await setSelectSetting(this.floorConfig,this.floorData)
        this.floorsortArray = this.floorConfig.filter((item,index)=>item.isSort == true)
    },
    async handleBuildingInfo(index, content){ //基本資料相關操作
      this.dialogTitle = 'user'
      this.dialogConfig = User.getConfig()
      this.dialogData = []
      if (index == 'empty'){
        this.dialogData.push(User.empty())
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},{ name:'取消',type:'info',status:'cancel'}]
        this.dialogStatus = 'create'
        this.innerVisible = true
      }else if (index == 'open') {
        await Promise.all(content.map(async (item) => {
          await this.dialogData.push(this.buildingusers.filter((element,index) => element.id == item.id)[0])
        }))
        this.dialogData = this.dialogData.sort((x,y) => x.id - y.id)
        this.dialogButtonsName = [
          { name:'新增用戶資料',type:'primary',status:'empty'},
          { name:'儲存',type:'primary',status:'update'},{ name:'取消',type:'info',status:'cancel'}]
        this.innerVisible = true
        this.dialogStatus = 'update'
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
    async handleBuildingFloorSelect(content){ //選擇樓層後的操作
      this.isChoose = true
      this.selectFloor = content
      content.floorPlanID == null ? this.floorImageId = null : this.floorImageId = content.getImageID()
      if(this.activeFloor == 'IN'){
        await this.floorOfHouseinit()
      }else if(this.activeFloor == 'IM'){
        await this.getFloorImage()
      }else {
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
          title === 'building' ? 
            await Building.createfiles(formData) : 
          title === 'floor' ?
            await this.selectFloor.createfiles(formData) :
            await this.floorofhouse.createfiles(formData)
      }else if(index === 'deletefile'){
        var data = { id:content.toString() }
        isOk = await Files.delete(data)
      }else{ //設定平面圖
        var _temp = {
          id:this.selectFloor.getID(),
          FloorPlanID:parseInt(content)
        }
        isOk = await Floors.update(_temp)
        if(isOk){
          this.floorImageId = content
          this.$store.dispatch('building/setbuildingfloors',await Floors.get())
        }
      }
      if(isOk){
        index === 'createfile' ? this.$message('上傳成功') : 
        index === 'deletefile' ? this.$message('刪除成功') : this.$message('更新成功')
        title === 'building' ? 
          this.buildingFiles = await Building.files() :  
        title === 'floor' ?
          this.floorFiles = await this.selectFloor.files() : this.floorFiles = await this.floorofhouse.files()
      }
    },
    async handleBlock(title,index, content) { //管委會、廠商資料、樓層門牌相關操作
      console.log(title,index,JSON.stringify(content))
      this.dialogData = []
      this.dialogSelect =  title === 'floorOfHouse' ? this.buildingUsers : this.usageOfFloorSelectList
      this.dialogTitle =  title === 'floorOfHouse' ? 'floorOfHouse' : this.activeName === 'MC' ? 'committee' : 'contactUnit'
      this.dialogConfig = title === 'floorOfHouse' ? this.floorConfig : this.activeName === 'MC' ? Committee.getDialogConfig() : this.tableConfig
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
            title === 'floorOfHouse' ? 
              this.floorlistQueryParams = {page: 1,limit: 12, total: 0} : 
              this.listQueryParams = {page: 1,limit: 12, total: 0} 
            title === 'floorOfHouse' ? await this.floorOfHouseinit() :
            title === 'committee' ? await this.managementListinit() : await this.contactunitListinit()
        }
      }else if(index === 'empty'){
        var data = title === 'floorOfHouse' ? UsageOfFloor.empty() : 
        this.activeName === 'MC' ? Committee.empty() : Contactunit.empty()
        this.dialogData.push(data)
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
        this.innerVisible = true
        this.dialogStatus = 'create'
      }else if(index == 'opendialog'){
        await this.handleBuildingInfo('open',content)
      }else if(index === 'openfiles'){
        this.floorofhouse = content
        this.floorFiles = await content.files()
        this.dialogButtonsName = []
        this.dialogTitle = 'floorOfHouse'
        this.innerVisible = true
        this.dialogStatus = 'upload'
      }else if(index === 'openfloorofhouse'){ 
        console.log(content)
        this.dialogTitle = 'floorOfHouse'
        this.dialogConfig = this.floorConfig
        this.dialogSelect = this.buildingUsers
        content.forEach(item=>{
          this.dialogData.push(item)
        })
        this.dialogButtonsName = [
                { name:'儲存',type:'primary',status:'update'},
                { name:'取消',type:'info',status:'cancel'}]
        this.dialogData = this.dialogData.sort((x,y) => x.id - y.id)
        this.dialogStatus = 'update'
        this.innerVisible = true
      }
    },
    async onUserActions(index, content){
      if(index === 'empty'){
        this.dialogData = []
        this.dialogData.push(User.empty())
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},{ name:'取消',type:'info',status:'cancel'}]
        this.dialogStatus = 'create'
      }else if(index === 'cancel'){
        this.innerVisible = false
      }else{
        var isOk = index === 'update' ? await content.update() : await content.create()
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          this.$store.dispatch('building/setbuildingusers',await User.get())
          await this.managementListinit()
          if(this.activeFloor == 'IN' && this.selectFloor !== null){
            await this.floorOfHouseinit()
          }
          this.innerVisible = false
        }
      }
    },
    async onCommitteeActions(index, content){
      if(index !== 'cancel'){
        var isOk = index === 'update' ? await content.update() : await content.create()
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          await this.managementListinit()
        }
      }
      this.innerVisible = false
    },
    async onContactUnitActions(index, content){
       if(index !== 'cancel'){
        var isOk = index === 'update' ? await content.update() : await content.create()
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          this.$store.dispatch('building/setbuildingcontactunit',await Contactunit.get())
          await this.contactunitListinit()
        }
      }
      this.innerVisible = false
    },
    async onFloorOfHouseActions(index, content){
      if(index === 'update' || index === 'create' ){
        var isOk = index === 'create' ? await content.create(this.selectFloor.getID()) : await content.update()
        if(isOk){
          index === 'create' ? this.$message('新增成功') : this.$message('更新成功')
          this.innerVisible = false
          if(this.selectFloor !== null){
            await this.floorOfHouseinit()
          }
          if(this.activeName == 'MC'){
            await this.getFloorOfHouse()
            await this.managementListinit()
          }
        }
      }else if(index === 'createfile'){
          await this.handleFilesUpload('createfile','floorOfHouse',content)
      }else{
        await this.handleFilesUpload('deletefile','floorOfHouse',content)
      }
    },
    async changeTable(value){
      this.isTable = value
      console.log(this.title)
      if(value == true){
        this.floorConfig = UsageOfFloor.getTableConfig()
        this.title === 'committee' ?  this.tableConfig = Committee.getConfig() : 
        this.title === 'contactUnit' ?  this.tableConfig = Contactunit.getTableConfig() : ''
      }else{
        this.floorConfig = UsageOfFloor.getConfig()
        this.title === 'committee' ?  this.tableConfig = Committee.getConfig() : 
        this.title === 'contactUnit' ?  this.tableConfig = Contactunit.getConfig() : ''
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