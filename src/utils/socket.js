
import store from '../store'

 let wsConnection = {
   $ws: null,
   lockReturn: false,
   timeout: 60 * 1000 * 5,
   timeoutObj: null,
   timeoutNum: null,
   serverTimeoutObj: null,
   //初始化websocket
   initWebSocket: function () {
     let wsIP = '192.168.88.65'
     let wsPort = '59119'
     let wsPath = ''
     let wsProtocol = 'JonUmZbPuQj69GnQdefx6w1ygkeU8PkzHO0EknOSdTmTYEhgg7HpDOeniThA96f4PlGlGFKBsVSbICqlEsb91xf15tVt7FGddY80p6AfcBIknQqsEWiPhKf9hByJL1Vt'
     this.$ws = new WebSocket('ws://'+wsIP+':'+wsPort+'/'+wsPath, wsProtocol);
     this.$ws.onopen = this.wsOpen;
     this.$ws.onclose = this.wsClose;
     this.$ws.onmessage = this.wsMsg;
     this.$ws.onerror = this.wsError;
   },
   //開啟
   wsOpen: function (e) {
     //開始心跳
     wsConnection.startWsHeartbeat()
     console.log('ws success')
   },
   //關閉
   wsClose: function (e) {
     console.log(e, 'ws close')
     wsConnection.reconnect()
   },
   //收到訊息
   wsMsg: function (msg) { 
     //重置心跳
     wsConnection.resetHeartbeat()
     var data = JSON.parse(msg.data)
     if(data.SenderName == 'MercuryfireWS'){
      store.dispatch('websocket/saveUserId',data.Data.Id)
     }
     store.dispatch('websocket/sendMsg',msg)
   },
   //錯誤處理
   wsError: function (err) {
     console.log(err, 'ws error')
     wsConnection.reconnect()
   },
   //重啟
   reconnect: function () {
     let _this = this;
     if (_this.lockReturn) {
       return;
     }
     _this.lockReturn = true;
     _this.timeoutNum && clearTimeout(_this.timeoutNum);
     _this.timeoutNum = setTimeout(function () {
       _this.initWebSocket();
       _this.lockReturn = false;
     }, 3000);
   },
   //開啟心跳
   startWsHeartbeat: function () {
     let _this = this;
     _this.timeoutObj && clearTimeout(_this.timeoutObj);
     _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj);
     _this.timeoutObj = setInterval(function () {
       //判斷當前的狀態
       if (_this.$ws.readyState != 1) {
         _this.reconnect()
       }
     }, _this.timeout);
   },
   //重置心跳
   resetHeartbeat: function () {
     let _this = this;
     clearTimeout(_this.timeoutObj);
     clearTimeout(_this.serverTimeoutObj);
     _this.startWsHeartbeat()
   },
   //發送訊息
   sendMsg: function(dataType,sendType,content,Bid = null){
      const msg = {
        DataType:dataType,
        SendType:sendType,
        SenderName:store.getters.name,
        Data:{ 
          Id: store.getters.wsuserId, 
          Bid: Bid == null ? store.getters.buildingid : Bid, 
          Content:content
        }
      }
      this.$ws.send(JSON.stringify(msg))
   }
 }
 
 export default wsConnection