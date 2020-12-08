<template>
    <div class="basicinfor-container">
        <div class="basicinfor-editor-container">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="block-wrapper">
                        <h3>基本資料</h3>
                        <Form 
                        v-bind="formAttrs" v-on="formEvent"
                        />
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper">
                        <el-tabs v-model="activeName" type="border-card" 
                        >
                        <el-tab-pane label="管委會" name="MC" >
                            <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
                          </el-tab-pane>
                          <el-tab-pane label="廠商資料" name="Vender" >
                            <Select style="margin-bottom: 20px;" 
                                v-bind="selectAttrs" v-on="selectEvent"
                            />
                            <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
                          </el-tab-pane>
                          <el-tab-pane label="相關資料" name="BOT" >
                            <el-form
                              label-position="left" 
                              label-width="auto" 
                              >
                              <el-form-item label="上傳檔案">
                                  <Upload v-on="uploadEvent"></Upload>
                              </el-form-item>
                              <el-form-item label="檔案">
                                  <div class="files">
                                      <div 
                                        v-for="(item,index) in buildingFiles" :key="item.id" class="filesdiv">
                                        <el-link 
                                            class="link" 
                                            :href="downloadbufile(item.id)" target="_blank" >
                                            【{{ index+1 }}】{{ item.fileOriginalName }}.{{item.extName}}
                                        </el-link>
                                        <span>
                                              <i class="el-icon-delete del" 
                                              style="float:right;font-size: 25px;margin-top:5px" 
                                              @click="delfile(item.id)" />
                                            </span>
                                            </div>
                                          </div>
                                      </el-form-item>
                            </el-form>
                          </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div :class="floorwrapper">
                        <h3>大樓樓層</h3>
                        <Range v-bind="rangeAttrs" v-on="rangeEvent"></Range>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper">
                        <el-tabs v-model="activeFloor" style="margin-top:15px;margin-bottom:15px;" type="border-card">
                          <el-tab-pane label="基本資料" name="IN" >
                            <FloorBlock 
                            v-if="activeFloor == 'IN'"
                            v-bind="floorAttrs" 
                            v-on="floorEvent"></FloorBlock>
                          </el-tab-pane>
                          <el-tab-pane label="樓層平面圖" name="IM" >
                            <Floor 
                            v-if="activeFloor == 'IM'"
                            v-bind="floorAttrs" 
                            v-on="floorEvent"></Floor>
                          </el-tab-pane>
                          <el-tab-pane label="相關資料" name="OT">
                            <Other 
                            v-if="activeFloor == 'OT'"
                            v-bind="floorAttrs" 
                            v-on="floorEvent"></Other>
                          </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <Dialog v-bind="dialogAttrs" v-on="dialogEvent"></Dialog>
            </el-row>
            
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Tab',
  components: { 
    Select: () => import('@/components/Select/index.vue'),
    Table: () => import('@/components/Table/Table.vue'),
    Block: () => import('@/components/Block/index.vue'),
    Form: () => import('./components/Form'),
    Floor: () => import('./components/Floor'),
    Range: () => import('./components/Range'),
    FloorBlock: () => import('@/components/Block/index.vue'),
    Other: () => import('./components/Other'),
    Dialog:() => import('@/components/Dialog/index.vue'),
    Upload:() => import('@/components/Upload/index.vue')
  },
  computed: {
    ...mapGetters([
        'buildingid'
    ]),
    formAttrs() {
      return {
        selectData: this.useroptions
      }
    },
    formEvent(){
      return {
        subOpitonButton: this.handleFormOption
      }
    },
    floorAttrs() {
      return {
        blockData: this.floorData,
        buttonsName: this.buttonsName,
        config: this.floorConfig,
        title:'floor',
        selectData: this.useroptions,
        isChoose:this.isChoose,
        originFiles:this.originFiles,
        selectfloor:this.selectfloor,
        floorImage:this.floorImage,
        imagesrc:this.imagesrc,
        loading:this.loading
      }
    },
    floorEvent(){
      return {
        subOpitonButton: this.handleFloorTableOption
      }
    },
    blockAttrs() {
      return {
        blockData: this.blockData,
        buttonsName: this.buttonsName,
        config: this.tableConfig,
        title:this.title,
        selectData: this.options
      }
    },
    blockEvent() {
      return {
        subOpitonButton: this.handleBlockOption
      }
    },
    selectAttrs() {
      return {
        data:this.blockData,
        selectData: this.selectData,
        title:'ContactUnit',
      }
    },
    selectEvent() {
      return {
        subChangeOption: this.handleSelectOption
      }
    },
    dialogAttrs(){
      return{
        visible: this.innerVisible,
        userdata: this.userdata,
        dialogStatus: this.dialogStatus
      }
    },
    dialogEvent(){
      return{
        subUserButton: this.handleUserOption
      }
    },
    rangeAttrs(){
      return{
        floor: this.allfloor
      }
    },
    rangeEvent(){
      return{
        subRangeButton: this.handleRangeOption
      }
    },
    floorwrapper(){
      if (this.$store.state.app.device === 'mobile') {
        return 'floorMobile'
      } else {
        return 'floornotMobile'
      }
    },
    uploadEvent(){
      return {
        subOpitonButton: this.handleUploadOption
      }
    },
  },
  data() {
    return {
      activeName: 'MC',
      activeFloor:'IN',
      allfloor:'',
      tableConfig: [
          { label:'所屬單位' , prop:'usageOfFloorId',format:'manageselect', mandatory:true, message:'請選擇單位',trigger:'change' },
          { label:'職稱' , prop:'title',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'姓名' , prop:'userName',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'電話' , prop:'callNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'緊急電話' , prop:'emergencyNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'備註' , prop:'note',type:'string',format:'textarea', mandatory:false}],
      floorConfig: [
          { label:'戶號' , prop:'houseNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'場所名稱' , prop:'placeName',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'緊急連絡人' , prop:'name',format:'hide'},
          { label:'電話' , prop:'cellphonenumber',format:'hide'},
          { label:'收容人數' , prop:'capacity',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'備註' , prop:'note',type:'string',format:'textarea',mandatory:false},
          { label:'所有人資料' , prop:'linkOwners',format:'ownerselect', mandatory:true, message:'請選擇用戶',trigger:'change'},
          { label:'使用人資料' , prop:'linkUsers',format:'userselect', mandatory:true, message:'請選擇用戶',trigger:'change'} ],
      floorData:[],
      buttonsName: ['編輯','刪除'],
      selectData:[],
      userselectData:[],
      options:[],
      useroptions:[],
      blockData:[],
      origin:[],
      innerVisible:false,
      userdata:[],
      dialogStatus:'',
      isChoose:false,
      selectfloor:'',
      title:'',
      originFiles:[],
      buildingFiles:[],
      floorsFiles:[],
      floorImage:'',
      imagesrc:'',
      loading:false
    }
  },
  watch: {
    buildingid:async function(val){
      this.activeName = 'MC'
      await this.gethouseOption()
      await this.getmanagementList()
    },
    async activeFloor(val){ 
      await this.getfloorimageid()
      if(val == 'IN'){
        this.getfloorList()
      }else if(val == 'IM'){
        this.getFloorImage()
      }else {
        this.getfloorFiles()
      }
    },
    async activeName(val){ 
      this.blockData = []
      this.options = []
      this.selectData = []
      if(val == 'MC'){
         this.tableConfig= [
          { label:'所屬單位' , prop:'usageOfFloorId',format:'manageselect', mandatory:true, message:'請選擇單位',trigger:'change' },
          { label:'職稱' , prop:'title',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'姓名' , prop:'userName',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'電話' , prop:'callNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'緊急電話' , prop:'emergencyNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'備註' , prop:'note',type:'string',format:'textarea', mandatory:false}]
        await this.gethouseOption()
        await this.getmanagementList()
      }else if(val == 'Vender'){
        this.tableConfig = [
          { label:'公司名稱' , prop:'name',type:'string', mandatory:true, message:'請輸入內容'},
          { label:'類別' , prop:'type', format:'contactunitselect', mandatory:true, message:'請選擇類別'},
          { label:'電話' , prop:'contactNumber',type:'string', mandatory:true, message:'請輸入內容',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'地址' , prop:'address',type:'string', mandatory:true, message:'請輸入內容'},
          { label:'備註' , prop:'note',type:'string',format:'textarea', mandatory:false},
          { label:'狀態' , prop:'collaborate', format:'tag', type:'boolean', mandatory:false, message:'請輸入內容',typemessage:'',isPattern: false }
        ]
        await this.getcontactunitOption()
        await this.getcontactunitList()
      }else{ //BOT
        await this.getbufiles()
      }
    }
  },
  async mounted() {
    this.activeName = 'MC'
    await this.gethouseOption()
    await this.getmanagementList()
  },
  methods: { 
    async getbufiles() {
      this.buildingFiles = []
      await this.$api.files.apiGetBuildingFiles().then(response => {
        response.result.forEach(item => {
          this.buildingFiles.push(item)
        })
      })
    },
    async getmanagementList() { //取得管委會
      this.blockData = []
      await this.$api.building.apiGetCommittee().then(response => {
        this.blockData = response.result
        this.origin = JSON.stringify(this.blockData)
        this.title = 'Management'
      })
    },
    async getcontactunitList(){ //取得廠商資料
      await this.$api.building.apiGetContactUnit().then(response => {
        this.blockData = response.result.sort(function(x,y){
            var a = x.collaborate
            var b = y.collaborate
            if(a == b){
              return y.id - x.id
            }
            return y.collaborate - x.collaborate
          })
        this.origin = JSON.stringify(this.blockData)
        this.title = 'ContactUnit'
      })
    },
    async getfloorList(){ //取得樓層資料
      this.floorData = []
      await this.$api.building.apiGetFloorOfHouse(this.selectfloor).then(response => {
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
            this.floorData.push(content)
        })
      })
    },
    async gethouseOption(){ //取得大樓所有門牌
      await this.$api.building.apiGetBuildingOfHouse().then(response=>{
        this.selectData = response.result.sort((x,y) => x.id - y.id)
        this.options = this.selectData.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.houseNumber) 
          this.$set(v, 'value', v.id) 
          return v
        })
      })
    },
    async getcontactunitOption(){ //取得大樓的廠商分類
      await this.$api.setting.apiGetOptions('ContactUnitOptions').then(response => {
        this.selectData = response.result.sort((x,y) => x.id - y.id)
        this.options = this.selectData.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.textName) 
          this.$set(v, 'value', v.id) 
          return v
        })
      })
    },
    async getBuildinguser(){ //取得大樓的所有用戶資料
      this.useroptions = []
      this.userselectData= []
      await this.$api.building.apiGetAllBuildingOfUser().then(response=>{
        this.userselectData = response.result.sort((x,y) => x.id - y.id)
        this.useroptions = this.userselectData.map(v => {
          this.$set(v, 'id', v.id) 
          this.$set(v, 'label', v.name) 
          this.$set(v, 'value', v.id) 
          return v
        })
      })
    },
    async getuser(userid){ //取得特定用戶資料
      await this.$api.building.apiGetUser(userid).then(response => {
        this.userdata.push(response.result[0])
      })
    },
    async getusageofFloorfiles(usageofFloorid){ //取得門牌檔案
      var _originFiles = []
      await this.$api.files.apiGetFloorOfHouseFiles(usageofFloorid).then(response=>{
        response.result.forEach( item => {
          _originFiles.push(item)
        })
        this.originFiles = _originFiles
      })
    },
    async getfloorFiles(){ //取得樓層檔案
      this.originFiles = []
      await this.$api.files.apiGetFloorFiles(this.selectfloor).then(response =>{
          response.result.forEach( item => {
              this.originFiles.push(item)
          })
      })
    },


    async handleSelectOption(content){ //廠商分類相關操作
      const array =  JSON.parse(this.origin)
      if(content !== undefined){
        this.blockData = array.filter((item, index) => 
        item.type == content[0].id )
      }else{
        this.blockData = array
      }
    },
    async handleFormOption(index, content){ //基本資料相關操作
      if(index == 'edit' || index == 'refreshUser'){
        await this.getBuildinguser()
      }else if (index == 'createUser'){
        this.userdata = []
        this.dialogStatus = 'create'
      }else {
        this.userdata =[]
        var userarray = content.split(',')
        await Promise.all(userarray.map(async (i) => {
          await this.getuser(i);
        }));
        this.userdata = this.userdata.sort((x,y) => x.id - y.id)
        this.innerVisible = true
        this.dialogStatus = 'update'
      }
    },
    async handleBlockOption(index, content) { //管委會、廠商資料相關操作
      console.log(index,JSON.stringify(content))
      if (index === 'update') {
        if(this.activeName === 'MC'){
          var unit = {
            id:content.usageOfFloorId
          }
          this.$delete(content,'linkUsageOfFloors')
          this.$set(content,"linkUsageOfFloors",unit)
          await this.$api.building.apiPatchCommittee(content).then(async(response) => {
            this.$message('更新成功')
            await this.getmanagementList()
          })
        }else{
          this.$api.building.apiPatchContactUnit(content).then(async(response) => {
            this.$message('更新成功')
            await this.getcontactunitList()
          })
        }
      }else if(index === 'create') {
        if(this.activeName === 'MC'){
          var unit = {
            id:content.usageOfFloorId
          }
          this.$set(content,"linkUsageOfFloors",unit)
          this.$delete(content,'unit')
          this.$delete(content,'usageOfFloorId')
          await this.$api.building.apiPostCommittee(content).then(async(response) => {
            this.$message('新增成功')
            await this.getmanagementList()
          })
        }else{
          this.$api.building.apiPostContactUnit(content).then(async(response) => {
            this.$message('新增成功')
            await this.getcontactunitList()
          })
        }
      }else if(index == 'delete'){
        if(this.activeName === 'MC'){
          await this.$api.building.apiDeleteCommittee(content).then(async(response) => {
            this.$message('刪除成功')
            await this.getmanagementList()
          })
        }else{
          this.$api.building.apiDeleteContactUnit(content).then(async(response) => {
            this.$message('刪除成功')
            await this.getcontactunitList()
          })
        }
      }else if(index == 'opendialog'){
        await this.gethouseOption()
        await this.getcontactunitOption()
      }
    },
    async handleFloorTableOption(index, content) { //樓層門牌相關操作
      console.log(index,JSON.stringify(content))
      if(index === 'update' || index === 'create' ){
        var linkOwners = [{
          id: content.linkOwners
        }]
        var linkUsers = [{
          id: content.linkUsers
        }]
        this.$set(content,'linkOwners',linkOwners)
        this.$set(content,'linkUsers',linkUsers)
      }
      if (index === 'update') {
        await this.$api.building.apiPatchFloorOfHouse(content).then(async(response) => {
          this.$message('更新成功')
          await this.getfloorList()
          })
      }else if(index === 'create') {
        await this.$api.building.apiPostFloorOfHouse(this.selectfloor,content).then(async(response) => {
            this.$message('新增成功')
            //await this.gethouseOption()
            await this.getfloorList()
        })
      }else if(index == 'delete'){
        await this.$api.building.apiDeleteFloorOfHouse(content).then(async(response)=>{
            this.$message('刪除成功')
            //await this.gethouseOption()
            await this.getfloorList()
          })
      }else if (index === 'createUser'){
          this.userdata = []
          this.innerVisible = true
          this.dialogStatus = 'create'
      }else if(index === 'openUser'){
          this.userdata = []
          await this.getuser(content)
          this.innerVisible = true
          this.dialogStatus = 'update'
      }else if(index === 'getfiles'){
        await this.getusageofFloorfiles(content)
      }else if(index === 'fileupload'){ 
          const formData = new FormData()
          content.file.forEach(item => {
            formData.append('file', item.raw)
          })
          await this.$api.files.apiPostFloorOfHouseFiles(content.id,formData).then(async(response)=>{
            await this.getusageofFloorfiles(content.id)
          })
      }else if(index == 'deletefile'){
        await this.$api.files.apiDeleteFile(content.fileid).then(async(response) =>{
          this.$message('刪除成功')
          await this.getusageofFloorfiles(content.id)
        })
      }else if(index == 'floorfile'){
        await this.getfloorFiles()
      }else if(index == 'opendialog'){

      }
    },
    async handleUserOption(index, content){ //大樓住戶相關操作
      if(index === 'cancel'){
        this.innerVisible = false
      }else if(index === 'create'){
        if(content === ''){
          this.userdata = []
          this.dialogStatus = 'create'
        }else{
          await this.$api.building.apiPostUser(content).then(async(response) => {
            this.$message('新增成功')
            this.innerVisible = false
            await this.getBuildinguser()
          })
        }
      }else{
        await this.$api.building.apiPatchUser(content).then(async(response) => {
          this.$message('更新成功')
          this.innerVisible = false
          await this.getBuildinguser()
        })
      }
    },
    async handleRangeOption(content){ //選擇樓層後的操作
      this.isChoose = true
      this.selectfloor = content
      await this.getfloorimageid()
      if(this.activeFloor == 'IN'){
        await this.getfloorList()
      }else if(this.activeFloor == 'IM'){
        await this.getFloorImage()
      }else {
        await this.getfloorFiles()
      }
    },
    async getfloorimageid(){ //儲存floorimageID
      await this.$api.building.apiGetFloor(this.selectfloor).then(response=> {
          if(response.result[0].floorPlanID !== null){
            this.floorImage = (response.result[0].floorPlanID).toString()
          }else{
            this.floorImage = null
          }
      })
    }, 
    async getFloorImage(){ //載入平面圖
      if(this.floorImage == null){
        this.imagesrc = -1
      }else{
        this.loading = true
        await this.$api.files.apiGetFloorImage(this.floorImage).then(response=> {
            const bufferUrl = btoa(new Uint8Array(response).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            this.imagesrc = 'data:image/png;base64,' + bufferUrl;
        }) 
        this.loading = false
      }
    },
    async handleUploadOption(index, file) { //大樓相關資料操作
      const formData = new FormData();
      file.forEach(item => {
        formData.append('file', item.raw)
      })
      await this.$api.files.apiPostBuildingFiles(formData).then(async(response) => {
        this.$message('上傳成功')
        await this.getbufiles()
      })
    },
    async delfile(fileid) {
      this.$confirm('是否確定刪除該筆資料?', '提示', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
      }).then(async() => {
          await this.$api.files.apiDeleteFile(fileid).then(async(response) => {
            this.$message('刪除成功')
            await this.getbufiles()
          })
       })
    },
    downloadbufile(fileid) {
      return "http://192.168.88.65:59119/basic/fileDownload/" + fileid
    },
    
  }
}
</script>

<style lang="scss" scoped>
.basicinfor-editor-container {
  padding: 15px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 155px);
  max-height: calc(100vh - 155px);
  overflow-y: auto;
  overflow-x: hidden;
  
  .block-wrapper {
    background: #fff;
    padding: 10px;
    margin-bottom: 32px;
    height: 750px;

    .el-tab-pane{
      height:600px;
      overflow-y: auto;
      overflow-x: hidden;
    }
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

}


@media (max-width:1024px) {
  .block-wrapper {
    padding: 8px;
  }
}
</style>