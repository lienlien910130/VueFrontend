
import store from '../store'

 let wsConnection = {
   plcWs:{
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
      let wsIP = '192.168.88.65'
      let wsPort = '59119'
      let wsPath = ''
      //plc
      let plcWsProtocol = 'clRywHL4CrkA3OUw7qBoFMhx6ZG1bDXTskdhZP6qc07D3U54D6I6FQSEkgHODJUPM3ZcUocC7m64O2XcZYT8VBX4SoHpfiYfkiop2cvRBFzG5jFLTQ98RI2rJe8wiIZz'
      this.plcWs.$ws = new WebSocket('ws://'+wsIP+':'+wsPort+'/'+wsPath, plcWsProtocol);
      //this.plcWs.$ws.onopen = this.wsOpen(this.plcWs);
      //this.plcWs.$ws.onclose = this.wsClose(this.plcWs);
      //this.plcWs.$ws.onmessage = this.wsMsg(this.plcWs);
      //this.plcWs.$ws.onerror = this.wsError(this.plcWs);
      this.plcWs.$ws.onopen = function(){
        console.log('ws open-PLC')
        wsConnection.startWsHeartbeat(_this.plcWs)
      }
      this.plcWs.$ws.onclose = function(){
        console.log('ws close-PLC')
        wsConnection.reconnect(_this.plcWs)
      }
      this.plcWs.$ws.onmessage = function(msg){
        console.log('ws message-PLC')
        console.log(msg)
        wsConnection.resetHeartbeat(_this.plcWs)
      }
      this.plcWs.$ws.onerror = function(){
        wsConnection.reconnect(_this.plcWs)
      }
      //內部溝通
      let dataWsProtocol = 'JonUmZbPuQj69GnQdefx6w1ygkeU8PkzHO0EknOSdTmTYEhgg7HpDOeniThA96f4PlGlGFKBsVSbICqlEsb91xf15tVt7FGddY80p6AfcBIknQqsEWiPhKf9hByJL1Vt'
      this.dataWs.$ws = new WebSocket('ws://'+wsIP+':'+wsPort+'/'+wsPath, dataWsProtocol);
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
        // var data = JSON.parse(msg.data)
        // if(data.SenderName == 'MercuryfireWS' || data.SenderName == 'MercuryfireWS2'){
        //   store.dispatch('websocket/saveUserId',data.Data.Id)
        // }
        // store.dispatch('websocket/sendMsg',msg)
      }
      this.dataWs.$ws.onerror = function(){
        wsConnection.reconnect(_this.dataWs)
      }
   },
   //開啟
  //  wsOpen: function (e) {
  //    wsConnection.startWsHeartbeat()
  //    console.log('ws success', e)
  //  },
   //關閉
  //  wsClose: function (e) {
  //    console.log(e, 'ws close')
  //    wsConnection.reconnect()
  //  },
   //收到訊息
  //  wsMsg: function (msg) { 
  //    wsConnection.resetHeartbeat()
  //    var data = JSON.parse(msg.data)
  //    if(data.SenderName == 'MercuryfireWS' || data.SenderName == 'MercuryfireWS2'){
  //     store.dispatch('websocket/saveUserId',data.Data.Id)
  //    }
  //    store.dispatch('websocket/sendMsg',msg)
  //  },
   //錯誤處理
  //  wsError: function (err) {
  //    console.log(err, 'ws error')
  //    wsConnection.reconnect()
  //  },
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
 
 export default wsConnection