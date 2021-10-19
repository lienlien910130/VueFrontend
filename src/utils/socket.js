
import store from '../store'
import { Account, Building, Contactunit, Device, DeviceAddressManagement, DeviceType, Floors, Role, UsageOfFloor, User } from '../object'
import moment from 'moment';
 let wsConnection = {
   backWs:{
      $ws: null,
      lockReturn: false,
      timeout: 60 * 1000 * 5,
      timeoutObj: null,
      timeoutNum: null,
      serverTimeoutObj: null,
   },
   dataWs:{
      $ws: null,
      lockReturn: false,
      timeout: 60 * 1000 * 5,
      timeoutObj: null,
      timeoutNum: null,
      serverTimeoutObj: null,
   },
   //初始化websocket
   initWebSocket: function () {
      let _this = this;
      //back
      let backIP = '192.168.88.110'
      let backPort = '5000'
      let backWsProtocol = 'clRywHL4CrkA3OUw7qBoFMhx6ZG1bDXTskdhZP6qc07D3U54D6I6FQSEkgHODJUPM3ZcUocC7m64O2XcZYT8VBX4SoHpfiYfkiop2cvRBFzG5jFLTQ98RI2rJe8wiIZz'
      // this.backWs.$ws = new WebSocket('ws://'+backIP+':'+backPort+'/', backWsProtocol);
      this.backWs.$ws = new WebSocket(process.env.VUE_APP_WEBSOCKET, backWsProtocol);
      this.backWs.$ws.onopen = function(){
        console.log('ws open-BACK')
        wsConnection.startWsHeartbeat(_this.backWs)
      }
      this.backWs.$ws.onclose = function(){
        console.log('ws close-BACK')
        wsConnection.reconnect(_this.backWs)
      }
      this.backWs.$ws.onmessage = function(msg){
        console.log('ws message-BACK')
        console.log(msg)
        var data = JSON.parse(msg.data)
        wsConnection.resetHeartbeat(_this.backWs)
        console.log(data)
        data.address.forEach(element => {
          var mode = ''
          var label = ''
          if(data.mode == 'main'){
            mode = '防災盤'
            label = element.internet + '-' + element.memeryLoc
          }else if(data.mode == 'locPlc'){
            mode = 'PLC'
            label = element.system + '-' + element.memeryLoc
          }else if(data.mode == 'loc'){
            mode = '火警'
            
          }
          store.dispatch('websocket/sendMsg',{
            mode:mode,
            date:moment(new Date()).format('YYYY/MM/DD HH:mm:ss'),
            action:element.status,
            point:label
          })
        })
        store.dispatch('websocket/sendActions',msg.data)
        // store.dispatch('websocket/sendMsg',data)
      }
      this.backWs.$ws.onerror = function(){
        wsConnection.reconnect(_this.backWs)
      }
      //前端給前端內部溝通
      let dataWsProtocol = 'JonUmZbPuQj69GnQdefx6w1ygkeU8PkzHO0EknOSdTmTYEhgg7HpDOeniThA96f4PlGlGFKBsVSbICqlEsb91xf15tVt7FGddY80p6AfcBIknQqsEWiPhKf9hByJL1Vt'
      // this.dataWs.$ws = new WebSocket('ws://'+wsIP+':'+wsPort+'/', dataWsProtocol);
      this.dataWs.$ws = new WebSocket(process.env.VUE_APP_WEBSOCKET, dataWsProtocol);
      this.dataWs.$ws.onopen = function(){
        console.log('ws open')
        wsConnection.startWsHeartbeat(_this.dataWs)
      }
      this.dataWs.$ws.onclose = function(){
        console.log('ws close')
        wsConnection.reconnect(_this.dataWs)
      }
      this.dataWs.$ws.onmessage = function(msg){
        console.log('ws message')
        console.log(msg)
        wsConnection.resetHeartbeat(_this.dataWs)
        var data = JSON.parse(msg.data)
        if(data.SenderName == 'MercuryfireWS65'){
          store.dispatch('websocket/saveUserId',data.Id)
        }else{
          getMessage(msg)
        }
        // store.dispatch('websocket/sendMsg',msg)
      }
      this.dataWs.$ws.onerror = function(){
        wsConnection.reconnect(_this.dataWs)
      }
   },
   //重啟
   reconnect: function (ws) {
     let _this = this
     if (ws.lockReturn) {
       return
     }
     ws.lockReturn = true
     ws.timeoutNum && clearTimeout(ws.timeoutNum)
     ws.timeoutNum = setTimeout(function () {
       _this.initWebSocket()
       ws.lockReturn = false
     }, 3000)
   },
   //開啟心跳
   startWsHeartbeat: function (ws) {
     let _this = this
     ws.timeoutObj && clearTimeout(ws.timeoutObj)
     ws.serverTimeoutObj && clearTimeout(ws.serverTimeoutObj)
     ws.timeoutObj = setInterval(function () {
       //判斷當前的狀態
       if (ws.$ws.readyState != 1) {
         _this.reconnect(ws)
       }
     }, ws.timeout)
   },
   //重置心跳
   resetHeartbeat: function (ws) {
     let _this = this
     clearTimeout(ws.timeoutObj)
     clearTimeout(ws.serverTimeoutObj)
     _this.startWsHeartbeat(ws)
   },
   //內部發送訊息
   sendMsg: function(dataType, sendType, content, Bid = null){
      let _this = this
      const msg = {
        DataType:dataType,
        SendType:sendType,
        SenderName:store.getters.name,
        Data:{
          Id: store.getters.wsuserId,
          Bid: Bid == null ? store.getters.buildingid : Bid,
          Content: content
        }
      }
      _this.dataWs.$ws.send(JSON.stringify(msg))
   }
 }

 function getMessage(msg){
    var data = JSON.parse(msg.data)
    console.log('getMessage',data.Data.Id, store.getters.wsuserId)
    if(data.Data.Id !== undefined && data.Data.Id !== store.getters.wsuserId){
      console.log('收到別人的訊息!', data.DataType)
      if(data.DataType == 'building' || data.DataType == 'account'){
        switch(data.DataType){
          case 'building':
            handleBuilding(data.SendType, data.Data.Bid, data.Data.Content)
            break;
          case 'account':
            handleAccount(data.SendType, data.Data.Content)
            break;
        }
      }else if(data.Data.Bid == store.getters.buildingid){
        switch(data.DataType){
            case 'roles':
              handleRoles(data.SendType, data.Data.Content)
              break;
            case 'menus':
              handleMenus(data.SendType, data.Data.Content)
              break;
            case 'setting':
              handleSetting(data.SendType, data.Data.Content)
              break;
            case 'floor':
              handleFloor(data.SendType, data.Data.Content)
              break;
            case 'contactUnit':
              handleContactUnit(data.SendType, data.Data.Content)
              break;
            case 'houseHolder':
              handleHouseHolder(data.SendType, data.Data.Content)
              break;
            case 'floorOfHouse':
              handleFloorOfHouse(data.SendType, data.Data.Content)
              break;
            case 'device':
              handleDevice(data.SendType, data.Data.Content)
              break;
            case 'deviceType':
              handleDeviceType(data.SendType, data.Data.Content)
              break;
            case 'deviceAddress':
              handleDeviceAddress(data.SendType, data.Data.Content)
              break;
            case 'graphic':
              handleGraphic(msg)
              break;
        }
      }
    }
 }

 function handleRoles(index,content){
  console.log('handleRoles',index,content)
  if(index == 'update'  || index == 'updateManySave'){
    store.dispatch('building/updateRole', new Role(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteRole',content)
  }else if(index == 'create'){
    store.dispatch('building/addRole', new Array(new Role(content)))
  }else if(index == 'uploadExcelSave'){
    store.dispatch('building/addRole', content.map(item=>{ return new Role(item)}))
  }
}
function handleAccount(index,content){
  console.log('handleAccount',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateAccount', new Account(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteAccount',content)
  }else if(index == 'create'){
    store.dispatch('building/addAccount', new Array(new Account(content)))
  }else if(index == 'uploadExcelSave'){
    store.dispatch('building/addAccount', content.map(item=>{ return new Account(item)}))
  }
}
function handleMenus(index,content){
  console.log('handleMenus',index,content)
  if(index == 'reset'){ //切換頁面的同時重新載入選單並儲存
    store.dispatch('permission/setneedreload', true)
  }else if(index == 'routes'){
    store.dispatch('permission/setRoutes')
  }
}
function handleSetting(index,content){
  console.log('handleSetting',index,content)
  if(index == 'update'){
    store.dispatch('building/updateOption', content)
  }else if(index == 'delete'){
    store.dispatch('building/deleteOption',content)
  }else if(index == 'create'){
    store.dispatch('building/addOption', content)
  }
}
function handleBuilding(index,bid,content){
  console.log('handleBuilding',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateBuildingList', new Building(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteBuildingList',content)
  }else if(index == 'create'){
    if(store.getters.id == '1'){ //系統管理員
      store.dispatch('building/addBuildingList', new Building(content))
    }
  }else if(index == 'info'){
    if(bid == store.getters.buildingid){
      store.dispatch('building/setBuildingInfo', new Building(content))
    }
  }else if(index == 'set'){
    if(store.getters.id == '1'){ //系統管理員
      var array = content.map(item=>{ return new Building(item)})
      store.dispatch('building/setBuildingList', array)
    }
  }
}
function handleFloor(index,content){
  console.log('handleSetting',index,content)
  if(index == 'update'){
    store.dispatch('building/updateFloor', new Floors(content))
  }
}
function handleContactUnit(index,content){
  console.log('handleContactUnit',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateContactunit', new Contactunit(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteContactunit',content)
  }else if(index == 'create'){
    store.dispatch('building/addContactunit',new Array(new Contactunit(content)))
  }else if(index == 'uploadExcelSave'){
    store.dispatch('building/addContactunit', content.map(item=>{ return new Contactunit(item)}))
  }
}
function handleHouseHolder(index,content){
  console.log('handleHouseHolder',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateHouseHolder', new User(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteHouseHolder',content)
  }else if(index == 'create'){
    store.dispatch('building/addHouseHolder', new Array(new User(content)))
  }else if(index == 'uploadExcelSave'){
    store.dispatch('building/addHouseHolder', content.map(item=>{ return new User(item)}))
  }
}
function handleFloorOfHouse(index,content){
  console.log('handleFloorOfHouse',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateFloorOfHouse', new UsageOfFloor(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteFloorOfHouse',content)
  }else if(index == 'create'){
    store.dispatch('building/addFloorOfHouse', new Array(new UsageOfFloor(content)))
  }else if(index == 'uploadExcelSave'){
    store.dispatch('building/addFloorOfHouse', content.map(item=>{ return new UsageOfFloor(item)}))
  }
}
function handleDevice(index,content){
  console.log('handleDevice',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateDevice', new Device(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteDevice',content)
  }else if(index == 'create'){
    store.dispatch('building/addDevice', new Array(new Device(content)))
  }else if(index == 'uploadExcelSave'){
    store.dispatch('building/addDevice', content.map(item=>{ return new Device(item)}))
  }
}
function handleDeviceType(index,content){
  console.log('handleDeviceType',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateDeviceType', new DeviceType(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteDeviceType',content)
  }else if(index == 'create'){
    store.dispatch('building/addDeviceType', new Array(new DeviceType(content)))
  }else if(index == 'uploadExcelSave'){
    store.dispatch('building/addDeviceType', content.map(item=>{ return new DeviceType(item)}))
  }
}
function handleDeviceAddress(index,content){
  console.log('handleDeviceAddress',index,content)
  if(index == 'update' || index == 'updateManySave'){
    store.dispatch('building/updateAddressManagement', new DeviceAddressManagement(content))
  }else if(index == 'delete'){
    store.dispatch('building/deleteAddressManagement',content)
  }else if(index == 'create'){
    store.dispatch('building/addAddressManagement', new Array(new DeviceAddressManagement(content)))
  }
}
function handleGraphic(msg){
  console.log('handleGraphic',msg)
  store.dispatch('websocket/sendGraphicMsg',msg)
}

export default wsConnection
