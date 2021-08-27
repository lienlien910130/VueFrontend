<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Building, Contactunit, Device, DeviceAddressManagement, DeviceType, Floors, Role, UsageOfFloor, User } from './object'

export default {
  name: 'App',
  created(){
    this.initsocket()
  },
  computed: {
    ...mapGetters([
        'wsmsg',
        'wsuserId',
        'buildingid',
        'id'
    ])
  },
  watch:{
    wsmsg:{
      handler:async function(){
          var data = JSON.parse(this.wsmsg.data)
          if(data.Data.Id !== this.wsuserId && data.DataType == 'building'){ //不是自己傳送的訊息 && 建築物清單不須判斷是否有選擇建築物
            this.handleBuilding(data.SendType, data.Data.Bid, data.Data.Content)
          }else if(data.Data.Id !== this.wsuserId && data.Data.Bid == this.buildingid){ //不是自己傳送的 && 判斷是否有選擇建築物=更動的建築物
              console.log('收到別人的訊息!', data.DataType)
                switch(data.DataType){
                  case 'roles':
                    this.handleRoles(data.SendType, data.Data.Content)
                    break;
                  case 'menus':
                    this.handleMenus(data.SendType, data.Data.Content)
                    break;
                  case 'setting':
                    this.handleSetting(data.SendType, data.Data.Content)
                    break;
                  case 'floor':
                    this.handleFloor(data.SendType, data.Data.Content)
                    break;
                  case 'contactUnit':
                    this.handleContactUnit(data.SendType, data.Data.Content)
                    break;
                  case 'houseHolder':
                    this.handleHouseHolder(data.SendType, data.Data.Content)
                    break;
                  case 'floorOfHouse':
                    this.handleFloorOfHouse(data.SendType, data.Data.Content)
                    break;
                  case 'device':
                    this.handleDevice(data.SendType, data.Data.Content)
                    break;
                  case 'deviceType':
                    this.handleDeviceType(data.SendType, data.Data.Content)
                    break;
                  case 'deviceAddress':
                    this.handleDeviceAddress(data.SendType, data.Data.Content)
                    break;
                }
          }
          
      },
      immediate:true
    }
  },
  methods: {
    initsocket(){
      //this.localSocket()
      if ("WebSocket" in window){
        this.$socket.initWebSocket()
      }else{
        console.log("您的瀏覽器不支援 WebSocket!")
      }
    },
    handleRoles(index,content){
      console.log('handleRoles',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateRole', new Role(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteRole',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addRole', new Array(new Role(content)))
      }else if(index == 'uploadExcelSave'){
        this.$store.dispatch('building/addRole', content.map(item=>{ return new Role(item)}))
      }
    },
    handleMenus(index,content){
      console.log('handleMenus',index,content)
      if(index == 'reset'){ //切換頁面的同時重新載入選單並儲存
        this.$store.dispatch('permission/setneedreload', true)
      }else if(index == 'routes'){
        this.$store.dispatch('permission/setRoutes')
      }
    },
    handleSetting(index,content){
      console.log('handleSetting',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateOption', content)
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteOption',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addOption', content)
      }
    },
    handleBuilding(index,bid,content){
      console.log('handleBuilding',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateBuildingList', new Building(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteBuildingList',content)
      }else if(index == 'create'){
        if(this.id == '1'){ //系統管理員
          this.$store.dispatch('building/addBuildingList', new Building(content))
        }
      }else if(index == 'info'){
        if(bid == this.buildingid){
          this.$store.dispatch('building/setBuildingInfo', new Building(content))
        }
      }else if(index == 'set'){
        if(this.id == '1'){ //系統管理員
          var array = content.map(item=>{ return new Building(item)})
          this.$store.dispatch('building/setBuildingList', array)
        }
      }
    },
    handleFloor(index,content){
      console.log('handleSetting',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateFloor', new Floors(content))
      }
    },
    handleContactUnit(index,content){
      console.log('handleContactUnit',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateContactunit', new Contactunit(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteContactunit',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addContactunit',new Array(new Contactunit(content)))
      }else if(index == 'uploadExcelSave'){
        this.$store.dispatch('building/addContactunit', content.map(item=>{ return new Contactunit(item)}))
      }
    },
    handleHouseHolder(index,content){
      console.log('handleHouseHolder',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateHouseHolder', new User(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteHouseHolder',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addHouseHolder', new Array(new User(content)))
      }else if(index == 'uploadExcelSave'){
        this.$store.dispatch('building/addHouseHolder', content.map(item=>{ return new User(item)}))
      }
    },
    handleFloorOfHouse(index,content){
      console.log('handleFloorOfHouse',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateFloorOfHouse', new UsageOfFloor(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteFloorOfHouse',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addFloorOfHouse', new Array(new UsageOfFloor(content)))
      }else if(index == 'uploadExcelSave'){
        this.$store.dispatch('building/addFloorOfHouse', content.map(item=>{ return new UsageOfFloor(item)}))
      }
    },
    handleDevice(index,content){
      console.log('handleDevice',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateDevice', new Device(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteDevice',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addDevice', new Array(new Device(content)))
      }else if(index == 'uploadExcelSave'){
        this.$store.dispatch('building/addDevice', content.map(item=>{ return new Device(item)}))
      }
    },
    handleDeviceType(index,content){
      console.log('handleDeviceType',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateDeviceType', new DeviceType(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteDeviceType',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addDeviceType', new Array(new DeviceType(content)))
      }else if(index == 'uploadExcelSave'){
        this.$store.dispatch('building/addDeviceType', content.map(item=>{ return new DeviceType(item)}))
      }
    },
    handleDeviceAddress(index,content){
      console.log('handleDeviceAddress',index,content)
      if(index == 'update'){
        this.$store.dispatch('building/updateAddressManagement', new DeviceAddressManagement(content))
      }else if(index == 'delete'){
        this.$store.dispatch('building/deleteAddressManagement',content)
      }else if(index == 'create'){
        this.$store.dispatch('building/addAddressManagement', new Array(new DeviceAddressManagement(content)))
      }
    }
  }
    
}
</script>
<style scoped>
#app::-webkit-scrollbar {  
width: 0 !important;  
}  
#app::-webkit-scrollbar {  
width: 0 !important;height: 0;  
}  

</style>

<style lang="scss">
.editor-container{
  padding: 15px;
  background-color: rgb(209, 226, 236);
  position: relative;
  min-height: calc(100vh - 50px);

  .block-wrapper{
    background: #fff;
    padding: 15px 15px;
    height: 100%;
  }
  .floornotMobile{
    background: #fff;
    padding: 10px;
    height: 750px;
    overflow-x:hidden;
    overflow-y:auto;
  }
}

.el-upload-list{
  height:500px;
  overflow-y: auto;
  overflow-x: hidden;
}
.el-form-item{
  margin-bottom: 18px;
}
.el-form-item__label{
  font-size: 18px;
}
.el-form-item__content{
  font-size: 18px;
}
.el-button--primary{
  background:rgb(0,140,214);
  color:white;
}
.el-button--info{
  background:white;
  color:black;
}
.el-button--success{
  background:rgb(171,205,3);
  color:white;
}
.el-button+.el-button{
  margin-left: 5px;
}
.el-button{
  margin: 5px;
}
.el-tabs--border-card>.el-tabs__header{
  background-color:rgb(237,237,237);
}
.el-link{
  font-size: 16px;
}

.el-table .cell{
  font-size: 18px;
}
.el-checkbox__label{
  font-size: 18px;
}
.el-message-box {
    width: 400px;
}

.el-tree {
  color: black;
  background: transparent;
  font-size: 20px;
  margin:10px;
}
.custom-tree-node{
    margin: 5px;
    width:100%;
}
/* 设置三角形图标的颜色 */
.el-tree-node__expand-icon {
  color: black;
  font-size: 25px;
}

/* 树节点鼠标悬浮式改变背景色，字体颜色 */
.el-tree-node__content:hover {
  background-color: rgb(202, 191 , 220);
  color: rgb(29, 4, 4);
}
 
/* 改变节点高度 */
.el-tree-node__content {
  height: 30px;
}
 
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: lightgray;
  color:black;
}
.el-tree-node .is-focusable .is-checked{
background-color:rgb(147, 180 , 197);
  color: black;
}
/* 设置树形最外层的背景颜色和字体颜色 */
.el-tree {
  color: black;
  background: transparent;
  font-size: 20px;
  margin:10px;
}
.custom-tree-node{
    margin: 5px;
    width:100%;
}
/* 设置三角形图标的颜色 */
.el-tree-node__expand-icon {
  color: black;
  font-size: 25px;
}

/* 树节点鼠标悬浮式改变背景色，字体颜色 */
.el-tree-node__content:hover {
  background-color: rgb(202, 191 , 220);
  color: rgb(29, 4, 4);
}
 
/* 改变节点高度 */
.el-tree-node__content {
  height: 30px;
}
 
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: lightgray;
  color:black;
}
.el-tree-node .is-focusable .is-checked{
background-color:rgb(147, 180 , 197);
  color: black;
}


@media (max-width: 767px) {
  .el-message-box{
    width:90%
  }
}
</style>