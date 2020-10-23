<template>
    <div class="basicinfor-container">
        <div class="basicinfor-editor-container">
            <el-row :gutter="32">
                <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="block-wrapper">
                        <p>基本資料</p>
                        <Form 
                        v-bind="formAttrs" v-on="formEvent"
                        />
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper">
                        <el-tabs v-model="activeName" style="margin-top:15px;margin-bottom:15px;" type="border-card" 
                        @tab-click="handleClick">
                            <el-tab-pane 
                            v-for="(item,index) in InforOptions" 
                            :key="item.key" :label="item.label" :name="item.key"
                            >
                                <Select style="margin-bottom: 20px;" 
                                v-if="index !== 0"
                                v-bind="selectAttrs" v-on="selectEvent"
                                />

                                <keep-alive>
                                 <Block v-bind="blockAttrs" v-on="blockEvent" ></Block>
                                </keep-alive>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="7">
                    <div class="block-wrapper" >
                        <p>大樓樓層</p>
                        <Range v-bind="rangeAttrs" v-on="rangeEvent"></Range>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24" :lg="17">
                    <div class="block-wrapper">
                        <el-tabs v-model="activeFloor" style="margin-top:15px;margin-bottom:15px;" type="border-card">
                            <el-tab-pane v-for="item in FloorOptions" :key="item.key" :label="item.label" :name="item.key">
                                <keep-alive>
                                  <component 
                                  v-bind:is="tabView" 
                                  v-bind="floorAttrs" 
                                  v-on="floorEvent"
                                  :floorinformation="floorinformation"
                                  :image="image"
                                  ></component>  
                                </keep-alive>
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
import { 
edituserList,creuserList,deluserList, floorImage, getBuildinguser,

  } from '@/api/building'
 
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
    Dialog:() => import('@/components/Dialog/index.vue')
  },
  computed: {
    ...mapGetters([
        'id',
        'buildingid'
    ]),
    formAttrs() {
      return {
        selectData: this.userselectData
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
        selectData: this.userselectData,
        isChoose:this.isChoose,
        originFiles:this.originFiles
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
        selectData: this.selectData
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
    }
    
  },
  data() {
    return {
      InforOptions: [
        { label: '管委會', key: 'MC' },
        { label: '廠商資料', key: 'vender' }
      ],
      FloorOptions:[
        { label: '基本資料', key: 'IN' },
        { label: '樓層平面圖', key: 'IM' },
        { label: '相關資料', key: 'OT' }
      ],
      activeName: 'MC',
      activeFloor:'IN',
      tabView:'FloorBlock',
      allfloor:'',
      floorinformation:'',
      image:'',
      tableConfig: [
          { label:'所屬單位' , prop:'usageOfFloorId',format:'manageselect', mandatory:true, message:'請選擇單位',trigger:'change' },
          { label:'職稱' , prop:'title',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'姓名' , prop:'userName',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'電話' , prop:'callNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'緊急電話' , prop:'emergencyNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'備註' , prop:'note',type:'string', mandatory:false}],
      floorConfig: [
          { label:'戶號' , prop:'houseNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'場所名稱' , prop:'placeName',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'緊急連絡人' , prop:'name',format:'hide'},
          { label:'電話' , prop:'cellphonenumber',format:'hide'},
          { label:'收容人數' , prop:'capacity',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'備註' , prop:'note',type:'string',mandatory:false},
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
      originFiles:[]
    }
  },
  watch: {
    buildingid: function(val){
      this.init() 
    },
    activeFloor(val){ 
      if(val == 'IN'){
        this.tabView = 'FloorBlock'
        this.getfloorList()
      }else if(val == 'IM'){
        this.tabView = 'Floor'
        this.getFloorImage()
      }else {
        this.tabView = 'Other'
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.activeName = 'MC'
      this.getManagementList()
      this.gethouseOption()
    },
    handleClick(tab, event){
      if(tab.index == 0){
         this.tableConfig= [
          { label:'所屬單位' , prop:'usageOfFloorId',format:'manageselect', mandatory:true, message:'請選擇單位',trigger:'change' },
          { label:'職稱' , prop:'title',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'姓名' , prop:'userName',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur'},
          { label:'電話' , prop:'callNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'緊急電話' , prop:'emergencyNumber',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'備註' , prop:'note',type:'string', mandatory:false}]
        this.getManagementList()
        this.gethouseOption()
      }else{
        this.tableConfig = [
          { label:'公司名稱' , prop:'name',type:'string', mandatory:true, message:'請輸入內容'},
          { label:'類別' , prop:'type', format:'contactunitselect', mandatory:true, message:'請選擇類別'},
          { label:'電話' , prop:'contactNumber',type:'string', mandatory:true, message:'請輸入內容',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'地址' , prop:'address',type:'string', mandatory:true, message:'請輸入內容'},
          { label:'備註' , prop:'note',type:'string', mandatory:false},
          { label:'狀態' , prop:'collaborate', format:'tag', type:'boolean', mandatory:false, message:'請輸入內容',typemessage:'',isPattern: false }
        ]
        this.getcontactunitList()
        this.getcontactunitOption()
      }
    },
    getManagementList() { //取得管委會
      this.blockData = []
      this.$api.building.apiGetCommittee().then(response => {
        this.blockData = response.result
        this.origin = JSON.stringify(this.blockData)
        this.title = 'Management'
        this.$forceUpdate()
      })
    },
    getcontactunitList(){ //取得廠商資料
      this.blockData = []
      this.$api.building.apiGetContactUnit().then(response => {
        this.blockData = response.result.sort((x,y) => y.collaborate - x.collaborate)
        this.origin = JSON.stringify(this.blockData)
        this.title = 'ContactUnit'
        this.$forceUpdate()
      })
    },
    gethouseOption(){ //取得大樓所有門牌
      this.options = []
      this.$api.building.apiGetBuildingOfHouse().then(response=>{
        response.result.forEach(item => {
          let _array = {
            id:item.id,
            label:item.houseNumber,
            value:item.id
          }
          this.options.push(_array)
        })
        this.selectData = this.options
        console.log('selectData=>'+JSON.stringify(this.selectData))
      })
    },
    getcontactunitOption(){ //取得大樓的廠商分類
      this.options = []
      this.$api.building.apiGetContactUnitOption().then(response => {
        response.result.forEach(item => {
              let _array = { 
                  id : item.id, 
                  label: item.textName, 
                  value: item.id
              }
              this.options.push(_array)  
            })
          this.selectData = this.options
      })
    },
    getBuildinguser(){ //取得大樓的所有用戶資料
      this.useroptions = []
      this.$api.building.apiGetAllBuildingOfUser().then(response=>{
        response.result.forEach(item => {
          let _array = {
            id:item.id,
            label:item.name,
            value:item.id
          }
          this.useroptions.push(_array)
        })
        this.userselectData = this.useroptions
      })
    },
    getuser(userid){ //取得特定用戶資料
      this.$api.building.apiGetUser(userid).then(response => {
        this.innerVisible = true
        this.userdata = response.result[0]
        this.dialogStatus = 'update'
      })
    },
    getfloorList(){ //取得樓層資料
      this.floorData = []
      this.$api.building.apiGetFloorOfHouse(this.selectfloor).then(response => {
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
    getusageofFloorfiles(usageofFloorid){ //取得門牌檔案
      var _originFiles = []
      this.$api.files.apiGetFloorOfHouseFiles(usageofFloorid).then(response=>{
        response.result.forEach( item => {
          _originFiles.push(item)
        })
        this.originFiles = _originFiles
        console.log('originFiles=>'+JSON.stringify(this.originFiles))
      })
    },

    handleSelectOption(content){ //廠商分類相關操作
      const array =  JSON.parse(this.origin)
      if(content !== undefined){
        this.blockData = array.filter((item, index) => 
        item.type == content[0].id )
      }else{
        this.blockData = array
      }
    },
    handleFormOption(index, content){ //基本資料相關操作
      if(index == 'edit' || index == 'refreshUser'){
        this.getBuildinguser()
      }else if (index == 'createUser'){
        this.userdata = []
        this.dialogStatus = 'create'
        this.innerVisible = true
      }else {
        this.getuser(content)
      }
    },
    handleBlockOption(index, content) { //管委會、廠商資料相關操作
      console.log(index,JSON.stringify(content))
      if (index === 'update') {
        if(this.activeName === 'MC'){
          var unit = {
            id:content.usageOfFloorId
          }
          this.$delete(content,'linkUsageOfFloors')
          this.$set(content,"linkUsageOfFloors",unit)
          this.$api.building.apiPatchCommittee(content).then(response => {
            this.$message('更新成功')
            this.getManagementList()
          })
        }else{
          this.$api.building.apiPatchContactUnit(content).then(response => {
            this.$message('更新成功')
            this.getcontactunitList()
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
          this.$api.building.apiPostCommittee(content).then(response => {
            this.$message('新增成功')
            this.getManagementList()
          })
        }else{
          this.$api.building.apiPostContactUnit(content).then(response => {
            this.$message('新增成功')
            this.getcontactunitList()
          })
        }
      }else{
        if(this.activeName === 'MC'){
          this.$api.building.apiDeleteCommittee(content).then(response => {
            this.$message('刪除成功')
            this.getManagementList()
          })
        }else{
          this.$api.building.apiDeleteContactUnit(content).then(response => {
            this.$message('刪除成功')
            this.getcontactunitList()
          })
        }
      }
    },
    handleFloorTableOption(index, content) { //樓層門牌相關操作
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
        this.$api.building.apiPatchFloorOfHouse(content).then(response => {
          this.$message('更新成功')
          this.getfloorList()
          })
      }else if(index === 'create') {
        this.$api.building.apiPostFloorOfHouse(this.selectfloor,content).then(response => {
            this.$message('新增成功')
            this.getfloorList()
            this.gethouseOption()
          })
      }else if (index === 'createUser'){
          this.userdata = []
          this.innerVisible = true
          this.dialogStatus = 'create'
      }else if(index === 'openUser'){
          this.getuser(content)
      }else if(index === 'getfiles'){
        this.getusageofFloorfiles(content)
      }else if(index === 'fileupload'){ 
          const formData = new FormData();
          content.file.forEach(item => {
            formData.append('file', item.raw)
          })
          this.$api.files.apiPostFloorOfHouseFiles(content.id,formData).then(response=>{
            this.getusageofFloorfiles(content.id)
          })
      }else if(index == 'deletefile'){
        this.$api.files.apiDeleteFile(content.fileid).then(response =>{
          this.$message('刪除成功')
          this.getusageofFloorfiles(content.id)
        })
      }else{
        this.$api.building.apiDeleteFloorOfHouse(content).then(response=>{
            this.$message('刪除成功')
            this.getfloorList()
            this.gethouseOption()
          })
      }
    },
    handleUserOption(index, content){ //大樓住戶相關操作
      if(index === 'cancel'){
        this.innerVisible = false
      }else if(index === 'create'){
        if(content === ''){
          this.userdata = []
          this.dialogStatus = 'create'
        }else{
          creuserList(content).then(response => {
            this.$message('新增成功')
            this.innerVisible = false
            this.getBuildinguser()
          }).catch(error => {
            console.log("error=>"+error)
          })
        }
      }else{
        edituserList(content).then(response => {
          this.$message('更新成功')
          this.innerVisible = false
          this.getBuildinguser()
        }).catch(error => {
          console.log("error=>"+error);
        })
      }
    },
    handleRangeOption(content){ //選擇樓層後的操作
      this.isChoose = true
      this.selectfloor = content
      this.getfloorList()
      this.getBuildinguser()
    }
    
    
  }
}
</script>

<style lang="scss" scoped>
.basicinfor-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  min-height: calc(100vh - 85px);

  .block-wrapper {
    background: #fff;
    padding: 0px 16px 15px;
    margin-bottom: 32px;
    height: 800px;
    overflow-x:hidden;
    overflow-y:auto;
  }

}


@media (max-width:1024px) {
  .block-wrapper {
    padding: 8px;
  }
}
</style>