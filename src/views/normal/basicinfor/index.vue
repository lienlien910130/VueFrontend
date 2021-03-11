<template>
        <div class="editor-container">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="block-wrapper">
                        <h3>基本資料</h3>
                        <Form 
                        :buildingUsers="buildingUsers"
                        v-on:handleBuildingInfo="handleBuildingInfo"
                        />
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper">
                        <el-tabs v-model="activeName" type="border-card" 
                        >
                          <el-tab-pane label="管委會" name="MC" >
                          <Block 
                          v-if="activeName == 'MC'"
                          :list-query-params.sync="listQueryParams"
                          :selectSetting.sync="selectSetting"
                          v-bind="communityAttrs" 
                          v-on="ManagementListblockEvent"></Block>
                          </el-tab-pane>
                          <el-tab-pane label="廠商資料" name="Vender" >
                            <Block 
                            v-if="activeName == 'Vender'"
                            :list-query-params.sync="listQueryParams"
                            :selectSetting.sync="selectSetting"
                            v-bind="contactunitAttrs" 
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
                    <div :class="floorwrapper">
                        <h3>大樓樓層</h3>
                        <Range v-on:handleBuildingFloorSelect="handleBuildingFloorSelect"></Range>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper">
                        <el-tabs v-model="activeFloor" type="border-card">
                            <el-tab-pane label="基本資料" name="IN" >
                              <p v-if="!isChoose">請選擇樓層</p>
                              <Block 
                              v-if="activeFloor == 'IN' && isChoose"
                              :list-query-params.sync="floorlistQueryParams"
                              :selectSetting.sync="floorselectSetting"
                              v-bind="floorAttrs" 
                              v-on="FloorblockEvent"></Block>
                            </el-tab-pane>
                            <el-tab-pane label="樓層平面圖" name="IM" >
                              <p v-if="!isChoose">請選擇樓層</p>
                              <FloorImage
                              v-if="activeFloor == 'IM' && isChoose"
                              v-bind="floorImageAttrs"></FloorImage>
                            </el-tab-pane>
                            <el-tab-pane label="相關資料" name="OT">
                              <p v-if="!isChoose">請選擇樓層</p>
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
                v-on:handleDialog="handleDialog"></Dialog>
                
            </el-row>
        </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setSelectSetting , changeLink } from '@/utils/index'

export default {
  name: 'Tab',
  components: { 
    Form: () => import('./components/Form'),
    FloorImage: () => import('./components/Floor'),
    Range: () => import('./components/Range'),
    Select: () => import('@/components/Select/index.vue'),
    Dialog:() => import('@/components/Dialog/index.vue'),
    Upload:() => import('@/components/Upload/index.vue'),
    Block:() => import('@/components/Block/index.vue'),
  },
  computed: {
    ...mapGetters([
        'buildingid',
        'buildingusers',
        'buildingoptions',
        'buildingdevices'
    ]),
    dialogAttrs(){
      return{
        title:this.dialogTitle,
        visible: this.innerVisible,
        dialogData: this.dialogData,
        dialogStatus: this.dialogStatus,
        buttonsName: this.dialogButtonsName,
        config: this.dialogConfig,
        selectData: this.dialogSelect,
        files:this.floorFiles
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
    communityAttrs() {
      return {
        blockData: this.blockData,
        config: this.tableConfig,
        title:'committee',
        selectData: this.selectData, //門牌
        sortArray:this.sortArray
      }
    },
    contactunitAttrs() {
      return {
        blockData: this.blockData,
        config: this.tableConfig,
        title:'contactUnit',
        sortArray:this.sortArray
      }
    },
    floorAttrs() {
      return {
        blockData: this.floorData,
        config: this.floorConfig,
        title:'floorOfHouse',
        sortArray:this.floorsortArray
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
      //Form 
      buildingUsers:[],
      //Buildingupload
      buildingFiles:[],
      //Dialog
      dialogButtonsName:[],
      dialogTitle:'',
      dialogConfig:[],
      dialogSelect:[],
      userConfig : [
        { label:'姓名' , prop:'name', mandatory:true, message:'請輸入姓名'},
        { label:'身份證' , prop:'identityCard', mandatory:true,message:'請輸入身份證',
        pattern:/^[A-Z][1|2]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true},
        { label:'生日' , prop:'birthday',format:'YYYY-MM-DD', mandatory:true,message:'請輸入生日'},
        { label:'電話' , prop:'callNumber', mandatory:true,message:'請輸入電話'},
        { label:'手機號碼' , prop:'cellPhoneNumber', mandatory:true, message:'請輸入手機號碼',
        pattern:/^[0][9]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true},
        { label:'緊急電話' , prop:'emergencyNumber', mandatory:false},   
        { label:'電子信箱' , prop:'email', mandatory:true,message:'請輸入電子信箱',pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true},    
        { label:'備註' , prop:'note', mandatory:false,format:'textarea'}, 
      ],
      dialogData:[],
      dialogStatus:'',
      innerVisible:false,
      //FloorImage
      loading:false,
      imageSrc:'',
      //Floorupload
      floorImageId:'',
      floorFiles:[],
      //block
      blockData:[],
      selectData:[],
      floorData:[],
      tableConfig: [
          { label:'所屬單位' , prop:'linkUsageOfFloors',format:'floorOfHouseSelect',
           mandatory:true, message:'請選擇單位',type:'array',typemessage:'',isSelect:true,
           options:[],selectType:'usageOfFloor',select:'',isSort:true},
          { label:'職稱' , prop:'title', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'姓名' , prop:'userName', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'電話' , prop:'callNumber', mandatory:true, message:'請輸入內容',
          pattern:/^[0][9]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true,isSelect:false,isSort:false},
          { label:'緊急電話' , prop:'emergencyNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false }],
      floorConfig: [
          { label:'戶號' , prop:'houseNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'場所名稱' , prop:'placeName', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'收容人數' , prop:'capacity',mandatory:true,message:'請輸入內容',isSelect:false,isSort:false},
          { label:'所有人資料' , prop:'linkOwners',format:'userInfo', mandatory:true, message:'請選擇用戶',
          isSelect:false,isSort:false,type:'array',typemessage:''},
          { label:'使用人資料' , prop:'linkUsers',format:'userInfo', mandatory:true, message:'請選擇用戶',
          isSelect:false,isSort:false,type:'array',typemessage:''},
          { label:'檢附文件' , prop: 'file',format:'openfiles',isSelect:false,isSort:false}, 
          { label:'備註' , prop:'note',format:'textarea',mandatory:false,isSelect:false,isSort:false},
      ],
      activeName: 'MC',
      activeFloor:'IN',
      selectFloor:'',
      isChoose:false,
      floorofhouseId :'',
      floorlistQueryParams:{
          page: 1,
          limit: 10,
          total: 0
      },
      listQueryParams:{
          page: 1,
          limit: 10,
          total: 0
      },
      floorselectSetting:[],
      selectSetting:[],
      sortArray:[],
      floorsortArray:[],
      origin:[],
      floororigin:[]
    }
  },
  watch: {
    buildingid:{
      handler:async function(){
        this.activeName = 'MC'
        this.selectFloor = ''
        this.activeFloor = 'IN'
        await this.getFloorOfHouse()
        await this.managementListinit()
      },
      immediate:true
    },
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
      if(this.selectFloor !== ''){
        if(val == 'IN'){
          await this.floorOfHouseinit()
        }else if(val == 'IM'){
          this.getFloorImage()
        }else {
          this.floorFiles = await this.$obj.Files.getBuildingFloorFiles(this.selectFloor)
        }
      } 
    },
    async activeName(val){ 
      this.blockData = []
      this.selectData = []
      if(val == 'MC'){
         this.tableConfig= [
          { label:'所屬單位' , prop:'linkUsageOfFloors',format:'floorOfHouseSelect',
           mandatory:true, message:'請選擇單位',type:'array',typemessage:'',isSelect:true,
           options:[],selectType:'usageOfFloor',select:'',isSort:true},
          { label:'職稱' , prop:'title', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'姓名' , prop:'userName', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'電話' , prop:'callNumber', mandatory:true, message:'請輸入內容',
          pattern:/^[0][9]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true,isSelect:false,isSort:false},
          { label:'緊急電話' , prop:'emergencyNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false }
          ],
        await this.getFloorOfHouse()
        await this.managementListinit()
      }else if(val == 'Vender'){
        this.tableConfig = [
          { label:'公司名稱' , prop:'name', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'類別' , prop:'type', format:'ContactUnitOptions', mandatory:true, message:'請選擇類別',
          isSelect:true,options:[],selectType:'options',select:'',isSort:true },
          { label:'電話' , prop:'contactNumber',mandatory:true, message:'請輸入內容',
          pattern:/^[0][9]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true,isSelect:false,isSort:false},
          { label:'地址' , prop:'address', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false},
          { label:'狀態' , prop:'collaborate', format:'tag', mandatory:false, message:'請輸入內容',
          isSelect:true,options:[],selectType:'collaborateBool',select:'',isSort:true,type:'boolean',typemessage:'' }
        ]
        await this.contactunitListinit()
      }else{ //BOT
        this.buildingFiles = await this.$obj.Files.getBuildingFiles()
      }
    }
  },
  async mounted() {
    if(this.$route.params.target !== undefined && this.$route.params.target !== ''){
      this.activeName = 'Vender'
      this.selectData = []
      this.tableConfig = [
          { label:'公司名稱' , prop:'name', mandatory:true, message:'請輸入內容'},
          { label:'類別' , prop:'type', format:'select', mandatory:true, message:'請選擇類別'},
          { label:'電話' , prop:'contactNumber',mandatory:true, message:'請輸入內容'},
          { label:'地址' , prop:'address', mandatory:true, message:'請輸入內容'},
          { label:'備註' , prop:'note',format:'textarea', mandatory:false},
          { label:'狀態' , prop:'collaborate', format:'tag', mandatory:false, message:'請輸入內容' }
      ]
      await this.contactunitListinit()
      let _array = this.blockData.filter((item, index) => 
        item.id == this.$route.params.target
      )
      await this.handleBlock('contactunit','open',_array[0])
    } 
  },
  methods: { 
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
        var data = await this.$obj.Files.getBuildingFloorImage(this.floorImageId)
        const bufferUrl = btoa(new Uint8Array(data).reduce((data, byte) => 
          data + String.fromCharCode(byte), ''))
          this.imageSrc = 'data:image/png;base64,' + bufferUrl
        this.loading = false
      }
    },
    async getFloorOfHouse(){ //取得大樓所有門牌
      var data = await this.$obj.Building.getBuildingOfHouse()
      this.selectData = data.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.houseNumber) 
          this.$set(v, 'value', v.id) 
          return v
      })
    },
    async saveManagementList(){
      var data = await this.$obj.Building.getManagementList()
      this.origin = this.$deepClone(data)
    },
    async getManagementList(sort = null) { //取得管委會
      this.blockData = []
      var data = this.$deepClone(this.origin)
      this.listQueryParams.total = data.length
      this.selectSetting.forEach(element=>{
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
      data = data.filter((item, index) => 
          index < this.listQueryParams.limit * this.listQueryParams.page && 
          index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
      if(sort !== '' && sort !== null){
          data = data.sort(function(x,y){
            return y[sort] - x[sort]
          })
      }else{
          data = data.sort(function(x,y){
            return y.id - x.id
          })
      }
      this.blockData = data
    },
    async saveContactunitList(){
      var data = await this.$obj.Building.getBuildingContactunit()
      this.origin = this.$deepClone(data)
    },
    async getContactunitList(sort = null){ //取得廠商資料
      this.blockData = []
      var data = this.$deepClone(this.origin)
      this.listQueryParams.total = data.length
      this.selectSetting.forEach(element=>{
        if(element.select != ''){
          data = data.filter((item, index) => item[element.prop] == element.select )
        }
      })
      data = data.filter((item, index) => 
          index < this.listQueryParams.limit * this.listQueryParams.page && 
          index >= this.listQueryParams.limit * (this.listQueryParams.page - 1))
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
      this.blockData = data
    },
    async saveFloorList(){
      var data = await this.$obj.Building.getBuildingFloorOfHouse(this.selectFloor)
      this.floororigin = this.$deepClone(data)
    },
    async getFloorList(sort = null){ //取得樓層資料
      this.floorData = []
      var data = this.$deepClone(this.floororigin)
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
        data = data.filter((item, index) => 
        index < this.floorlistQueryParams.limit * this.floorlistQueryParams.page && 
        index >= this.floorlistQueryParams.limit * (this.floorlistQueryParams.page - 1))
        if(sort !== '' && sort !== null){
          data = data.sort(function(x,y){
            return y[sort] - x[sort]
        })}else{
          data = data.sort(function(x,y){
            return y.id - x.id
          })
      }
      this.floorData = data
      // await this.$api.building.apiGetFloorOfHouse(this.selectFloor).then(response => {
      //   response.result.forEach( item => {
      //       let content = {
      //           id:item.id,
      //           floor: item.floor,
      //           houseNumber: item.houseNumber,
      //           placeName:item.placeName,
      //           name:item.linkUsers[0].name,
      //           cellphonenumber:item.linkUsers[0].cellPhoneNumber,
      //           capacity:item.capacity,
      //           note:item.note,
      //           linkOwners:item.linkOwners[0].id,
      //           linkUsers:item.linkUsers[0].id
      //       }
      //       data.push(content)
      //   })
      //   this.floorlistQueryParams.total = response.result.length
      //   this.floorselectSetting.forEach(element=>{
      //       if(element.select != ''){
      //           data = data.filter((item, index) => item[element.prop] == element.select )
      //       }
      //     })
      //     data = data.filter((item, index) => 
      //     index < this.floorlistQueryParams.limit * this.floorlistQueryParams.page && 
      //     index >= this.floorlistQueryParams.limit * (this.floorlistQueryParams.page - 1))
      //     if(sort !== '' && sort !== null){
      //       data = data.sort(function(x,y){
      //         return y[sort] - x[sort]
      //       })
      //     }else{
      //         data = data.sort(function(x,y){
      //           return y.id - x.id
      //         })
      //     }
      //     this.floorData = data
      // })
    },
    async setSelectSetting(){
        this.selectSetting = await setSelectSetting(this.tableConfig,this.blockData)
        this.sortArray = this.tableConfig.filter((item,index)=>item.isSort == true)
    },
    async setFloorSelectSetting(){
        this.floorselectSetting = await setSelectSetting(this.floorConfig,this.floorData)
        this.floorsortArray = this.floorConfig.filter((item,index)=>item.isSort == true)
    },
    async handleBuildingInfo(index, content){ //基本資料相關操作
      this.dialogTitle = 'user'
      this.dialogConfig = this.userConfig
      this.dialogData = []
      if (index == 'empty'){
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
      this.selectFloor = content.id
      content.floorPlanID == null ? this.floorImageId = null : this.floorImageId = (content.floorPlanID).toString()
      if(this.activeFloor == 'IN'){
        await this.floorOfHouseinit()
      }else if(this.activeFloor == 'IM'){
        await this.getFloorImage()
      }else {
        this.floorFiles = await this.$obj.Files.getBuildingFloorFiles(this.selectFloor)
      }
    },
    async handleFilesUpload(index,title,data) { //檔案上傳操作
      console.log(index,title,data)
      var isOk = false
      if(index === 'createfile'){
        const formData = new FormData()
        data.forEach(item => {
          formData.append('file', item.raw)
        })
        isOk = 
          title === 'building' ? 
            await this.$obj.Files.postBuildingFiles(formData) : 
          title === 'floor' ?
            await this.$obj.Files.postBuildingFloorFiles(this.selectFloor,formData) :
            await this.$obj.Files.postBuildingFloorOfHouseFiles(this.floorofhouseId,formData)
      }else if(index === 'deletefile'){
        isOk = await this.$obj.Files.deleteFiles(data)
      }else{ //設定平面圖
        var _temp = {
          id:this.selectFloor,
          FloorPlanID:parseInt(data)
        }
        isOk = await this.$obj.Building.updateBuildingFloor(JSON.stringify(_temp))
        if(isOk){
          this.floorImageId = data
          this.$store.dispatch('building/setbuildingfloors',await this.$obj.Building.getBuildingFloors())
        }
      }
      if(isOk){
        index === 'createfile' ? this.$message('上傳成功') : 
        index === 'deletefile' ? this.$message('刪除成功') : this.$message('更新成功')
        title === 'building' ? 
          this.buildingFiles = await this.$obj.Files.getBuildingFiles() :  
        title === 'floor' ?
          this.floorFiles = await this.$obj.Files.getBuildingFloorFiles(this.selectFloor) :
          this.floorFiles = await this.$obj.Files.getBuildingFloorOfHouseFiles(this.floorofhouseId)
      }
    },
    async handleBlock(title,index, content) { //管委會、廠商資料、樓層門牌相關操作
      console.log(title,index,JSON.stringify(content))
      this.dialogData =[]
      this.dialogSelect = this.selectData
      if(title === 'floorOfHouse'){
        this.dialogTitle = 'floorOfHouse'
        this.dialogConfig = this.floorConfig
        this.dialogSelect = this.buildingUsers
      }else {
        this.dialogTitle = this.activeName === 'MC' ? 'committee' : 'contactUnit'
        this.dialogConfig = this.tableConfig
      }
      this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'update'},{ name:'取消',type:'info',status:'cancel'}]
      if (index === 'open') {
        this.dialogStatus = 'update'
        var temp = this.$deepClone(content)
        temp = changeLink(title,temp,'open')
        this.dialogData.push(temp)
        this.innerVisible = true
      }else if(index === 'delete'){
        var isDelete = false
        isDelete = title === 'committee' ? await this.$obj.Building.deleteManagementList(content) : false
        if(title === 'floorOfHouse'){
          var commList =  await this.$obj.Building.getManagementList()
          var array = commList.filter(function(item,index){
            var data = item.linkUsageOfFloors.filter((item,index)=> item.id == content)
            if(data.length>0){
                return item
            }
          })
          array.length>0 ? this.$message({
            message: '該門牌底下尚有管委會，請先將管委會移除後再刪除門牌資料',
            type: 'warning'
          }) : isDelete = await this.$obj.Building.deleteBuildingOfHouse(content)

        }else if(title === 'contactUnit'){
          var devices =  this.buildingdevices.filter(function(item,index){
            var data = item.linkKeeperUnits.filter((item,index)=> item.id == content)
            if(data.length>0){
                return item
            }
          })
          devices.length>0 ? this.$message({
            message: '該廠商底下尚有設備，請先將設備移除後再刪除廠商資料',
            type: 'warning'
          }) : isDelete = await this.$obj.Building.deleteBuildingContactunit(content)
        }
        if(isDelete){
            this.$message('刪除成功')
            title === 'floorOfHouse' ? 
              this.floorlistQueryParams = {page: 1,limit: 10, total: 0} : 
              this.listQueryParams = {page: 1,limit: 10, total: 0} 
            title === 'floorOfHouse' ? await this.floorOfHouseinit() :
            title === 'committee' ? await this.managementListinit() : await this.contactunitListinit()
        }
      }else if(index === 'empty'){
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},
          { name:'取消',type:'info',status:'cancel'}]
        this.innerVisible = true
        this.dialogStatus = 'create'
      }else if(index == 'opendialog'){
        await this.handleBuildingInfo('open',content)
      }else if(index === 'openfiles'){
        this.floorofhouseId = content
        this.floorFiles = await this.$obj.Files.getBuildingFloorOfHouseFiles(this.floorofhouseId)
        this.dialogButtonsName = []
        this.dialogTitle = 'floorOfHouse'
        this.innerVisible = true
        this.dialogStatus = 'upload'
      }else if(index === 'openfloorofhouse'){ 
        this.dialogTitle = 'floorOfHouse'
        this.dialogConfig = this.floorConfig
        this.dialogSelect = this.buildingUsers
        await Promise.all(content.map(async (item) => {
          var _temp = this.$deepClone(await this.$obj.Building.getBuildingOfHouseById(item.id))
          _temp = changeLink('floorOfHouse',_temp,'open')
          await this.dialogData.push(_temp)
        }))
        this.dialogData = this.dialogData.sort((x,y) => x.id - y.id)
        this.dialogStatus = 'update'
        this.innerVisible = true
      }
    },
    async onUserActions(index, content){
      if(index === 'empty'){
        this.dialogData = []
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},{ name:'取消',type:'info',status:'cancel'}]
        this.dialogStatus = 'create'
      }else if(index === 'cancel'){
        this.innerVisible = false
      }else{
        var isOk = index === 'create' ? await this.$obj.User.createUser(JSON.stringify(content)) : 
        await this.$obj.User.updateUser(JSON.stringify(content))
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          this.$store.dispatch('building/setbuildingusers',await this.$obj.Building.getBuildingUser())
          this.innerVisible = false
        }
      }
    },
    async onCommitteeActions(index, content){
      if(index !== 'cancel'){
        content = changeLink('committee',content,'')
        var isOk = index === 'update' ? 
        await this.$obj.Building.updateManagementList(JSON.stringify(content)) : 
        await this.$obj.Building.postManagementList(JSON.stringify(content))
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          await this.managementListinit()
        }
      }
      this.innerVisible = false
    },
    async onContactUnitActions(index, content){
       if(index !== 'cancel'){
        var isOk = index === 'update' ? 
        await this.$obj.Building.updateBuildingContactunit(JSON.stringify(content)) : 
        await this.$obj.Building.postBuildingContactunit(JSON.stringify(content))
        if(isOk){
          index === 'update' ? this.$message('更新成功') : this.$message('新增成功')
          this.$store.dispatch('building/setbuildingcontactunit',await this.$obj.Building.getBuildingContactunit())
          await this.contactunitListinit()
        }
      }
      this.innerVisible = false
    },
    async onFloorOfHouseActions(index, content){
      if(index === 'update' || index === 'create' ){
        content = changeLink('floorOfHouse',content,'')
        var isOk = index === 'create' ? 
          await this.$obj.Building.postBuildingOfHouse(this.selectFloor,JSON.stringify(content)) :
          await this.$obj.Building.updateBuildingOfHouse(JSON.stringify(content))
        if(isOk){
          index === 'create' ? this.$message('新增成功') : this.$message('更新成功')
          this.innerVisible = false
          if(this.selectFloor !== ''){
            await this.floorOfHouseinit()
          }
          if(this.activeName == 'MC'){
            this.blockData = []
            await this.getFloorOfHouse()
            await this.managementListinit()
          }
        }
      }else if(index === 'createfile'){
          await this.handleFilesUpload('createfile','floorOfHouse',content)
      }else{
        await this.handleFilesUpload('deletefile','floorOfHouse',content)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.block-wrapper {
    background: #fff;
    padding: 10px;
    margin-bottom: 32px;
    height: 750px;
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