
import store from '../store'

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
      this.backWs.$ws = new WebSocket('ws://'+backIP+':'+backPort+'/', backWsProtocol);
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
        wsConnection.resetHeartbeat(_this.backWs)
      }
      this.backWs.$ws.onerror = function(){
        wsConnection.reconnect(_this.backWs)
      }
      //前端給前端內部溝通
      let wsIP = '192.168.88.65'
      let wsPort = '49119'
      let dataWsProtocol = 'JonUmZbPuQj69GnQdefx6w1ygkeU8PkzHO0EknOSdTmTYEhgg7HpDOeniThA96f4PlGlGFKBsVSbICqlEsb91xf15tVt7FGddY80p6AfcBIknQqsEWiPhKf9hByJL1Vt'
      this.dataWs.$ws = new WebSocket('ws://'+wsIP+':'+wsPort+'/', dataWsProtocol);
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
      // _this.dataWs.$ws.send(JSON.stringify(msg))
   }
 }
 
 export default wsConnection