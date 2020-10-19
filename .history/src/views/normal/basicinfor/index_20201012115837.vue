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
                        <Range v-on:setrange="setrange" :floor="floor"/>

                        <div class="floordiv" 
                          v-for="item in divfloor" 
                          :key="item" 
                          @click="selectFloorDiv(item)"
                          @mouseover="addClassload(item)"
                          @mouseleave="removeClassload(item)"
                          :class="[{ active:classenable && item == current },{ select:item == selectfloor }]"
                        >
                          <span v-if="item > 0 ">{{ item }} F</span>
                          <span v-else>B{{ -(item) }} F</span>
                        </div>
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
import { getbuilding, getbuInfo , getselectOption ,
getmanagementList, editmanagementList ,cremanagementList,delmanagementList,
getcontactunitList, editcontactunitList,crecontactunitList,delcontactunitList,
 getfloorList, getfloor, editfloorList ,crefloorList ,delfloorList,
 getuserList, edituserList,creuserList,deluserList, floorImage, getBuildinguser
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
        information: this.information,
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
        selectData: this.userselectData
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
        title:'ContactUnit',
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
        innerVisible: this.innerVisible,
        userdata: this.userdata,
        dialogStatus: this.dialogStatus
      }
    },
    dialogEvent(){
      return{
        subUserButton: this.handleUserOption
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
      information:[],
      divfloor:[],
      floor:[],
      hover: false,
      current:0,
      classenable:false,
      currentrange:1,
      tabView:'FloorBlock',
      selectfloor:'',
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
          { label:'樓層' , prop:'floor',format:'floor',type:'string', mandatory:true, message:'請輸入內容', trigger: 'blur',pattern:'^[0-9]*$',errorMsg:'請輸入數字',isPattern: true},
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
      rules: [],
      selectData:[],
      userselectData:[],
      options:[],
      useroptions:[],
      blockData:[],
      origin:[],
      innerVisible:false,
      userdata:[],
      dialogStatus:''
    }
  },
  watch: {
    buildingid: function(val){
      this.init() 
    },
    activeFloor(val){ 
      if(val == 'IN'){
        this.tabView = 'FloorBlock'
        this.getFloorList()
      }else if(val == 'IM'){
        this.tabView = 'Floor'
        this.getFloorImage()
      }else {
        this.tabView = 'Other'
      }
    },
    floor: function(){
      this.setFloorDiv(1)
      this.selectfloor = ''
    },
    selectfloor: function(){
      if(this.activeFloor == 'IN'){
        this.getFloorList()
        this.getuserOption()
      }else if(this.activeFloor == 'IM'){
        this.getFloorImage()
      }else {

      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      this.activeName = 'MC'
      this.getbuInfo()
      this.getManagementList()
      this.gethouseOption()
    },
    getbuInfo() {
      getbuInfo(this.id,this.buildingid).then(response => {
        this.information = response.result[0]
        this.floor = [ response.result[0].floorsOfAboveGround , response.result[0].floorsOfUnderground , '0']
      })
    },
    setrange(val) {
      this.currentrange = val
      this.setFloorDiv(val)
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
          { label:'類別' , prop:'type', format:'select', mandatory:true, message:'請選擇類別'},
          { label:'電話' , prop:'contactNumber',type:'string', mandatory:true, message:'請輸入內容',pattern:'^[0-9]{10}$',errorMsg:'請輸入10位數',isPattern: true},
          { label:'地址' , prop:'address',type:'string', mandatory:true, message:'請輸入內容'},
          { label:'備註' , prop:'note',type:'string', mandatory:false},
          { label:'狀態' , prop:'collaborate', format:'tag', type:'boolean', mandatory:false, message:'請輸入內容',typemessage:'',isPattern: false }
        ]
        this.getcontactunitList()
        this.getselectOption()
      }
    },
    getFloorList(){
      this.floorData = []
      getfloorList(this.buildingid,this.selectfloor).then(response => {
        console.log('//'+JSON.stringify(response))
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
    getFloorImage(){
      
    },
    setFloorDiv(val) {
      const up = this.information.floorsOfAboveGround
      const down = this.information.floorsOfUnderground
      const nofloor = ['0'] //this.information.floor[2].split(",") //沒有的樓層
      const array = []
      this.divfloor = []
      if(val !== '0'){
        const end = parseInt(up) > parseInt(val)+9 ? parseInt(val)+9 : parseInt(up)
        for (let i = val; i <= end; i++){
          nofloor.find(item => {
            if(parseInt(item) !== i) {
              array.push(i)
            }
          })
        }
         this.divfloor = array.reverse()
      }else {
        for (let i = 1; i <= down; i++){
          nofloor.find(item => {
            if(parseInt(item) !== -i) {
              array.push(-i)
            }
          })
        }
        this.divfloor = array
      }
    },
    selectFloorDiv(val) {
      this.selectfloor = val
    },
    addClassload(index){
        this.classenable = true
        this.current = index;
    },
    removeClassload(index){
        this.classenable = false
        this.current = index;
    },
    getselectOption(){
      this.options = []
      getselectOption(this.buildingid).then(response => {
        response.result.forEach(item => {
              let _array = { 
                  id : item.id, 
                  label: item.textName, 
                  value: item.id,
                  type: item.value
              }
              this.options.push(_array)  
            })
          this.selectData = this.options
      }).catch(error=>{
        console.log('error=>'+error)
      })
    },
    gethouseOption(){
      this.options = []
      getfloor(this.buildingid).then(response=>{
        response.result.forEach(item => {
          let _array = {
            id:item.id,
            floor:item.floor,
            houseNumber:item.houseNumber,
            label:item.floor+'樓之'+item.houseNumber+'號',
            value:item.id
          }
          this.options.push(_array)
        })
        this.selectData = this.options
        console.log('selectData=>'+JSON.stringify(this.selectData))
      }).catch(error=>{
        console.log('error=>'+error)
      })
    },
    getuserOption(){
      this.useroptions = []
      getBuildinguser().then(response=>{
        response.result.forEach(item => {
          let _array = {
            id:item.id,
            label:item.name,
            value:item.id
          }
          this.useroptions.push(_array)
        })
        this.userselectData = this.useroptions
      }).catch(error=>{
        console.log('error=>'+error)
      })
    },
    handleSelectOption(content){
      const array =  JSON.parse(this.origin)
      if(content !== undefined){
        this.blockData = array.filter((item, index) => 
        item.type == content.type )
      }else{
        this.blockData = array
      }
    },
    handleFormOption(index, content){
      if(index == 'update'){
        this.getbuInfo()
      }else if(index == 'edit') {
        this.getuserOption()
      }else {
        getuserList(content).then(response => {
          this.innerVisible = true
          this.userdata = response.result[0]
          this.dialogStatus = 'update'
        }).catch(error=>{
          console.log("error=>"+error);
        })
      }
    },
    handleBlockOption(index, content) {
      console.log(index,JSON.stringify(content))
      if (index === 'update') {
        if(this.activeName === 'MC'){
          var unit = {
            id:content.usageOfFloorId
          }
          
          this.$delete(content,'linkUsageOfFloors')
          this.$set(content,"linkUsageOfFloors",unit)
          console.log(JSON.stringify(content))
          editmanagementList(JSON.stringify(content)).then(response => {
            this.$message('更新成功')
            this.getManagementList()
          }).catch( error => {
            console.log('error=>'+error)
          })
        }else{
          editcontactunitList(JSON.stringify(content)).then(response => {
            this.$message('更新成功')
            this.getcontactunitList()
          }).catch(error => {
            console.log('error=>'+error)
          })
        }
      }else if(index === 'create') {
        if(this.activeName === 'MC'){
          console.log(JSON.stringify(content))
          var unit = {
            id:content.unit
          }
          this.$set(content,"linkUsageOfFloors",unit)
          this.$delete(content,'unit')
          console.log(JSON.stringify(content))
          cremanagementList(this.buildingid,JSON.stringify(content)).then(response => {
            this.$message('新增成功')
            this.getManagementList()
          }).catch( error => {
            console.log('error=>'+error)
          })
        }else{
          crecontactunitList(this.buildingid,JSON.stringify(content)).then(response => {
            this.$message('新增成功')
            this.getcontactunitList()
          }).catch(error => {
            console.log('error=>'+error)
          })
        }
      }else{
        if(this.activeName === 'MC'){
          delmanagementList(content).then(response => {
            this.$message('刪除成功')
            this.getManagementList()
          }).catch( error => {
            console.log('error=>'+error)
          })
        }else{
          delcontactunitList(content).then(response => {
            this.$message('刪除成功')
            this.getcontactunitList()
          }).catch(error => {
            console.log('error=>'+error)
          })
        }
      }
    },
    handleFloorTableOption(index, content) {
      if(index === 'update' || index === 'create' ){
        this.$delete(content,'name')
        this.$delete(content,'cellphonenumber')
        var temp = [{
          id: content.linkOwners
        }]
        var _temp = [{
          id: content.linkUsers
        }]
        this.$set(content,'linkOwners',temp)
        this.$set(content,'linkUsers',_temp)
      }
      console.log(index,JSON.stringify(content))
     
      if (index === 'update') {
        editfloorList(JSON.stringify(content)).then(response => {
            this.$message('更新成功')
            this.getFloorList()
          }).catch(error => {
              console.log('error=>'+error)
        })
      }else if(index === 'create') {
        crefloorList(this.buildingid,JSON.stringify(content)).then(response => {
             console.log('response=>'+JSON.stringify(response))
            this.$message('新增成功')
            this.getFloorList()
          }).catch(error => {
            console.log('error=>'+error)
        })
      }else if (index === 'createUser'){
          this.userdata = []
          this.innerVisible = true
      }else if(index === 'openUser'){
          var _temp = []
            getuserList(content).then(response => {
              console.log('ss=>'+JSON.stringify(response))
              this._temp = response.result[0]
              this.$alert('<h3>聯絡人資料</h3><p>姓名:'+this._temp.name+
              '</p><p>電話:'+this._temp.callNumber+
              '</p><p>手機:'+this._temp.cellPhoneNumber+
              '</p><p>電子郵件:'+this._temp.email+
              '</p><p>備註:'+this._temp.note, {
                  dangerouslyUseHTMLString: true
              });
            }).catch(error=>{
                console.log("error=>"+error);
            })
            
      }else{
        delfloorList(content).then(response=>{
            this.$message('刪除成功')
            this.getFloorList()
          }).catch(error => {
            console.log('error=>'+error)
        })
      }
    },
    handleUserOption(index, content){
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
          }).catch(error => {
            console.log("error=>"+error);
          })
        }
      }else{
        edituserList(content).then(response => {
          this.$message('更新成功')
          this.innerVisible = false
        }).catch(error => {
          console.log("error=>"+error);
        })
      }
    },
    getManagementList() {
      this.blockData = []
      getmanagementList(this.buildingid).then(response => {
        console.log('getManagementList=>'+JSON.stringify(response))
        this.blockData = response.result
        this.origin = JSON.stringify(this.blockData)
        this.$forceUpdate()
      }).catch(error => {
        console.log("error=>"+error);
      })
    },
    getcontactunitList(){
      this.blockData = []
      getcontactunitList(this.buildingid).then(response => {
        this.blockData = response.result.sort((x,y) => y.collaborate - x.collaborate)
        this.origin = JSON.stringify(this.blockData)
        this.$forceUpdate()
      }).catch(error => {
        console.log("error=>"+error);
      })
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

  .floordiv{
    width: 100% ;
    height: 50px;
    background-color:darkgray;
    border: 2px solid black;
    text-align: center;
    vertical-align: middle;
    color: white;
    font-weight:bold;
    font-size: 30px;
    line-height:50px;
  }
  .active {
    background: rgb(0, 110 , 163);
    cursor: pointer;
  }
  .select {
    background: red;
  }
  
}


@media (max-width:1024px) {
  .block-wrapper {
    padding: 8px;
  }
}
</style>