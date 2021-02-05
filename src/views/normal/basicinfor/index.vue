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
import { setSelectSetting } from '@/utils/index'

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
        'buildingid'
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
        buttonsName:this.buttonsName,
        config: this.tableConfig,
        title:'community',
        selectData: this.selectData, //門牌
        sortArray:this.sortArray
      }
    },
    contactunitAttrs() {
      return {
        blockData: this.blockData,
        buttonsName: this.buttonsName,
        config: this.tableConfig,
        title:'contactunit',
        selectData: this.selectData, //廠商類別
        sortArray:this.sortArray
      }
    },
    floorAttrs() {
      return {
        blockData: this.floorData,
        buttonsName: this.buttonsName,
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
        { label:'身份證' , prop:'identityCard', mandatory:true,message:'請輸入身份證',pattern:/^[A-Z][1|2]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true},
        { label:'生日' , prop:'birthday',format:'YYYY-MM-DD', mandatory:true,message:'請輸入生日'},
        { label:'電話' , prop:'callNumber', mandatory:true,message:'請輸入電話'},
        { label:'手機號碼' , prop:'cellPhoneNumber', mandatory:true, message:'請輸入手機號碼',pattern:/^[0][9]\d{8}$/,errorMsg:'格式錯誤,請重新輸入',isPattern: true},
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
      buttonsName:[
        { name:'編輯',type:'primary',status:'open'},
        { name:'刪除',type:'info',status:'delete'}], 
      blockData:[],
      selectData:[],
      floorData:[],
      tableConfig: [
          { label:'所屬單位' , prop:'usageOfFloorId',format:'floorOfHouseSelect',
           mandatory:true, message:'請選擇單位',isSelect:true,options:[],selectType:'usageOfFloor',select:'',isSort:true},
          { label:'職稱' , prop:'title', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'姓名' , prop:'userName', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'電話' , prop:'callNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'緊急電話' , prop:'emergencyNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false }],
      floorConfig: [
          { label:'戶號' , prop:'houseNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'場所名稱' , prop:'placeName', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'緊急連絡人' , prop:'name',format:'hide',isSelect:false,isSort:false},
          { label:'電話' , prop:'cellphonenumber',format:'hide',isSelect:false,isSort:false},
          { label:'收容人數' , prop:'capacity',mandatory:true,message:'請輸入內容',isSelect:false,isSort:false},
          { label:'備註' , prop:'note',format:'textarea',mandatory:false,isSelect:false,isSort:false},
          { label:'所有人資料' , prop:'linkOwners',format:'userInfo', mandatory:true, message:'請選擇用戶',
          isSelect:true,options:[],selectType:'user',select:'',isSort:true},
          { label:'使用人資料' , prop:'linkUsers',format:'userInfo', mandatory:true, message:'請選擇用戶',
          isSelect:true,options:[],selectType:'user',select:'',isSort:true},
          { label:'檢附文件' , prop: 'file',format:'openfiles',isSelect:false,isSort:false} 
      ],
      activeName: 'MC',
      activeFloor:'IN',
      selectFloor:'',
      isChoose:false,
      floorofhouseId :'',
      origin:[], //廠商資料
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
      floorsortArray:[]
    }
  },
  watch: {
    async activeFloor(val){ 
      await this.getFloorImageId()
      if(val == 'IN'){
        await this.getFloorList()
        await this.setFloorSelectSetting()
      }else if(val == 'IM'){
        this.getFloorImage()
      }else {
        this.getFloorFiles()
      }
    },
    async activeName(val){ 
      this.blockData = []
      this.selectData = []
      if(val == 'MC'){
         this.tableConfig= [
          { label:'所屬單位' , prop:'usageOfFloorId',format:'floorOfHouseSelect',
           mandatory:true, message:'請選擇單位',isSelect:true,options:[],selectType:'usageOfFloor',select:'',isSort:true},
          { label:'職稱' , prop:'title', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'姓名' , prop:'userName', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'電話' , prop:'callNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'緊急電話' , prop:'emergencyNumber', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false }],
        await this.getFloorOfHouse()
        await this.getManagementList()
        await this.setSelectSetting()
      }else if(val == 'Vender'){
        this.tableConfig = [
          { label:'公司名稱' , prop:'name', mandatory:true, message:'請輸入內容',isSelect:false,isSort:true},
          { label:'類別' , prop:'type', format:'select', mandatory:true, message:'請選擇類別',
          isSelect:true,options:[],selectType:'options',select:'',isSort:true},
          { label:'電話' , prop:'contactNumber',mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'地址' , prop:'address', mandatory:true, message:'請輸入內容',isSelect:false,isSort:false},
          { label:'備註' , prop:'note',format:'textarea', mandatory:false,isSelect:false,isSort:false},
          { label:'狀態' , prop:'collaborate', format:'tag', mandatory:false, message:'請輸入內容',
          isSelect:true,options:[],selectType:'collaborateBool',select:'',isSort:true }
        ]
        await this.getContactUnitOption()
        await this.getContactunitList()
        await this.setSelectSetting()
      }else{ //BOT
        await this.getBuildingFiles()
      }
    }
  },
  async mounted() {
    this.activeName = 'MC'
    await this.getFloorOfHouse()
    await this.getManagementList()
    await this.setSelectSetting()
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
      await this.getContactUnitOption()
      await this.getContactunitList()
      await this.setSelectSetting()
      let _array = this.blockData.filter((item, index) => 
        item.id == this.$route.params.target
      )
      await this.handleBlock('contactunit','open',_array[0])
    } 
  },
  methods: { 
    async getBuildingFiles() {
      this.buildingFiles = []
      await this.$api.files.apiGetBuildingFiles().then(response => {
        response.result.forEach(item => {
          this.buildingFiles.push(item)
        })
      })
    },
    async getBuildingUser(){ //取得大樓的所有用戶資料
      this.buildingUsers = this.$deepClone(await this.$obj.Building.getBuildingUser())
    },
    async getFloorFiles(){ //取得樓層檔案
      this.floorFiles = []
      await this.$api.files.apiGetFloorFiles(this.selectFloor).then(response =>{
        response.result.forEach( item => {
          this.floorFiles.push(item)
        })
      })
    },
    async getFloorImageId(){ //儲存floorimageID
      await this.$api.building.apiGetFloor(this.selectFloor).then(response=> {
          if(response.result[0].floorPlanID !== null){
            this.floorImageId = (response.result[0].floorPlanID).toString()
          }else{
            this.floorImageId = null
          }
      })
    }, 
    async getFloorImage(){ //載入平面圖
      if(this.floorImageId == null){
        this.imageSrc = -1
      }else{
        this.loading = true
        await this.$api.files.apiGetFloorImage(this.floorImageId).then(response=> {
          const bufferUrl = btoa(new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          this.imageSrc = 'data:image/png;base64,' + bufferUrl
        }) 
        this.loading = false
      }
    },
    async getFloorOfHouse(){ //取得大樓所有門牌
      await this.$api.building.apiGetBuildingOfHouse().then(response=>{
        var _temp = response.result.sort((x,y) => x.id - y.id)
        this.selectData = _temp.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.houseNumber) 
          this.$set(v, 'value', v.id) 
          return v
        })
      })
    },
    async getManagementList(sort = null) { //取得管委會
      this.blockData = []
      var data = []
      await this.$api.building.apiGetCommittee().then(response => {
          this.listQueryParams.total = response.result.length
                data = response.result
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
                        return y.id - x.id
                    })
                }
                this.blockData = data
      })
    },
    async getContactUnitOption(){ //取得大樓的廠商分類
      await this.$api.setting.apiGetOptions('ContactUnitOptions').then(response => {
        console.log(JSON.stringify(response))
        var _temp = response.result.sort((x,y) => x.id - y.id)
        this.selectData = _temp.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.textName) 
          this.$set(v, 'value', v.id) 
          return v
        })
      })
    },
    async getContactunitList(sort = null){ //取得廠商資料
      this.blockData = []
      var data = []
      await this.$api.building.apiGetBuildingContactUnit().then(response => {
          this.listQueryParams.total = response.result.length
          data = response.result
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
      })
    },
    async getFloorList(sort = null){ //取得樓層資料
      this.floorData = []
      var data = []
      await this.$api.building.apiGetFloorOfHouse(this.selectFloor).then(response => {
        response.result.forEach( item => {
            let content = {
                id:item.id,
                floor: item.floor,
                houseNumber: item.houseNumber,
                placeName:item.placeName,
                name:item.linkUsers[0].name,
                cellphonenumber:item.linkUsers[0].cellPhoneNumber,
                capacity:item.capacity,
                note:item.note,
                linkOwners:item.linkOwners[0].id,
                linkUsers:item.linkUsers[0].id
            }
            data.push(content)
        })
        this.floorlistQueryParams.total = response.result.length
        this.floorselectSetting.forEach(element=>{
            if(element.select != ''){
                data = data.filter((item, index) => item[element.prop] == element.select )
            }
          })
          data = data.filter((item, index) => 
          index < this.floorlistQueryParams.limit * this.floorlistQueryParams.page && 
          index >= this.floorlistQueryParams.limit * (this.floorlistQueryParams.page - 1))
          if(sort !== '' && sort !== null){
            data = data.sort(function(x,y){
              return y[sort] - x[sort]
            })
          }else{
              data = data.sort(function(x,y){
                return y.id - x.id
              })
          }
          this.floorData = data
      })
    },
    async getUsageofFloorFiles(usageofFloorId){ //取得門牌檔案
      this.floorFiles = []
      await this.$api.files.apiGetFloorOfHouseFiles(usageofFloorId).then(response=>{
        response.result.forEach( item => {
          this.floorFiles.push(item)
        })
      })
    },
    async getUser(userId){ //取得特定用戶資料
      this.dialogData.push(await this.$obj.User.getUser(userId))
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
      if(index == 'readbuildingUsers'){
        await this.getBuildingUser()
      }else if (index == 'empty'){
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},{ name:'取消',type:'info',status:'cancel'}]
        this.dialogStatus = 'create'
        this.innerVisible = true
      }else if (index == 'open') {
        var userarray = content.split(',')
        await Promise.all(userarray.map(async (item) => {
          await this.getUser(item)
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
      console.log(title ,index,content)
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
      await this.getFloorImageId()
      if(this.activeFloor == 'IN'){
        await this.getFloorList()
        await this.setFloorSelectSetting()
      }else if(this.activeFloor == 'IM'){
        await this.getFloorImage()
      }else {
        await this.getFloorFiles()
      }
    },
    async handleFilesUpload(index,title,data) { //檔案上傳操作
      if(title === 'building'){
        if(index === 'createfile'){
          const formData = new FormData();
          data.forEach(item => {
            formData.append('file', item.raw)
          })
          await this.$api.files.apiPostBuildingFiles(formData).then(async(response) => {
            this.$message('上傳成功')
            await this.getBuildingFiles()
          })
        }else{
          await this.$api.files.apiDeleteFile(data).then(async(response) => {
            this.$message('刪除成功')
            await this.getBuildingFiles()
          })
        }
      }else if(title == 'floor'){
        if(index === 'createfile'){
            const formData = new FormData()
            data.forEach(item => {
                    formData.append('file', item.raw)
            })
            this.$api.files.apiPostFloorFiles(this.selectFloor,formData).then(async(response)=> {
                this.$message('上傳成功')
                await this.getFloorFiles()
            })
        }else if(index === 'deletefile'){
          await this.$api.files.apiDeleteFile(data).then(async(response) => {
            this.$message('刪除成功')
            await this.getFloorFiles()
          })
        }else{
          var _temp = {
                id:this.selectFloor,
                FloorPlanID:parseInt(data)
            }
            this.$api.building.apiPatchFloors(_temp).then(response =>{
                this.$message('儲存成功')
                this.floorImageId = data
            })
        }
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
        this.dialogData.push(content)
        this.innerVisible = true
      }else if(index === 'delete'){
        if(title === 'floorOfHouse'){
          await this.$api.building.apiDeleteFloorOfHouse(content).then(async(response)=>{
            this.$message('刪除成功')
            await this.getFloorList()
          })
        }else if(title === 'community') {
          await this.$api.building.apiDeleteCommittee(content).then(async(response) => {
            this.$message('刪除成功')
            await this.getManagementList()
          })
        }else{
          await this.$api.building.apiDeleteContactUnit(content).then(async(response) => {
            this.$message('刪除成功')
            await this.getContactunitList()
          })
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
        await this.getUsageofFloorFiles(content)
        this.floorofhouseId = content
        this.dialogButtonsName = []
        this.dialogTitle = 'floorOfHouse'
        this.innerVisible = true
        this.dialogStatus = 'upload'
      }else if(index === 'openfloorofhouse'){
        this.dialogTitle = 'floorOfHouse'
        this.dialogConfig = this.floorConfig
        this.dialogSelect = this.buildingUsers
        await this.$api.building.apiGetHouse(content).then(async(response) => {
          let content = {
                id:response.result[0].id,
                houseNumber: response.result[0].houseNumber,
                placeName:response.result[0].placeName,
                name:response.result[0].linkUsers[0].name,
                capacity:response.result[0].capacity,
                note:response.result[0].note,
                linkOwners:response.result[0].linkOwners[0].id,
                linkUsers:response.result[0].linkUsers[0].id
            }
          this.dialogData.push(content)
        })
        this.dialogStatus = 'update'
        this.dialogData.push(content)
        this.innerVisible = true
      }
    },
    async onUserActions(index, content){
      if(index === 'create'){
        var isSucc = await this.$obj.User.createUser(content)
        if(isSucc){
          this.$message('新增成功')
          this.innerVisible = false
          await this.getBuildingUser()
        }
      }else if(index === 'update'){
        await this.$api.building.apiPatchUser(content).then(async(response) => {
          this.$message('更新成功')
          this.innerVisible = false
          await this.getBuildingUser()
        })
      }else if (index == 'empty'){
        this.dialogData = []
        this.dialogButtonsName = [
          { name:'儲存',type:'primary',status:'create'},{ name:'取消',type:'info',status:'cancel'}]
        this.dialogStatus = 'create'
      }
    },
    async onCommitteeActions(index, content){
      var unit = {
          id:content.usageOfFloorId
      }
      if(index === 'create'){
          this.$set(content,"linkUsageOfFloors",unit)
          this.$delete(content,'unit')
          this.$delete(content,'usageOfFloorId')
          await this.$api.building.apiPostCommittee(content).then(response => {
            this.$message('新增成功')
          })
      }else if(index === 'update'){
          this.$delete(content,'linkUsageOfFloors')
          this.$set(content,"linkUsageOfFloors",unit)
          await this.$api.building.apiPatchCommittee(content).then(response => {
            this.$message('更新成功')
          })
      }
      this.innerVisible = false
      await this.getManagementList()
    },
    async onContactUnitActions(index, content){
      if(index === 'create'){
          await this.$api.building.apiPostContactUnit(content).then(response => {
            this.$message('新增成功')
          })
      }else if(index === 'update'){
          await this.$api.building.apiPatchContactUnit(content).then(response => {
            this.$message('更新成功')
          })
      }
      this.innerVisible = false
      await this.getContactunitList()
    },
    async onFloorOfHouseActions(index, content){
      if(index === 'update' || index === 'create' ){
        var linkOwners = [{
          id: content.linkOwners
        }]
        var linkUsers = [{
          id: content.linkUsers
        }]
        this.$set(content,'linkOwners',linkOwners)
        this.$set(content,'linkUsers',linkUsers)
        this.$delete(content,'name')
        this.$delete(content,'cellphonenumber')
      }
      if(index === 'create'){
        await this.$api.building.apiPostFloorOfHouse(this.selectFloor,content).then(async(response) => {
            this.$message('新增成功')
            this.innerVisible = false
            await this.getFloorList()
        })
      }else if(index === 'update'){
        await this.$api.building.apiPatchFloorOfHouse(content).then(async(response) => {
          this.$message('更新成功')
          this.innerVisible = false
          if(this.selectFloor !== ''){
            await this.getFloorList()
          }
          if(this.activeName == 'MC'){
            this.blockData = []
            await this.getFloorOfHouse()
            await this.getManagementList()
          }
        })  
      }else if(index === 'createfile'){
        const formData = new FormData()
        content.forEach(item => {
          formData.append('file', item.raw)
        })
        await this.$api.files.apiPostFloorOfHouseFiles(this.floorofhouseId,formData).then(async(response)=>{
          this.$message('新增成功')
          await this.getUsageofFloorFiles(this.floorofhouseId)
        })
      }else if(index == 'deletefile'){
        await this.$api.files.apiDeleteFile(content).then(async(response) =>{
          this.$message('刪除成功')
          await this.getUsageofFloorFiles(this.floorofhouseId)
        })
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