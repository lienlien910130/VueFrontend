
import store from '../store'

 let wsConnection = {
   $ws: null,
   lockReturn: false,
   timeout: 60 * 1000 * 5,
   timeoutObj: null,
   timeoutNum: null,
   serverTimeoutObj: null,
   //初始化webSocket长连接
   initWebSocket: function () {
     //let corpId = localStorage.getItem('corpId');
     //let name = localStorage.getItem('username');
     this.$ws = new WebSocket('ws://192.168.88.65:36142/usually/');
     this.$ws.onopen = this.wsOpen;
     this.$ws.onclose = this.wsClose;
     this.$ws.onmessage = this.wsMsg;
     this.$ws.onerror = this.wsError;
   },
   //打开websocket
   wsOpen: function (e) {
     //开始websocket心跳
     wsConnection.startWsHeartbeat();
     console.log('ws success')
   },
   wsClose: function (e) {
     console.log(e, 'ws close')
     wsConnection.reconnect()
   },
   wsMsg: function (msg) {
     //每次接收到服务端消息后 重置websocket心跳
     wsConnection.resetHeartbeat();
     //服务端发送来的消息存到vuex
     store.dispatch('websocket/sendMsg',JSON.stringify(msg.data))
   },
   wsError: function (err) {
     console.log(err, 'ws error');
     wsConnection.reconnect()
   },
   //重启websocket
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
   startWsHeartbeat: function () {
     let _this = this;
     _this.timeoutObj && clearTimeout(_this.timeoutObj);
     _this.serverTimeoutObj && clearTimeout(_this.serverTimeoutObj);
     _this.timeoutObj = setInterval(function () {
       //判断websocket当前状态
       if (_this.$ws.readyState != 1) {
         _this.reconnect()
       }
     }, _this.timeout);
   },
   //重置websocket心跳
   resetHeartbeat: function () {
     let _this = this;
     clearTimeout(_this.timeoutObj);
     clearTimeout(_this.serverTimeoutObj);
     _this.startWsHeartbeat()
   }
 };
 
 export default wsConnection